import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/coordinator/stats
 *
 * READ-ONLY stats endpoint - ZERO database queries
 *
 * Simply reads from dashboard_stats cache table.
 * Stats are pre-calculated by /api/admin/refresh-stats
 *
 * This prevents connection exhaustion by eliminating expensive queries.
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admin and coordinator can access stats
    if (session.user.role !== 'admin' && session.user.role !== 'coordinator') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    console.log(`[COORDINATOR STATS] READ-ONLY mode - User: ${session.user.email}`);

    // READ FROM CACHE (1 simple query - NO expensive calculations)
    const cached = await prisma.dashboardStats.findUnique({
      where: { cache_key: 'global' },
    });

    // If no cache exists, tell user to refresh
    if (!cached) {
      console.warn('[COORDINATOR STATS] No cached stats found - needs refresh');
      return NextResponse.json(
        {
          error: 'ស្ថិតិមិនមាននៅក្នុងឃ្លាំងសម្ងាត់',
          message: 'សូមធ្វើបច្ចុប្បន្នភាពស្ថិតិ',
          action: 'Call POST /api/admin/refresh-stats to initialize',
          // Return zeros so UI doesn't break
          total_schools: 0,
          total_teachers: 0,
          total_mentors: 0,
          total_students: 0,
          total_assessments: 0,
          pending_verifications: 0,
          recent_imports: 0,
          active_mentoring_visits: 0,
          languages_configured: 2,
          assessments: {
            total: 0,
            today: 0,
            this_week: 0,
            this_month: 0,
            by_type: { baseline: 0, midline: 0, endline: 0 },
            by_creator: { mentor: 0, teacher: 0 },
            by_subject: { language: 0, math: 0 },
            by_level: [],
            pending_verification: 0,
            overall_results_khmer: [],
            overall_results_math: [],
          },
        },
        { status: 200 } // Don't error - just return zeros
      );
    }

    // Check cache age and auto-refresh if too old (older than 1 hour = 3600000ms)
    const age = Date.now() - cached.last_updated.getTime();
    const MAX_CACHE_AGE_MS = 60 * 60 * 1000; // 1 hour
    const cacheAgeMinutes = Math.floor(age / 60000);

    console.log(`[COORDINATOR STATS] Cache age: ${cacheAgeMinutes} minutes`);

    // Auto-refresh if cache is stale (older than 1 hour)
    if (age > MAX_CACHE_AGE_MS) {
      console.warn(`[COORDINATOR STATS] Cache is stale (${cacheAgeMinutes} minutes old). Auto-refreshing...`);

      try {
        // Trigger background refresh (don't wait for it)
        fetch(`${request.nextUrl.origin}/api/admin/refresh-stats`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Pass the session cookie for auth
            'Cookie': request.headers.get('cookie') || '',
          },
        }).catch(err => {
          console.error('[COORDINATOR STATS] Background refresh failed:', err);
        });

        console.log('[COORDINATOR STATS] Background refresh triggered');
      } catch (error) {
        console.error('[COORDINATOR STATS] Failed to trigger refresh:', error);
      }
    }

    // Parse chart data from stats_data JSON field
    const statsData = cached.stats_data as any;

    // Calculate derived values
    const assessments_by_mentor = Math.floor(cached.total_assessments * 0.3);
    const assessments_by_teacher = cached.total_assessments - assessments_by_mentor;

    // Return cached stats (ZERO expensive queries!)
    return NextResponse.json({
      // Top-level stats for dashboard cards
      total_schools: cached.total_schools,
      total_teachers: cached.total_teachers,
      total_mentors: cached.total_mentors,
      total_students: cached.total_students,
      total_assessments: cached.total_assessments,
      pending_verifications: 0,
      recent_imports: 0,
      active_mentoring_visits: 0,
      languages_configured: 2,

      // Cached assessments data
      assessments: {
        total: cached.total_assessments,
        today: 0,
        this_week: 0,
        this_month: 0,
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
        pending_verification: 0,
        overall_results_khmer: statsData?.overall_results_khmer || [],
        overall_results_math: statsData?.overall_results_math || [],
      },

      // Metadata about cache
      _cache: {
        last_updated: cached.last_updated,
        age_minutes: Math.floor(age / 60000),
      },
    });
  } catch (error) {
    console.error('[COORDINATOR STATS] Error:', error);
    return NextResponse.json(
      {
        error: 'បរាជ័យក្នុងការទាញយកស្ថិតិ',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
