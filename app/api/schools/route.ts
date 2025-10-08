import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

/**
 * ⚠️  WARNING: LEGACY SCHOOLS API
 * 
 * This API uses the complex `schools` table for full education management.
 * For TaRL application, prefer `/api/pilot-schools` which uses the simpler 
 * `pilot_schools` table with 33 pilot program schools.
 * 
 * See: /docs/SCHOOL_DATA_STRATEGY.md for full explanation.
 */

// Validation schema
const schoolSchema = z.object({
  name: z.string().min(1, "School name is required"),
  code: z.string().min(1, "School code is required"),
  province_id: z.number().min(1, "Province is required"),
  district: z.string().optional(),
  commune: z.string().optional(),
  village: z.string().optional(),
  school_type: z.string().optional(),
  level: z.string().optional(),
  total_students: z.number().optional(),
  total_teachers: z.number().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  phone: z.string().optional(),
  email: z.string().email("Invalid email format").optional(),
});

// Helper function to check permissions
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

// GET /api/schools - List schools with pagination and filtering
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
    const school_type = searchParams.get("school_type") || "";
    const level = searchParams.get("level") || "";
    
    const skip = (page - 1) * limit;

    // Use pilot_schools table instead of schools (which is empty)
    const pilotWhere: any = {};

    if (search) {
      pilotWhere.OR = [
        { school_name: { contains: search, mode: "insensitive" } },
        { school_code: { contains: search, mode: "insensitive" } },
        { district: { contains: search, mode: "insensitive" } },
        { cluster: { contains: search, mode: "insensitive" } }
      ];
    }

    if (province_id) {
      pilotWhere.province = province_id;
    }

    const [pilotSchools, total] = await Promise.all([
      prisma.pilotSchool.findMany({
        where: pilotWhere,
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
        },
        skip,
        take: limit,
        orderBy: { created_at: "desc" }
      }),
      prisma.pilotSchool.count({ where: pilotWhere })
    ]);

    // Transform pilot_schools data to match schools API format
    const schools = pilotSchools.map(ps => ({
      id: ps.id,
      name: ps.school_name,
      code: ps.school_code,
      province_id: 0, // Not used in pilot_schools
      district: ps.district,
      commune: null, // Not in pilot_schools schema
      village: null, // Not in pilot_schools schema
      school_type: null, // Not in pilot_schools schema
      level: null, // Not in pilot_schools schema
      total_students: null, // Not in pilot_schools schema
      total_teachers: null, // Not in pilot_schools schema
      latitude: null, // Not in pilot_schools schema
      longitude: null, // Not in pilot_schools schema
      phone: null, // Not in pilot_schools schema
      email: null, // Not in pilot_schools schema
      cluster: ps.cluster,
      cluster_id: ps.cluster_id,
      baseline_start_date: ps.baseline_start_date,
      baseline_end_date: ps.baseline_end_date,
      midline_start_date: ps.midline_start_date,
      midline_end_date: ps.midline_end_date,
      endline_start_date: ps.endline_start_date,
      endline_end_date: ps.endline_end_date,
      is_locked: ps.is_locked,
      created_at: ps.created_at,
      province: {
        id: 0,
        name_english: ps.province || "",
        name_khmer: ps.province || "",
        code: ps.province || ""
      },
      classes: [] // pilot_schools doesn't have classes relation
    }));

    return NextResponse.json({
      data: schools,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error("Error fetching schools:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/schools - Create new school
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "សូមចូលប្រើប្រាស់ប្រព័ន្ធជាមុនសិន" }, { status: 401 });
    }

    if (!hasPermission(session.user.role, "create")) {
      return NextResponse.json({ error: "អ្នកមិនមានសិទ្ធិបង្កើតសាលារៀនទេ" }, { status: 403 });
    }

    const body = await request.json();

    // Check if school code already exists in pilot_schools
    const existingSchool = await prisma.pilotSchool.findFirst({
      where: { school_code: body.code }
    });

    if (existingSchool) {
      return NextResponse.json(
        { error: "លេខកូដសាលារៀននេះមានរួចហើយ សូមប្រើលេខកូដផ្សេង" },
        { status: 400 }
      );
    }

    // Validate required fields (pilot_schools table requires province, district, cluster)
    if (!body.district || body.district.trim() === "") {
      return NextResponse.json(
        { error: "សូមបញ្ចូលស្រុក/ខណ្ឌ" },
        { status: 400 }
      );
    }

    // Create school in pilot_schools
    const pilotSchool = await prisma.pilotSchool.create({
      data: {
        school_name: body.name,
        school_code: body.code,
        province: body.province,
        district: body.district,
        cluster: body.cluster || "",  // Can be empty string
      }
    });

    return NextResponse.json({
      message: "បានបង្កើតសាលារៀនដោយជោគជ័យ",
      data: {
        id: pilotSchool.id,
        name: pilotSchool.school_name,
        code: pilotSchool.school_code,
        province: pilotSchool.province,
        district: pilotSchool.district,
      }
    }, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "ទិន្នន័យមិនត្រឹមត្រូវ", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error creating school:", error);

    // Return detailed error message for debugging
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        error: "មានបញ្ហាក្នុងការបង្កើតសាលារៀន",
        message: errorMessage,
        details: error
      },
      { status: 500 }
    );
  }
}

// PUT /api/schools - Update school (requires school ID in body)
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "សូមចូលប្រើប្រាស់ប្រព័ន្ធជាមុនសិន" }, { status: 401 });
    }

    if (!hasPermission(session.user.role, "update")) {
      return NextResponse.json({ error: "អ្នកមិនមានសិទ្ធិកែប្រែសាលារៀនទេ" }, { status: 403 });
    }

    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: "សូមបញ្ចូលលេខសម្គាល់សាលារៀន" }, { status: 400 });
    }

    // Check if school code already exists (excluding current school)
    if (updateData.code) {
      const existingSchool = await prisma.pilotSchool.findFirst({
        where: {
          school_code: updateData.code,
          id: { not: parseInt(id) }
        }
      });

      if (existingSchool) {
        return NextResponse.json(
          { error: "លេខកូដសាលារៀននេះមានរួចហើយ សូមប្រើលេខកូដផ្សេង" },
          { status: 400 }
        );
      }
    }

    // Build update data for pilot_schools (only existing fields)
    const pilotUpdateData: any = {};
    if (updateData.name) pilotUpdateData.school_name = updateData.name;
    if (updateData.code) pilotUpdateData.school_code = updateData.code;
    if (updateData.province) pilotUpdateData.province = updateData.province;
    if (updateData.district) pilotUpdateData.district = updateData.district;
    if (updateData.cluster) pilotUpdateData.cluster = updateData.cluster;

    // Update pilot school
    const pilotSchool = await prisma.pilotSchool.update({
      where: { id: parseInt(id) },
      data: pilotUpdateData
    });

    return NextResponse.json({
      message: "បានកែប្រែសាលារៀនដោយជោគជ័យ",
      data: {
        id: pilotSchool.id,
        name: pilotSchool.school_name,
        code: pilotSchool.school_code,
        province: pilotSchool.province,
        district: pilotSchool.district,
      }
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "ទិន្នន័យមិនត្រឹមត្រូវ", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error updating school:", error);

    // Return detailed error message for debugging
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        error: "មានបញ្ហាក្នុងការកែប្រែសាលារៀន",
        message: errorMessage,
        details: error
      },
      { status: 500 }
    );
  }
}

// DELETE /api/schools - Delete school (requires school ID in query)
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "សូមចូលប្រើប្រាស់ប្រព័ន្ធជាមុនសិន" }, { status: 401 });
    }

    if (!hasPermission(session.user.role, "delete")) {
      return NextResponse.json({ error: "អ្នកមិនមានសិទ្ធិលុបសាលារៀនទេ" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "សូមបញ្ចូលលេខសម្គាល់សាលារៀន" }, { status: 400 });
    }

    // Check if pilot school exists
    const pilotSchool = await prisma.pilotSchool.findUnique({
      where: { id: parseInt(id) }
    });

    if (!pilotSchool) {
      return NextResponse.json({ error: "រកមិនឃើញសាលារៀន" }, { status: 404 });
    }

    // Check if school has associated students
    const studentsCount = await prisma.student.count({
      where: {
        pilot_school_id: parseInt(id),
        is_active: true
      }
    });

    if (studentsCount > 0) {
      return NextResponse.json(
        { error: `មិនអាចលុបសាលារៀននេះបានទេ ព្រោះមានសិស្ស ${studentsCount} នាក់នៅសាលានេះ។ សូមផ្លាស់ប្តូរសិស្សទៅសាលាផ្សេងជាមុនសិន។` },
        { status: 400 }
      );
    }

    // Check if school has associated users (teachers/mentors)
    const usersCount = await prisma.user.count({
      where: {
        pilot_school_id: parseInt(id),
        is_active: true
      }
    });

    if (usersCount > 0) {
      return NextResponse.json(
        { error: `មិនអាចលុបសាលារៀននេះបានទេ ព្រោះមានអ្នកប្រើប្រាស់ ${usersCount} នាក់ត្រូវបានចាត់តាំងនៅសាលានេះ។ សូមផ្លាស់ប្តូរអ្នកប្រើប្រាស់ទៅសាលាផ្សេងជាមុនសិន។` },
        { status: 400 }
      );
    }

    // Delete pilot school (hard delete since pilot_schools doesn't have is_active)
    await prisma.pilotSchool.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({
      message: "បានលុបសាលារៀនដោយជោគជ័យ"
    });

  } catch (error) {
    console.error("Error deleting school:", error);

    // Return detailed error message for debugging
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        error: "មានបញ្ហាក្នុងការលុបសាលារៀន",
        message: errorMessage,
        details: error
      },
      { status: 500 }
    );
  }
}