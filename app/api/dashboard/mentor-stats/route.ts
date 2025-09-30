import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Get overall statistics for mentor
    const [
      totalStudents,
      temporaryStudents,
      totalPilotSchools,
      totalAssessments,
      temporaryAssessments
    ] = await Promise.all([
      prisma.student.count(),
      prisma.student.count({ where: { is_temporary: true } }),
      prisma.pilotSchool.count(),
      prisma.assessment.count(),
      prisma.assessment.count({ where: { is_temporary: true } })
    ]);

    // Get recent assessments (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentAssessments = await prisma.assessment.findMany({
      where: {
        assessed_date: {
          gte: sevenDaysAgo
        }
      },
      take: 10,
      orderBy: {
        assessed_date: 'desc'
      },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            is_temporary: true
          }
        }
      }
    });

    const processedRecentAssessments = recentAssessments.map((assessment, index) => ({
      key: assessment.id.toString(),
      student_name: assessment.student?.name || 'Unknown',
      is_temporary: assessment.student?.is_temporary || false,
      assessment_type: assessment.cycle || 'baseline',
      subject: assessment.subject || 'khmer',
      level: assessment.level || 'beginner',
      assessed_date: assessment.assessed_date?.toISOString() || null
    }));

    // Get recent activity count
    const assessmentsLast7Days = await prisma.assessment.count({
      where: {
        assessed_date: {
          gte: sevenDaysAgo
        }
      }
    });

    // Assessment distribution data
    const [baselineCount, midlineCount, endlineCount] = await Promise.all([
      prisma.assessment.count({ where: { cycle: 'baseline' } }),
      prisma.assessment.count({ where: { cycle: 'midline' } }),
      prisma.assessment.count({ where: { cycle: 'endline' } })
    ]);

    // TODO: Calculate actual school comparison data from assessments
    const schoolComparison = {
      labels: [],
      khmer: [],
      math: []
    };

    const response = {
      statistics: {
        overview: {
          total_students: totalStudents,
          temporary_students: temporaryStudents,
          total_pilot_schools: totalPilotSchools,
          total_assessments: totalAssessments,
          temporary_assessments: temporaryAssessments
        },
        recent_activity: {
          assessments_last_7_days: assessmentsLast7Days
        },
        distributions: {
          assessments_by_type: {
            baseline: baselineCount,
            midline: midlineCount,
            endline: endlineCount
          }
        }
      },
      recent_assessments: processedRecentAssessments,
      charts: {
        assessment_distribution: {
          baseline: baselineCount,
          midline: midlineCount,
          endline: endlineCount
        },
        school_comparison: schoolComparison
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching mentor dashboard data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch mentor dashboard data' },
      { status: 500 }
    );
  }
}