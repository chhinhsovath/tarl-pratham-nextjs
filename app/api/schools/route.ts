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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!hasPermission(session.user.role, "view")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
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
        { commune: { contains: search, mode: "insensitive" } },
        { village: { contains: search, mode: "insensitive" } }
      ];
    }

    if (province_id) {
      pilotWhere.province = province_id;
    }

    if (school_type) {
      pilotWhere.school_type = school_type;
    }

    if (level) {
      pilotWhere.level = level;
    }

    const [pilotSchools, total] = await Promise.all([
      prisma.pilot_schools.findMany({
        where: pilotWhere,
        select: {
          id: true,
          school_name: true,
          school_code: true,
          province: true,
          district: true,
          commune: true,
          village: true,
          school_type: true,
          level: true,
          total_students: true,
          total_teachers: true,
          latitude: true,
          longitude: true,
          phone: true,
          email: true,
          created_at: true,
        },
        skip,
        take: limit,
        orderBy: { created_at: "desc" }
      }),
      prisma.pilot_schools.count({ where: pilotWhere })
    ]);

    // Transform pilot_schools data to match schools API format
    const schools = pilotSchools.map(ps => ({
      id: ps.id,
      name: ps.school_name,
      code: ps.school_code,
      province_id: 0, // Not used in pilot_schools
      district: ps.district,
      commune: ps.commune,
      village: ps.village,
      school_type: ps.school_type,
      level: ps.level,
      total_students: ps.total_students,
      total_teachers: ps.total_teachers,
      latitude: ps.latitude,
      longitude: ps.longitude,
      phone: ps.phone,
      email: ps.email,
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!hasPermission(session.user.role, "create")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();

    // Check if school code already exists in pilot_schools
    const existingSchool = await prisma.pilot_schools.findFirst({
      where: { school_code: body.code }
    });

    if (existingSchool) {
      return NextResponse.json(
        { error: "School code already exists" },
        { status: 400 }
      );
    }

    // Create school in pilot_schools
    const pilotSchool = await prisma.pilot_schools.create({
      data: {
        school_name: body.name,
        school_code: body.code,
        province: body.province || "",
        district: body.district,
        commune: body.commune,
        village: body.village,
        school_type: body.school_type,
        level: body.level,
        total_students: body.total_students || 0,
        total_teachers: body.total_teachers || 0,
        latitude: body.latitude,
        longitude: body.longitude,
        phone: body.phone,
        email: body.email,
      }
    });

    return NextResponse.json({
      message: "School created successfully",
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
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    
    console.error("Error creating school:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/schools - Update school (requires school ID in body)
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!hasPermission(session.user.role, "update")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: "School ID is required" }, { status: 400 });
    }

    // Check if school code already exists (excluding current school)
    if (updateData.code) {
      const existingSchool = await prisma.pilot_schools.findFirst({
        where: {
          school_code: updateData.code,
          id: { not: parseInt(id) }
        }
      });

      if (existingSchool) {
        return NextResponse.json(
          { error: "School code already exists" },
          { status: 400 }
        );
      }
    }

    // Build update data for pilot_schools
    const pilotUpdateData: any = {};
    if (updateData.name) pilotUpdateData.school_name = updateData.name;
    if (updateData.code) pilotUpdateData.school_code = updateData.code;
    if (updateData.province) pilotUpdateData.province = updateData.province;
    if (updateData.district) pilotUpdateData.district = updateData.district;
    if (updateData.commune) pilotUpdateData.commune = updateData.commune;
    if (updateData.village) pilotUpdateData.village = updateData.village;
    if (updateData.school_type) pilotUpdateData.school_type = updateData.school_type;
    if (updateData.level) pilotUpdateData.level = updateData.level;
    if (updateData.total_students !== undefined) pilotUpdateData.total_students = updateData.total_students;
    if (updateData.total_teachers !== undefined) pilotUpdateData.total_teachers = updateData.total_teachers;
    if (updateData.latitude !== undefined) pilotUpdateData.latitude = updateData.latitude;
    if (updateData.longitude !== undefined) pilotUpdateData.longitude = updateData.longitude;
    if (updateData.phone) pilotUpdateData.phone = updateData.phone;
    if (updateData.email) pilotUpdateData.email = updateData.email;

    // Update pilot school
    const pilotSchool = await prisma.pilot_schools.update({
      where: { id: parseInt(id) },
      data: pilotUpdateData
    });

    return NextResponse.json({
      message: "School updated successfully",
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
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    
    console.error("Error updating school:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/schools - Delete school (requires school ID in query)
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!hasPermission(session.user.role, "delete")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "School ID is required" }, { status: 400 });
    }

    // Check if pilot school exists
    const pilotSchool = await prisma.pilot_schools.findUnique({
      where: { id: parseInt(id) }
    });

    if (!pilotSchool) {
      return NextResponse.json({ error: "School not found" }, { status: 404 });
    }

    // Check if school has associated students
    const studentsCount = await prisma.students.count({
      where: {
        pilot_school_id: parseInt(id),
        is_active: true
      }
    });

    if (studentsCount > 0) {
      return NextResponse.json(
        { error: `Cannot delete school with ${studentsCount} existing students. Please transfer students first.` },
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
        { error: `Cannot delete school with ${usersCount} assigned users. Please reassign users first.` },
        { status: 400 }
      );
    }

    // Delete pilot school (hard delete since pilot_schools doesn't have is_active)
    await prisma.pilot_schools.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({
      message: "School deleted successfully"
    });

  } catch (error) {
    console.error("Error deleting school:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}