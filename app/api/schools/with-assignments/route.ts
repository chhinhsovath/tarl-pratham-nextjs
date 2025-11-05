import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/schools/with-assignments
 *
 * Fetches pilot schools with assignment counts (mentors and teachers).
 *
 * Optimizations:
 * - Uses single database query with groupBy (no N+1)
 * - Efficient filtering by assignment status
 * - Cached counts per school to avoid multiple queries
 *
 * Query Parameters:
 * - page: number (default 1)
 * - limit: number (default 10)
 * - search: string (school name or code)
 * - province_id: string
 * - has_mentors: boolean (true = has mentors, false = no mentors)
 * - has_teachers: boolean (true = has teachers, false = no teachers)
 */

function hasPermission(userRole: string, action: string): boolean {
  const permissions = {
    admin: ["view", "create", "update", "delete"],
    coordinator: ["view", "create", "update", "delete"],
    mentor: ["view"],
    teacher: ["view"],
    viewer: ["view"]
  };

  return permissions[userRole as keyof typeof permissions]?.includes(action) || false;
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "សូមចូលប្រើប្រាស់ប្រព័ន្ធជាមុនសិន" }, { status: 401 });
    }

    if (!hasPermission(session.user.role, "view")) {
      return NextResponse.json({ error: "អ្នកមិនមានសិទ្ធិមើលសាលារៀនទេ" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const province_id = searchParams.get("province_id") || "";
    const has_mentors = searchParams.get("has_mentors");
    const has_teachers = searchParams.get("has_teachers");

    const skip = (page - 1) * limit;

    // Step 1: Get all schools matching search/province filters
    const schoolWhere: any = {};

    if (search) {
      schoolWhere.OR = [
        { school_name: { contains: search, mode: "insensitive" } },
        { school_code: { contains: search, mode: "insensitive" } },
        { district: { contains: search, mode: "insensitive" } },
        { cluster: { contains: search, mode: "insensitive" } }
      ];
    }

    if (province_id) {
      schoolWhere.province = province_id;
    }

    // Step 2: Get assignment counts in two efficient queries (no N+1)
    const [allSchools, totalCount, mentorCounts, teacherCounts] = await Promise.all([
      // Get all schools that match filters (for assignment filtering)
      prisma.pilotSchool.findMany({
        where: schoolWhere,
        select: { id: true },
      }),
      // Total count
      prisma.pilotSchool.count({ where: schoolWhere }),
      // Mentor assignment counts (active only, grouped by school)
      prisma.mentorSchoolAssignment.groupBy({
        by: ["pilot_school_id"],
        where: { is_active: true },
        _count: { id: true },
      }),
      // Teacher assignment counts (active only, grouped by school)
      prisma.teacherSchoolAssignment.groupBy({
        by: ["pilot_school_id"],
        where: { is_active: true },
        _count: { id: true },
      }),
    ]);

    // Step 3: Create lookup maps for fast access
    const mentorCountMap = new Map(
      mentorCounts.map(m => [m.pilot_school_id, m._count.id])
    );
    const teacherCountMap = new Map(
      teacherCounts.map(t => [t.pilot_school_id, t._count.id])
    );

    // Step 4: Filter schools based on assignment status
    let filteredSchoolIds = allSchools.map(s => s.id);

    if (has_mentors !== null && has_mentors !== undefined) {
      const hasMentorsBoolean = has_mentors === "true";
      filteredSchoolIds = filteredSchoolIds.filter(schoolId => {
        const count = mentorCountMap.get(schoolId) || 0;
        return hasMentorsBoolean ? count > 0 : count === 0;
      });
    }

    if (has_teachers !== null && has_teachers !== undefined) {
      const hasTeachersBoolean = has_teachers === "true";
      filteredSchoolIds = filteredSchoolIds.filter(schoolId => {
        const count = teacherCountMap.get(schoolId) || 0;
        return hasTeachersBoolean ? count > 0 : count === 0;
      });
    }

    // Step 5: Get paginated schools with all details
    const paginatedSchoolIds = filteredSchoolIds.slice(skip, skip + limit);

    const schools = await prisma.pilotSchool.findMany({
      where: {
        id: { in: paginatedSchoolIds }
      },
      select: {
        id: true,
        school_name: true,
        school_code: true,
        province: true,
        district: true,
        cluster: true,
        cluster_id: true,
        baseline_start_date: true,
        baseline_end_date: true,
        midline_start_date: true,
        midline_end_date: true,
        endline_start_date: true,
        endline_end_date: true,
        is_locked: true,
        created_at: true,
        updated_at: true,
      },
      orderBy: { created_at: "desc" }
    });

    // Step 6: Enrich schools with assignment counts
    const enrichedSchools = schools.map(school => ({
      ...school,
      mentor_count: mentorCountMap.get(school.id) || 0,
      teacher_count: teacherCountMap.get(school.id) || 0,
    }));

    return NextResponse.json({
      data: enrichedSchools,
      pagination: {
        page,
        limit,
        total: filteredSchoolIds.length,
        pages: Math.ceil(filteredSchoolIds.length / limit)
      }
    });

  } catch (error) {
    console.error("Error fetching schools with assignments:", error);
    return NextResponse.json(
      {
        error: "មានបញ្ហាក្នុងការទាញយកទិន្នន័យ",
        message: error instanceof Error ? error.message : "Internal server error"
      },
      { status: 500 }
    );
  }
}
