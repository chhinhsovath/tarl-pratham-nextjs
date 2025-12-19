import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/schools/with-assignments
 *
 * Fetches pilot schools with assigned teachers and mentors.
 *
 * Query Performance (Optimized):
 * 1. Get all schools matching filters (search, province) - 1 query
 * 2. Get mentor assignments (ALL active) - 1 query (filtered in-memory by schoolIds)
 * 3. Get teacher assignments (ALL active) - 1 query (filtered in-memory by schoolIds)
 * 4. Get paginated school details - 1 query (using filtered IDs)
 * Total: 4 queries regardless of school count (no N+1)
 *
 * Memory optimization: Only keep assignments for schools in final result
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

    // Build school filter
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

    // Step 1: Get all matching schools for filtering (by assignment status)
    const allSchools = await prisma.pilot_schools.findMany({
      where: schoolWhere,
      select: { id: true },
    });

    const allSchoolIds = allSchools.map(s => s.id);

    // Step 2: Get ALL mentor and teacher assignments (filtered by schoolIds in-memory)
    // This is more efficient than querying all assignments system-wide
    const [mentorAssignments, teacherAssignments] = await Promise.all([
      prisma.mentor_school_assignments.findMany({
        where: {
          is_active: true,
          pilot_school_id: { in: allSchoolIds }
        },
        select: {
          pilot_school_id: true,
          mentor: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
      prisma.teacherSchoolAssignment.findMany({
        where: {
          is_active: true,
          pilot_school_id: { in: allSchoolIds }
        },
        select: {
          pilot_school_id: true,
          teacher: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
    ]);

    // Step 3: Create lookup maps for fast access (group by school)
    const mentorMap = new Map<number, Array<{ id: number; name: string }>>();
    mentorAssignments.forEach(assignment => {
      if (!mentorMap.has(assignment.pilot_school_id)) {
        mentorMap.set(assignment.pilot_school_id, []);
      }
      mentorMap.get(assignment.pilot_school_id)!.push(assignment.mentor);
    });

    const teacherMap = new Map<number, Array<{ id: number; name: string }>>();
    teacherAssignments.forEach(assignment => {
      if (!teacherMap.has(assignment.pilot_school_id)) {
        teacherMap.set(assignment.pilot_school_id, []);
      }
      teacherMap.get(assignment.pilot_school_id)!.push(assignment.teacher);
    });

    // Step 4: Filter schools based on assignment status
    let filteredSchoolIds = allSchools.map(s => s.id);

    if (has_mentors !== null && has_mentors !== undefined) {
      const hasMentorsBoolean = has_mentors === "true";
      filteredSchoolIds = filteredSchoolIds.filter(schoolId => {
        const count = (mentorMap.get(schoolId) || []).length;
        return hasMentorsBoolean ? count > 0 : count === 0;
      });
    }

    if (has_teachers !== null && has_teachers !== undefined) {
      const hasTeachersBoolean = has_teachers === "true";
      filteredSchoolIds = filteredSchoolIds.filter(schoolId => {
        const count = (teacherMap.get(schoolId) || []).length;
        return hasTeachersBoolean ? count > 0 : count === 0;
      });
    }

    // Step 5: Get paginated schools with all details
    const paginatedSchoolIds = filteredSchoolIds.slice(skip, skip + limit);

    const schools = await prisma.pilot_schools.findMany({
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

    // Step 6: Enrich schools with assignment names
    const enrichedSchools = schools.map(school => ({
      ...school,
      mentors: mentorMap.get(school.id) || [],
      teachers: teacherMap.get(school.id) || [],
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
