import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';


export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        {
          error: 'សូមចូលប្រើប្រាស់ជាមុនសិន',
          message: 'Unauthorized',
          code: 'UNAUTHORIZED'
        },
        { status: 401 }
      );
    }

    const user = session.user;
    const userRole = user.role;

    // Determine current assessment period (you may have this stored elsewhere)
    const currentPeriod = 'baseline'; // TODO: Get from system settings or date logic
    const periodLabel = currentPeriod === 'baseline' ? 'តេស្តដើមគ្រា' :
                       currentPeriod === 'midline' ? 'តេស្តពាក់កណ្ដាលគ្រា' :
                       'តេស្តចុងក្រោយគ្រា';

    // Get students based on role
    const recordStatus = userRole === 'teacher' ? 'production' : 'test_mentor';

    const students = await prisma.student.findMany({
      where: {
        record_status: recordStatus,
        ...(user.pilot_school_id ? { pilot_school_id: user.pilot_school_id } : {})
      },
      select: {
        id: true,
        name: true,
        baseline_khmer_level: true,
        baseline_math_level: true,
        midline_khmer_level: true,
        midline_math_level: true,
        endline_khmer_level: true,
        endline_math_level: true
      }
    });

    const totalStudents = students.length;

    // Count assessed students for current period
    const assessedStudents = students.filter(student => {
      if (currentPeriod === 'baseline') {
        return student.baseline_khmer_level || student.baseline_math_level;
      } else if (currentPeriod === 'midline') {
        return student.midline_khmer_level || student.midline_math_level;
      } else {
        return student.endline_khmer_level || student.endline_math_level;
      }
    }).length;

    const studentsRemaining = totalStudents - assessedStudents;
    const progressPercentage = totalStudents > 0
      ? Math.round((assessedStudents / totalStudents) * 100)
      : 0;

    // Generate today's tasks
    const tasksToday = [];

    if (studentsRemaining > 0) {
      tasksToday.push({
        id: '1',
        title: 'បញ្ចប់ការវាយតម្លៃសិស្សនៅសល់',
        description: `${studentsRemaining} នាក់នៅសល់ត្រូវធ្វើតេស្ត`,
        priority: studentsRemaining > 10 ? 'high' : 'medium',
        completed: false
      });
    }

    // Get recent assessments to check
    const recentAssessments = await prisma.assessment.findMany({
      where: {
        added_by_id: parseInt(user.id),
        created_at: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
        }
      },
      take: 1
    });

    if (recentAssessments.length > 0) {
      tasksToday.push({
        id: '2',
        title: 'ពិនិត្យលទ្ធផលតេស្តពីម្សិលមិញ',
        description: 'ពិនិត្យនិងបញ្ជាក់លទ្ធផល',
        priority: 'medium',
        completed: false
      });
    }

    // Upcoming deadlines (example - you may have actual deadline data)
    const upcomingDeadlines = [];

    if (currentPeriod === 'baseline') {
      upcomingDeadlines.push({
        id: '1',
        title: 'តេស្តពាក់កណ្ដាលគ្រា',
        date: '2025-10-15',
        type: 'assessment'
      });
    } else if (currentPeriod === 'midline') {
      upcomingDeadlines.push({
        id: '1',
        title: 'តេស្តចុងក្រោយគ្រា',
        date: '2025-10-30',
        type: 'assessment'
      });
    }

    // Add mentor visit deadline if mentor
    if (userRole === 'mentor') {
      upcomingDeadlines.push({
        id: '2',
        title: 'ជួបគ្រូនៅសាលា',
        date: '2025-10-20',
        type: 'visit'
      });
    }

    const dashboardData = {
      currentPeriod,
      periodLabel,
      tasksToday,
      progressPercentage,
      studentsAssessed: assessedStudents,
      studentsRemaining,
      totalStudents,
      upcomingDeadlines,
      recentActivity: []
    };

    return NextResponse.json({
      message: 'Dashboard data retrieved successfully',
      data: dashboardData
    });

  } catch (error: any) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      {
        error: 'មានបញ្ហាក្នុងការទាញយកទិន្នន័យ',
        message: 'Error fetching dashboard data',
        code: 'INTERNAL_ERROR',
        meta: { error: error.message }
      },
      { status: 500 }
    );
  }
}
