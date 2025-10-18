import { prisma } from '@/lib/prisma';

// Cache TTL in milliseconds (5 minutes)
const CACHE_TTL_MS = 5 * 60 * 1000;

interface CoordinatorStatsData {
  total_schools: number;
  total_students: number;
  total_teachers: number;
  total_mentors: number;
  total_assessments: number;
  baseline_assessments: number;
  midline_assessments: number;
  endline_assessments: number;
  language_assessments: number;
  math_assessments: number;
}

/**
 * Get cached coordinator stats or calculate fresh if stale
 * This reduces queries from 8 to 1 in most cases
 */
export async function getCoordinatorStats(): Promise<CoordinatorStatsData> {
  const cacheKey = 'global';

  try {
    // Try to get cached stats
    const cached = await prisma.dashboardStats.findUnique({
      where: { cache_key: cacheKey }
    });

    // Check if cache is fresh (less than TTL old)
    if (cached && cached.last_updated) {
      const age = Date.now() - cached.last_updated.getTime();
      if (age < CACHE_TTL_MS) {
        console.log('[STATS CACHE] HIT - Returning cached stats', { age_seconds: Math.floor(age / 1000) });
        return {
          total_schools: cached.total_schools,
          total_students: cached.total_students,
          total_teachers: cached.total_teachers,
          total_mentors: cached.total_mentors,
          total_assessments: cached.total_assessments,
          baseline_assessments: cached.baseline_assessments,
          midline_assessments: cached.midline_assessments,
          endline_assessments: cached.endline_assessments,
          language_assessments: cached.language_assessments,
          math_assessments: cached.math_assessments,
        };
      }
    }

    console.log('[STATS CACHE] MISS - Calculating fresh stats');

    // Cache miss or stale - calculate fresh stats
    const freshStats = await calculateCoordinatorStats();

    // Try to store in cache (may fail if table doesn't exist yet)
    try {
      await prisma.dashboardStats.upsert({
        where: { cache_key: cacheKey },
        create: {
          cache_key: cacheKey,
          role: 'coordinator',
          ...freshStats
        },
        update: freshStats
      });
      console.log('[STATS CACHE] Stored fresh stats');
    } catch (cacheError: any) {
      // Gracefully handle cache storage failure (table might not exist yet)
      if (cacheError.code === 'P2021' || cacheError.message?.includes('does not exist')) {
        console.warn('[STATS CACHE] Table does not exist yet - skipping cache storage');
      } else {
        console.error('[STATS CACHE] Failed to store cache:', cacheError.message);
      }
    }

    return freshStats;

  } catch (error: any) {
    console.error('[STATS CACHE] Error accessing cache:', error.message);
    // Fallback: calculate without caching if cache fails
    console.log('[STATS CACHE] FALLBACK - Calculating without cache');
    return await calculateCoordinatorStats();
  }
}

/**
 * Calculate fresh coordinator stats (8 queries)
 * Only called when cache is stale or missing
 */
async function calculateCoordinatorStats(): Promise<CoordinatorStatsData> {
  const schoolFilter: any = {};
  const userFilter: any = {};

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
    prisma.pilotSchool.count(),
    prisma.student.count({ where: schoolFilter }),
    prisma.user.count({ where: { ...userFilter, role: 'teacher', is_active: true } }),
    prisma.user.count({ where: { ...userFilter, role: 'mentor', is_active: true } }),
    prisma.assessment.count({ where: schoolFilter }),
    prisma.assessment.count({ where: { ...schoolFilter, assessment_type: 'baseline' } }),
    prisma.assessment.count({ where: { ...schoolFilter, assessment_type: 'midline' } }),
    prisma.assessment.count({ where: { ...schoolFilter, assessment_type: 'endline' } }),
  ]);

  // Approximate language/math split
  const language_assessments = Math.floor(total_assessments / 2);
  const math_assessments = total_assessments - language_assessments;

  return {
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
  };
}

/**
 * Invalidate (delete) cache for a specific key
 * Call this when data changes to force fresh calculation
 */
export async function invalidateStatsCache(cacheKey: string = 'global'): Promise<void> {
  try {
    await prisma.dashboardStats.delete({
      where: { cache_key: cacheKey }
    });
    console.log(`[STATS CACHE] Invalidated cache for key: ${cacheKey}`);
  } catch (error) {
    // Ignore error if cache doesn't exist
    console.log(`[STATS CACHE] Cache key ${cacheKey} not found (already invalid)`);
  }
}
