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
  by_level?: Array<{
    level: string;
    khmer: number;
    math: number;
  }>;
  overall_results_khmer?: Array<{
    cycle: string;
    levels: Record<string, number>;
  }>;
  overall_results_math?: Array<{
    cycle: string;
    levels: Record<string, number>;
  }>;
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

        // Parse chart data from stats_data JSON field
        const statsData = cached.stats_data as any;

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
          by_level: statsData?.by_level || [],
          overall_results_khmer: statsData?.overall_results_khmer || [],
          overall_results_math: statsData?.overall_results_math || [],
        };
      }
    }

    console.log('[STATS CACHE] MISS - Calculating fresh stats');

    // Cache miss or stale - calculate fresh stats
    const freshStats = await calculateCoordinatorStats();

    // Try to store in cache (may fail if table doesn't exist yet)
    try {
      // Separate scalar fields from complex data (charts)
      const { by_level, overall_results_khmer, overall_results_math, ...scalarStats } = freshStats;

      await prisma.dashboardStats.upsert({
        where: { cache_key: cacheKey },
        create: {
          cache_key: cacheKey,
          role: 'coordinator',
          ...scalarStats,
          // Store chart data in stats_data JSON field
          stats_data: {
            by_level,
            overall_results_khmer,
            overall_results_math,
          },
        },
        update: {
          ...scalarStats,
          // Store chart data in stats_data JSON field
          stats_data: {
            by_level,
            overall_results_khmer,
            overall_results_math,
          },
        }
      });
      console.log('[STATS CACHE] Stored fresh stats with chart data');
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
 * Calculate fresh coordinator stats (8 queries + chart data)
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

  // Calculate chart data if there are assessments
  let by_level: Array<{ level: string; khmer: number; math: number; }> = [];
  let overall_results_khmer: Array<{ cycle: string; levels: Record<string, number>; }> = [];
  let overall_results_math: Array<{ cycle: string; levels: Record<string, number>; }> = [];

  if (total_assessments > 0) {
    try {
      // Get all assessments with level data
      const assessments = await prisma.assessment.findMany({
        where: schoolFilter,
        select: {
          subject: true,
          level: true,  // Fixed: was 'level_achieved' (doesn't exist in schema)
          assessment_type: true,
        },
      });

      // Calculate by_level distribution
      const levelCounts: Record<string, { khmer: number; math: number }> = {};

      assessments.forEach(assessment => {
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

      // Calculate overall_results_khmer by cycle
      const khmerByType: Record<string, Record<string, number>> = {
        'តេស្តដើមគ្រា': {},
        'តេស្តពាក់កណ្ដាលគ្រា': {},
        'តេស្តចុងក្រោយគ្រា': {},
      };

      const mathByType: Record<string, Record<string, number>> = {
        'តេស្តដើមគ្រា': {},
        'តេស្តពាក់កណ្ដាលគ្រា': {},
        'តេស្តចុងក្រោយគ្រា': {},
      };

      const cycleMap: Record<string, string> = {
        'baseline': 'តេស្តដើមគ្រា',
        'midline': 'តេស្តពាក់កណ្ដាលគ្រា',
        'endline': 'តេស្តចុងក្រោយគ្រា',
      };

      assessments.forEach(assessment => {
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
      overall_results_khmer = Object.entries(khmerByType)
        .filter(([_, levels]) => Object.keys(levels).length > 0)
        .map(([cycle, levels]) => ({ cycle, levels }));

      overall_results_math = Object.entries(mathByType)
        .filter(([_, levels]) => Object.keys(levels).length > 0)
        .map(([cycle, levels]) => ({ cycle, levels }));

    } catch (error) {
      console.error('[STATS CACHE] Error calculating chart data:', error);
      // Continue with empty chart data if calculation fails
    }
  }

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
    by_level,
    overall_results_khmer,
    overall_results_math,
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
