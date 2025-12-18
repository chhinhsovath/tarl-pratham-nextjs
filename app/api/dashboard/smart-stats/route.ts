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
    const recentAssessments = await prisma.assessments.findMany({
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

    // Get comprehensive assessment data for charts (teacher-specific)
    const schoolFilter = user.pilot_school_id
      ? { pilot_school_id: user.pilot_school_id }
      : {};

    // Optimized: Single aggregated query instead of 13 separate calls
    const assessmentStats = await prisma.assessments.groupBy({
      by: ['assessment_type', 'subject', 'level'],
      where: {
        student: schoolFilter,
      },
      _count: { id: true }
    });

    // Process aggregated results in memory (much faster)
    const stats: Record<string, any> = {
      baseline: 0,
      midline: 0,
      endline: 0,
      language: 0,
      math: 0,
      levels: {} as Record<string, { khmer: number; math: number }>,
      by_cycle_level: {
        baseline: { khmer: {} as Record<string, number>, math: {} as Record<string, number> },
        midline: { khmer: {} as Record<string, number>, math: {} as Record<string, number> },
        endline: { khmer: {} as Record<string, number>, math: {} as Record<string, number> }
      }
    };

    // Aggregate data in memory
    assessmentStats.forEach(stat => {
      const { assessment_type, subject, level, _count } = stat;
      const count = _count.id;

      // By type
      stats[assessment_type] = (stats[assessment_type] || 0) + count;

      // By subject
      stats[subject === 'Language' ? 'language' : 'math'] =
        (stats[subject === 'Language' ? 'language' : 'math'] || 0) + count;

      // By level (combined)
      if (!stats.levels[level]) {
        stats.levels[level] = { khmer: 0, math: 0 };
      }
      if (subject === 'Language') {
        stats.levels[level].khmer += count;
      } else {
        stats.levels[level].math += count;
      }

      // By cycle and level
      if (subject === 'Language') {
        stats.by_cycle_level[assessment_type].khmer[level] =
          (stats.by_cycle_level[assessment_type].khmer[level] || 0) + count;
      } else {
        stats.by_cycle_level[assessment_type].math[level] =
          (stats.by_cycle_level[assessment_type].math[level] || 0) + count;
      }
    });

    const baseline_assessments = stats.baseline;
    const midline_assessments = stats.midline;
    const endline_assessments = stats.endline;
    const language_assessments = stats.language;
    const math_assessments = stats.math;
    const level_distribution_khmer = Object.entries(stats.levels)
      .map(([level, data]) => ({ level, _count: { id: data.khmer } }))
      .filter(item => item.level);
    const level_distribution_math = Object.entries(stats.levels)
      .map(([level, data]) => ({ level, _count: { id: data.math } }))
      .filter(item => item.level);

    // Format results for charts
    const baseline_by_level_khmer = Object.entries(stats.by_cycle_level.baseline.khmer)
      .map(([level, count]) => ({ level, _count: { id: count } }));
    const midline_by_level_khmer = Object.entries(stats.by_cycle_level.midline.khmer)
      .map(([level, count]) => ({ level, _count: { id: count } }));
    const endline_by_level_khmer = Object.entries(stats.by_cycle_level.endline.khmer)
      .map(([level, count]) => ({ level, _count: { id: count } }));
    const baseline_by_level_math = Object.entries(stats.by_cycle_level.baseline.math)
      .map(([level, count]) => ({ level, _count: { id: count } }));
    const midline_by_level_math = Object.entries(stats.by_cycle_level.midline.math)
      .map(([level, count]) => ({ level, _count: { id: count } }));
    const endline_by_level_math = Object.entries(stats.by_cycle_level.endline.math)
      .map(([level, count]) => ({ level, _count: { id: count } }));

    // Format overall results by cycle for stacked percentage chart (Khmer)
    const overall_results_khmer = [
      {
        cycle: 'តេស្តដើមគ្រា',
        levels: baseline_by_level_khmer.reduce((acc, item) => {
          if (item.level) acc[item.level] = item._count.id;
          return acc;
        }, {} as Record<string, number>)
      },
      {
        cycle: 'តេស្តពាក់កណ្ដាលគ្រា',
        levels: midline_by_level_khmer.reduce((acc, item) => {
          if (item.level) acc[item.level] = item._count.id;
          return acc;
        }, {} as Record<string, number>)
      },
      {
        cycle: 'តេស្តចុងក្រោយគ្រា',
        levels: endline_by_level_khmer.reduce((acc, item) => {
          if (item.level) acc[item.level] = item._count.id;
          return acc;
        }, {} as Record<string, number>)
      }
    ];

    // Format overall results by cycle for stacked percentage chart (Math)
    const overall_results_math = [
      {
        cycle: 'តេស្តដើមគ្រា',
        levels: baseline_by_level_math.reduce((acc, item) => {
          if (item.level) acc[item.level] = item._count.id;
          return acc;
        }, {} as Record<string, number>)
      },
      {
        cycle: 'តេស្តពាក់កណ្ដាលគ្រា',
        levels: midline_by_level_math.reduce((acc, item) => {
          if (item.level) acc[item.level] = item._count.id;
          return acc;
        }, {} as Record<string, number>)
      },
      {
        cycle: 'តេស្តចុងក្រោយគ្រា',
        levels: endline_by_level_math.reduce((acc, item) => {
          if (item.level) acc[item.level] = item._count.id;
          return acc;
        }, {} as Record<string, number>)
      }
    ];

    // Format level distribution - combine Khmer and Math by level
    const allLevels = new Set([
      ...level_distribution_khmer.map(l => l.level),
      ...level_distribution_math.map(l => l.level)
    ]);

    const level_distribution = Array.from(allLevels)
      .filter(level => level) // Remove null/undefined
      .map(level => ({
        level,
        khmer: level_distribution_khmer.find(l => l.level === level)?._count.id || 0,
        math: level_distribution_math.find(l => l.level === level)?._count.id || 0,
      }));

    // Get total assessments
    const totalAssessments = baseline_assessments + midline_assessments + endline_assessments;

    const dashboardData = {
      currentPeriod,
      periodLabel,
      tasksToday,
      progressPercentage,
      studentsAssessed: assessedStudents,
      studentsRemaining,
      totalStudents,
      upcomingDeadlines,
      recentActivity: [],
      // Add assessment data for charts
      assessments: {
        total: totalAssessments,
        by_type: {
          baseline: baseline_assessments,
          midline: midline_assessments,
          endline: endline_assessments,
        },
        by_subject: {
          language: language_assessments,
          math: math_assessments,
        },
        by_level: level_distribution,
        // Overall results by cycle and level for stacked percentage charts
        overall_results_khmer: overall_results_khmer,
        overall_results_math: overall_results_math,
      }
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
