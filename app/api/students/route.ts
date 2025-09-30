import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { generateMockStudents } from "@/lib/services/mockDataService";
import { getRecordStatus, getRecordStatusFilter } from "@/lib/utils/recordStatus";

// Validation schema
const studentSchema = z.object({
  school_class_id: z.number().optional(),
  pilot_school_id: z.number().optional(),
  name: z.string().min(1, "Student name is required"),
  age: z.number().min(1).max(25).optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
  guardian_name: z.string().optional(),
  guardian_phone: z.string().optional(),
  address: z.string().optional(),
  photo: z.string().optional(),
  baseline_khmer_level: z.string().optional(),
  baseline_math_level: z.string().optional(),
  midline_khmer_level: z.string().optional(),
  midline_math_level: z.string().optional(),
  endline_khmer_level: z.string().optional(),
  endline_math_level: z.string().optional(),
  is_temporary: z.boolean().optional(),
});

// Helper function to check permissions
function hasPermission(userRole: string, action: string): boolean {
  const permissions = {
    admin: ["view", "create", "update", "delete"],
    coordinator: ["view", "create", "update", "delete"],
    mentor: ["view", "create", "update"],
    teacher: ["view", "create", "update"],
    viewer: ["view"]
  };
  
  return permissions[userRole as keyof typeof permissions]?.includes(action) || false;
}

// Helper function to check if user can access student data
function canAccessStudent(userRole: string, userPilotSchoolId: number | null, studentPilotSchoolId: number | null): boolean {
  if (userRole === "admin" || userRole === "coordinator") {
    return true;
  }
  
  if ((userRole === "mentor" || userRole === "teacher") && userPilotSchoolId) {
    return studentPilotSchoolId === userPilotSchoolId;
  }
  
  return false;
}

// GET /api/students - List students with pagination and filtering
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
    const gender = searchParams.get("gender") || "";
    const school_class_id = searchParams.get("school_class_id") || "";
    const pilot_school_id = searchParams.get("pilot_school_id") || "";
    const is_temporary = searchParams.get("is_temporary");
    const include_test_data = searchParams.get("include_test_data") === "true";

    const skip = (page - 1) * limit;

    // Build where clause with record_status filter
    const where: any = {
      is_active: true,
      ...getRecordStatusFilter(session.user.role, include_test_data)
    };
    
    if (search) {
      where.AND = where.AND || [];
      where.AND.push({
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { guardian_name: { contains: search, mode: "insensitive" } },
          { guardian_phone: { contains: search, mode: "insensitive" } }
        ]
      });
    }
    
    if (gender) {
      where.AND = where.AND || [];
      where.AND.push({ gender: gender });
    }
    
    if (school_class_id) {
      where.AND = where.AND || [];
      where.AND.push({ school_class_id: parseInt(school_class_id) });
    }
    
    if (pilot_school_id) {
      where.AND = where.AND || [];
      where.AND.push({ pilot_school_id: parseInt(pilot_school_id) });
    }
    
    if (is_temporary !== null) {
      where.AND = where.AND || [];
      where.AND.push({ is_temporary: is_temporary === "true" });
    }

    // Apply access restrictions for mentors and teachers
    if (session.user.role === "mentor" || session.user.role === "teacher") {
      if (session.user.pilot_school_id) {
        where.AND = where.AND || [];
        where.AND.push({ pilot_school_id: session.user.pilot_school_id });
      } else {
        // If user has no pilot school, they can't see any students
        where.AND = where.AND || [];
        where.AND.push({ id: -1 });
      }
    }

    const [students, total] = await Promise.all([
      prisma.student.findMany({
        where,
        include: {
          school_class: {
            include: {
              school: {
                select: {
                  id: true,
                  name: true,
                  code: true
                }
              }
            }
          },
          pilot_school: {
            select: {
              id: true,
              school_name: true,
              school_code: true
            }
          },
          added_by: {
            select: {
              id: true,
              name: true,
              role: true
            }
          },
          assessments: {
            select: {
              id: true,
              assessment_type: true,
              subject: true,
              level: true,
              score: true,
              assessed_date: true
            },
            orderBy: { assessed_date: "desc" }
          }
        },
        skip,
        take: limit,
        orderBy: { created_at: "desc" }
      }),
      prisma.student.count({ where })
    ]);

    // If no students and user is mentor, return mock data
    if (students.length === 0 && session.user.role === 'mentor') {
      const mockStudents = generateMockStudents(20);

      return NextResponse.json({
        data: mockStudents,
        pagination: {
          page: 1,
          limit: mockStudents.length,
          total: mockStudents.length,
          pages: 1
        },
        is_mock: true,
        message: '🧪 Test data - Changes will not be saved'
      });
    }

    return NextResponse.json({
      data: students,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error: any) {
    console.error("Error fetching students:", error);
    
    // Check if it's a Prisma/database error
    if (error.code === 'P2002' || error.code === 'P2025' || error.message?.includes('Invalid')) {
      // Return empty data with clear Khmer message for database issues
      return NextResponse.json({
        data: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          pages: 0
        },
        message: 'មិនមានទិន្នន័យសិស្សនៅក្នុងប្រព័ន្ធ',
        error_detail: 'បញ្ហាទាក់ទងនឹងមូលដ្ឋានទិន្នន័យ សូមទាក់ទងអ្នកគ្រប់គ្រងប្រព័ន្ធ'
      });
    }
    
    // Provide mock data as fallback for development
    const mockStudents = [
      {
        id: 1,
        name: 'សិស្ស ទី១',
        age: 12,
        gender: 'male',
        guardian_name: 'អាណាព្យាបាល ទី១',
        guardian_phone: '012345678',
        address: 'ភូមិ ១ សង្កាត់ ១',
        baseline_khmer_level: 'beginner',
        baseline_math_level: 'beginner',
        is_temporary: false,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
        pilot_school: {
          id: 1,
          name: 'សាលាបឋមសិក្សាគំរូ',
          code: 'SCH001'
        },
        school_class: null,
        added_by: {
          id: 1,
          name: 'គ្រូ សុខា',
          role: 'teacher'
        },
        assessments: []
      },
      {
        id: 2,
        name: 'សិស្ស ទី២',
        age: 11,
        gender: 'female',
        guardian_name: 'អាណាព្យាបាល ទី២',
        guardian_phone: '098765432',
        address: 'ភូមិ ២ សង្កាត់ ២',
        baseline_khmer_level: 'intermediate',
        baseline_math_level: 'beginner',
        is_temporary: false,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
        pilot_school: {
          id: 1,
          name: 'សាលាបឋមសិក្សាគំរូ',
          code: 'SCH001'
        },
        school_class: null,
        added_by: {
          id: 1,
          name: 'គ្រូ សុខា',
          role: 'teacher'
        },
        assessments: []
      }
    ];
    
    return NextResponse.json({
      data: mockStudents,
      pagination: {
        page: 1,
        limit: 10,
        total: mockStudents.length,
        pages: 1
      },
      message: 'កំពុងប្រើទិន្នន័យសាកល្បង',
      mock: true
    });
  }
}

// POST /api/students - Create new student
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!hasPermission(session.user.role, "create")) {
      return NextResponse.json({ error: "អ្នកមិនមានសិទ្ធិបង្កើតសិស្សទេ" }, { status: 403 });
    }

    const body = await request.json();

    // Validate input
    const validatedData = studentSchema.parse(body);

    // Determine record status based on user role
    const recordStatus = getRecordStatus(
      session.user.role,
      session.user.test_mode_enabled || false
    );

    // For mentors, automatically set their pilot school
    if (session.user.role === "mentor") {
      if (!session.user.pilot_school_id) {
        return NextResponse.json(
          { error: "Mentor must be assigned to a pilot school" },
          { status: 400 }
        );
      }

      validatedData.pilot_school_id = session.user.pilot_school_id;
    }

    // For teachers, set their pilot school if they have one
    if (session.user.role === "teacher" && session.user.pilot_school_id) {
      validatedData.pilot_school_id = session.user.pilot_school_id;
    }

    // Verify school class exists if provided
    if (validatedData.school_class_id) {
      const schoolClass = await prisma.schoolClass.findUnique({
        where: { id: validatedData.school_class_id }
      });
      
      if (!schoolClass) {
        return NextResponse.json(
          { error: "Invalid school class ID" },
          { status: 400 }
        );
      }
    }

    // Verify pilot school exists if provided
    if (validatedData.pilot_school_id) {
      const pilotSchool = await prisma.pilotSchool.findUnique({
        where: { id: validatedData.pilot_school_id }
      });
      
      if (!pilotSchool) {
        return NextResponse.json(
          { error: "Invalid pilot school ID" },
          { status: 400 }
        );
      }
    }

    // Create student
    const student = await prisma.student.create({
      data: {
        ...validatedData,
        added_by_id: parseInt(session.user.id),
        added_by_mentor: session.user.role === "mentor", // Deprecated but keep for compatibility
        is_temporary: recordStatus !== 'production', // Deprecated but keep for compatibility
        mentor_created_at: session.user.role === "mentor" ? new Date() : null,
        record_status: recordStatus,
        created_by_role: session.user.role
      },
      include: {
        school_class: {
          include: {
            school: {
              select: {
                id: true,
                name: true,
                code: true
              }
            }
          }
        },
        pilot_school: {
          select: {
            id: true,
            school_name: true,
            school_code: true
          }
        },
        added_by: {
          select: {
            id: true,
            name: true,
            role: true
          }
        }
      }
    });

    return NextResponse.json({ 
      message: "បានបង្កើតសិស្សដោយជោគជ័យ",
      data: student 
    }, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "ទិន្នន័យមិនត្រឹមត្រូវ សូមពិនិត្យឡើងវិញ", details: error.errors },
        { status: 400 }
      );
    }
    
    console.error("Error creating student:", error);
    return NextResponse.json(
      { error: "មានបញ្ហាក្នុងការបង្កើតសិស្ស សូមព្យាយាមម្តងទៀត" },
      { status: 500 }
    );
  }
}

// PUT /api/students - Update student (requires student ID in body)
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
      return NextResponse.json({ error: "ត្រូវការលេខសម្គាល់សិស្ស" }, { status: 400 });
    }

    // Check if student exists and user has access
    const existingStudent = await prisma.student.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingStudent) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    if (!canAccessStudent(session.user.role, session.user.pilot_school_id, existingStudent.pilot_school_id)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Validate input
    const updateSchema = studentSchema.partial();
    const validatedData = updateSchema.parse(updateData);

    // Verify school class exists if being updated
    if (validatedData.school_class_id) {
      const schoolClass = await prisma.schoolClass.findUnique({
        where: { id: validatedData.school_class_id }
      });
      
      if (!schoolClass) {
        return NextResponse.json(
          { error: "Invalid school class ID" },
          { status: 400 }
        );
      }
    }

    // Update student
    const student = await prisma.student.update({
      where: { id: parseInt(id) },
      data: validatedData,
      include: {
        school_class: {
          include: {
            school: {
              select: {
                id: true,
                name: true,
                code: true
              }
            }
          }
        },
        pilot_school: {
          select: {
            id: true,
            school_name: true,
            school_code: true
          }
        },
        added_by: {
          select: {
            id: true,
            name: true,
            role: true
          }
        }
      }
    });

    return NextResponse.json({ 
      message: "Student updated successfully",
      data: student 
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "ទិន្នន័យមិនត្រឹមត្រូវ សូមពិនិត្យឡើងវិញ", details: error.errors },
        { status: 400 }
      );
    }
    
    console.error("Error updating student:", error);
    return NextResponse.json(
      { error: "មានបញ្ហាក្នុងការកែប្រែសិស្ស សូមព្យាយាមម្តងទៀត" },
      { status: 500 }
    );
  }
}

// DELETE /api/students - Delete student (requires student ID in query)
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "សូមចូលប្រើប្រាស់ប្រព័ន្ធជាមុនសិន" }, { status: 401 });
    }

    if (!hasPermission(session.user.role, "delete")) {
      return NextResponse.json({ error: "អ្នកមិនមានសិទ្ធិលុបសិស្សទេ" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json({ error: "ត្រូវការលេខសម្គាល់សិស្ស" }, { status: 400 });
    }

    // Check if student exists and user has access
    const existingStudent = await prisma.student.findUnique({
      where: { id: parseInt(id) },
      include: {
        assessments: true
      }
    });

    if (!existingStudent) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    if (!canAccessStudent(session.user.role, session.user.pilot_school_id, existingStudent.pilot_school_id)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // For mentors deleting temporary students, hard delete
    // For others, soft delete
    if (session.user.role === "mentor" && existingStudent.is_temporary && existingStudent.added_by_mentor) {
      // Hard delete student and all related assessments
      await prisma.$transaction([
        prisma.assessment.deleteMany({
          where: { student_id: parseInt(id) }
        }),
        prisma.student.delete({
          where: { id: parseInt(id) }
        })
      ]);
    } else {
      // Soft delete by setting is_active to false
      await prisma.student.update({
        where: { id: parseInt(id) },
        data: { is_active: false }
      });
    }

    return NextResponse.json({ 
      message: "បានលុបសិស្សដោយជោគជ័យ" 
    });

  } catch (error) {
    console.error("Error deleting student:", error);
    return NextResponse.json(
      { error: "មានបញ្ហាក្នុងការលុបសិស្ស សូមព្យាយាមម្តងទៀត" },
      { status: 500 }
    );
  }
}