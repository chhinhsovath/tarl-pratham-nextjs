import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { getMentorSchoolIds } from "@/lib/mentorAssignments";

// Helper function to safely parse JSON strings
function tryParseJSON(jsonString: string): any {
  try {
    return JSON.parse(jsonString);
  } catch (e) {
    return jsonString; // Return original string if parsing fails
  }
}

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
function canAccessVisit(userRole: string, userPilotSchoolId: number | null, visitPilotSchoolId: number | null, mentorId: number, userId: string | number): boolean {
  if (userRole === "admin" || userRole === "coordinator") {
    return true;
  }
  
  if (userRole === "mentor") {
    // Mentors can only access their own visits or visits at their pilot school
    let currentUserId: number;
    if (typeof userId === 'string') {
      currentUserId = parseInt(userId);
    } else {
      currentUserId = userId;
    }
    
    if (isNaN(currentUserId)) {
      return false; // If user ID is not a valid number, deny access
    }
    
    return mentorId === currentUserId || (userPilotSchoolId && visitPilotSchoolId === userPilotSchoolId);
  }
  
  if (userRole === "teacher" && userPilotSchoolId) {
    return visitPilotSchoolId === userPilotSchoolId;
  }
  
  return false;
}

// GET /api/mentoring/[id] - Get individual mentoring visit
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "សូមចូលប្រើប្រាស់ប្រព័ន្ធជាមុនសិន" }, { status: 401 });
    }

    if (!hasPermission(session.user.role, "view")) {
      return NextResponse.json({ error: "អ្នកមិនមានសិទ្ធិចូលមើលទិន្នន័យនេះទេ" }, { status: 403 });
    }

    const visitId = parseInt(params.id);

    if (isNaN(visitId)) {
      return NextResponse.json({ error: "លេខសម្គាល់ការចុះអប់រំមិនត្រឹមត្រូវ" }, { status: 400 });
    }

    // Get mentoring visit with all relationships
    const visit = await prisma.mentoring_visits.findUnique({
      where: { id: visitId },
      include: {
        mentor: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        },
        pilot_schools: {
          select: {
            id: true,
            school_name: true,
            school_code: true,
            province: true,
            district: true,
            cluster: true
          }
        },
        teacher: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    if (!visit) {
      return NextResponse.json({ error: "រកមិនឃើញការចុះអប់រំ" }, { status: 404 });
    }

    // Check if user has access to this visit
    if (!canAccessVisit(session.user.role, session.user.pilot_school_id, visit.pilot_school_id, visit.mentor_id, session.user.id)) {
      return NextResponse.json({ error: "អ្នកមិនមានសិទ្ធិចូលមើលការចុះអប់រំនេះទេ" }, { status: 403 });
    }

    // Parse JSON string fields back to arrays for the frontend
    const parsedVisit = {
      ...visit,
      grades_observed: visit.grades_observed ? tryParseJSON(visit.grades_observed) : null,
      language_levels_observed: visit.language_levels_observed ? tryParseJSON(visit.language_levels_observed) : null,
      numeracy_levels_observed: visit.numeracy_levels_observed ? tryParseJSON(visit.numeracy_levels_observed) : null,
      materials_present: visit.materials_present ? tryParseJSON(visit.materials_present) : null,
      teaching_materials: visit.teaching_materials ? tryParseJSON(visit.teaching_materials) : null
    };

    return NextResponse.json({ data: parsedVisit });

  } catch (error: any) {
    console.error("Error fetching mentoring visit:", error);
    return NextResponse.json(
      {
        error: "មានបញ្ហាក្នុងការទាញយកទិន្នន័យ",
        message: error.message || String(error),
        code: error.code || "UNKNOWN_ERROR"
      },
      { status: 500 }
    );
  }
}

// Update schema for editing
const updateMentoringVisitSchema = z.object({
  // Basic Information (mentor_id and mentor_name sent by form but ignored - mentor cannot be changed)
  mentor_id: z.union([z.number(), z.string()]).optional(),
  mentor_name: z.string().optional(),
  pilot_school_id: z.number().min(1, "Pilot school is required").optional(),
  teacher_id: z.number().optional(),
  school_id: z.number().optional(),
  visit_date: z.string().optional(),
  program_type: z.string().optional(),
  grade_group: z.string().optional(),
  
  // Location
  province: z.string().optional(),
  district: z.string().optional(),
  commune: z.string().optional(),
  village: z.string().optional(),
  
  // Class Session - Support both boolean and number (0/1) from form
  class_in_session: z.union([z.boolean(), z.number()]).optional().transform(val => val === 1 || val === true),
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
  
  // Classroom Organization - Support both boolean and number (0/1) from form
  students_grouped_by_level: z.union([z.boolean(), z.number()]).optional().transform(val => val === 1 || val === true),
  children_grouped_appropriately: z.union([z.boolean(), z.number()]).optional().transform(val => val === 1 || val === true),
  students_active_participation: z.union([z.boolean(), z.number()]).optional().transform(val => val === 1 || val === true),
  students_fully_involved: z.union([z.boolean(), z.number()]).optional().transform(val => val === 1 || val === true),

  // Teacher Planning - Support both boolean and number (0/1) from form
  has_session_plan: z.union([z.boolean(), z.number()]).optional().transform(val => val === 1 || val === true),
  followed_session_plan: z.union([z.boolean(), z.number()]).optional().transform(val => val === 1 || val === true),
  no_session_plan_reason: z.string().optional(),
  no_follow_plan_reason: z.string().optional(),
  session_plan_appropriate: z.union([z.boolean(), z.number()]).optional().transform(val => val === 1 || val === true),
  
  // Classroom Materials
  teaching_materials: z.any().optional(),
  materials_present: z.any().optional(),
  teacher_feedback: z.string().optional(),
  session_plan_notes: z.string().optional(),
  lesson_plan_feedback: z.string().optional(),
  grades_observed: z.any().optional(),

  // Activities
  number_of_activities: z.number().min(1).max(3).optional(),
  
  // Activity 1 - Support both boolean and number (0/1) from form
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

  // Activity 2 - Support both boolean and number (0/1) from form
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

  // Activity 3 - Support both boolean and number (0/1) from form
  activity3_name_language: z.string().optional(),
  activity3_name_numeracy: z.string().optional(),
  activity3_duration: z.number().min(0).optional(),
  activity3_clear_instructions: z.union([z.boolean(), z.number()]).optional().transform(val => val === 1 || val === true),
  activity3_no_clear_instructions_reason: z.string().optional(),
  activity3_demonstrated: z.union([z.boolean(), z.number()]).optional().transform(val => val === 1 || val === true),
  activity3_students_practice: z.string().optional(),
  activity3_small_groups: z.string().optional(),
  activity3_individual: z.string().optional(),
  
  // Feedback and Actions - Support both boolean and number (0/1) from form
  observation: z.string().optional(),
  score: z.number().min(0).max(100).optional(),
  follow_up_required: z.union([z.boolean(), z.number()]).optional().transform(val => val === 1 || val === true),
  feedback_for_teacher: z.string().optional(),
  recommendations: z.string().optional(),
  action_plan: z.string().optional(),
  follow_up_actions: z.string().optional(),
  
  // Photos
  photo: z.string().optional(),
  photos: z.array(z.string()).optional(),
  
  // Status
  status: z.enum(["scheduled", "completed", "cancelled"]).optional(),
  
  // Legacy fields for backward compatibility
  level: z.string().optional(),
  purpose: z.string().optional(),
  activities: z.string().optional(),
  observations: z.string().optional(),
  participants_count: z.number().min(0).optional(),
  duration_minutes: z.number().min(0).optional(),
});

// PUT /api/mentoring/[id] - Update individual mentoring visit
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "សូមចូលប្រើប្រាស់ប្រព័ន្ធជាមុនសិន" }, { status: 401 });
    }

    if (!hasPermission(session.user.role, "update")) {
      return NextResponse.json({ error: "អ្នកមិនមានសិទ្ធិកែសម្រួលទិន្នន័យនេះទេ" }, { status: 403 });
    }

    const visitId = parseInt(params.id);

    if (isNaN(visitId)) {
      return NextResponse.json({ error: "លេខសម្គាល់ការចុះអប់រំមិនត្រឹមត្រូវ" }, { status: 400 });
    }

    // Check if visit exists and user has access
    const existingVisit = await prisma.mentoring_visits.findUnique({
      where: { id: visitId }
    });

    if (!existingVisit) {
      return NextResponse.json({ error: "រកមិនឃើញការចុះអប់រំ" }, { status: 404 });
    }

    if (!canAccessVisit(session.user.role, session.user.pilot_school_id, existingVisit.pilot_school_id, existingVisit.mentor_id, session.user.id)) {
      return NextResponse.json({ error: "អ្នកមិនមានសិទ្ធិកែសម្រួលការចុះអប់រំនេះទេ" }, { status: 403 });
    }

    const body = await request.json();
    
    // Validate input
    const validatedData = updateMentoringVisitSchema.parse(body);

    // For mentors, restrict to their assigned schools (not just pilot_school_id)
    if (session.user.role === "mentor" && validatedData.pilot_school_id) {
      const mentorSchoolIds = await getMentorSchoolIds(parseInt(session.user.id));
      if (mentorSchoolIds.length > 0 && !mentorSchoolIds.includes(validatedData.pilot_school_id)) {
        return NextResponse.json(
          { error: "អ្នកណែនាំអាចកែសម្រួលការចុះអប់រំបានត្រឹមតែសាលាដែលត្រូវបានចាត់តាំងប៉ុណ្ណោះ" },
          { status: 403 }
        );
      }
    }

    // Verify pilot school exists if being updated
    if (validatedData.pilot_school_id) {
      const pilotSchool = await prisma.pilot_schools.findUnique({
        where: { id: validatedData.pilot_school_id }
      });

      if (!pilotSchool) {
        return NextResponse.json(
          { error: "លេខសម្គាល់សាលារៀនមិនត្រឹមត្រូវ" },
          { status: 400 }
        );
      }
    }

    // Remove fields that should not be updated (mentor_id and mentor_name from form)
    const { mentor_id, mentor_name, ...updateData } = validatedData;

    // Update mentoring visit
    const visit = await prisma.mentoring_visits.update({
      where: { id: visitId },
      data: {
        ...updateData,
        visit_date: updateData.visit_date ? new Date(updateData.visit_date) : undefined,
        photos: updateData.photos ? JSON.stringify(updateData.photos) : undefined,
        grades_observed: updateData.grades_observed ? JSON.stringify(updateData.grades_observed) : undefined,
        language_levels_observed: updateData.language_levels_observed ? JSON.stringify(updateData.language_levels_observed) : undefined,
        numeracy_levels_observed: updateData.numeracy_levels_observed ? JSON.stringify(updateData.numeracy_levels_observed) : undefined,
        materials_present: updateData.materials_present ? JSON.stringify(updateData.materials_present) : undefined,
        teaching_materials: updateData.teaching_materials ? JSON.stringify(updateData.teaching_materials) : undefined
      },
      include: {
        mentor: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        },
        pilot_schools: {
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
      message: "បានកែសម្រួលការចុះអប់រំដោយជោគជ័យ",
      data: visit
    });

  } catch (error: any) {
    if (error instanceof z.ZodError) {
      // DETAILED ERROR - per AI_DEVELOPMENT_RULES.md
      console.error("Validation error:", error.errors);
      return NextResponse.json(
        {
          error: "ទិន្នន័យមិនត្រឹមត្រូវ សូមពិនិត្យឡើងវិញ",
          message: "Validation failed - see details for specific field errors",
          code: "VALIDATION_ERROR",
          details: error.errors,
          fields: error.errors.map((e: any) => ({
            field: e.path.join('.'),
            message: e.message,
            received: e.received
          }))
        },
        { status: 400 }
      );
    }

    console.error("Error updating mentoring visit:", error);
    return NextResponse.json(
      {
        error: "មានបញ្ហាក្នុងការកែសម្រួល",
        message: error.message || String(error),
        code: error.code || "UNKNOWN_ERROR",
        meta: error.meta || {}
      },
      { status: 500 }
    );
  }
}

// DELETE /api/mentoring/[id] - Delete individual mentoring visit
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "សូមចូលប្រើប្រាស់ប្រព័ន្ធជាមុនសិន" }, { status: 401 });
    }

    if (!hasPermission(session.user.role, "delete")) {
      return NextResponse.json({ error: "អ្នកមិនមានសិទ្ធិលុបទិន្នន័យនេះទេ" }, { status: 403 });
    }

    const visitId = parseInt(params.id);

    if (isNaN(visitId)) {
      return NextResponse.json({ error: "លេខសម្គាល់ការចុះអប់រំមិនត្រឹមត្រូវ" }, { status: 400 });
    }

    // Check if visit exists and user has access
    const existingVisit = await prisma.mentoring_visits.findUnique({
      where: { id: visitId }
    });

    if (!existingVisit) {
      return NextResponse.json({ error: "រកមិនឃើញការចុះអប់រំ" }, { status: 404 });
    }

    if (!canAccessVisit(session.user.role, session.user.pilot_school_id, existingVisit.pilot_school_id, existingVisit.mentor_id, session.user.id)) {
      return NextResponse.json({ error: "អ្នកមិនមានសិទ្ធិលុបការចុះអប់រំនេះទេ" }, { status: 403 });
    }

    // Delete mentoring visit
    await prisma.mentoring_visits.delete({
      where: { id: visitId }
    });

    return NextResponse.json({
      message: "បានលុបការចុះអប់រំដោយជោគជ័យ" 
    });

  } catch (error: any) {
    console.error("Error deleting mentoring visit:", error);
    return NextResponse.json(
      {
        error: "មានបញ្ហាក្នុងការលុប",
        message: error.message || String(error),
        code: error.code || "UNKNOWN_ERROR"
      },
      { status: 500 }
    );
  }
}