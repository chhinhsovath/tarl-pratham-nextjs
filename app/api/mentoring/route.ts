import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Comprehensive validation schema for complete mentoring visit
const mentoringVisitSchema = z.object({
  // Basic Information
  pilot_school_id: z.number().min(1, "Pilot school is required"),
  teacher_id: z.number().optional(),
  school_id: z.number().optional(),
  mentor_id: z.union([z.number(), z.string()]).optional(), // Form sends this but we override from session
  mentor_name: z.string().optional(), // Form sends this but we ignore it
  visit_date: z.string(),
  program_type: z.string().optional().default("TaRL"),
  grade_group: z.string().optional(),
  grades_observed: z.any().optional(), // Form sends array of grades

  // Location
  province: z.string().optional(),
  district: z.string().optional(),
  commune: z.string().optional(),
  village: z.string().optional(),

  // Class Session - Support both boolean and number (0/1) from form
  class_in_session: z.union([z.boolean(), z.number()]).optional().default(true).transform(val => val === 1 || val === true),
  class_not_in_session_reason: z.string().optional(),
  full_session_observed: z.union([z.boolean(), z.number()]).optional().transform(val => val === 1 || val === true),
  class_started_on_time: z.union([z.boolean(), z.number()]).optional().transform(val => val === 1 || val === true),
  late_start_reason: z.string().optional(),
  
  // Student Data
  total_students_enrolled: z.number().min(0).optional(),
  students_present: z.number().min(0).optional(),
  students_improved: z.number().min(0).optional(),
  classes_conducted_before_visit: z.number().min(0).optional(),
  students_improved_from_last_week: z.number().min(0).optional(),
  
  // Subject and Levels
  subject_observed: z.string().optional(),
  language_levels_observed: z.any().optional(),
  numeracy_levels_observed: z.any().optional(),
  
  // Classroom Organization - Support both boolean and number (0/1)
  students_grouped_by_level: z.union([z.boolean(), z.number()]).optional().transform(val => val === 1 || val === true),
  children_grouped_appropriately: z.union([z.boolean(), z.number()]).optional().transform(val => val === 1 || val === true),
  students_active_participation: z.union([z.boolean(), z.number()]).optional().transform(val => val === 1 || val === true),
  students_fully_involved: z.union([z.boolean(), z.number()]).optional().transform(val => val === 1 || val === true),

  // Teacher Planning - Support both boolean and number (0/1)
  has_session_plan: z.union([z.boolean(), z.number()]).optional().transform(val => val === 1 || val === true),
  followed_session_plan: z.union([z.boolean(), z.number()]).optional().transform(val => val === 1 || val === true),
  no_session_plan_reason: z.string().optional(),
  no_follow_plan_reason: z.string().optional(),
  session_plan_appropriate: z.union([z.boolean(), z.number()]).optional().transform(val => val === 1 || val === true),
  session_plan_notes: z.string().optional(), // Form sends this

  // Classroom Materials
  teaching_materials: z.any().optional(),
  materials_present: z.any().optional(), // Can be string or array from form
  teacher_feedback: z.string().optional(), // Form sends this
  
  // Activities
  number_of_activities: z.number().min(1).max(5).optional(), // User can select up to 5, but detailed records only support 3
  
  // Activity 1
  activity1_name_language: z.string().optional(),
  activity1_name_numeracy: z.string().optional(),
  activity1_duration: z.number().min(0).optional(),
  activity1_clear_instructions: z.union([z.boolean(), z.number()]).optional().transform(val => val === 1 || val === true),
  activity1_no_clear_instructions_reason: z.string().optional(),
  activity1_followed_process: z.union([z.boolean(), z.number()]).optional().transform(val => val === 1 || val === true),
  activity1_not_followed_reason: z.string().optional(),
  activity1_type: z.string().optional(),
  activity1_demonstrated: z.union([z.boolean(), z.number()]).optional().transform(val => val === 1 || val === true),
  activity1_students_practice: z.string().optional(),
  activity1_small_groups: z.string().optional(),
  activity1_individual: z.string().optional(),

  // Activity 2
  activity2_name_language: z.string().optional(),
  activity2_name_numeracy: z.string().optional(),
  activity2_duration: z.number().min(0).optional(),
  activity2_clear_instructions: z.union([z.boolean(), z.number()]).optional().transform(val => val === 1 || val === true),
  activity2_no_clear_instructions_reason: z.string().optional(),
  activity2_followed_process: z.union([z.boolean(), z.number()]).optional().transform(val => val === 1 || val === true),
  activity2_not_followed_reason: z.string().optional(),
  activity2_type: z.string().optional(),
  activity2_demonstrated: z.union([z.boolean(), z.number()]).optional().transform(val => val === 1 || val === true),
  activity2_students_practice: z.string().optional(),
  activity2_small_groups: z.string().optional(),
  activity2_individual: z.string().optional(),

  // Activity 3 (Note: followed_process and not_followed_reason accepted but not saved - DB doesn't support them)
  activity3_name_language: z.string().optional(),
  activity3_name_numeracy: z.string().optional(),
  activity3_duration: z.number().min(0).optional(),
  activity3_clear_instructions: z.union([z.boolean(), z.number()]).optional().transform(val => val === 1 || val === true),
  activity3_no_clear_instructions_reason: z.string().optional(),
  activity3_followed_process: z.union([z.boolean(), z.number()]).optional().transform(val => val === 1 || val === true), // Accepted but not saved
  activity3_not_followed_reason: z.string().optional(), // Accepted but not saved
  activity3_demonstrated: z.union([z.boolean(), z.number()]).optional().transform(val => val === 1 || val === true),
  activity3_students_practice: z.string().optional(),
  activity3_small_groups: z.string().optional(),
  activity3_individual: z.string().optional(),

  // Feedback and Actions
  observation: z.string().optional(),
  score: z.number().min(0).max(100).optional(),
  follow_up_required: z.union([z.boolean(), z.number()]).optional().default(false).transform(val => val === 1 || val === true),
  feedback_for_teacher: z.string().optional(),
  recommendations: z.string().optional(),
  action_plan: z.string().optional(),
  follow_up_actions: z.string().optional(),
  
  // Photos
  photo: z.string().optional(),
  photos: z.array(z.string()).optional(),
  
  // Status
  status: z.enum(["scheduled", "completed", "cancelled"]).default("scheduled"),
  
  // Legacy fields for backward compatibility
  level: z.string().optional(),
  purpose: z.string().optional(),
  activities: z.string().optional(),
  observations: z.string().optional(),
  participants_count: z.number().min(0).optional(),
  duration_minutes: z.number().min(0).optional(),
});

// Helper function to check permissions
function hasPermission(userRole: string, action: string): boolean {
  const permissions = {
    admin: ["view", "create", "update", "delete"],
    coordinator: ["view", "create", "update", "delete"],
    mentor: ["view", "create", "update", "delete"],
    teacher: ["view"],
    viewer: ["view"]
  };
  
  return permissions[userRole as keyof typeof permissions]?.includes(action) || false;
}

// Helper function to check if user can access mentoring visit data
function canAccessVisit(userRole: string, userPilotSchoolId: number | null, visitPilotSchoolId: number | null, mentorId: number, userId: string): boolean {
  if (userRole === "admin" || userRole === "coordinator") {
    return true;
  }
  
  if (userRole === "mentor") {
    // Mentors can only access their own visits or visits at their pilot school
    return mentorId === parseInt(userId) || (userPilotSchoolId && visitPilotSchoolId === userPilotSchoolId);
  }
  
  if (userRole === "teacher" && userPilotSchoolId) {
    return visitPilotSchoolId === userPilotSchoolId;
  }
  
  return false;
}

// GET /api/mentoring - List mentoring visits with pagination and filtering
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
    const status = searchParams.get("status") || "";
    const pilot_school_id = searchParams.get("pilot_school_id") || "";
    const mentor_id = searchParams.get("mentor_id") || "";
    const date_from = searchParams.get("date_from") || "";
    const date_to = searchParams.get("date_to") || "";
    
    const skip = (page - 1) * limit;
    
    // Build where clause
    const where: any = {};
    
    if (search) {
      where.OR = [
        { purpose: { contains: search, mode: "insensitive" } },
        { activities: { contains: search, mode: "insensitive" } },
        { observations: { contains: search, mode: "insensitive" } },
        { recommendations: { contains: search, mode: "insensitive" } }
      ];
    }
    
    if (status) {
      where.status = status;
    }
    
    if (pilot_school_id) {
      where.pilot_school_id = parseInt(pilot_school_id);
    }
    
    if (mentor_id) {
      where.mentor_id = parseInt(mentor_id);
    }
    
    if (date_from) {
      where.visit_date = {
        ...where.visit_date,
        gte: new Date(date_from)
      };
    }
    
    if (date_to) {
      where.visit_date = {
        ...where.visit_date,
        lte: new Date(date_to)
      };
    }

    // Apply access restrictions for mentors and teachers
    if (session.user.role === "mentor") {
      if (session.user.pilot_school_id) {
        where.OR = [
          { mentor_id: parseInt(session.user.id) },
          { pilot_school_id: session.user.pilot_school_id }
        ];
      } else {
        where.mentor_id = parseInt(session.user.id);
      }
    } else if (session.user.role === "teacher") {
      if (session.user.pilot_school_id) {
        where.pilot_school_id = session.user.pilot_school_id;
      } else {
        // If teacher has no pilot school, they can't see any visits
        where.id = -1;
      }
    }

    const [visits, total] = await Promise.all([
      prisma.mentoringVisit.findMany({
        where,
        include: {
          mentor: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true
            }
          },
          pilot_school: {
            select: {
              id: true,
              school_name: true,
              school_code: true,
              province: true,
              district: true,
              cluster: true
            }
          }
        },
        skip,
        take: limit,
        orderBy: { visit_date: "desc" }
      }),
      prisma.mentoringVisit.count({ where })
    ]);

    return NextResponse.json({
      data: visits,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error: any) {
    console.error("Error fetching mentoring visits:", error);
    console.error("Error message:", error.message);
    console.error("Error code:", error.code);
    console.error("Error meta:", error.meta);

    return NextResponse.json(
      {
        error: "Internal server error",
        message: error.message || "Unknown error",
        code: error.code || "UNKNOWN",
        meta: error.meta || {},
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

// POST /api/mentoring - Create new mentoring visit
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
    const validatedData = mentoringVisitSchema.parse(body);
    
    // For mentors, restrict to their pilot school if they have one
    if (session.user.role === "mentor" && session.user.pilot_school_id) {
      if (validatedData.pilot_school_id !== session.user.pilot_school_id) {
        return NextResponse.json(
          { error: "Mentors can only create visits for their assigned pilot school" },
          { status: 403 }
        );
      }
    }

    // Verify pilot school exists
    const pilotSchool = await prisma.pilotSchool.findUnique({
      where: { id: validatedData.pilot_school_id }
    });
    
    if (!pilotSchool) {
      return NextResponse.json(
        { error: "Invalid pilot school ID" },
        { status: 400 }
      );
    }

    // Prepare data for database - stringify array fields and remove unsupported fields
    const {
      activity3_followed_process,
      activity3_not_followed_reason,
      mentor_name, // Form sends this but we override with session
      session_plan_notes, // Map to lesson_plan_feedback
      ...cleanedData
    } = validatedData;

    const dbData = {
      ...cleanedData,
      mentor_id: parseInt(session.user.id),
      visit_date: new Date(validatedData.visit_date),
      lesson_plan_feedback: session_plan_notes || null, // Map session_plan_notes to lesson_plan_feedback
      photos: validatedData.photos ? JSON.stringify(validatedData.photos) : null,
      grades_observed: validatedData.grades_observed ? JSON.stringify(validatedData.grades_observed) : null,
      language_levels_observed: validatedData.language_levels_observed ? JSON.stringify(validatedData.language_levels_observed) : null,
      numeracy_levels_observed: validatedData.numeracy_levels_observed ? JSON.stringify(validatedData.numeracy_levels_observed) : null,
      materials_present: validatedData.materials_present ? JSON.stringify(validatedData.materials_present) : null,
      teaching_materials: validatedData.teaching_materials ? JSON.stringify(validatedData.teaching_materials) : null,
    };

    // Create mentoring visit
    const visit = await prisma.mentoringVisit.create({
      data: dbData,
      include: {
        mentor: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        },
        pilot_school: {
          select: {
            id: true,
            school_name: true,
            school_code: true,
            province: true,
            district: true,
            cluster: true
          }
        }
      }
    });

    return NextResponse.json({ 
      message: "Mentoring visit created successfully",
      data: visit 
    }, { status: 201 });

  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    // DETAILED ERROR LOGGING - Following AI_DEVELOPMENT_RULES.md
    console.error("Error creating mentoring visit:", error);
    console.error("Error message:", error.message);
    console.error("Error code:", error.code);
    console.error("Error meta:", error.meta);

    // Return detailed error information to help debugging
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error.message || "Unknown error",
        code: error.code || "UNKNOWN",
        meta: error.meta || {},
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

// PUT /api/mentoring - Update mentoring visit (requires visit ID in body)
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
      return NextResponse.json({ error: "Visit ID is required" }, { status: 400 });
    }

    // Check if visit exists and user has access
    const existingVisit = await prisma.mentoringVisit.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingVisit) {
      return NextResponse.json({ error: "Mentoring visit not found" }, { status: 404 });
    }

    if (!canAccessVisit(session.user.role, session.user.pilot_school_id, existingVisit.pilot_school_id, existingVisit.mentor_id, session.user.id)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Validate input
    const updateSchema = mentoringVisitSchema.partial();
    const validatedData = updateSchema.parse(updateData);

    // For mentors, restrict pilot school changes
    if (session.user.role === "mentor" && session.user.pilot_school_id && validatedData.pilot_school_id) {
      if (validatedData.pilot_school_id !== session.user.pilot_school_id) {
        return NextResponse.json(
          { error: "Mentors can only assign visits to their pilot school" },
          { status: 403 }
        );
      }
    }

    // Verify pilot school exists if being updated
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

    // Prepare data for database - stringify array fields and remove unsupported fields
    const {
      activity3_followed_process: _activity3_followed,
      activity3_not_followed_reason: _activity3_not_followed,
      mentor_name: _mentor_name,
      session_plan_notes, // Map to lesson_plan_feedback
      ...cleanedUpdateData
    } = validatedData;

    const updateDbData = {
      ...cleanedUpdateData,
      visit_date: validatedData.visit_date ? new Date(validatedData.visit_date) : undefined,
      lesson_plan_feedback: session_plan_notes || undefined, // Map session_plan_notes to lesson_plan_feedback
      photos: validatedData.photos ? JSON.stringify(validatedData.photos) : undefined,
      grades_observed: validatedData.grades_observed ? JSON.stringify(validatedData.grades_observed) : undefined,
      language_levels_observed: validatedData.language_levels_observed ? JSON.stringify(validatedData.language_levels_observed) : undefined,
      numeracy_levels_observed: validatedData.numeracy_levels_observed ? JSON.stringify(validatedData.numeracy_levels_observed) : undefined,
      materials_present: validatedData.materials_present ? JSON.stringify(validatedData.materials_present) : undefined,
      teaching_materials: validatedData.teaching_materials ? JSON.stringify(validatedData.teaching_materials) : undefined,
    };

    // Update mentoring visit
    const visit = await prisma.mentoringVisit.update({
      where: { id: parseInt(id) },
      data: updateDbData,
      include: {
        mentor: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        },
        pilot_school: {
          select: {
            id: true,
            school_name: true,
            school_code: true,
            province: true,
            district: true,
            cluster: true
          }
        }
      }
    });

    return NextResponse.json({ 
      message: "Mentoring visit updated successfully",
      data: visit 
    });

  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    // DETAILED ERROR LOGGING
    console.error("Error updating mentoring visit:", error);
    console.error("Error message:", error.message);
    console.error("Error code:", error.code);
    console.error("Error meta:", error.meta);

    return NextResponse.json(
      {
        error: "Internal server error",
        message: error.message || "Unknown error",
        code: error.code || "UNKNOWN",
        meta: error.meta || {},
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

// DELETE /api/mentoring - Delete mentoring visit (requires visit ID in query)
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
      return NextResponse.json({ error: "Visit ID is required" }, { status: 400 });
    }

    // Check if visit exists and user has access
    const existingVisit = await prisma.mentoringVisit.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingVisit) {
      return NextResponse.json({ error: "Mentoring visit not found" }, { status: 404 });
    }

    if (!canAccessVisit(session.user.role, session.user.pilot_school_id, existingVisit.pilot_school_id, existingVisit.mentor_id, session.user.id)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Delete mentoring visit
    await prisma.mentoringVisit.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({ 
      message: "Mentoring visit deleted successfully" 
    });

  } catch (error: any) {
    console.error("Error deleting mentoring visit:", error);
    console.error("Error message:", error.message);
    console.error("Error code:", error.code);
    console.error("Error meta:", error.meta);

    return NextResponse.json(
      {
        error: "Internal server error",
        message: error.message || "Unknown error",
        code: error.code || "UNKNOWN",
        meta: error.meta || {},
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}