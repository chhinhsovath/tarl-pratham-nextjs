import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Get mentor's user record to find assigned pilot_school_id
    const mentorUser = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      select: { pilot_school_id: true, role: true }
    });

    if (!mentorUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Build filter based on mentor's assigned school
    const schoolFilter = mentorUser.pilot_school_id
      ? { pilot_school_id: mentorUser.pilot_school_id }
      : {}; // If no assigned school, show nothing

    // Get statistics filtered by mentor's assigned school
    // BATCH 1: Student counts (3 queries)
    const [
      totalStudents,
      temporaryStudents,
      totalPilotSchools
    ] = await Promise.all([
      prisma.students.count({ where: schoolFilter }),
      prisma.students.count({ where: { ...schoolFilter, is_temporary: true } }),
      Promise.resolve(mentorUser.pilot_school_id ? 1 : 0) // Mentor assigned to 1 school or 0
    ]);

    // BATCH 2: Assessment counts (2 queries)
    const [
      totalAssessments,
      temporaryAssessments
    ] = await Promise.all([
      prisma.assessments.count({
        where: {
          student: schoolFilter
        }
      }),
      prisma.assessments.count({
        where: {
          is_temporary: true,
          student: schoolFilter
        }
      })
    ]);

    // Get recent assessments (last 7 days) filtered by mentor's school
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentAssessments = await prisma.assessments.findMany({
      where: {
        assessed_date: {
          gte: sevenDaysAgo
        },
        student: schoolFilter
      },
      take: 10,
      orderBy: {
        assessed_date: 'desc'
      },
      include: {
        students: {
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
      student_name: assessment.students?.name || 'Unknown',
      is_temporary: assessment.students?.is_temporary || false,
      assessment_type: assessment.cycle || 'baseline',
      subject: assessment.subject || 'khmer',
      level: assessment.level || 'beginner',
      assessed_date: assessment.assessed_date?.toISOString() || null
    }));

    // Get recent activity count filtered by school
    const assessmentsLast7Days = await prisma.assessments.count({
      where: {
        assessed_date: {
          gte: sevenDaysAgo
        },
        student: schoolFilter
      }
    });

    // Assessment distribution data filtered by school and using assessment_type field
    const [baselineCount, midlineCount, endlineCount] = await Promise.all([
      prisma.assessments.count({
        where: { assessment_type: 'baseline', student: schoolFilter }
      }),
      prisma.assessments.count({
        where: { assessment_type: 'midline', student: schoolFilter }
      }),
      prisma.assessments.count({
        where: { assessment_type: 'endline', student: schoolFilter }
      })
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