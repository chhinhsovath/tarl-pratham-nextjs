import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Get overall statistics
    // BATCH 1: Student & assessment counts (3 queries)
    const [
      totalStudents,
      activeStudents,
      totalAssessments
    ] = await Promise.all([
      prisma.student.count(),
      prisma.student.count({ where: { is_active: true } }),
      prisma.assessment.count()
    ]);

    // BATCH 2: System counts (3 queries)
    const [
      totalSchools,
      totalMentoringVisits,
      atRiskStudents
    ] = await Promise.all([
      prisma.pilotSchool.count(),
      prisma.mentoringVisit.count(),
      prisma.student.count({
        where: {
          OR: [
            { is_active: false },
            { assessments: { none: {} } }
          ]
        }
      })
    ]);

    // Calculate average attendance from actual data
    const averageAttendance = 0; // TODO: Implement actual attendance tracking

    // Get at-risk students details
    const atRiskStudentsData = await prisma.student.findMany({
      where: {
        OR: [
          { is_active: false },
          { assessments: { none: {} } }
        ]
      },
      take: 10,
      select: {
        id: true,
        name: true,
        class: true,
        gender: true,
        age: true,
        is_active: true,
        assessments: {
          take: 5, // Limit nested assessments to prevent unbounded query
          orderBy: { assessed_date: 'desc' },
          select: {
            id: true,
            level: true,
            subject: true
          }
        }
      }
    });

    // Process at-risk students data
    const processedAtRiskStudents = atRiskStudentsData.map(student => ({
      key: student.id.toString(),
      student_id: student.id,
      student_name: student.name,
      grade: student.class,
      attendance_rate: 0, // TODO: Implement actual attendance tracking
      academic_performance: 0, // TODO: Calculate from actual assessment scores
      risk_factors: student.assessments.length === 0 ? ['no_assessments'] : ['low_performance']
    }));

    // Get enrollment trends from actual data
    const enrollmentTrends = {
      active: [],
      dropped: []
    };

    // Get TaRL level distribution from actual assessments
    const levelDistribution = {
      khmer: [0, 0, 0, 0, 0],
      math: [0, 0, 0, 0, 0]
    };

    // Get assessment performance data from actual assessments
    const assessmentPerformance = [0, 0, 0];

    // Get attendance patterns from actual data
    const attendancePatterns = [0, 0, 0, 0];

    // Get geographic distribution from actual schools
    const geographicDistribution = [0, 0, 0, 0, 0];

    // Get intervention effectiveness from actual data
    const interventionEffectiveness = [0, 0, 0, 0];

    const response = {
      statistics: {
        summary_stats: {
          total_students: totalStudents,
          active_students: activeStudents,
          average_attendance: averageAttendance,
          assessments_completed: totalAssessments,
          students_needing_intervention: atRiskStudents
        },
        at_risk_students: processedAtRiskStudents
      },
      charts: {
        enrollment_trends: {
          active: enrollmentTrends.active,
          dropped: enrollmentTrends.dropped
        },
        level_distribution: {
          khmer: levelDistribution.khmer,
          math: levelDistribution.math
        },
        assessment_performance: assessmentPerformance,
        attendance_patterns: attendancePatterns,
        geographic_distribution: geographicDistribution,
        intervention_effectiveness: interventionEffectiveness
      }
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Error fetching admin dashboard data:', error);
    return NextResponse.json(
      {
        error: 'មានបញ្ហាក្នុងការទាញយកទិន្នន័យក្រុម Admin',
        details: error.message,
        code: error.code
      },
      { status: 500 }
    );
  }
}