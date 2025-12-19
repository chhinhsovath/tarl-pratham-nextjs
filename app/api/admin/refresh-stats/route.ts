import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * POST /api/admin/refresh-stats
 *
 * ADMIN-ONLY endpoint to manually refresh dashboard statistics cache
 *
 * This pre-calculates all stats and stores in dashboard_stats table
 * so that /api/coordinator/stats can read without expensive queries.
 *
 * Usage:
 * - Call after bulk imports (students, assessments)
 * - Call when data seems stale
 * - Can be triggered by cron job
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Only admin can refresh stats
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'អ្នកត្រូវតែជាអ្នកគ្រប់គ្រងដើម្បីធ្វើបច្ចុប្បន្នភាពស្ថិតិ' },
        { status: 403 }
      );
    }

    console.log('[ADMIN] Manual stats refresh triggered by:', session.user.email);

    // Calculate fresh stats (8 queries + chart data)
    const freshStats = await calculateAllStats();

    // Store in cache table
    await prisma.dashboard_stats.upsert({
      where: { cache_key: 'global' },
      create: {
        cache_key: 'global',
        role: 'coordinator',
        ...freshStats.scalarStats,
        stats_data: freshStats.chartData,
      },
      update: {
        ...freshStats.scalarStats,
        stats_data: freshStats.chartData,
      },
    });

    console.log('[ADMIN] Stats refreshed successfully:', {
      schools: freshStats.scalarStats.total_schools,
      students: freshStats.scalarStats.total_students,
      assessments: freshStats.scalarStats.total_assessments,
    });

    return NextResponse.json({
      success: true,
      message: 'ស្ថិតិត្រូវបានធ្វើបច្ចុប្បន្នភាពដោយជោគជ័យ',
      stats: {
        total_schools: freshStats.scalarStats.total_schools,
        total_students: freshStats.scalarStats.total_students,
        total_assessments: freshStats.scalarStats.total_assessments,
        baseline_assessments: freshStats.scalarStats.baseline_assessments,
        midline_assessments: freshStats.scalarStats.midline_assessments,
        endline_assessments: freshStats.scalarStats.endline_assessments,
      },
      refreshed_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[ADMIN] Error refreshing stats:', error);
    return NextResponse.json(
      {
        error: 'បរាជ័យក្នុងការធ្វើបច្ចុប្បន្នភាពស្ថិតិ',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/admin/refresh-stats
 *
 * Check last refresh time
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || (session.user.role !== 'admin' && session.user.role !== 'coordinator')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const cached = await prisma.dashboard_stats.findUnique({
      where: { cache_key: 'global' },
      select: {
        last_updated: true,
        total_schools: true,
        total_students: true,
        total_assessments: true,
      },
    });

    if (!cached) {
      return NextResponse.json({
        cached: false,
        message: 'មិនមានស្ថិតិក្នុងឃ្លាំងសម្ងាត់ទេ - សូមធ្វើបច្ចុប្បន្នភាព',
      });
    }

    const age = Date.now() - cached.last_updated.getTime();

    return NextResponse.json({
      cached: true,
      last_updated: cached.last_updated,
      age_minutes: Math.floor(age / 60000),
      stats: {
        total_schools: cached.total_schools,
        total_students: cached.total_students,
        total_assessments: cached.total_assessments,
      },
    });
  } catch (error) {
    console.error('[ADMIN] Error checking cache:', error);
    return NextResponse.json(
      { error: 'Failed to check cache status' },
      { status: 500 }
    );
  }
}

/**
 * Calculate all stats from database (expensive - 8+ queries)
 * Only called during manual refresh or initial setup
 */
async function calculateAllStats() {
  const schoolFilter: any = {};

  // Run 8 parallel queries
  const [
    total_schools,
    total_students,
    total_teachers,
    total_mentors,
    total_assessments,
    baseline_assessments,
    midline_assessments,
    endline_assessments,
  ] = await Promise.all([
    prisma.pilot_schools.count(),
    prisma.students.count({ where: schoolFilter }),
    prisma.users.count({ where: { role: 'teacher', is_active: true } }),
    prisma.users.count({ where: { role: 'mentor', is_active: true } }),
    prisma.assessments.count({ where: schoolFilter }),
    prisma.assessments.count({ where: { ...schoolFilter, assessment_type: 'baseline' } }),
    prisma.assessments.count({ where: { ...schoolFilter, assessment_type: 'midline' } }),
    prisma.assessments.count({ where: { ...schoolFilter, assessment_type: 'endline' } }),
  ]);

  // Approximate language/math split
  const language_assessments = Math.floor(total_assessments / 2);
  const math_assessments = total_assessments - language_assessments;

  // Calculate chart data if there are assessments
  let by_level: Array<{ level: string; khmer: number; math: number }> = [];
  let overall_results_khmer: Array<{ cycle: string; levels: Record<string, number> }> = [];
  let overall_results_math: Array<{ cycle: string; levels: Record<string, number> }> = [];

  if (total_assessments > 0) {
    try {
      // Get all assessments with level data
      const assessments = await prisma.assessments.findMany({
        where: schoolFilter,
        select: {
          subject: true,
          level: true,
          assessment_type: true,
        },
      });

      // Calculate by_level distribution
      const levelCounts: Record<string, { khmer: number; math: number }> = {};

      assessments.forEach((assessment) => {
        if (!assessment.level) return;

        const level = assessment.level;
        if (!levelCounts[level]) {
          levelCounts[level] = { khmer: 0, math: 0 };
        }

        if (assessment.subject === 'language') {
          levelCounts[level].khmer++;
        } else if (assessment.subject === 'math') {
          levelCounts[level].math++;
        }
      });

      by_level = Object.entries(levelCounts).map(([level, counts]) => ({
        level,
        khmer: counts.khmer,
        math: counts.math,
      }));

      // Calculate overall_results by cycle (ENGLISH labels for charts)
      const khmerByType: Record<string, Record<string, number>> = {
        'baseline': {},
        'midline': {},
        'endline': {},
      };

      const mathByType: Record<string, Record<string, number>> = {
        'baseline': {},
        'midline': {},
        'endline': {},
      };

      const cycleMap: Record<string, string> = {
        baseline: 'baseline',
        midline: 'midline',
        endline: 'endline',
      };

      assessments.forEach((assessment) => {
        if (!assessment.level || !assessment.assessment_type) return;

        const cycle = cycleMap[assessment.assessment_type];
        if (!cycle) return;

        const level = assessment.level;

        if (assessment.subject === 'language') {
          khmerByType[cycle][level] = (khmerByType[cycle][level] || 0) + 1;
        } else if (assessment.subject === 'math') {
          mathByType[cycle][level] = (mathByType[cycle][level] || 0) + 1;
        }
      });

      // Convert to array format for charts
      // IMPORTANT: Always include all 3 cycles (baseline, midline, endline) even if empty
      overall_results_khmer = Object.entries(khmerByType).map(([cycle, levels]) => ({
        cycle,
        levels
      }));

      overall_results_math = Object.entries(mathByType).map(([cycle, levels]) => ({
        cycle,
        levels
      }));
    } catch (error) {
      console.error('[STATS] Error calculating chart data:', error);
      // Continue with empty chart data if calculation fails
    }
  }

  return {
    scalarStats: {
      total_schools,
      total_students,
      total_teachers,
      total_mentors,
      total_assessments,
      baseline_assessments,
      midline_assessments,
      endline_assessments,
      language_assessments,
      math_assessments,
    },
    chartData: {
      by_level,
      overall_results_khmer,
      overall_results_math,
    },
  };
}
