import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

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
    coordinator: ["view", "create", "update"],
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
    
    // Build where clause
    const where: any = { is_active: true };
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { code: { contains: search, mode: "insensitive" } },
        { district: { contains: search, mode: "insensitive" } },
        { commune: { contains: search, mode: "insensitive" } },
        { village: { contains: search, mode: "insensitive" } }
      ];
    }
    
    if (province_id) {
      where.province_id = parseInt(province_id);
    }
    
    if (school_type) {
      where.school_type = school_type;
    }
    
    if (level) {
      where.level = level;
    }

    const [schools, total] = await Promise.all([
      prisma.school.findMany({
        where,
        include: {
          province: {
            select: {
              id: true,
              name_english: true,
              name_khmer: true,
              code: true
            }
          },
          classes: {
            select: {
              id: true,
              name: true,
              grade: true,
              student_count: true
            }
          }
        },
        skip,
        take: limit,
        orderBy: { created_at: "desc" }
      }),
      prisma.school.count({ where })
    ]);

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
    
    // Validate input
    const validatedData = schoolSchema.parse(body);
    
    // Check if school code already exists
    const existingSchool = await prisma.school.findUnique({
      where: { code: validatedData.code }
    });
    
    if (existingSchool) {
      return NextResponse.json(
        { error: "School code already exists" },
        { status: 400 }
      );
    }

    // Verify province exists
    const province = await prisma.province.findUnique({
      where: { id: validatedData.province_id }
    });
    
    if (!province) {
      return NextResponse.json(
        { error: "Invalid province ID" },
        { status: 400 }
      );
    }

    // Create school
    const school = await prisma.school.create({
      data: validatedData,
      include: {
        province: {
          select: {
            id: true,
            name_english: true,
            name_khmer: true,
            code: true
          }
        }
      }
    });

    return NextResponse.json({ 
      message: "School created successfully",
      data: school 
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

    // Validate input
    const updateSchema = schoolSchema.partial();
    const validatedData = updateSchema.parse(updateData);

    // Check if school code already exists (excluding current school)
    if (validatedData.code) {
      const existingSchool = await prisma.school.findFirst({
        where: { 
          code: validatedData.code,
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

    // Verify province exists if being updated
    if (validatedData.province_id) {
      const province = await prisma.province.findUnique({
        where: { id: validatedData.province_id }
      });
      
      if (!province) {
        return NextResponse.json(
          { error: "Invalid province ID" },
          { status: 400 }
        );
      }
    }

    // Update school
    const school = await prisma.school.update({
      where: { id: parseInt(id) },
      data: validatedData,
      include: {
        province: {
          select: {
            id: true,
            name_english: true,
            name_khmer: true,
            code: true
          }
        }
      }
    });

    return NextResponse.json({ 
      message: "School updated successfully",
      data: school 
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

    // Check if school has associated data
    const schoolWithData = await prisma.school.findUnique({
      where: { id: parseInt(id) },
      include: {
        classes: {
          include: {
            students: true
          }
        }
      }
    });

    if (!schoolWithData) {
      return NextResponse.json({ error: "School not found" }, { status: 404 });
    }

    const hasStudents = schoolWithData.classes.some(cls => cls.students.length > 0);
    
    if (hasStudents) {
      return NextResponse.json(
        { error: "Cannot delete school with existing students. Please transfer students first." },
        { status: 400 }
      );
    }

    // Soft delete by setting is_active to false
    await prisma.school.update({
      where: { id: parseInt(id) },
      data: { is_active: false }
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