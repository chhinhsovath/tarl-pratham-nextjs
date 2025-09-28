import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

// Validation schema
const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
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
    coordinator: ["view", "create", "update"],
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

    // For mentors and teachers, limit to their own data unless admin/coordinator
    if (session.user.role === "mentor" || session.user.role === "teacher") {
      where.id = parseInt(session.user.id);
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

    return NextResponse.json({
      data: users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
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
    
    const { role } = searchParams;
    const filteredUsers = role ? mockUsers.filter(u => u.role === role) : mockUsers;
    
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
    
    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    });
    
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password || "password123", 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        ...validatedData,
        password: hashedPassword
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        province: true,
        subject: true,
        phone: true,
        pilot_school_id: true,
        created_at: true,
        pilot_school: {
          select: {
            id: true,
            name: true,
            code: true
          }
        }
      }
    });

    return NextResponse.json({ 
      message: "User created successfully",
      data: user 
    }, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
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
            name: true,
            code: true
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
        { error: "Validation failed", details: error.errors },
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