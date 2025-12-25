import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Validation schema
const teacherAssignmentSchema = z.object({
  teacher_id: z.number().int().positive("Teacher ID is required"),
  pilot_school_id: z.number().int().positive("School ID is required"),
  subject: z.enum(["Language", "Math"], { errorMap: () => ({ message: "Subject must be Language or Math" }) }),
  notes: z.string().optional(),
});

// Helper function to check permissions
function hasPermission(userRole: string, action: string): boolean {
  const permissions = {
    admin: ["view", "create", "update", "delete"],
    coordinator: ["view", "create", "update", "delete"],
    mentor: [],
    teacher: ["view"],
    viewer: ["view"]
  };

  return permissions[userRole as keyof typeof permissions]?.includes(action) || false;
}

// GET /api/teacher-assignments - List teacher assignments with filtering
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
        error: "អ្នកមិនមានសិទ្ធិមើលការចាត់តាំងគ្រូបង្រៀន",
        message: "Permission denied"
      }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const teacher_id = searchParams.get("teacher_id");
    const pilot_school_id = searchParams.get("pilot_school_id");
    const subject = searchParams.get("subject");
    const is_active = searchParams.get("is_active");

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (teacher_id) {
      where.teacher_id = parseInt(teacher_id);
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

    // For teachers: only show their own assignments
    if (session.user.role === "teacher") {
      where.teacher_id = parseInt(session.user.id);
    }

    const [assignments, total] = await Promise.all([
      prisma.teacher_school_assignments.findMany({
        where,
        include: {
          teacher: {
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
          assigned_by: {
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
      prisma.teacher_school_assignments.count({ where })
    ]);

    return NextResponse.json({
      data: assignments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error: any) {
    console.error("Error fetching teacher assignments:", error);

    return NextResponse.json({
      error: "មានបញ្ហាក្នុងការទាញយកទិន្នន័យ",
      message: error.message || "Failed to fetch teacher assignments",
      details: error.meta || error.code
    }, { status: 500 });
  }
}

// POST /api/teacher-assignments - Create new teacher assignment
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
    const validatedData = teacherAssignmentSchema.parse(body);

    // Verify teacher exists and has teacher role
    const teacher = await prisma.users.findUnique({
      where: { id: validatedData.teacher_id }
    });

    if (!teacher) {
      return NextResponse.json(
        {
          error: "រកមិនឃើញគ្រូបង្រៀន",
          message: "Teacher not found"
        },
        { status: 404 }
      );
    }

    if (teacher.role !== "teacher") {
      return NextResponse.json(
        {
          error: "អ្នកប្រើប្រាស់នេះមិនមែនជាគ្រូបង្រៀនទេ",
          message: "User is not a teacher"
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
    const existingAssignment = await prisma.teacher_school_assignments.findFirst({
      where: {
        teacher_id: validatedData.teacher_id,
        pilot_school_id: validatedData.pilot_school_id,
        subject: validatedData.subject,
      }
    });

    if (existingAssignment) {
      return NextResponse.json(
        {
          error: "ការចាត់តាំងនេះមានរួចហើយ",
          message: "Assignment already exists for this teacher, school, and subject"
        },
        { status: 400 }
      );
    }

    // Create assignment
    const assignment = await prisma.teacher_school_assignments.create({
      data: {
        ...validatedData,
        assigned_by_id: parseInt(session.user.id),
      },
      include: {
        teacher: {
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

    return NextResponse.json({
      data: assignment,
      message: "បានបង្កើតការចាត់តាំងដោយជោគជ័យ",
      success: true
    }, { status: 201 });

  } catch (error: any) {
    console.error("Error creating teacher assignment:", error);

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
      message: error.message || "Failed to create teacher assignment",
      details: error.meta || error.code
    }, { status: 500 });
  }
}

// PUT /api/teacher-assignments - Update teacher assignment
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
    const existingAssignment = await prisma.teacher_school_assignments.findUnique({
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
    const updatedAssignment = await prisma.teacher_school_assignments.update({
      where: { id: parseInt(id) },
      data: {
        is_active: is_active !== undefined ? is_active : existingAssignment.is_active,
        notes: notes !== undefined ? notes : existingAssignment.notes,
        updated_at: new Date(),
      },
      include: {
        teacher: {
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

    return NextResponse.json({
      data: updatedAssignment,
      message: "បានកែប្រែការចាត់តាំងដោយជោគជ័យ",
      success: true
    });

  } catch (error: any) {
    console.error("Error updating teacher assignment:", error);

    return NextResponse.json({
      error: "មានបញ្ហាក្នុងការកែប្រែការចាត់តាំង",
      message: error.message || "Failed to update teacher assignment",
      details: error.meta || error.code
    }, { status: 500 });
  }
}

// DELETE /api/teacher-assignments - Delete teacher assignment
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
    const existingAssignment = await prisma.teacher_school_assignments.findUnique({
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
    await prisma.teacher_school_assignments.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({
      message: "បានលុបការចាត់តាំងដោយជោគជ័យ",
      success: true
    });

  } catch (error: any) {
    console.error("Error deleting teacher assignment:", error);

    return NextResponse.json({
      error: "មានបញ្ហាក្នុងការលុបការចាត់តាំង",
      message: error.message || "Failed to delete teacher assignment",
      details: error.meta || error.code
    }, { status: 500 });
  }
}
