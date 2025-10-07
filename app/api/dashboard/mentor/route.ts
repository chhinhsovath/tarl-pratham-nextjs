import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  getMentorDetailedAssignments,
  getMentorSchoolIds,
  getMentorAssignmentStats,
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
        { error: "តែម៉ង់ទ័របានអាចចូលមើលទំព័រនេះ" },
        { status: 403 }
      );
    }

    const mentorId = parseInt(session.user.id);

    // Get all detailed assignments
    const assignments = await getMentorDetailedAssignments(mentorId);
    const stats = await getMentorAssignmentStats(mentorId);
    const schoolIds = await getMentorSchoolIds(mentorId);

    // Get student counts per school
    const studentCounts = schoolIds.length > 0
      ? await prisma.student.groupBy({
          by: ["pilot_school_id"],
          where: {
            pilot_school_id: { in: schoolIds },
            is_active: true,
          },
          _count: {
            id: true,
          },
        })
      : [];

    // Get assessment counts per school and subject
    const assessmentCounts = schoolIds.length > 0
      ? await prisma.assessment.groupBy({
          by: ["pilot_school_id", "subject"],
          where: {
            pilot_school_id: { in: schoolIds },
          },
          _count: {
            id: true,
          },
        })
      : [];

    // Get recent mentoring visits across all schools
    const recentVisits = schoolIds.length > 0
      ? await prisma.mentoringVisit.findMany({
          where: {
            OR: [
              { pilot_school_id: { in: schoolIds } },
              { mentor_id: mentorId },
            ],
          },
          include: {
            pilot_school: {
              select: {
                id: true,
                school_name: true,
                province: true,
                district: true,
              },
            },
            mentor: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: { visit_date: "desc" },
          take: 10,
        })
      : [];

    // Get pending tasks/verifications
    const pendingVerifications = schoolIds.length > 0
      ? await prisma.assessment.count({
          where: {
            pilot_school_id: { in: schoolIds },
            verified_at: null,
          },
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
          recent_visits: visitsAtSchool,
        },
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

    return NextResponse.json({
      mentor: {
        id: mentorId,
        name: session.user.name,
        email: session.user.email,
      },
      assignments: {
        total: stats.total_assignments,
        schools: stats.total_schools,
        subjects: stats.subjects,
        language_schools: stats.language_schools,
        math_schools: stats.math_schools,
        details: schoolStats,
      },
      summary: {
        total_students: totalStudents,
        total_assessments: totalAssessments,
        total_visits: totalVisits,
        pending_verifications: pendingVerifications,
      },
      recent_activities: recentActivities,
      recent_visits: recentVisits,
    });
  } catch (error: any) {
    console.error("Error fetching mentor dashboard:", error);
    return NextResponse.json(
      {
        error: "មានបញ្ហាក្នុងការទាញយកទិន្នន័យ",
        message: error.message,
        details: error.meta || error.code,
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

    // Get recent students added
    const recentStudents = await prisma.student.findMany({
      where: {
        pilot_school_id: { in: schoolIds },
        is_active: true,
      },
      select: {
        id: true,
        name: true,
        created_at: true,
        pilot_school: {
          select: {
            school_name: true,
          },
        },
        added_by: {
          select: {
            name: true,
          },
        },
      },
      orderBy: { created_at: "desc" },
      take: 5,
    });

    // Get recent assessments
    const recentAssessments = await prisma.assessment.findMany({
      where: {
        pilot_school_id: { in: schoolIds },
      },
      select: {
        id: true,
        assessment_type: true,
        subject: true,
        created_at: true,
        student: {
          select: {
            name: true,
          },
        },
        pilot_school: {
          select: {
            school_name: true,
          },
        },
        added_by: {
          select: {
            name: true,
          },
        },
      },
      orderBy: { created_at: "desc" },
      take: 5,
    });

    // Combine and sort by date
    const activities = [
      ...recentStudents.map((s) => ({
        type: "student_added",
        description: `ថ្មី​សិស្ស: ${s.name}`,
        school: s.pilot_school?.school_name || "Unknown",
        user: s.added_by?.name || "System",
        created_at: s.created_at,
      })),
      ...recentAssessments.map((a) => ({
        type: "assessment_added",
        description: `${a.assessment_type} ${a.subject} សម្រាប់ ${a.student.name}`,
        school: a.pilot_school?.school_name || "Unknown",
        user: a.added_by?.name || "System",
        created_at: a.created_at,
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
