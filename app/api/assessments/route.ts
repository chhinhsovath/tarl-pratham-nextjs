import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import {
  LANGUAGE_LEVELS,
  MATH_LEVELS,
  isValidLevel,
  buildLevelFieldName,
  getLevelsBySubject
} from "@/lib/constants/assessment-levels";
import { getMentorSchoolIds, getMentorAssignedSubjects } from "@/lib/mentorAssignments";

// Validation schema with dynamic level validation
const assessmentSchema = z.object({
  student_id: z.number().min(1, "Student ID is required"),
  pilot_school_id: z.number().optional(),
  assessment_type: z.enum([
    "baseline", "midline", "endline",
    "baseline_verification", "midline_verification", "endline_verification"
  ], {
    errorMap: () => ({ message: "Assessment type must be baseline, midline, endline, or their verification variants" })
  }),
  subject: z.enum(["language", "math"], {
    errorMap: () => ({ message: "Subject must be language or math" })
  }),
  level: z.string().optional(),
  assessment_sample: z.enum(["Sample 1", "Sample 2", "Sample 3", "ឧបករណ៍តេស្ត លេខ១", "ឧបករណ៍តេស្ត លេខ២", "ឧបករណ៍តេស្ត លេខ៣"], {
    errorMap: () => ({ message: "Assessment sample must be Sample 1/2/3 or ឧបករណ៍តេស្ត លេខ១/២/៣" })
  }),
  student_consent: z.enum(["Yes", "No"], {
    errorMap: () => ({ message: "Student consent must be Yes or No" })
  }),
  notes: z.string().optional(),
  assessed_date: z.string().datetime().optional(),
  assessed_by_mentor: z.boolean().optional(),
  mentor_assessment_id: z.string().optional(),
}).refine((data) => {
  // If level is provided, validate it matches the subject
  if (!data.level) return true;

  return isValidLevel(data.subject, data.level);
}, {
  message: "Invalid level for the selected subject",
  path: ["level"]
});

// Bulk assessment schema
const bulkAssessmentSchema = z.object({
  assessments: z.array(assessmentSchema),
  pilot_school_id: z.number().optional()
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

// Helper function to check if user can access assessment data
// NOTE: For mentors, use canMentorAccessAssessment from mentorAuthorization.ts for comprehensive checks
async function canAccessAssessment(
  userRole: string,
  userId: string,
  userPilotSchoolId: number | null,
  assessmentPilotSchoolId: number | null
): Promise<boolean> {
  if (userRole === "admin" || userRole === "coordinator") {
    return true;
  }

  if (userRole === "mentor") {
    // Mentors can access assessments from ALL their assigned schools
    if (!assessmentPilotSchoolId) return false;
    const mentorSchoolIds = await getMentorSchoolIds(parseInt(userId));
    return mentorSchoolIds.includes(assessmentPilotSchoolId);
  }

  if (userRole === "teacher" && userPilotSchoolId) {
    return assessmentPilotSchoolId === userPilotSchoolId;
  }

  return false;
}

// GET /api/assessments - List assessments with pagination and filtering
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
    const assessment_type = searchParams.get("assessment_type") || "";
    const subject = searchParams.get("subject") || "";
    const pilot_school_id = searchParams.get("pilot_school_id") || "";
    const student_id = searchParams.get("student_id") || "";
    const is_temporary = searchParams.get("is_temporary");
    
    const skip = (page - 1) * limit;
    
    // Build where clause
    const where: any = {};
    
    if (search) {
      where.OR = [
        { 
          student: { 
            name: { contains: search, mode: "insensitive" } 
          } 
        },
        { 
          notes: { contains: search, mode: "insensitive" } 
        }
      ];
    }
    
    if (assessment_type) {
      where.assessment_type = assessment_type;
    }
    
    if (subject) {
      where.subject = subject;
    }
    
    if (pilot_school_id) {
      where.pilot_school_id = parseInt(pilot_school_id);
    }
    
    if (student_id) {
      where.student_id = parseInt(student_id);
    }
    
    if (is_temporary !== null) {
      where.is_temporary = is_temporary === "true";
    }

    // Apply access restrictions for mentors and teachers
    // Admin and Coordinator have full access - no filtering needed
    if (session.user.role === "mentor") {
      // Mentors can ONLY see assessments they personally created
      where.added_by_id = parseInt(session.user.id);
    } else if (session.user.role === "teacher") {
      // Teachers remain restricted to their single school
      if (session.user.pilot_school_id) {
        where.pilot_school_id = session.user.pilot_school_id;
      } else {
        // If user has no pilot school, they can't see any assessments
        where.id = -1;
      }
    }
    // Note: admin and coordinator roles intentionally have no restrictions - they see all assessments

    const [assessments, total] = await Promise.all([
      prisma.assessment.findMany({
        where,
        include: {
          student: {
            select: {
              id: true,
              student_id: true,
              name: true,
              age: true,
              gender: true,
              is_temporary: true
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
        },
        skip,
        take: limit,
        orderBy: { assessed_date: "desc" }
      }),
      prisma.assessment.count({ where })
    ]);

    return NextResponse.json({
      data: assessments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error("Error fetching assessments:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/assessments - Create new assessment or bulk assessments
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
    
    // Check if this is a bulk assessment request
    if (body.assessments && Array.isArray(body.assessments)) {
      return handleBulkAssessment(body, session);
    }
    
    // Single assessment creation
    const validatedData = assessmentSchema.parse(body);

    // Verify student exists and user has access
    const student = await prisma.student.findUnique({
      where: { id: validatedData.student_id }
    });

    if (!student) {
      return NextResponse.json(
        {
          error: "រកមិនឃើញសិស្ស",
          message: "Student not found",
          code: "STUDENT_NOT_FOUND"
        },
        { status: 404 }
      );
    }

    // ⚠️ HYBRID APPROACH: Mentors can assess production students, but assessments are temporary
    // Note: Mentor assessments on production students will be marked as temporary
    // and require teacher/admin review before becoming permanent

    // ⚠️ CRITICAL: Teachers can only assess production students
    if (session.user.role === "teacher" && student.record_status !== 'production') {
      return NextResponse.json(
        {
          error: "គ្រូមិនអាចវាយតម្លៃទិន្នន័យសាកល្បងបាន",
          message: "Teachers cannot assess test/temporary students",
          code: "PERMISSION_DENIED",
          meta: {
            student_id: student.id,
            student_record_status: student.record_status,
            user_role: session.user.role
          }
        },
        { status: 403 }
      );
    }

    // For mentors and teachers, automatically set their pilot school
    if (session.user.role === "mentor" || session.user.role === "teacher") {
      if (!session.user.pilot_school_id) {
        return NextResponse.json(
          {
            error: session.user.role === "mentor" ? "អ្នកណែនាំត្រូវតែមានសាលាកំណត់" : "គ្រូត្រូវតែមានសាលាកំណត់",
            message: `${session.user.role === "mentor" ? "Mentor" : "Teacher"} must be assigned to a pilot school`,
            code: "SCHOOL_REQUIRED"
          },
          { status: 400 }
        );
      }

      validatedData.pilot_school_id = session.user.pilot_school_id;
    }

    // Auto-link to active test session for test data
    let testSessionId = null;
    const recordStatus = session.user.role === "mentor" ? 'test_mentor' :
                        (session.user.role === "teacher" && session.user.test_mode_enabled) ? 'test_teacher' :
                        'production';

    if (recordStatus === 'test_mentor' || recordStatus === 'test_teacher') {
      const activeSession = await prisma.testSession.findFirst({
        where: {
          user_id: parseInt(session.user.id),
          status: 'active'
        }
      });
      if (activeSession) {
        testSessionId = activeSession.id;
      }
    }

    // Check for duplicate assessment (skip for verification assessments)
    const isVerification = validatedData.assessment_type.includes('_verification');

    if (!isVerification) {
      const existingAssessment = await prisma.assessment.findFirst({
        where: {
          student_id: validatedData.student_id,
          assessment_type: validatedData.assessment_type,
          subject: validatedData.subject
        }
      });

      if (existingAssessment) {
        // Localize assessment type
        const typeMap: Record<string, string> = {
          'baseline': 'តេស្តដើមគ្រា',
          'midline': 'តេស្តពាក់កណ្ដាលគ្រា',
          'endline': 'តេស្តចុងក្រោយគ្រា'
        };

        // Localize subject
        const subjectMap: Record<string, string> = {
          'language': 'ភាសា',
          'math': 'គណិតវិទ្យា'
        };

        const typeKh = typeMap[validatedData.assessment_type] || validatedData.assessment_type;
        const subjectKh = subjectMap[validatedData.subject] || validatedData.subject;

        return NextResponse.json(
          {
            error: `ការវាយតម្លៃ${typeKh} ${subjectKh} មានរួចហើយសម្រាប់សិស្សនេះ`,
            message: `${validatedData.assessment_type} ${validatedData.subject} assessment already exists for this student`,
            code: 'DUPLICATE_ASSESSMENT'
          },
          { status: 400 }
        );
      }
    }

    // Create assessment
    const assessment = await prisma.assessment.create({
      data: {
        ...validatedData,
        added_by_id: parseInt(session.user.id),
        // Use provided assessed_by_mentor if present (verification mode), otherwise infer from role
        assessed_by_mentor: validatedData.assessed_by_mentor !== undefined ? validatedData.assessed_by_mentor : (session.user.role === "mentor"),
        // Verification assessments are NOT temporary - they are production data
        is_temporary: validatedData.mentor_assessment_id ? false : (session.user.role === "mentor" ? true : false),
        assessed_date: validatedData.assessed_date ? new Date(validatedData.assessed_date) : new Date(),
        record_status: validatedData.mentor_assessment_id ? 'production' : recordStatus,
        created_by_role: session.user.role,
        test_session_id: testSessionId,
        mentor_assessment_id: validatedData.mentor_assessment_id || null
      },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            age: true,
            gender: true
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

    // Update student assessment level ONLY for regular assessments (not verifications)
    // Verification assessments should NOT overwrite the original teacher's assessment
    if (!isVerification) {
      const levelField = buildLevelFieldName(validatedData.assessment_type, validatedData.subject);
      await prisma.student.update({
        where: { id: validatedData.student_id },
        data: {
          [levelField]: validatedData.level,
          assessed_by_mentor: session.user.role === "mentor" ? true : undefined
        }
      });
    } else if (validatedData.mentor_assessment_id) {
      // If this is a verification assessment, mark the original teacher assessment as verified
      await prisma.assessment.update({
        where: { id: parseInt(validatedData.mentor_assessment_id) },
        data: {
          is_temporary: false,
          record_status: 'production',
          verified_by_id: parseInt(session.user.id),
          verified_at: new Date(),
          verification_notes: `Verified by mentor assessment #${assessment.id}`
        }
      });
    }

    return NextResponse.json({
      message: "Assessment created successfully",
      data: assessment
    }, { status: 201 });

  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "ទិន្នន័យមិនត្រឹមត្រូវ សូមពិនិត្យឡើងវិញ",
          message: "Validation failed",
          code: "VALIDATION_ERROR",
          meta: error.errors,
          details: error.issues
        },
        { status: 400 }
      );
    }

    // ALWAYS return detailed errors (per AI_DEVELOPMENT_RULES.md)
    console.error("Error creating assessment:", error);
    return NextResponse.json(
      {
        error: "មានបញ្ហាក្នុងការបង្កើតការវាយតម្លៃ សូមព្យាយាមម្តងទៀត",
        message: error.message || String(error),
        code: error.code || 'UNKNOWN_ERROR',
        meta: error.meta || {}
      },
      { status: 500 }
    );
  }
}

// Helper function for bulk assessment creation - OPTIMIZED with batch queries
async function handleBulkAssessment(body: any, session: any) {
  try {
    const validatedData = bulkAssessmentSchema.parse(body);

    // For mentors and teachers, set pilot school automatically
    let pilot_school_id = validatedData.pilot_school_id;
    if (session.user.role === "mentor" || session.user.role === "teacher") {
      if (!session.user.pilot_school_id) {
        return NextResponse.json(
          { error: `${session.user.role === "mentor" ? "Mentor" : "Teacher"} must be assigned to a pilot school` },
          { status: 400 }
        );
      }
      pilot_school_id = session.user.pilot_school_id;
    }

    // Auto-link to active test session for test data
    let testSessionId = null;
    const recordStatus = session.user.role === "mentor" ? 'test_mentor' :
                        (session.user.role === "teacher" && session.user.test_mode_enabled) ? 'test_teacher' :
                        'production';

    if (recordStatus === 'test_mentor' || recordStatus === 'test_teacher') {
      const activeSession = await prisma.testSession.findFirst({
        where: {
          user_id: parseInt(session.user.id),
          status: 'active'
        }
      });
      if (activeSession) {
        testSessionId = activeSession.id;
      }
    }

    // ✅ OPTIMIZATION: Batch fetch all students at once (N+1 fix)
    const studentIds = validatedData.assessments.map(a => a.student_id);
    const students = await prisma.student.findMany({
      where: { id: { in: studentIds } },
      select: {
        id: true,
        name: true,
        record_status: true
      }
    });
    const studentMap = new Map(students.map(s => [s.id, s]));

    // ✅ OPTIMIZATION: Batch check for existing assessments (N+1 fix)
    const assessmentQueries = validatedData.assessments.map(a => ({
      student_id: a.student_id,
      assessment_type: a.assessment_type,
      subject: a.subject
    }));

    const existingAssessments = await prisma.assessment.findMany({
      where: {
        OR: assessmentQueries
      },
      select: {
        id: true,
        student_id: true,
        assessment_type: true,
        subject: true
      }
    });

    // Create lookup for quick access
    const existingAssessmentSet = new Set(
      existingAssessments.map(
        a => `${a.student_id}:${a.assessment_type}:${a.subject}`
      )
    );

    const results = [];
    const errors = [];

    // ✅ OPTIMIZATION: Process assessments with pre-fetched data
    for (let i = 0; i < validatedData.assessments.length; i++) {
      const assessmentData = validatedData.assessments[i];

      try {
        // Check if student exists (O(1) lookup)
        const student = studentMap.get(assessmentData.student_id);

        if (!student) {
          errors.push(`Assessment ${i + 1}: Student with ID ${assessmentData.student_id} not found`);
          continue;
        }

        // Check for duplicate assessment (O(1) lookup)
        const key = `${assessmentData.student_id}:${assessmentData.assessment_type}:${assessmentData.subject}`;
        if (existingAssessmentSet.has(key)) {
          errors.push(`Assessment ${i + 1}: ${assessmentData.assessment_type} ${assessmentData.subject} assessment already exists for student ${student.name}`);
          continue;
        }

        // Create assessment
        const assessment = await prisma.assessment.create({
          data: {
            ...assessmentData,
            pilot_school_id: pilot_school_id,
            added_by_id: parseInt(session.user.id),
            assessed_by_mentor: assessmentData.assessed_by_mentor !== undefined ? assessmentData.assessed_by_mentor : (session.user.role === "mentor"),
            is_temporary: assessmentData.mentor_assessment_id ? false : (session.user.role === "mentor" ? true : false),
            assessed_date: assessmentData.assessed_date ? new Date(assessmentData.assessed_date) : new Date(),
            record_status: assessmentData.mentor_assessment_id ? 'production' : recordStatus,
            created_by_role: session.user.role,
            test_session_id: testSessionId,
            mentor_assessment_id: assessmentData.mentor_assessment_id || null
          },
          include: {
            student: {
              select: {
                id: true,
                name: true
              }
            }
          }
        });

        // Update student assessment level ONLY for regular assessments (not verifications)
        const isVerification = assessmentData.assessment_type.includes('_verification');
        if (!isVerification) {
          const levelField = buildLevelFieldName(assessmentData.assessment_type, assessmentData.subject);
          await prisma.student.update({
            where: { id: assessmentData.student_id },
            data: {
              [levelField]: assessmentData.level,
              assessed_by_mentor: session.user.role === "mentor" ? true : undefined
            }
          });
        } else if (assessmentData.mentor_assessment_id) {
          // If this is a verification assessment, mark the original teacher assessment as verified
          await prisma.assessment.update({
            where: { id: parseInt(assessmentData.mentor_assessment_id) },
            data: {
              is_temporary: false,
              record_status: 'production',
              verified_by_id: parseInt(session.user.id),
              verified_at: new Date(),
              verification_notes: `Verified by mentor assessment #${assessment.id}`
            }
          });
        }

        results.push(assessment);

      } catch (error) {
        errors.push(`Assessment ${i + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    return NextResponse.json({
      message: `Bulk assessment completed. ${results.length} successful, ${errors.length} errors.`,
      data: {
        successful: results,
        errors: errors,
        total_processed: validatedData.assessments.length,
        successful_count: results.length,
        error_count: errors.length
      }
    }, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error creating bulk assessments:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/assessments - Update assessment (requires assessment ID in body)
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
      return NextResponse.json({ error: "Assessment ID is required" }, { status: 400 });
    }

    // Check if assessment exists and user has access
    const existingAssessment = await prisma.assessment.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingAssessment) {
      return NextResponse.json({ error: "Assessment not found" }, { status: 404 });
    }

    if (!canAccessAssessment(session.user.role, session.user.pilot_school_id, existingAssessment.pilot_school_id)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Validate input
    const updateSchema = assessmentSchema.partial().omit({ student_id: true });
    const validatedData = updateSchema.parse(updateData);

    // Update assessment
    const assessment = await prisma.assessment.update({
      where: { id: parseInt(id) },
      data: {
        ...validatedData,
        assessed_date: validatedData.assessed_date ? new Date(validatedData.assessed_date) : undefined
      },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            age: true,
            gender: true
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

    // Update student assessment level if level was changed
    if (validatedData.level) {
      const levelField = `${existingAssessment.assessment_type}_${existingAssessment.subject}_level`;
      await prisma.student.update({
        where: { id: existingAssessment.student_id },
        data: {
          [levelField]: validatedData.level
        }
      });
    }

    return NextResponse.json({ 
      message: "Assessment updated successfully",
      data: assessment 
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    
    console.error("Error updating assessment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/assessments - Delete assessment (requires assessment ID in query)
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
      return NextResponse.json({ error: "Assessment ID is required" }, { status: 400 });
    }

    // Check if assessment exists and user has access
    const existingAssessment = await prisma.assessment.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingAssessment) {
      return NextResponse.json({ error: "Assessment not found" }, { status: 404 });
    }

    if (!canAccessAssessment(session.user.role, session.user.pilot_school_id, existingAssessment.pilot_school_id)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Delete assessment
    await prisma.assessment.delete({
      where: { id: parseInt(id) }
    });

    // Clear student assessment level
    const levelField = `${existingAssessment.assessment_type}_${existingAssessment.subject}_level`;
    await prisma.student.update({
      where: { id: existingAssessment.student_id },
      data: {
        [levelField]: null
      }
    });

    return NextResponse.json({ 
      message: "Assessment deleted successfully" 
    });

  } catch (error) {
    console.error("Error deleting assessment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}