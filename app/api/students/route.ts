import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { getRecordStatus, getRecordStatusFilter } from "@/lib/utils/recordStatus";

// Validation schema
const studentSchema = z.object({
  student_id: z.string().optional(),
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
    return NextResponse.json(
      {
        error: "មានបញ្ហាក្នុងការទាញយកទិន្នន័យសិស្ស សូមព្យាយាមម្តងទៀត",
        message: error.message || String(error),
        code: error.code || 'UNKNOWN_ERROR',
        meta: error.meta || {}
      },
      { status: 500 }
    );
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

    // Auto-assign pilot_school_id from user's profile if not provided
    // This ensures students are linked to the teacher's/mentor's school
    if (!validatedData.pilot_school_id) {
      if ((session.user.role === "mentor" || session.user.role === "teacher") && session.user.pilot_school_id) {
        validatedData.pilot_school_id = session.user.pilot_school_id;
        console.log(`✅ Auto-assigned pilot_school_id ${session.user.pilot_school_id} from ${session.user.role}'s profile`);
      } else if (session.user.role === "mentor" || session.user.role === "teacher") {
        // Teacher/Mentor must have a school assigned before creating students
        return NextResponse.json(
          { error: "សូមបំពេញប្រវត្តិរូបរបស់អ្នកជាមុនសិន (សូមជ្រើសរើសសាលារៀន)" },
          { status: 400 }
        );
      }
    }

    // Auto-link to active test session for test data
    let testSessionId = null;
    if (recordStatus === 'test_mentor' || recordStatus === 'test_teacher') {
      try {
        const activeSession = await prisma.testSession.findFirst({
          where: {
            user_id: parseInt(session.user.id),
            status: 'active'
          }
        });
        if (activeSession) {
          testSessionId = activeSession.id;
        }
      } catch (err) {
        // TestSession table may not exist in production - skip linking
        console.warn('TestSession table not available:', err);
      }
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

    // Create student - extract IDs separately to avoid Prisma relation error
    const { school_class_id, pilot_school_id, ...otherData } = validatedData;

    const student = await prisma.student.create({
      data: {
        ...otherData,
        school_class_id,
        pilot_school_id,
        added_by_id: parseInt(session.user.id),
        added_by_mentor: session.user.role === "mentor", // Deprecated but keep for compatibility
        is_temporary: recordStatus !== 'production', // Deprecated but keep for compatibility
        mentor_created_at: session.user.role === "mentor" ? new Date() : null,
        record_status: recordStatus,
        created_by_role: session.user.role,
        test_session_id: testSessionId
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

  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "ទិន្នន័យមិនត្រឹមត្រូវ សូមពិនិត្យឡើងវិញ",
          message: error.issues.map((e: any) => `${e.path.join('.')}: ${e.message}`).join(', '),
          details: error.issues
        },
        { status: 400 }
      );
    }

    // ALWAYS return detailed errors (per AI_DEVELOPMENT_RULES.md)
    console.error("Error creating student:", error);
    return NextResponse.json(
      {
        error: "មានបញ្ហាក្នុងការបង្កើតសិស្ស សូមព្យាយាមម្តងទៀត",
        message: error.message || String(error),
        code: error.code || 'UNKNOWN_ERROR',
        meta: error.meta || {}
      },
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
      return NextResponse.json({
        error: "រកមិនឃើញសិស្ស",
        message: "Student not found",
        code: "STUDENT_NOT_FOUND"
      }, { status: 404 });
    }

    if (!canAccessStudent(session.user.role, session.user.pilot_school_id, existingStudent.pilot_school_id)) {
      return NextResponse.json({
        error: "អ្នកមិនមានសិទ្ធិចូលប្រើទិន្នន័យនេះ",
        message: "Forbidden - cannot access student from different school",
        code: "ACCESS_DENIED"
      }, { status: 403 });
    }

    // ⚠️ CRITICAL: Mentors can only update temporary (test) students
    if (session.user.role === "mentor" && existingStudent.record_status === 'production') {
      return NextResponse.json({
        error: "អ្នកណែនាំមិនអាចកែប្រែទិន្នន័យផលិតកម្មរបស់គ្រូបាន",
        message: "Mentors cannot modify production student data created by teachers",
        code: "PERMISSION_DENIED",
        meta: {
          student_id: existingStudent.id,
          student_record_status: existingStudent.record_status,
          user_role: session.user.role
        }
      }, { status: 403 });
    }

    // ⚠️ CRITICAL: Teachers can only update production students
    if (session.user.role === "teacher" && existingStudent.record_status !== 'production') {
      return NextResponse.json({
        error: "គ្រូមិនអាចកែប្រែទិន្នន័យសាកល្បងបាន",
        message: "Teachers cannot modify test/temporary students created by mentors",
        code: "PERMISSION_DENIED",
        meta: {
          student_id: existingStudent.id,
          student_record_status: existingStudent.record_status,
          user_role: session.user.role
        }
      }, { status: 403 });
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

  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "ទិន្នន័យមិនត្រឹមត្រូវ សូមពិនិត្យឡើងវិញ",
          message: error.issues.map((e: any) => `${e.path.join('.')}: ${e.message}`).join(', '),
          details: error.issues
        },
        { status: 400 }
      );
    }

    console.error("Error updating student:", error);
    return NextResponse.json(
      {
        error: "មានបញ្ហាក្នុងការកែប្រែសិស្ស សូមព្យាយាមម្តងទៀត",
        message: error.message || String(error),
        code: error.code || 'UNKNOWN_ERROR',
        meta: error.meta || {}
      },
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

    // For test data, hard delete
    // For production data, soft delete (archive)
    if (existingStudent.record_status === 'test_mentor' || existingStudent.record_status === 'test_teacher') {
      // Hard delete student and all related assessments for test data
      await prisma.$transaction([
        prisma.assessment.deleteMany({
          where: { student_id: parseInt(id) }
        }),
        prisma.student.delete({
          where: { id: parseInt(id) }
        })
      ]);
    } else {
      // Soft delete production data by archiving
      await prisma.student.update({
        where: { id: parseInt(id) },
        data: {
          is_active: false,
          record_status: 'archived'
        }
      });
    }

    return NextResponse.json({ 
      message: "បានលុបសិស្សដោយជោគជ័យ" 
    });

  } catch (error: any) {
    console.error("Error deleting student:", error);
    return NextResponse.json(
      { error: "មានបញ្ហាក្នុងការលុបសិស្ស សូមព្យាយាមម្តងទៀត" },
      { status: 500 }
    );
  }
}