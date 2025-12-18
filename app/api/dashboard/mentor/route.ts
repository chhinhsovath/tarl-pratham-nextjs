import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  getMentorDetailedAssignments,
  getMentorSchoolIds,
  getMentorAssignmentStats
        } from "@/lib/mentorAssignments";

/**
 * GET /api/dashboard/mentor
 * Comprehensive mentor dashboard data including all assigned schools and statistics
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "សូមចូលប្រើប្រាស់ប្រព័ន្ធជាមុនសិន" },
        { status: 401 }
      );
    }

    if (session.user.role !== "mentor") {
      return NextResponse.json(
        { error: "តែគ្រូព្រឹក្សាគរុកោសល្យបានអាចចូលមើលទំព័រនេះ" },
        { status: 403 }
      );
    }

    const mentorId = parseInt(session.user.id);

    // Get all detailed assignments
    const assignments = await getMentorDetailedAssignments(mentorId);
    const stats = await getMentorAssignmentStats(mentorId);
    const schoolIds = await getMentorSchoolIds(mentorId);

    // Get student counts per school (all students in mentor's assigned schools)
    const studentCounts = schoolIds.length > 0
      ? await prisma.students.groupBy({
          by: ["pilot_school_id"],
          where: {
            pilot_school_id: { in: schoolIds },
            is_active: true
        },
          _count: {
            id: true
        }
        })
      : [];

    // Get assessment counts per school and subject (all assessments in mentor's assigned schools)
    const assessmentCounts = schoolIds.length > 0
      ? await prisma.assessments.groupBy({
          by: ["pilot_school_id", "subject"],
          where: {
            pilot_school_id: { in: schoolIds }
        },
          _count: {
            id: true
        }
        })
      : [];

    // Get recent mentoring visits across all schools
    const recentVisits = schoolIds.length > 0
      ? await prisma.mentoringVisit.findMany({
          where: {
            OR: [
              { pilot_school_id: { in: schoolIds } },
              { mentor_id: mentorId },
            ]
        },
          include: {
            pilot_schools: {
              select: {
                id: true,
                school_name: true,
                province: true,
                district: true
        }
        },
            mentor: {
              select: {
                id: true,
                name: true
        }
        }
        },
          orderBy: { visit_date: "desc" },
          take: 10
        })
      : [];

    // Get pending tasks/verifications (all unverified assessments in mentor's schools)
    const pendingVerifications = schoolIds.length > 0
      ? await prisma.assessments.count({
          where: {
            pilot_school_id: { in: schoolIds },
            verified_at: null
        }
        })
      : 0;

    // Aggregate statistics by school
    const schoolStats = assignments.map((assignment) => {
      const studentsAtSchool =
        studentCounts.find(
          (sc) => sc.pilot_school_id === assignment.pilot_school_id
        )?._count.id || 0;

      const languageAssessments =
        assessmentCounts.find(
          (ac) =>
            ac.pilot_school_id === assignment.pilot_school_id &&
            ac.subject === "language"
        )?._count.id || 0;

      const mathAssessments =
        assessmentCounts.find(
          (ac) =>
            ac.pilot_school_id === assignment.pilot_school_id &&
            ac.subject === "math"
        )?._count.id || 0;

      const visitsAtSchool = recentVisits.filter(
        (v) => v.pilot_school_id === assignment.pilot_school_id
      ).length;

      return {
        assignment: assignment,
        stats: {
          student_count: studentsAtSchool,
          language_assessments: languageAssessments,
          math_assessments: mathAssessments,
          total_assessments: languageAssessments + mathAssessments,
          recent_visits: visitsAtSchool
        }
        };
    });

    // Overall summary statistics
    const totalStudents = studentCounts.reduce(
      (sum, sc) => sum + sc._count.id,
      0
    );
    const totalAssessments = assessmentCounts.reduce(
      (sum, ac) => sum + ac._count.id,
      0
    );
    const totalVisits = recentVisits.length;

    // Get recent activities across all schools
    const recentActivities = await getRecentActivities(mentorId, schoolIds);

    // Get comprehensive assessment data for charts (all assessments in mentor's assigned schools)
    // Batch 1: Assessment breakdowns by type and subject
    const [
      baseline_assessments,
      midline_assessments,
      endline_assessments,
      language_assessments_count,
      math_assessments_count,
      level_distribution_khmer,
      level_distribution_math,
    ] = await Promise.all([
      prisma.assessments.count({
        where: {
          pilot_school_id: { in: schoolIds },
          assessment_type: 'baseline'
        }
      }),
      prisma.assessments.count({
        where: {
          pilot_school_id: { in: schoolIds },
          assessment_type: 'midline'
        }
      }),
      prisma.assessments.count({
        where: {
          pilot_school_id: { in: schoolIds },
          assessment_type: 'endline'
        }
      }),
      prisma.assessments.count({
        where: {
          pilot_school_id: { in: schoolIds },
          subject: 'Language'
        }
      }),
      prisma.assessments.count({
        where: {
          pilot_school_id: { in: schoolIds },
          subject: 'Math'
        }
      }),
      // Group assessments by level for Khmer (Language)
      prisma.assessments.groupBy({
        by: ['level'],
        where: {
          pilot_school_id: { in: schoolIds },
          subject: 'Language'
        },
        _count: { id: true }
      }),
      // Group assessments by level for Math
      prisma.assessments.groupBy({
        by: ['level'],
        where: {
          pilot_school_id: { in: schoolIds },
          subject: 'Math'
        },
        _count: { id: true }
      }),
    ]);

    // Batch 2: Overall results by cycle and level (all assessments in mentor's assigned schools)
    const [
      baseline_by_level_khmer,
      midline_by_level_khmer,
      endline_by_level_khmer,
      baseline_by_level_math,
      midline_by_level_math,
      endline_by_level_math,
    ] = await Promise.all([
      // Khmer levels by cycle
      prisma.assessments.groupBy({
        by: ['level'],
        where: {
          pilot_school_id: { in: schoolIds },
          subject: 'Language',
          assessment_type: 'baseline'
        },
        _count: { id: true }
      }),
      prisma.assessments.groupBy({
        by: ['level'],
        where: {
          pilot_school_id: { in: schoolIds },
          subject: 'Language',
          assessment_type: 'midline'
        },
        _count: { id: true }
      }),
      prisma.assessments.groupBy({
        by: ['level'],
        where: {
          pilot_school_id: { in: schoolIds },
          subject: 'Language',
          assessment_type: 'endline'
        },
        _count: { id: true }
      }),
      // Math levels by cycle
      prisma.assessments.groupBy({
        by: ['level'],
        where: {
          pilot_school_id: { in: schoolIds },
          subject: 'Math',
          assessment_type: 'baseline'
        },
        _count: { id: true }
      }),
      prisma.assessments.groupBy({
        by: ['level'],
        where: {
          pilot_school_id: { in: schoolIds },
          subject: 'Math',
          assessment_type: 'midline'
        },
        _count: { id: true }
      }),
      prisma.assessments.groupBy({
        by: ['level'],
        where: {
          pilot_school_id: { in: schoolIds },
          subject: 'Math',
          assessment_type: 'endline'
        },
        _count: { id: true }
      }),
    ]);

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
        math: level_distribution_math.find(l => l.level === level)?._count.id || 0
        }));

    // Debug logging for mentor dashboard
    if (process.env.NODE_ENV === 'development') {
      console.log(`[MENTOR DASHBOARD DEBUG] mentorId: ${mentorId}`);
      console.log(`[MENTOR DASHBOARD DEBUG] schoolIds: ${JSON.stringify(schoolIds)}`);
      console.log(`[MENTOR DASHBOARD DEBUG] Total assignments: ${stats.total_assignments}`);
      console.log(`[MENTOR DASHBOARD DEBUG] Total schools: ${stats.total_schools}`);
    }

    return NextResponse.json({
      mentor: {
        id: mentorId,
        name: session.user.name,
        email: session.user.email
        },
      _debug: {
        schoolIds: schoolIds,
        schoolCount: schoolIds.length,
        assignmentsCount: stats.total_assignments
        },
      assignments: {
        total: stats.total_assignments,
        schools: stats.total_schools,
        subjects: stats.subjects,
        language_schools: stats.language_schools,
        math_schools: stats.math_schools,
        details: schoolStats
        },
      summary: {
        total_students: totalStudents,
        total_assessments: totalAssessments,
        total_visits: totalVisits,
        pending_verifications: pendingVerifications
        },
      assessments: {
        total: totalAssessments,
        by_type: {
          baseline: baseline_assessments,
          midline: midline_assessments,
          endline: endline_assessments
        },
        by_subject: {
          language: language_assessments_count,
          math: math_assessments_count
        },
        by_level: level_distribution,
        pending_verification: pendingVerifications,
        // Overall results by cycle and level for stacked percentage charts
        overall_results_khmer: overall_results_khmer,
        overall_results_math: overall_results_math
        },
      recent_activities: recentActivities,
      recent_visits: recentVisits
        });
  } catch (error: any) {
    console.error("Error fetching mentor dashboard:", error);
    return NextResponse.json(
      {
        error: "មានបញ្ហាក្នុងការទាញយកទិន្នន័យ",
        message: error.message,
        details: error.meta || error.code
        },
      { status: 500 }
    );
  }
}

/**
 * Helper function to get recent activities
 */
async function getRecentActivities(mentorId: number, schoolIds: number[]) {
  try {
    if (schoolIds.length === 0) return [];

    // Get recent students (all students in mentor's assigned schools)
    const recentStudents = await prisma.students.findMany({
      where: {
        pilot_school_id: { in: schoolIds },
        is_active: true
        },
      select: {
        id: true,
        name: true,
        created_at: true,
        pilot_schools: {
          select: {
            school_name: true
        }
        },
        users_assessments_added_by_idTousers: {
          select: {
            name: true
        }
        }
        },
      orderBy: { created_at: "desc" },
      take: 5
        });

    // Get recent assessments (all assessments in mentor's assigned schools)
    const recentAssessments = await prisma.assessments.findMany({
      where: {
        pilot_school_id: { in: schoolIds }
        },
      select: {
        id: true,
        assessment_type: true,
        subject: true,
        created_at: true,
        students: {
          select: {
            name: true
        }
        },
        pilot_schools: {
          select: {
            school_name: true
        }
        },
        users_assessments_added_by_idTousers: {
          select: {
            name: true
        }
        }
        },
      orderBy: { created_at: "desc" },
      take: 5
        });

    // Combine and sort by date
    const activities = [
      ...recentStudents.map((s) => ({
        type: "student_added",
        description: `ថ្មី​សិស្ស: ${s.name}`,
        school: s.pilot_schools?.school_name || "Unknown",
        user: s.users_assessments_added_by_idTousers?.name || "System",
        created_at: s.created_at
        })),
      ...recentAssessments.map((a) => ({
        type: "assessment_added",
        description: `${a.assessment_type} ${a.subject} សម្រាប់ ${a.students.name}`,
        school: a.pilot_schools?.school_name || "Unknown",
        user: a.users_assessments_added_by_idTousers?.name || "System",
        created_at: a.created_at
        })),
    ];

    // Sort by date and limit to 10
    return activities
      .sort((a, b) => b.created_at.getTime() - a.created_at.getTime())
      .slice(0, 10);
  } catch (error) {
    console.error("Error fetching recent activities:", error);
    return [];
  }
}
