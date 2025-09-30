import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Get user details
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
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
          class: { in: grades }
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
  } catch (error) {
    console.error('Error fetching teacher dashboard data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch teacher dashboard data' },
      { status: 500 }
    );
  }
}