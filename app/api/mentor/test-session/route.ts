import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getTestDataExpiryDate } from '@/lib/utils/recordStatus';

/**
 * GET /api/mentor/test-session
 * Get current test session statistics for the logged-in mentor
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Check authentication
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized - Please login first' },
        { status: 401 }
      );
    }

    // Check role - only mentors have test sessions
    if (session.user.role !== 'mentor') {
      return NextResponse.json(
        { error: 'Test sessions are only available for mentors' },
        { status: 403 }
      );
    }

    const mentorId = parseInt(session.user.id);

    // Get counts of test data created by this mentor
    const [
      studentCount,
      assessmentCount,
      mentoringVisitCount,
      students,
      assessments,
      activeSessions
    ] = await Promise.all([
      prisma.student.count({
        where: {
          record_status: 'test_mentor',
          added_by_id: mentorId
        }
      }),
      prisma.assessments.count({
        where: {
          record_status: 'test_mentor',
          added_by_id: mentorId
        }
      }),
      prisma.mentoringVisit.count({
        where: {
          record_status: 'test_mentor',
          mentor_id: mentorId
        }
      }),
      prisma.student.findMany({
        where: {
          record_status: 'test_mentor',
          added_by_id: mentorId
        },
        select: {
          id: true,
          created_at: true,
          test_session_id: true
        },
        orderBy: { created_at: 'asc' },
        take: 1
      }),
      prisma.assessments.findMany({
        where: {
          record_status: 'test_mentor',
          added_by_id: mentorId
        },
        select: {
          id: true,
          created_at: true,
          test_session_id: true
        },
        orderBy: { created_at: 'asc' },
        take: 1
      }),
      prisma.testSession.findMany({
        where: {
          user_id: mentorId,
          status: 'active'
        },
        orderBy: { created_at: 'desc' }
      })
    ]);

    // Get the most recent active session or create session data
    const currentSession = activeSessions[0];
    const hasData = studentCount > 0 || assessmentCount > 0 || mentoringVisitCount > 0;

    // Calculate next reset time (7 days from first record or session start)
    const now = new Date();
    const sessionStart = currentSession?.started_at || students[0]?.created_at || assessments[0]?.created_at || now;
    const expiryDate = currentSession?.expires_at || getTestDataExpiryDate(7);
    const hoursUntilExpiry = Math.max(0, Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60)));

    return NextResponse.json({
      success: true,
      session: {
        id: currentSession?.id || null,
        mentor_id: mentorId,
        mentor_name: session.user.name,
        status: currentSession?.status || (hasData ? 'active' : 'no_data'),
        started_at: sessionStart,
        expires_at: expiryDate,
        hours_until_expiry: hoursUntilExpiry,
        days_until_expiry: Math.ceil(hoursUntilExpiry / 24)
      },
      statistics: {
        students: studentCount,
        assessments: assessmentCount,
        mentoring_visits: mentoringVisitCount,
        total_records: studentCount + assessmentCount + mentoringVisitCount
      },
      breakdown: {
        assessment_by_type: await prisma.assessments.groupBy({
          by: ['assessment_type'],
          where: {
            is_temporary: true,
            assessed_by_mentor: true,
            added_by_id: mentorId
          },
          _count: {
            id: true
          }
        }),
        assessment_by_subject: await prisma.assessments.groupBy({
          by: ['subject'],
          where: {
            is_temporary: true,
            assessed_by_mentor: true,
            added_by_id: mentorId
          },
          _count: {
            id: true
          }
        }),
        students_by_gender: await prisma.student.groupBy({
          by: ['gender'],
          where: {
            is_temporary: true,
            added_by_mentor: true,
            added_by_id: mentorId
          },
          _count: {
            id: true
          }
        })
      },
      message: hasData
        ? `អ្នកមានទិន្នន័យសាកល្បងចំនួន ${studentCount + assessmentCount + mentoringVisitCount} កំណត់ត្រា`
        : 'មិនមានទិន្នន័យសាកល្បង - ចាប់ផ្តើមបង្កើតសិស្ស ឬការវាយតម្លៃដើម្បីសាកល្បង'
    });

  } catch (error) {
    console.error('Test session info error:', error);
    return NextResponse.json(
      {
        error: 'មានបញ្ហាក្នុងការទាញយកព័ត៌មានសម័យសាកល្បង',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );  }
}