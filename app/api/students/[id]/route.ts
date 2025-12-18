import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getRecordStatus } from '@/lib/utils/recordStatus';
import { getMentorSchoolIds } from '@/lib/mentorAssignments';

// Helper function to check permissions
function hasPermission(userRole: string, action: string): boolean {
  const permissions = {
    admin: ["view", "create", "update", "delete"],
    coordinator: ["view", "create", "update", "delete"],
    mentor: ["view", "create", "update"],
    teacher: ["view", "create", "update"],
    viewer: ["view"]
  };

  return permissions[userRole as keyof typeof permissions]?.includes(action) || false;
}

// Helper function to check if user can access student data
async function canAccessStudent(
  userRole: string,
  userId: string,
  userPilotSchoolId: number | null,
  studentPilotSchoolId: number | null
): Promise<boolean> {
  if (userRole === "admin" || userRole === "coordinator") {
    return true;
  }

  if (userRole === "mentor") {
    // Mentors can access students from ALL their assigned schools
    if (!studentPilotSchoolId) return false;
    const mentorSchoolIds = await getMentorSchoolIds(parseInt(userId));
    return mentorSchoolIds.includes(studentPilotSchoolId);
  }

  if (userRole === "teacher" && userPilotSchoolId) {
    return studentPilotSchoolId === userPilotSchoolId;
  }

  return false;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const studentId = parseInt(id);

    if (isNaN(studentId)) {
      return NextResponse.json({ error: 'Invalid student ID' }, { status: 400 });
    }

    // Check permissions
    if (!hasPermission(session.user.role, "view")) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        school_class: {
          include: {
            school: {
              select: {
                id: true,
                name: true,
                code: true
              }
            }
          }
        },
        pilot_school: {
          select: {
            id: true,
            school_name: true,
            school_code: true,
            province: true,
            district: true
          }
        },
        added_by: {
          select: {
            id: true,
            name: true,
            role: true
          }
        }
      }
    });

    if (!student) {
      return NextResponse.json({ error: 'រកមិនឃើញសិស្ស' }, { status: 404 });
    }

    // Check if user can access this student
    const hasAccess = await canAccessStudent(session.user.role, session.user.id, session.user.pilot_school_id, student.pilot_school_id);
    if (!hasAccess) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({
      student,
      success: true
    });

  } catch (error: any) {
    console.error('Get student error:', error);
    return NextResponse.json(
      {
        error: 'មានបញ្ហាក្នុងការទាញយកទិន្នន័យសិស្ស',
        message: error.message || 'Failed to fetch student',
        code: error.code || 'UNKNOWN_ERROR',
        meta: error.meta || {}
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check permissions
    if (!hasPermission(session.user.role, "update")) {
      return NextResponse.json({ error: 'Forbidden - No update permission' }, { status: 403 });
    }

    const { id } = await params;
    const studentId = parseInt(id);

    if (isNaN(studentId)) {
      return NextResponse.json({ error: 'Invalid student ID' }, { status: 400 });
    }

    // Fetch existing student to check access
    const existingStudent = await prisma.student.findUnique({
      where: { id: studentId },
      select: { pilot_school_id: true }
    });

    if (!existingStudent) {
      return NextResponse.json({ error: 'រកមិនឃើញសិស្ស' }, { status: 404 });
    }

    // Check if user can access this student
    const hasAccess = await canAccessStudent(session.user.role, session.user.id, session.user.pilot_school_id, existingStudent.pilot_school_id);
    if (!hasAccess) {
      return NextResponse.json({ error: 'Forbidden - Cannot update students from other schools' }, { status: 403 });
    }

    const body = await request.json();

    // Don't allow changing record_status directly via this endpoint
    const { record_status: _, ...updateData } = body;

    const student = await prisma.student.update({
      where: { id: studentId },
      data: {
        ...updateData,
        updated_at: new Date()
      }
    });

    return NextResponse.json({
      student,
      success: true,
      message: 'Student updated successfully'
    });

  } catch (error: any) {
    console.error('Update student error:', error);
    return NextResponse.json(
      {
        error: 'មានបញ្ហាក្នុងការកែប្រែទិន្នន័យសិស្ស',
        message: error.message || 'Failed to update student',
        code: error.code || 'UNKNOWN_ERROR',
        meta: error.meta || {}
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const studentId = parseInt(id);

    if (isNaN(studentId)) {
      return NextResponse.json({ error: 'Invalid student ID' }, { status: 400 });
    }

    // Fetch existing student to check access
    const existingStudent = await prisma.student.findUnique({
      where: { id: studentId },
      select: { pilot_school_id: true }
    });

    if (!existingStudent) {
      return NextResponse.json({ error: 'រកមិនឃើញសិស្ស' }, { status: 404 });
    }

    // Check if user can access this student
    const hasAccess = await canAccessStudent(session.user.role, session.user.id, session.user.pilot_school_id, existingStudent.pilot_school_id);
    if (!hasAccess) {
      return NextResponse.json({ error: 'Forbidden - Cannot delete students from other schools' }, { status: 403 });
    }

    // Check permissions based on role
    const userRole = session.user.role;

    if (userRole === 'teacher' || userRole === 'mentor') {
      // Teachers and mentors can delete students if:
      // 1. Student has NO assessments, OR
      // 2. Student has assessments BUT none are verified/locked
      const verifiedOrLockedCount = await prisma.assessments.count({
        where: {
          student_id: studentId,
          OR: [
            { verified_by_id: { not: null } },
            { is_locked: true }
          ]
        }
      });

      if (verifiedOrLockedCount > 0) {
        return NextResponse.json({
          error: 'មិនអាចលុបសិស្សបានទេ ព្រោះការវាយតម្លៃរបស់សិស្សនេះត្រូវបានផ្ទៀងផ្ទាត់ ឬចាក់សោរួចហើយ។ សូមទាក់ទងអ្នកគ្រប់គ្រងប្រសិនបើចង់លុប។',
          message: `Cannot delete student with ${verifiedOrLockedCount} verified/locked assessment(s). Only admins and coordinators can delete students with verified or locked assessments.`
        }, { status: 403 });
      }
    } else if (userRole !== 'admin' && userRole !== 'coordinator') {
      // Other roles (viewer) cannot delete
      return NextResponse.json({
        error: 'អ្នកមិនមានសិទ្ធិលុបសិស្សទេ'
      }, { status: 403 });
    }

    // Delete in transaction to ensure data consistency
    await prisma.$transaction(async (tx) => {
      // First, delete related assessment history records
      await tx.assessmentHistory.deleteMany({
        where: {
          assessment: {
            student_id: studentId
          }
        }
      });

      // Then, delete all assessments for this student
      await tx.assessment.deleteMany({
        where: { student_id: studentId }
      });

      // Finally, delete the student
      await tx.student.delete({
        where: { id: studentId }
      });
    });

    return NextResponse.json({
      success: true,
      message: 'Student deleted successfully'
    });

  } catch (error: any) {
    console.error('Delete student error:', error);

    // Check for foreign key constraint errors (student has related records)
    if (error.code === 'P2003' || error.message?.includes('Foreign key constraint')) {
      return NextResponse.json(
        {
          error: 'មិនអាចលុបសិស្សបានទេ ព្រោះសិស្សនេះមានទិន្នន័យផ្សេងទៀតទាក់ទង (ការវាយតម្លៃ, ប្រវត្តិការវាយតម្លៃ ។ល។)',
          message: 'Cannot delete student because they have related records (assessments, assessment history, etc.)',
          code: error.code || 'FOREIGN_KEY_CONSTRAINT',
          meta: error.meta
        },
        { status: 400 }
      );
    }

    // Return detailed error (per AI_DEVELOPMENT_RULES.md)
    return NextResponse.json(
      {
        error: 'មានបញ្ហាក្នុងការលុបសិស្ស',
        message: error.message || 'Failed to delete student',
        code: error.code || 'UNKNOWN_ERROR',
        meta: error.meta || {}
      },
      { status: 500 }
    );
  }
}