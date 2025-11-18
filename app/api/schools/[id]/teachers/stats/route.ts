import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/schools/[id]/teachers/stats - Get teacher statistics for a school
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

    // Get all teachers assigned to this school
    const teacherAssignments = await prisma.teacherSchoolAssignment.findMany({
      where: {
        pilot_school_id: schoolId,
        is_active: true,
      },
      include: {
        teacher: {
          select: {
            id: true,
            is_active: true,
          },
        },
      },
    });

    // Calculate statistics
    const total_teachers = teacherAssignments.length;
    const active_teachers = teacherAssignments.filter(
      (a) => a.teacher.is_active
    ).length;
    const khmer_teachers = teacherAssignments.filter(
      (a) => a.subject === "Language"
    ).length;
    const math_teachers = teacherAssignments.filter(
      (a) => a.subject === "Math"
    ).length;
    const both_subjects = teacherAssignments.filter(
      (a) => a.subject === "both"
    ).length;

    return NextResponse.json({
      total_teachers,
      active_teachers,
      khmer_teachers,
      math_teachers,
      both_subjects,
    });
  } catch (error) {
    console.error("Error fetching teacher stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}
