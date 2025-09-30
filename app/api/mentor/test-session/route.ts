import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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

    // Get counts of temporary data created by this mentor
    const [
      studentCount,
      assessmentCount,
      mentoringVisitCount,
      students,
      assessments
    ] = await Promise.all([
      prisma.student.count({
        where: {
          is_temporary: true,
          added_by_mentor: true,
          added_by_id: mentorId
        }
      }),
      prisma.assessment.count({
        where: {
          is_temporary: true,
          assessed_by_mentor: true,
          added_by_id: mentorId
        }
      }),
      prisma.mentoringVisit.count({
        where: {
          is_temporary: true,
          mentor_id: mentorId
        }
      }),
      prisma.student.findMany({
        where: {
          is_temporary: true,
          added_by_mentor: true,
          added_by_id: mentorId
        },
        select: {
          id: true,
          created_at: true,
          expires_at: true
        },
        orderBy: { created_at: 'asc' },
        take: 1
      }),
      prisma.assessment.findMany({
        where: {
          is_temporary: true,
          assessed_by_mentor: true,
          added_by_id: mentorId
        },
        select: {
          id: true,
          created_at: true
        },
        orderBy: { created_at: 'asc' },
        take: 1
      })
    ]);

    // Determine session start time (earliest record creation)
    const sessionStart = students[0]?.created_at || assessments[0]?.created_at || null;

    // Calculate next reset time (midnight)
    const now = new Date();
    const nextReset = new Date(now);
    nextReset.setHours(24, 0, 0, 0); // Next midnight

    // Check if there's any data
    const hasData = studentCount > 0 || assessmentCount > 0 || mentoringVisitCount > 0;

    return NextResponse.json({
      success: true,
      session: {
        mentor_id: mentorId,
        mentor_name: session.user.name,
        status: hasData ? 'active' : 'no_data',
        started_at: sessionStart,
        next_reset: nextReset,
        hours_until_reset: Math.ceil((nextReset.getTime() - now.getTime()) / (1000 * 60 * 60))
      },
      statistics: {
        students: studentCount,
        assessments: assessmentCount,
        mentoring_visits: mentoringVisitCount,
        total_records: studentCount + assessmentCount + mentoringVisitCount
      },
      breakdown: {
        assessment_by_type: await prisma.assessment.groupBy({
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
        assessment_by_subject: await prisma.assessment.groupBy({
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
    );
  } finally {
    await prisma.$disconnect();
  }
}