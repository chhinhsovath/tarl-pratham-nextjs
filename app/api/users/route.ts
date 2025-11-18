import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { getMentorSchoolIds } from "@/lib/mentorAssignments";
import { nameToUsername } from "@/lib/username-converter";

// Validation schema
const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format").optional(), // Email is now optional
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
  role: z.enum(["admin", "coordinator", "mentor", "teacher", "viewer"]),
  province: z.string().optional(),
  subject: z.string().optional(),
  phone: z.string().optional(),
  pilot_school_id: z.number().optional(),
});

// Helper function to check permissions
function hasPermission(userRole: string, action: string): boolean {
  const permissions = {
    admin: ["view", "create", "update", "delete"],
    coordinator: ["view", "create", "update", "delete"],
    mentor: ["view"],
    teacher: ["view"],
    viewer: ["view"]
  };
  
  return permissions[userRole as keyof typeof permissions]?.includes(action) || false;
}

// GET /api/users - List users with pagination and filtering
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "សូមចូលប្រើប្រាស់ប្រព័ន្ធជាមុនសិន" }, { status: 401 });
    }

    if (!hasPermission(session.user.role, "view")) {
      return NextResponse.json({ error: "អ្នកមិនមានសិទ្ធិមើលអ្នកប្រើប្រាស់" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const role = searchParams.get("role") || "";
    const province = searchParams.get("province") || "";
    // Support both 'school_id' and 'pilot_school_id' parameters for compatibility
    const school_id = searchParams.get("school_id") || searchParams.get("pilot_school_id") || "";

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } }
      ];
    }

    if (role) {
      where.role = role;
    }

    if (province) {
      where.province = province;
    }

    // Role-based data filtering
    // Admins and coordinators have full system access (no filtering)
    if (session.user.role === "mentor") {
      // Mentors can view users at their assigned schools
      const mentorSchoolIds = await getMentorSchoolIds(parseInt(session.user.id));

      if (mentorSchoolIds.length > 0) {
        // If school_id parameter is provided, verify it's one of mentor's assigned schools
        if (school_id) {
          const requestedSchoolId = parseInt(school_id);
          if (mentorSchoolIds.includes(requestedSchoolId)) {
            // Mentor has access to this school - filter by this specific school
            // Special handling for teacher role with school filter
            // Check teacher_school_assignments table for proper teacher-school linkage
            if (role === "teacher") {
              // Get teachers assigned to this school via teacher_school_assignments
              const teacherAssignments = await prisma.teacherSchoolAssignment.findMany({
                where: {
                  pilot_school_id: requestedSchoolId,
                  is_active: true,
                },
                select: {
                  teacher_id: true,
                },
              });

              const assignedTeacherIds = teacherAssignments.map((a) => a.teacher_id);

              if (assignedTeacherIds.length > 0) {
                // Filter by teachers assigned to this school
                where.id = { in: assignedTeacherIds };
              } else {
                // No teachers assigned to this school - return empty
                where.id = -1;
              }
            } else {
              // For other roles, use pilot_school_id
              where.pilot_school_id = requestedSchoolId;
            }
          } else {
            // Mentor doesn't have access to requested school - return empty result
            where.id = -1; // No user has ID -1
          }
        } else {
          // No specific school requested - show users from all assigned schools
          where.pilot_school_id = { in: mentorSchoolIds };
        }
      } else {
        // Mentor has no school assigned - restrict to own data
        where.id = parseInt(session.user.id);
      }
    } else if (session.user.role === "teacher" || session.user.role === "viewer") {
      // Teachers and viewers can only see their own data
      where.id = parseInt(session.user.id);
    } else {
      // Admin/Coordinator - apply school_id filter if provided
      if (school_id) {
        const requestedSchoolId = parseInt(school_id);

        // Special handling for teacher role with school filter
        // Check teacher_school_assignments table for proper teacher-school linkage
        if (role === "teacher") {
          // Get teachers assigned to this school via teacher_school_assignments
          const teacherAssignments = await prisma.teacherSchoolAssignment.findMany({
            where: {
              pilot_school_id: requestedSchoolId,
              is_active: true,
            },
            select: {
              teacher_id: true,
            },
          });

          const assignedTeacherIds = teacherAssignments.map((a) => a.teacher_id);

          if (assignedTeacherIds.length > 0) {
            // Filter by teachers assigned to this school
            where.id = { in: assignedTeacherIds };
          } else {
            // No teachers assigned to this school - return empty
            where.id = -1;
          }
        } else {
          // For other roles, use pilot_school_id
          where.pilot_school_id = requestedSchoolId;
        }
      }
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          province: true,
          subject: true,
          phone: true,
          pilot_school_id: true,
          onboarding_completed: true,
          is_active: true,
          created_at: true,
          updated_at: true,
          pilot_school: {
            select: {
              id: true,
              school_name: true,
              school_code: true
            }
          }
        },
        skip,
        take: limit,
        orderBy: { created_at: "desc" }
      }),
      prisma.user.count({ where })
    ]);

    // Compute profile completion status based on role and assigned fields
    const usersWithProfileStatus = users.map((user: any) => {
      let teacher_profile_setup = false;
      let mentor_profile_complete = false;

      // Profile is considered complete if user has both pilot_school_id and subject assigned
      const profileComplete = user.pilot_school_id && user.subject;

      if (user.role === "teacher") {
        teacher_profile_setup = profileComplete;
      } else if (user.role === "mentor") {
        mentor_profile_complete = profileComplete;
      }

      return {
        ...user,
        teacher_profile_setup,
        mentor_profile_complete
      };
    });

    // Get role statistics - wrapped in try-catch for safety
    let stats = {
      admin: 0,
      coordinator: 0,
      mentor: 0,
      teacher: 0,
      viewer: 0,
    };

    try {
      const roleStats = await prisma.user.groupBy({
        by: ['role'],
        where,
        _count: {
          role: true
        }
      });

      stats = {
        admin: roleStats.find(s => s.role === 'admin')?._count.role || 0,
        coordinator: roleStats.find(s => s.role === 'coordinator')?._count.role || 0,
        mentor: roleStats.find(s => s.role === 'mentor')?._count.role || 0,
        teacher: roleStats.find(s => s.role === 'teacher')?._count.role || 0,
        viewer: roleStats.find(s => s.role === 'viewer')?._count.role || 0,
      };
    } catch (statsError) {
      console.error("Error fetching role statistics:", statsError);
      // Fallback: calculate from current users if groupBy fails
      stats = {
        admin: usersWithProfileStatus.filter(u => u.role === 'admin').length,
        coordinator: usersWithProfileStatus.filter(u => u.role === 'coordinator').length,
        mentor: usersWithProfileStatus.filter(u => u.role === 'mentor').length,
        teacher: usersWithProfileStatus.filter(u => u.role === 'teacher').length,
        viewer: usersWithProfileStatus.filter(u => u.role === 'viewer').length,
      };
    }

    return NextResponse.json({
      data: usersWithProfileStatus,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      stats
    });

  } catch (error: any) {
    console.error("Error fetching users:", error);
    
    // Check if it's a Prisma/database error
    if (error.code === 'P2002' || error.code === 'P2025' || error.message?.includes('Invalid')) {
      return NextResponse.json({
        data: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          pages: 0
        },
        message: 'មិនមានទិន្នន័យអ្នកប្រើប្រាស់នៅក្នុងប្រព័ន្ធ',
        error_detail: 'បញ្ហាទាក់ទងនឹងមូលដ្ឋានទិន្នន័យ សូមទាក់ទងអ្នកគ្រប់គ្រងប្រព័ន្ធ'
      });
    }
    
    // Provide fallback data when database query fails
    const mockUsers = [
      {
        id: 1,
        name: "គ្រូ សុខា",
        email: "sokha@example.com",
        role: "mentor",
        province: "កំពង់ចាម",
        subject: "ភាសាខ្មែរ",
        phone: "012345678",
        pilot_school_id: 1,
        onboarding_completed: true,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
        pilot_school: {
          id: 1,
          school_name: "សាលាបឋមសិក្សាគំរូ",
          school_code: "SCH001"
        }
      },
      {
        id: 2,
        name: "គ្រូ មករា",
        email: "makara@example.com",
        role: "mentor",
        province: "កំពង់ចាម",
        subject: "គណិតវិទ្យា",
        phone: "098765432",
        pilot_school_id: 2,
        onboarding_completed: true,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
        pilot_school: {
          id: 2,
          school_name: "សាលាបឋមសិក្សាទី២",
          school_code: "SCH002"
        }
      }
    ];

    const filteredUsers = mockUsers;
    
    return NextResponse.json({
      data: filteredUsers,
      pagination: {
        page: 1,
        limit: 10,
        total: filteredUsers.length,
        pages: 1
      },
      message: 'កំពុងប្រើទិន្នន័យសាកល្បង',
      mock: true // Indicate this is mock data
    });
  }
}

// POST /api/users - Create new user
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "សូមចូលប្រើប្រាស់ប្រព័ន្ធជាមុនសិន" }, { status: 401 });
    }

    if (!hasPermission(session.user.role, "create")) {
      return NextResponse.json({ error: "អ្នកមិនមានសិទ្ធិបង្កើតអ្នកប្រើប្រាស់ថ្មី" }, { status: 403 });
    }

    const body = await request.json();
    
    // Validate input
    const validatedData = userSchema.parse(body);

    // Check if email already exists (only if email was provided)
    if (validatedData.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email: validatedData.email }
      });

      if (existingUser) {
        return NextResponse.json(
          { error: "Email already exists" },
          { status: 400 }
        );
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password || "admin123", 12);

    // Auto-generate username from full name using smart converter
    const baseUsername = nameToUsername(validatedData.name);

    // VALIDATION: Ensure username was generated
    if (!baseUsername || baseUsername.trim().length === 0) {
      return NextResponse.json(
        { error: "Could not generate username from provided name. Please provide a valid name." },
        { status: 400 }
      );
    }

    // Check if this username is already taken and make it unique
    let username = baseUsername;
    let counter = 1;

    while (true) {
      const existingUser = await prisma.user.findFirst({
        where: { username: username }
      });

      if (!existingUser) {
        break;
      }

      // If taken, append a counter
      username = `${baseUsername}${counter}`;
      counter++;

      if (counter > 100) {
        // Safety check - use timestamp as fallback
        username = `${baseUsername}_${Date.now()}`;
        break;
      }
    }

    // FINAL VALIDATION: Ensure username is NOT null before saving
    if (!username || username.trim().length === 0) {
      return NextResponse.json(
        { error: "Failed to generate unique username. Please try again." },
        { status: 500 }
      );
    }

    // Auto-generate email if not provided
    let email = validatedData.email;
    if (!email) {
      // Generate email from username: username@tarl.local
      email = `${username}@tarl.local`;

      // Make sure generated email is unique
      let emailCounter = 1;
      let emailToCheck = email;
      while (true) {
        const existingEmail = await prisma.user.findFirst({
          where: { email: emailToCheck }
        });

        if (!existingEmail) {
          email = emailToCheck;
          break;
        }

        // If taken, append counter
        emailToCheck = `${username}${emailCounter}@tarl.local`;
        emailCounter++;
      }
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        ...validatedData,
        username, // Set the auto-generated username from name
        email, // Set the email (provided or auto-generated)
        password: hashedPassword
      },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        role: true,
        province: true,
        subject: true,
        phone: true,
        pilot_school_id: true,
        created_at: true,
        pilot_school: {
          select: {
            id: true,
            school_name: true,
            school_code: true
          }
        }
      }
    });

    return NextResponse.json({
      message: `User created successfully! Username: ${username}, Email: ${email}`,
      data: user
    }, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/users - Update user (requires user ID in body)
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "សូមចូលប្រើប្រាស់ប្រព័ន្ធជាមុនសិន" }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...updateData } = body;
    
    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // Check permissions
    const canUpdate = hasPermission(session.user.role, "update") || 
                     (session.user.id === id.toString()); // Users can update themselves
    
    if (!canUpdate) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Validate input (make password optional for updates)
    const updateSchema = userSchema.partial();
    const validatedData = updateSchema.parse(updateData);

    // If password is being updated, hash it
    if (validatedData.password) {
      validatedData.password = await bcrypt.hash(validatedData.password, 12);
    }

    // Update user
    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data: validatedData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        province: true,
        subject: true,
        phone: true,
        pilot_school_id: true,
        updated_at: true,
        pilot_school: {
          select: {
            id: true,
            school_name: true,
            school_code: true
          }
        }
      }
    });

    return NextResponse.json({ 
      message: "User updated successfully",
      data: user 
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/users - Delete user (requires user ID in query)
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "សូមចូលប្រើប្រាស់ប្រព័ន្ធជាមុនសិន" }, { status: 401 });
    }

    if (!hasPermission(session.user.role, "delete")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // Don't allow users to delete themselves
    if (session.user.id === id) {
      return NextResponse.json({ 
        error: "Cannot delete your own account" 
      }, { status: 400 });
    }

    // Delete user
    await prisma.user.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({ 
      message: "User deleted successfully" 
    });

  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}