import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/schools/[id]/teachers - Get all teachers assigned to a specific school
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const schoolId = parseInt(params.id);
    if (isNaN(schoolId)) {
      return NextResponse.json({ error: "Invalid school ID" }, { status: 400 });
    }

    // Get all teachers assigned to this school via teacher_school_assignments
    const teacherAssignments = await prisma.teacherSchoolAssignment.findMany({
      where: {
        pilot_school_id: schoolId,
        is_active: true,
      },
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            is_active: true,
            role: true,
          },
        },
      },
      orderBy: { teacher: { name: "asc" } },
    });

    // Extract teacher data with subject information
    const teachers = teacherAssignments.map((assignment) => ({
      id: assignment.teacher.id,
      name: assignment.teacher.name,
      email: assignment.teacher.email,
      phone: assignment.teacher.phone,
      subject: assignment.subject,
      is_active: assignment.teacher.is_active,
      role: assignment.teacher.role,
    }));

    return NextResponse.json({
      teachers,
      total: teachers.length,
    });
  } catch (error) {
    console.error("Error fetching school teachers:", error);
    return NextResponse.json(
      { error: "Failed to fetch teachers" },
      { status: 500 }
    );
  }
}

// POST /api/schools/[id]/teachers - Assign teachers to a school
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = (session.user as any).role;
    if (!["admin", "coordinator"].includes(userRole)) {
      return NextResponse.json(
        { error: "Only admins and coordinators can assign teachers" },
        { status: 403 }
      );
    }

    const schoolId = parseInt(params.id);
    if (isNaN(schoolId)) {
      return NextResponse.json({ error: "Invalid school ID" }, { status: 400 });
    }

    const body = await request.json();
    const { teacher_ids } = body;

    if (!Array.isArray(teacher_ids) || teacher_ids.length === 0) {
      return NextResponse.json(
        { error: "teacher_ids must be a non-empty array" },
        { status: 400 }
      );
    }

    // Create teacher assignments
    const createdAssignments = [];
    for (const teacherId of teacher_ids) {
      // Check if already assigned
      const existing = await prisma.teacherSchoolAssignment.findFirst({
        where: {
          teacher_id: teacherId,
          pilot_school_id: schoolId,
        },
      });

      if (!existing) {
        const assignment = await prisma.teacherSchoolAssignment.create({
          data: {
            teacher_id: teacherId,
            pilot_school_id: schoolId,
            subject: "Language", // Default subject
            assigned_by_id: parseInt(session.user.id),
            is_active: true,
          },
          include: {
            teacher: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        });
        createdAssignments.push(assignment);
      }
    }

    return NextResponse.json({
      message: `Successfully assigned ${createdAssignments.length} teacher(s)`,
      assignments: createdAssignments,
    });
  } catch (error) {
    console.error("Error assigning teachers:", error);
    return NextResponse.json(
      { error: "Failed to assign teachers" },
      { status: 500 }
    );
  }
}
