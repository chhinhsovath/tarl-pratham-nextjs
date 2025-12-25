import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Validation schema
const mentorAssignmentSchema = z.object({
  mentor_id: z.number().int().positive("Mentor ID is required"),
  pilot_school_id: z.number().int().positive("School ID is required"),
  subject: z.enum(["Language", "Math"], { errorMap: () => ({ message: "Subject must be Language or Math" }) }),
  notes: z.string().optional(),
});

// Helper function to check permissions
function hasPermission(userRole: string, action: string): boolean {
  const permissions = {
    admin: ["view", "create", "update", "delete"],
    coordinator: ["view", "create", "update", "delete"],
    mentor: ["view"],
    teacher: [],
    viewer: ["view"]
  };

  return permissions[userRole as keyof typeof permissions]?.includes(action) || false;
}

// GET /api/mentor-assignments - List mentor assignments with filtering
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({
        error: "សូមចូលប្រើប្រាស់ប្រព័ន្ធជាមុនសិន",
        message: "Authentication required"
      }, { status: 401 });
    }

    if (!hasPermission(session.user.role, "view")) {
      return NextResponse.json({
        error: "អ្នកមិនមានសិទ្ធិមើលការចាត់តាំងគ្រូព្រឹក្សាគរុកោសល្យ",
        message: "Permission denied"
      }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const mentor_id = searchParams.get("mentor_id");
    const pilot_school_id = searchParams.get("pilot_school_id");
    const subject = searchParams.get("subject");
    const is_active = searchParams.get("is_active");

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (mentor_id) {
      where.mentor_id = parseInt(mentor_id);
    }

    if (pilot_school_id) {
      where.pilot_school_id = parseInt(pilot_school_id);
    }

    if (subject) {
      where.subject = subject;
    }

    if (is_active !== null && is_active !== undefined) {
      where.is_active = is_active === "true";
    }

    // For mentors: only show their own assignments
    if (session.user.role === "mentor") {
      where.mentor_id = parseInt(session.user.id);
    }

    const [assignments, total] = await Promise.all([
      prisma.mentor_school_assignments.findMany({
        where,
        include: {
          users_mentor_school_assignments_mentor_idTousers: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              province: true,
            }
          },
          pilot_schools: {
            select: {
              id: true,
              school_name: true,
              school_code: true,
              province: true,
              district: true,
              cluster: true,
            }
          },
          users_mentor_school_assignments_assigned_by_idTousers: {
            select: {
              id: true,
              name: true,
              email: true,
            }
          }
        },
        skip,
        take: limit,
        orderBy: { created_at: "desc" }
      }),
      prisma.mentor_school_assignments.count({ where })
    ]);

    // Map to simpler field names for frontend
    const mappedAssignments = assignments.map(a => ({
      ...a,
      mentor: a.users_mentor_school_assignments_mentor_idTousers,
      assigned_by: a.users_mentor_school_assignments_assigned_by_idTousers,
    }));

    return NextResponse.json({
      data: mappedAssignments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error: any) {
    console.error("Error fetching mentor assignments:", error);

    return NextResponse.json({
      error: "មានបញ្ហាក្នុងការទាញយកទិន្នន័យ",
      message: error.message || "Failed to fetch mentor assignments",
      details: error.meta || error.code
    }, { status: 500 });
  }
}

// POST /api/mentor-assignments - Create new mentor assignment
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({
        error: "សូមចូលប្រើប្រាស់ប្រព័ន្ធជាមុនសិន",
        message: "Authentication required"
      }, { status: 401 });
    }

    if (!hasPermission(session.user.role, "create")) {
      return NextResponse.json({
        error: "អ្នកមិនមានសិទ្ធិបង្កើតការចាត់តាំងថ្មី",
        message: "Permission denied"
      }, { status: 403 });
    }

    const body = await request.json();

    // Validate input
    const validatedData = mentorAssignmentSchema.parse(body);

    // Verify mentor exists and has mentor role
    const mentor = await prisma.users.findUnique({
      where: { id: validatedData.mentor_id }
    });

    if (!mentor) {
      return NextResponse.json(
        {
          error: "រកមិនឃើញគ្រូព្រឹក្សាគរុកោសល្យ",
          message: "Mentor not found"
        },
        { status: 404 }
      );
    }

    if (mentor.role !== "mentor") {
      return NextResponse.json(
        {
          error: "អ្នកប្រើប្រាស់នេះមិនមែនជាគ្រូព្រឹក្សាគរុកោសល្យទេ",
          message: "User is not a mentor"
        },
        { status: 400 }
      );
    }

    // Verify school exists
    const school = await prisma.pilot_schools.findUnique({
      where: { id: validatedData.pilot_school_id }
    });

    if (!school) {
      return NextResponse.json(
        {
          error: "រកមិនឃើញសាលារៀន",
          message: "School not found"
        },
        { status: 404 }
      );
    }

    // Check if assignment already exists
    const existingAssignment = await prisma.mentor_school_assignments.findFirst({
      where: {
        mentor_id: validatedData.mentor_id,
        pilot_school_id: validatedData.pilot_school_id,
        subject: validatedData.subject,
      }
    });

    if (existingAssignment) {
      return NextResponse.json(
        {
          error: "ការចាត់តាំងនេះមានរួចហើយ",
          message: "Assignment already exists for this mentor, school, and subject"
        },
        { status: 400 }
      );
    }

    // Create assignment
    const assignment = await prisma.mentor_school_assignments.create({
      data: {
        ...validatedData,
        assigned_by_id: parseInt(session.user.id),
        updated_at: new Date(),
      },
      include: {
        users_mentor_school_assignments_mentor_idTousers: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        pilot_schools: {
          select: {
            id: true,
            school_name: true,
            school_code: true,
            province: true,
            district: true,
          }
        }
      }
    });

    // Map to simpler field names
    const mappedAssignment = {
      ...assignment,
      mentor: assignment.users_mentor_school_assignments_mentor_idTousers,
    };

    return NextResponse.json({
      data: mappedAssignment,
      message: "បានបង្កើតការចាត់តាំងដោយជោគជ័យ",
      success: true
    }, { status: 201 });

  } catch (error: any) {
    console.error("Error creating mentor assignment:", error);

    // Handle Zod validation errors
    if (error.name === "ZodError") {
      return NextResponse.json({
        error: "ទិន្នន័យមិនត្រឹមត្រូវ",
        message: "Validation failed",
        details: error.errors
      }, { status: 400 });
    }

    return NextResponse.json({
      error: "មានបញ្ហាក្នុងការបង្កើតការចាត់តាំង",
      message: error.message || "Failed to create mentor assignment",
      details: error.meta || error.code
    }, { status: 500 });
  }
}

// PUT /api/mentor-assignments - Update mentor assignment
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({
        error: "សូមចូលប្រើប្រាស់ប្រព័ន្ធជាមុនសិន",
        message: "Authentication required"
      }, { status: 401 });
    }

    if (!hasPermission(session.user.role, "update")) {
      return NextResponse.json({
        error: "អ្នកមិនមានសិទ្ធិកែប្រែការចាត់តាំង",
        message: "Permission denied"
      }, { status: 403 });
    }

    const body = await request.json();
    const { id, is_active, notes } = body;

    if (!id) {
      return NextResponse.json(
        {
          error: "ID ត្រូវការ",
          message: "Assignment ID is required"
        },
        { status: 400 }
      );
    }

    // Check if assignment exists
    const existingAssignment = await prisma.mentor_school_assignments.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingAssignment) {
      return NextResponse.json(
        {
          error: "រកមិនឃើញការចាត់តាំង",
          message: "Assignment not found"
        },
        { status: 404 }
      );
    }

    // Update assignment
    const updatedAssignment = await prisma.mentor_school_assignments.update({
      where: { id: parseInt(id) },
      data: {
        is_active: is_active !== undefined ? is_active : existingAssignment.is_active,
        notes: notes !== undefined ? notes : existingAssignment.notes,
        updated_at: new Date(),
      },
      include: {
        users_mentor_school_assignments_mentor_idTousers: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        pilot_schools: {
          select: {
            id: true,
            school_name: true,
            school_code: true,
            province: true,
            district: true,
          }
        }
      }
    });

    // Map to simpler field names
    const mappedUpdate = {
      ...updatedAssignment,
      mentor: updatedAssignment.users_mentor_school_assignments_mentor_idTousers,
    };

    return NextResponse.json({
      data: mappedUpdate,
      message: "បានកែប្រែការចាត់តាំងដោយជោគជ័យ",
      success: true
    });

  } catch (error: any) {
    console.error("Error updating mentor assignment:", error);

    return NextResponse.json({
      error: "មានបញ្ហាក្នុងការកែប្រែការចាត់តាំង",
      message: error.message || "Failed to update mentor assignment",
      details: error.meta || error.code
    }, { status: 500 });
  }
}

// DELETE /api/mentor-assignments - Delete mentor assignment
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({
        error: "សូមចូលប្រើប្រាស់ប្រព័ន្ធជាមុនសិន",
        message: "Authentication required"
      }, { status: 401 });
    }

    if (!hasPermission(session.user.role, "delete")) {
      return NextResponse.json({
        error: "អ្នកមិនមានសិទ្ធិលុបការចាត់តាំង",
        message: "Permission denied"
      }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        {
          error: "ID ត្រូវការ",
          message: "Assignment ID is required"
        },
        { status: 400 }
      );
    }

    // Check if assignment exists
    const existingAssignment = await prisma.mentor_school_assignments.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingAssignment) {
      return NextResponse.json(
        {
          error: "រកមិនឃើញការចាត់តាំង",
          message: "Assignment not found"
        },
        { status: 404 }
      );
    }

    // Delete assignment
    await prisma.mentor_school_assignments.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({
      message: "បានលុបការចាត់តាំងដោយជោគជ័យ",
      success: true
    });

  } catch (error: any) {
    console.error("Error deleting mentor assignment:", error);

    return NextResponse.json({
      error: "មានបញ្ហាក្នុងការលុបការចាត់តាំង",
      message: error.message || "Failed to delete mentor assignment",
      details: error.meta || error.code
    }, { status: 500 });
  }
}
