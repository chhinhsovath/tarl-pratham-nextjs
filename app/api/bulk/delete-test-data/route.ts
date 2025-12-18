import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { RecordStatus } from '@prisma/client';

/**
 * POST /api/bulk/delete-test-data
 * Bulk delete test data by status, user, or session
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Only admins, coordinators, and mentors can bulk delete
    if (!['admin', 'coordinator', 'mentor'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'អ្នកមិនមានសិទ្ធិលុបទិន្នន័យជាបណ្តុំទេ' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      record_status,
      user_id,
      test_session_id,
      delete_all_test_data = false
    } = body;

    // Build where clauses
    const userId = parseInt(session.user.id);
    const isMentor = session.user.role === 'mentor';

    // Base where for students
    const studentWhere: any = {};
    const assessmentWhere: any = {};
    const mentoringVisitWhere: any = {};

    if (delete_all_test_data) {
      // Delete all test data (admin/coordinator only)
      if (!['admin', 'coordinator'].includes(session.user.role)) {
        return NextResponse.json(
          { error: 'Only admins can delete all test data' },
          { status: 403 }
        );
      }

      studentWhere.record_status = { in: ['test_mentor', 'test_teacher'] };
      assessmentWhere.record_status = { in: ['test_mentor', 'test_teacher'] };
      mentoringVisitWhere.record_status = { in: ['test_mentor', 'test_teacher'] };
    } else if (test_session_id) {
      // Delete by session
      studentWhere.test_session_id = test_session_id;
      assessmentWhere.test_session_id = test_session_id;
      mentoringVisitWhere.test_session_id = test_session_id;
    } else if (record_status) {
      // Delete by status
      studentWhere.record_status = record_status;
      assessmentWhere.record_status = record_status;
      mentoringVisitWhere.record_status = record_status;
    } else {
      return NextResponse.json(
        { error: 'Must specify record_status, test_session_id, or delete_all_test_data' },
        { status: 400 }
      );
    }

    // Mentors can only delete their own test data
    if (isMentor) {
      studentWhere.added_by_id = userId;
      assessmentWhere.added_by_id = userId;
      mentoringVisitWhere.mentor_id = userId;
    } else if (user_id) {
      // Admins/coordinators can filter by specific user
      const targetUserId = parseInt(user_id);
      studentWhere.added_by_id = targetUserId;
      assessmentWhere.added_by_id = targetUserId;
      mentoringVisitWhere.mentor_id = targetUserId;
    }

    // Count before deletion
    const [studentCount, assessmentCount, mentoringVisitCount] = await Promise.all([
      prisma.students.count({ where: studentWhere }),
      prisma.assessments.count({ where: assessmentWhere }),
      prisma.mentoringVisit.count({ where: mentoringVisitWhere })
    ]);

    // Perform bulk deletion
    await prisma.$transaction([
      prisma.assessments.deleteMany({ where: assessmentWhere }),
      prisma.students.deleteMany({ where: studentWhere }),
      prisma.mentoringVisit.deleteMany({ where: mentoringVisitWhere })
    ]);

    // If deleting by session, mark session as expired
    if (test_session_id) {
      await prisma.testSession.update({
        where: { id: test_session_id },
        data: {
          status: 'expired',
          student_count: 0,
          assessment_count: 0,
          mentoring_visit_count: 0
        }
      });
    }

    return NextResponse.json({
      success: true,
      message: 'បានលុបទិន្នន័យសាកល្បងដោយជោគជ័យ',
      deleted: {
        students: studentCount,
        assessments: assessmentCount,
        mentoring_visits: mentoringVisitCount,
        total: studentCount + assessmentCount + mentoringVisitCount
      }
    });

  } catch (error) {
    console.error('Bulk delete error:', error);
    return NextResponse.json(
      {
        error: 'មានបញ្ហាក្នុងការលុបទិន្នន័យ',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}