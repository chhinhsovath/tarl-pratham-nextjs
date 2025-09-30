import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * POST /api/bulk/archive-test-data
 * Bulk archive test data (soft delete) by status, user, or session
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

    // Only admins and coordinators can bulk archive
    if (!['admin', 'coordinator'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'អ្នកមិនមានសិទ្ធិរក្សាទុកទិន្នន័យជាបណ្តុំទេ' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      record_status,
      user_id,
      test_session_id
    } = body;

    // Build where clauses
    const studentWhere: any = {};
    const assessmentWhere: any = {};
    const mentoringVisitWhere: any = {};

    if (test_session_id) {
      studentWhere.test_session_id = test_session_id;
      assessmentWhere.test_session_id = test_session_id;
      mentoringVisitWhere.test_session_id = test_session_id;
    } else if (record_status) {
      studentWhere.record_status = record_status;
      assessmentWhere.record_status = record_status;
      mentoringVisitWhere.record_status = record_status;
    } else {
      return NextResponse.json(
        { error: 'Must specify record_status or test_session_id' },
        { status: 400 }
      );
    }

    if (user_id) {
      const targetUserId = parseInt(user_id);
      studentWhere.added_by_id = targetUserId;
      assessmentWhere.added_by_id = targetUserId;
      mentoringVisitWhere.mentor_id = targetUserId;
    }

    // Count before archiving
    const [studentCount, assessmentCount, mentoringVisitCount] = await Promise.all([
      prisma.student.count({ where: studentWhere }),
      prisma.assessment.count({ where: assessmentWhere }),
      prisma.mentoringVisit.count({ where: mentoringVisitWhere })
    ]);

    // Perform bulk archiving
    await prisma.$transaction([
      prisma.student.updateMany({
        where: studentWhere,
        data: {
          record_status: 'archived',
          is_active: false
        }
      }),
      prisma.assessment.updateMany({
        where: assessmentWhere,
        data: {
          record_status: 'archived'
        }
      }),
      prisma.mentoringVisit.updateMany({
        where: mentoringVisitWhere,
        data: {
          record_status: 'archived'
        }
      })
    ]);

    // If archiving by session, mark session as archived
    if (test_session_id) {
      await prisma.testSession.update({
        where: { id: test_session_id },
        data: { status: 'archived' }
      });
    }

    return NextResponse.json({
      success: true,
      message: 'បានរក្សាទុកទិន្នន័យសាកល្បងដោយជោគជ័យ',
      archived: {
        students: studentCount,
        assessments: assessmentCount,
        mentoring_visits: mentoringVisitCount,
        total: studentCount + assessmentCount + mentoringVisitCount
      }
    });

  } catch (error) {
    console.error('Bulk archive error:', error);
    return NextResponse.json(
      {
        error: 'មានបញ្ហាក្នុងការរក្សាទុកទិន្នន័យ',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}