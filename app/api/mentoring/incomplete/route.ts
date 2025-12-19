import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/mentoring/incomplete
 * Get report of incomplete mentoring visits (missing key observation fields)
 *
 * Query params:
 * - includeDetails: Include full visit data (default: false)
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "សូមចូលប្រើប្រាស់ប្រព័ន្ធជាមុនសិន" }, { status: 401 });
    }

    // Only coordinators and admins can access this report
    if (!['admin', 'coordinator'].includes(session.user.role)) {
      return NextResponse.json({ error: "អ្នកមិនមានសិទ្ធិចូលប្រើប្រាស់មុខងារនេះទេ" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const includeDetails = searchParams.get("includeDetails") === "true";

    // Get all visits
    const visits = await prisma.mentoring_visits.findMany({
      select: {
        id: true,
        visit_date: true,
        mentor_id: true,
        pilot_school_id: true,
        students_grouped_by_level: true,
        students_active_participation: true,
        teacher_has_lesson_plan: true,
        followed_lesson_plan: true,
        plan_appropriate_for_levels: true,
        num_activities_observed: true,
        observation: true,
        feedback_for_teacher: true,
        action_plan: true,
        score: true,
        grade_group: true,
        subject_observed: true,
        total_students_enrolled: true,
        students_present: true,
        ...(includeDetails && {
          users: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          pilot_schools: {
            select: {
              id: true,
              school_name: true,
              school_code: true
            }
          }
        })
      },
      orderBy: { visit_date: 'desc' }
    });

    // Analyze completeness of each visit
    const analyzed = visits.map(visit => {
      const missingFields = [];

      // Check critical observation fields
      if (visit.students_grouped_by_level === null || visit.students_grouped_by_level === false) {
        missingFields.push('students_grouped_by_level');
      }
      if (visit.students_active_participation === null || visit.students_active_participation === false) {
        missingFields.push('students_active_participation');
      }
      if (visit.teacher_has_lesson_plan === null) {
        missingFields.push('teacher_has_lesson_plan');
      }
      if (visit.followed_lesson_plan === null) {
        missingFields.push('followed_lesson_plan');
      }
      if (visit.plan_appropriate_for_levels === null) {
        missingFields.push('plan_appropriate_for_levels');
      }
      if (!visit.num_activities_observed || visit.num_activities_observed === 0) {
        missingFields.push('num_activities_observed');
      }
      if (!visit.observation || visit.observation.trim() === '') {
        missingFields.push('observation');
      }
      if (!visit.feedback_for_teacher || visit.feedback_for_teacher.trim() === '') {
        missingFields.push('feedback_for_teacher');
      }
      if (!visit.action_plan || visit.action_plan.trim() === '') {
        missingFields.push('action_plan');
      }
      if (visit.score === null || visit.score === undefined) {
        missingFields.push('score');
      }
      if (!visit.grade_group || visit.grade_group.trim() === '') {
        missingFields.push('grade_group');
      }

      const totalFields = 11;
      const filledFields = totalFields - missingFields.length;
      const completeness = Math.round((filledFields / totalFields) * 100);

      return {
        id: visit.id,
        visit_date: visit.visit_date,
        mentor_id: visit.mentor_id,
        pilot_school_id: visit.pilot_school_id,
        completeness_percentage: completeness,
        missing_fields_count: missingFields.length,
        missing_fields: missingFields,
        is_complete: missingFields.length === 0,
        ...(includeDetails && {
          mentor_name: visit.users?.name,
          mentor_email: visit.users?.email,
          school_name: visit.pilot_schools?.school_name,
          school_code: visit.pilot_schools?.school_code,
          subject_observed: visit.subject_observed,
          total_students_enrolled: visit.total_students_enrolled,
          students_present: visit.students_present
        })
      };
    });

    // Calculate summary statistics
    const summary = {
      total_visits: visits.length,
      complete_visits: analyzed.filter(v => v.is_complete).length,
      incomplete_visits: analyzed.filter(v => !v.is_complete).length,
      average_completeness: analyzed.length > 0
        ? Math.round(analyzed.reduce((sum, v) => sum + v.completeness_percentage, 0) / analyzed.length)
        : 0,
      most_common_missing_fields: getMostCommonMissingFields(analyzed),
      completeness_distribution: {
        '0-25%': analyzed.filter(v => v.completeness_percentage <= 25).length,
        '26-50%': analyzed.filter(v => v.completeness_percentage > 25 && v.completeness_percentage <= 50).length,
        '51-75%': analyzed.filter(v => v.completeness_percentage > 50 && v.completeness_percentage <= 75).length,
        '76-99%': analyzed.filter(v => v.completeness_percentage > 75 && v.completeness_percentage < 100).length,
        '100%': analyzed.filter(v => v.completeness_percentage === 100).length
      }
    };

    return NextResponse.json({
      summary,
      visits: analyzed,
      generated_at: new Date().toISOString()
    });

  } catch (error: any) {
    console.error("Error generating incomplete visits report:", error);
    return NextResponse.json(
      {
        error: "មានបញ្ហាក្នុងការដំណើរការ",
        message: error.message || "Unknown error",
        code: error.code || "UNKNOWN"
      },
      { status: 500 }
    );
  }
}

/**
 * Helper function to find most commonly missing fields
 */
function getMostCommonMissingFields(analyzed: any[]): Array<{ field: string, count: number, percentage: number }> {
  const fieldCounts: Record<string, number> = {};

  analyzed.forEach(visit => {
    visit.missing_fields.forEach((field: string) => {
      fieldCounts[field] = (fieldCounts[field] || 0) + 1;
    });
  });

  const total = analyzed.length;

  return Object.entries(fieldCounts)
    .map(([field, count]) => ({
      field,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10); // Top 10 missing fields
}
