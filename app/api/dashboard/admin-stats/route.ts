import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admin can access this endpoint
    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get overall statistics
    // BATCH 1: Student & assessment counts (5 queries)
    const [
      totalStudents,
      activeStudents,
      totalAssessments,
      totalTeachers,
      totalMentors
    ] = await Promise.all([
      prisma.student.count(),
      prisma.student.count({ where: { is_active: true } }),
      prisma.assessments.count(),
      prisma.user.count({ where: { role: 'teacher' } }),
      prisma.user.count({ where: { role: 'mentor' } })
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

    // BATCH 3: Assessment breakdowns (6 queries)
    const [
      baseline_assessments,
      midline_assessments,
      endline_assessments,
      language_assessments,
      math_assessments,
      pending_verifications
    ] = await Promise.all([
      prisma.assessments.count({ where: { assessment_type: 'baseline' } }),
      prisma.assessments.count({ where: { assessment_type: 'midline' } }),
      prisma.assessments.count({ where: { assessment_type: 'endline' } }),
      prisma.assessments.count({ where: { subject: 'Language' } }),
      prisma.assessments.count({ where: { subject: 'Math' } }),
      prisma.assessments.count({ where: { verified_by_id: null } })
    ]);

    // BATCH 4: Level distributions and province data (3 queries)
    const [
      level_distribution_khmer,
      level_distribution_math,
      schools_by_province
    ] = await Promise.all([
      prisma.assessments.groupBy({
        by: ['level'],
        where: { subject: 'Language' },
        _count: { id: true }
      }),
      prisma.assessments.groupBy({
        by: ['level'],
        where: { subject: 'Math' },
        _count: { id: true }
      }),
      prisma.pilotSchool.groupBy({
        by: ['province'],
        _count: { id: true }
      })
    ]);

    // BATCH 5: Overall results by cycle and level for charts (6 queries)
    const [
      baseline_by_level_khmer,
      midline_by_level_khmer,
      endline_by_level_khmer,
      baseline_by_level_math,
      midline_by_level_math,
      endline_by_level_math
    ] = await Promise.all([
      prisma.assessments.groupBy({
        by: ['level'],
        where: { subject: 'Language', assessment_type: 'baseline' },
        _count: { id: true }
      }),
      prisma.assessments.groupBy({
        by: ['level'],
        where: { subject: 'Language', assessment_type: 'midline' },
        _count: { id: true }
      }),
      prisma.assessments.groupBy({
        by: ['level'],
        where: { subject: 'Language', assessment_type: 'endline' },
        _count: { id: true }
      }),
      prisma.assessments.groupBy({
        by: ['level'],
        where: { subject: 'Math', assessment_type: 'baseline' },
        _count: { id: true }
      }),
      prisma.assessments.groupBy({
        by: ['level'],
        where: { subject: 'Math', assessment_type: 'midline' },
        _count: { id: true }
      }),
      prisma.assessments.groupBy({
        by: ['level'],
        where: { subject: 'Math', assessment_type: 'endline' },
        _count: { id: true }
      })
    ]);

    // Format overall results by cycle for stacked percentage charts
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

    // Format level distribution
    const allLevels = new Set([
      ...level_distribution_khmer.map(l => l.level),
      ...level_distribution_math.map(l => l.level)
    ]);

    const level_distribution = Array.from(allLevels)
      .filter(level => level)
      .map(level => ({
        level,
        khmer: level_distribution_khmer.find(l => l.level === level)?._count.id || 0,
        math: level_distribution_math.find(l => l.level === level)?._count.id || 0,
      }));

    // Format province distribution
    const province_distribution = schools_by_province.map(p => ({
      province: p.province || 'Unknown',
      schools: p._count.id
    }));

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
      // Top-level statistics
      total_students: totalStudents,
      active_students: activeStudents,
      total_schools: totalSchools,
      total_teachers: totalTeachers,
      total_mentors: totalMentors,
      total_assessments: totalAssessments,
      total_mentoring_visits: totalMentoringVisits,
      pending_verifications: pending_verifications,
      at_risk_students_count: atRiskStudents,

      // Detailed breakdowns
      schools: {
        total: totalSchools,
        by_province: province_distribution
      },
      students: {
        total: totalStudents,
        active: activeStudents,
        at_risk: atRiskStudents,
        at_risk_details: processedAtRiskStudents
      },
      teachers: {
        total: totalTeachers
      },
      mentors: {
        total: totalMentors
      },
      assessments: {
        total: totalAssessments,
        by_type: {
          baseline: baseline_assessments,
          midline: midline_assessments,
          endline: endline_assessments
        },
        by_subject: {
          language: language_assessments,
          math: math_assessments
        },
        by_level: level_distribution,
        pending_verification: pending_verifications,
        // Chart data for stacked percentage charts
        overall_results_khmer: overall_results_khmer,
        overall_results_math: overall_results_math
      },
      mentoring_visits: {
        total: totalMentoringVisits
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