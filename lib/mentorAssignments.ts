import { prisma } from "@/lib/prisma";
import { createRequestCache } from "@/lib/cache/request-cache";

export interface MentorAssignment {
  pilot_school_id: number;
  subject: string;
  school_name?: string;
  province?: string;
  district?: string;
}

/**
 * ⚠️ CRITICAL: Cache invalidation for mentor assignments
 * Call this when mentor assignments change to prevent stale authorization data
 */
export const invalidateMentorCache = {
  byMentor: (mentorId: number) => {
    globalMentorCache.clear();
    console.log(`[Cache] Invalidated mentor cache for mentor ${mentorId}`);
  },
  bySchool: (schoolId: number) => {
    globalMentorCache.clear();
    console.log(`[Cache] Invalidated mentor cache for school ${schoolId}`);
  },
  all: () => {
    globalMentorCache.clear();
    console.log(`[Cache] Cleared all mentor cache`);
  },
};

// 🚨 SECURITY: Global cache with 5-min TTL - only for performance, not correctness
// If authorization depends on this cache, it creates security risks if assignments change
// during the cache window. Always verify assignments in sensitive operations (verification, locking).
const globalMentorCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCacheKey(mentorId: number, subject?: string, activeOnly?: boolean): string {
  return `mentor:${mentorId}:${subject || 'all'}:${activeOnly ? 'active' : 'all'}`;
}

function getOrSetGlobalCache<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const cached = globalMentorCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return Promise.resolve(cached.data as T);
  }
  return fn().then(data => {
    globalMentorCache.set(key, { data, timestamp: Date.now() });
    return data;
  });
}

/**
 * Get all schools assigned to a mentor
 * ✅ OPTIMIZED: Includes global caching with 5-min TTL
 * ⚠️ SECURITY: For authorization-sensitive operations, always verify fresh assignments
 * @param mentorId - The mentor's user ID
 * @param subject - Optional: Filter by specific subject (Language or Math)
 * @param activeOnly - Whether to return only active assignments (default: true)
 * @param bypassCache - Set to true for sensitive operations (verification, locking)
 * @returns Array of school assignments with details
 */
export async function getMentorAssignedSchools(
  mentorId: number,
  subject?: string,
  activeOnly: boolean = true,
  bypassCache: boolean = false
): Promise<MentorAssignment[]> {
  const cacheKey = getCacheKey(mentorId, subject, activeOnly);

  // Skip cache for sensitive operations that require real-time authorization
  if (bypassCache) {
    return fetchMentorAssignedSchools(mentorId, subject, activeOnly);
  }

  return getOrSetGlobalCache(cacheKey, () => fetchMentorAssignedSchools(mentorId, subject, activeOnly));
}

/**
 * Fetch mentor schools without caching
 * @internal Use getMentorAssignedSchools instead
 */
async function fetchMentorAssignedSchools(
  mentorId: number,
  subject?: string,
  activeOnly: boolean = true
): Promise<MentorAssignment[]> {
  try {
    // ✅ OPTIMIZATION: Batch fetch mentor data with minimal fields
    const [assignments, user] = await Promise.all([
      // Query 1: Check explicit assignments
      prisma.mentorSchoolAssignment.findMany({
        where: {
          mentor_id: mentorId,
          ...(activeOnly && { is_active: true }),
          ...(subject && { subject }),
        },
        select: {
          pilot_school_id: true,
          subject: true,
          pilot_schools: {
            select: {
              id: true,
              school_name: true,
              province: true,
              district: true,
            },
          },
        },
      }),
      // Query 2: Fetch user for fallback (only if needed)
      activeOnly
        ? prisma.user.findUnique({
            where: { id: mentorId },
            select: {
              id: true,
              pilot_school_id: true,
              pilot_schools: {
                select: {
                  id: true,
                  school_name: true,
                  province: true,
                  district: true,
                },
              },
            },
          })
        : Promise.resolve(null),
    ]);

    // If assignments exist, return them
    if (assignments.length > 0) {
      return assignments.map((assignment) => ({
        pilot_school_id: assignment.pilot_school_id,
        subject: assignment.subject,
        school_name: assignment.pilot_schools.school_name,
        province: assignment.pilot_schools.province,
        district: assignment.pilot_schools.district,
      }));
    }

    // BACKWARDS COMPATIBILITY: If no assignments, check user.pilot_school_id
    if (user?.pilot_school_id && user.pilot_school) {
      // Return both subjects if no specific subject requested
      const subjects = subject ? [subject] : ["Language", "Math"];
      return subjects.map((subj) => ({
        pilot_school_id: user.pilot_school_id!,
        subject: subj,
        school_name: user.pilot_school!.school_name,
        province: user.pilot_school!.province,
        district: user.pilot_school!.district,
      }));
    }

    // No assignments found
    return [];
  } catch (error) {
    console.error("Error fetching mentor assigned schools:", error);
    return [];
  }
}

/**
 * Get all school IDs assigned to a mentor
 * ✅ OPTIMIZED: Uses cached assignments
 * @param mentorId - The mentor's user ID
 * @param subject - Optional: Filter by specific subject
 * @returns Array of school IDs
 */
export async function getMentorSchoolIds(
  mentorId: number,
  subject?: string
): Promise<number[]> {
  const assignments = await getMentorAssignedSchools(mentorId, subject);
  // Remove duplicates using Set
  return [...new Set(assignments.map((a) => a.pilot_school_id))];
}

/**
 * Get all subjects a mentor is assigned to teach
 * @param mentorId - The mentor's user ID
 * @param schoolId - Optional: Filter by specific school
 * @returns Array of subjects (Language, Math)
 */
export async function getMentorAssignedSubjects(
  mentorId: number,
  schoolId?: number
): Promise<string[]> {
  const assignments = await getMentorAssignedSchools(mentorId);
  const filtered = schoolId
    ? assignments.filter((a) => a.pilot_school_id === schoolId)
    : assignments;

  // Remove duplicates
  return [...new Set(filtered.map((a) => a.subject))];
}

/**
 * Check if a mentor can access a specific school
 * @param mentorId - The mentor's user ID
 * @param schoolId - The school ID to check
 * @param subject - Optional: Also verify subject assignment
 * @returns Boolean indicating access permission
 */
export async function canMentorAccessSchool(
  mentorId: number,
  schoolId: number,
  subject?: string
): Promise<boolean> {
  const assignments = await getMentorAssignedSchools(mentorId, subject);
  return assignments.some((a) => a.pilot_school_id === schoolId);
}

/**
 * Get mentor assignment statistics
 * @param mentorId - The mentor's user ID
 * @returns Object with assignment counts and details
 */
export async function getMentorAssignmentStats(mentorId: number) {
  const allAssignments = await getMentorAssignedSchools(mentorId, undefined, true);

  const schoolIds = [...new Set(allAssignments.map((a) => a.pilot_school_id))];
  const subjects = [...new Set(allAssignments.map((a) => a.subject))];

  const languageSchools = allAssignments
    .filter((a) => a.subject === "Language")
    .map((a) => a.pilot_school_id);

  const mathSchools = allAssignments
    .filter((a) => a.subject === "Math")
    .map((a) => a.pilot_school_id);

  return {
    total_schools: schoolIds.length,
    total_assignments: allAssignments.length,
    subjects: subjects,
    language_schools: languageSchools.length,
    math_schools: mathSchools.length,
    schools: allAssignments,
  };
}

/**
 * Build Prisma where clause for mentor's accessible schools
 * Useful for API queries that need to filter by mentor's schools
 * @param mentorId - The mentor's user ID
 * @param subject - Optional: Filter by subject
 * @returns Prisma where clause object
 */
export async function getMentorSchoolsWhereClause(
  mentorId: number,
  subject?: string
): Promise<{ pilot_school_id: { in: number[] } } | {}> {
  const schoolIds = await getMentorSchoolIds(mentorId, subject);

  if (schoolIds.length === 0) {
    // Return empty results if no schools assigned
    return { pilot_school_id: -1 }; // No school has ID -1
  }

  return { pilot_school_id: { in: schoolIds } };
}

/**
 * Get detailed assignment information for a mentor
 * Includes school details and assignment metadata
 * @param mentorId - The mentor's user ID
 * @returns Array of detailed assignments
 */
export async function getMentorDetailedAssignments(mentorId: number) {
  try {
    const assignments = await prisma.mentorSchoolAssignment.findMany({
      where: {
        mentor_id: mentorId,
        is_active: true,
      },
      include: {
        pilot_schools: {
          select: {
            id: true,
            school_name: true,
            school_code: true,
            province: true,
            district: true,
            cluster: true,
          },
        },
        assigned_by: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        assigned_date: "desc",
      },
    });

    // Backwards compatibility
    if (assignments.length === 0) {
      const user = await prisma.user.findUnique({
        where: { id: mentorId },
        include: {
          pilot_school: true,
        },
      });

      if (user?.pilot_school) {
        return [
          {
            id: 0, // Synthetic ID for backwards compat
            mentor_id: mentorId,
            pilot_school_id: user.pilot_school_id!,
            subject: "Language",
            assigned_date: user.created_at,
            is_active: true,
            notes: "Legacy assignment (from user profile)",
            pilot_school: user.pilot_school,
            assigned_by: null,
          },
          {
            id: 0,
            mentor_id: mentorId,
            pilot_school_id: user.pilot_school_id!,
            subject: "Math",
            assigned_date: user.created_at,
            is_active: true,
            notes: "Legacy assignment (from user profile)",
            pilot_school: user.pilot_school,
            assigned_by: null,
          },
        ];
      }
    }

    return assignments;
  } catch (error) {
    console.error("Error fetching mentor detailed assignments:", error);
    return [];
  }
}
