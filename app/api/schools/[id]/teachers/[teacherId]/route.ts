import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// DELETE /api/schools/[id]/teachers/[teacherId] - Remove a teacher from a school
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; teacherId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = (session.user as any).role;
    if (!["admin", "coordinator"].includes(userRole)) {
      return NextResponse.json(
        { error: "Only admins and coordinators can remove teachers" },
        { status: 403 }
      );
    }

    const schoolId = parseInt(params.id);
    const teacherId = parseInt(params.teacherId);

    if (isNaN(schoolId) || isNaN(teacherId)) {
      return NextResponse.json(
        { error: "Invalid school ID or teacher ID" },
        { status: 400 }
      );
    }

    // Delete the teacher assignment
    const deleted = await prisma.teacherSchoolAssignment.deleteMany({
      where: {
        teacher_id: teacherId,
        pilot_school_id: schoolId,
      },
    });

    if (deleted.count === 0) {
      return NextResponse.json(
        { error: "Teacher assignment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Teacher removed from school successfully",
      deleted_count: deleted.count,
    });
  } catch (error) {
    console.error("Error removing teacher:", error);
    return NextResponse.json(
      { error: "Failed to remove teacher" },
      { status: 500 }
    );
  }
}
