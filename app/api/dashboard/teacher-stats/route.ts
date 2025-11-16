import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    // Validate userId is provided and not "undefined" string
    if (!userId || userId === 'undefined' || userId === 'null') {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Validate userId is a valid number
    const userIdNumber = parseInt(userId);
    if (isNaN(userIdNumber)) {
      return NextResponse.json(
        { error: 'User ID must be a valid number' },
        { status: 400 }
      );
    }

    // Get user details
    const user = await prisma.user.findUnique({
      where: { id: userIdNumber },
      select: {
        id: true,
        name: true,
        pilot_school_id: true,
        assigned_subject: true,
        holding_classes: true
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get student count for this teacher's school and grades
    let studentCount = 0;
    if (user.pilot_school_id && user.holding_classes) {
      const grades = user.holding_classes === 'grade_4' ? [4] :
                   user.holding_classes === 'grade_5' ? [5] : [4, 5];

      studentCount = await prisma.student.count({
        where: {
          pilot_school_id: user.pilot_school_id,
          grade: { in: grades },
          is_active: true
        }
      });
    }

    // TODO: Get actual assessment statistics from database
    const assessmentStats = {
      baseline: {
        completed: 0,
        in_progress: 0,
        not_started: studentCount
      },
      midline: {
        completed: 0,
        in_progress: 0,
        not_started: studentCount
      },
      endline: {
        completed: 0,
        in_progress: 0,
        not_started: studentCount
      }
    };

    const response = {
      statistics: {
        student_count: studentCount,
        assessment_stats: assessmentStats,
        profile_complete: !!(user.pilot_school_id && user.assigned_subject && user.holding_classes)
      }
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Error fetching teacher dashboard data:', error);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Error meta:', error.meta);

    return NextResponse.json(
      {
        error: 'Failed to fetch teacher dashboard data',
        message: error.message || 'Unknown error',
        code: error.code || 'UNKNOWN_ERROR',
        meta: error.meta || {}
      },
      { status: 500 }
    );
  }
}