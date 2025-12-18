import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * POST /api/test-sessions/[id]/expire
 * Manually expire a test session and optionally delete/archive its data
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;
    const sessionId = id;

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { action = 'archive' } = body; // 'archive' or 'delete'

    // Get the test session
    const testSession = await prisma.testSession.findUnique({
      where: { id: sessionId }
    });

    if (!testSession) {
      return NextResponse.json(
        { error: 'Test session not found' },
        { status: 404 }
      );
    }

    // Check permissions
    const userId = parseInt(session.user.id);
    if (testSession.user_id !== userId && !['admin', 'coordinator'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'អ្នកមិនមានសិទ្ធិបិទសម័យនេះទេ' },
        { status: 403 }
      );
    }

    // Get counts of data in this session
    const [studentCount, assessmentCount, mentoringVisitCount] = await Promise.all([
      prisma.students.count({
        where: { test_session_id: sessionId }
      }),
      prisma.assessments.count({
        where: { test_session_id: sessionId }
      }),
      prisma.mentoringVisit.count({
        where: { test_session_id: sessionId }
      })
    ]);

    if (action === 'delete') {
      // Delete all data in this session
      await prisma.$transaction([
        prisma.assessments.deleteMany({
          where: { test_session_id: sessionId }
        }),
        prisma.students.deleteMany({
          where: { test_session_id: sessionId }
        }),
        prisma.mentoringVisit.deleteMany({
          where: { test_session_id: sessionId }
        }),
        prisma.testSession.update({
          where: { id: sessionId },
          data: {
            status: 'expired',
            student_count: 0,
            assessment_count: 0,
            mentoring_visit_count: 0
          }
        })
      ]);

      return NextResponse.json({
        success: true,
        message: 'បានបិទសម័យ និងលុបទិន្នន័យដោយជោគជ័យ',
        session_id: sessionId,
        deleted: {
          students: studentCount,
          assessments: assessmentCount,
          mentoring_visits: mentoringVisitCount,
          total: studentCount + assessmentCount + mentoringVisitCount
        }
      });
    } else {
      // Archive all data in this session
      await prisma.$transaction([
        prisma.students.updateMany({
          where: { test_session_id: sessionId },
          data: {
            record_status: 'archived',
            is_active: false
          }
        }),
        prisma.assessments.updateMany({
          where: { test_session_id: sessionId },
          data: { record_status: 'archived' }
        }),
        prisma.mentoringVisit.updateMany({
          where: { test_session_id: sessionId },
          data: { record_status: 'archived' }
        }),
        prisma.testSession.update({
          where: { id: sessionId },
          data: { status: 'archived' }
        })
      ]);

      return NextResponse.json({
        success: true,
        message: 'បានបិទសម័យ និងរក្សាទុកទិន្នន័យដោយជោគជ័យ',
        session_id: sessionId,
        archived: {
          students: studentCount,
          assessments: assessmentCount,
          mentoring_visits: mentoringVisitCount,
          total: studentCount + assessmentCount + mentoringVisitCount
        }
      });
    }

  } catch (error) {
    console.error('Expire session error:', error);
    return NextResponse.json(
      {
        error: 'មានបញ្ហាក្នុងការបិទសម័យ',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}