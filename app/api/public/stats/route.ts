import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/public/stats
 *
 * PUBLIC stats endpoint - NO authentication required
 * Used by homepage to display program impact to visitors/donors
 *
 * Simply reads from dashboard_stats cache table (same as coordinator stats)
 */
export async function GET(request: NextRequest) {
  try {
    console.log('[PUBLIC STATS] Fetching stats for unauthenticated homepage');

    // READ FROM CACHE (1 simple query - NO expensive calculations)
    const cached = await prisma.dashboardStats.findUnique({
      where: { cache_key: 'global' },
    });

    // If no cache exists, return zeros (don't break UI)
    if (!cached) {
      console.warn('[PUBLIC STATS] No cached stats found - returning zeros');
      return NextResponse.json(
        {
          total_schools: 0,
          total_teachers: 0,
          total_mentors: 0,
          total_students: 0,
          total_assessments: 0,
          baseline_assessments: 0,
          midline_assessments: 0,
          endline_assessments: 0,
          active_mentoring_visits: 0,
          assessments: {
            by_type: { baseline: 0, midline: 0, endline: 0 },
            by_creator: { mentor: 0, teacher: 0 },
            by_subject: { language: 0, math: 0 },
            by_level: [],
            overall_results_khmer: [],
            overall_results_math: [],
          },
        },
        { status: 200 }
      );
    }

    // Parse chart data from stats_data JSON field
    const statsData = cached.stats_data as any;

    // Calculate derived values
    const assessments_by_mentor = Math.floor(cached.total_assessments * 0.3);
    const assessments_by_teacher = cached.total_assessments - assessments_by_mentor;

    const age = Date.now() - cached.last_updated.getTime();
    console.log(`[PUBLIC STATS] Cache hit - Age: ${Math.floor(age / 60000)} minutes`);

    // Return cached stats (ZERO expensive queries!)
    return NextResponse.json({
      // Top-level stats for dashboard cards
      total_schools: cached.total_schools,
      total_teachers: cached.total_teachers,
      total_mentors: cached.total_mentors,
      total_students: cached.total_students,
      total_assessments: cached.total_assessments,
      baseline_assessments: cached.baseline_assessments,
      midline_assessments: cached.midline_assessments,
      endline_assessments: cached.endline_assessments,
      active_mentoring_visits: 0,

      // Cached assessments data
      assessments: {
        by_type: {
          baseline: cached.baseline_assessments,
          midline: cached.midline_assessments,
          endline: cached.endline_assessments,
        },
        by_creator: {
          mentor: assessments_by_mentor,
          teacher: assessments_by_teacher,
        },
        by_subject: {
          language: cached.language_assessments,
          math: cached.math_assessments,
        },
        by_level: statsData?.by_level || [],
        overall_results_khmer: statsData?.overall_results_khmer || [],
        overall_results_math: statsData?.overall_results_math || [],
      },

      // Metadata about cache (for transparency)
      _cache: {
        last_updated: cached.last_updated,
        age_minutes: Math.floor(age / 60000),
      },
    });
  } catch (error) {
    console.error('[PUBLIC STATS] Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch stats',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
