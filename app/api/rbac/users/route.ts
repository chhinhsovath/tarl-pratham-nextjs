import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import bcrypt from "bcryptjs";

const createUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().optional(),
  role: z.enum(["admin", "coordinator", "mentor", "teacher", "viewer"]),
  pilot_school_id: z.number().optional(),
  is_active: z.boolean().default(true),
  assigned_schools: z.array(z.number()).optional(),
});

// GET /api/rbac/users
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only admins can access user management
    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const role = searchParams.get('role');
    const status = searchParams.get('status');
    const school_id = searchParams.get('school_id');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    // Build where clause
    let where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } },
        {
          pilot_school: {
            school_name: { contains: search, mode: 'insensitive' }
          }
        }
      ];
    }

    if (role) {
      where.role = role;
    }

    if (status) {
      where.is_active = status === 'active';
    }

    if (school_id) {
      where.pilot_school_id = parseInt(school_id);
    }

    // Get users with relationships
    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        where,
        include: {
          pilot_school: {
            select: {
              id: true,
              school_name: true
            }
          },
          user_pilot_school_assignments: {
            include: {
              pilot_school: {
                select: {
                  id: true,
                  school_name: true
                }
              }
            }
          }
        },
        orderBy: { created_at: 'desc' },
        skip: offset,
        take: limit
      }),
      prisma.user.count({ where })
    ]);

    // Transform users to include assigned_pilot_schools
    const transformedUsers = users.map(user => ({
      ...user,
      assigned_pilot_schools: user.user_pilot_school_assignments?.map(assignment => assignment.pilot_school) || []
    }));

    // Get filter options
    const [schools, roles] = await Promise.all([
      prisma.pilotSchool.findMany({
        select: { id: true, school_name: true },
        orderBy: { school_name: 'asc' }
      }),
      Promise.resolve(['admin', 'coordinator', 'mentor', 'teacher', 'viewer'])
    ]);

    return NextResponse.json({
      users: transformedUsers,
      pagination: {
        current: page,
        pageSize: limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      },
      filters: {
        schools,
        roles
      }
    });

  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/rbac/users
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only admins can create users
    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = createUserSchema.parse(body);

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 12);

    // Create user
    const newUser = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
        phone: validatedData.phone,
        role: validatedData.role,
        pilot_school_id: validatedData.pilot_school_id,
        is_active: validatedData.is_active,
      },
      include: {
        pilot_school: {
          select: {
            id: true,
            school_name: true
          }
        }
      }
    });

    // If the user is a mentor, assign schools
    if (validatedData.role === 'mentor' && validatedData.assigned_schools?.length) {
      const schoolAssignments = validatedData.assigned_schools.map(schoolId => ({
        user_id: newUser.id,
        pilot_school_id: schoolId
      }));

      await prisma.userPilotSchoolAssignment.createMany({
        data: schoolAssignments
      });
    }

    return NextResponse.json({
      message: `User created successfully with ${validatedData.role} role`,
      user: newUser
    }, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}