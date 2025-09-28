import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

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

// GET /api/mentoring/[id] - Get individual mentoring visit
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!hasPermission(session.user.role, "view")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const visitId = parseInt(params.id);
    
    if (isNaN(visitId)) {
      return NextResponse.json({ error: "Invalid visit ID" }, { status: 400 });
    }

    // Get mentoring visit with all relationships
    const visit = await prisma.mentoringVisit.findUnique({
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
        teacher: {
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
            name: true,
            code: true,
            province: {
              select: {
                name_english: true,
                name_khmer: true
              }
            }
          }
        }
      }
    });

    if (!visit) {
      return NextResponse.json({ error: "Mentoring visit not found" }, { status: 404 });
    }

    // Check if user has access to this visit
    if (!canAccessVisit(session.user.role, session.user.pilot_school_id, visit.pilot_school_id, visit.mentor_id, session.user.id)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ data: visit });

  } catch (error) {
    console.error("Error fetching mentoring visit:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Update schema for editing
const updateMentoringVisitSchema = z.object({
  // Basic Information
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
  
  // Class Session
  class_in_session: z.boolean().optional(),
  class_not_in_session_reason: z.string().optional(),
  full_session_observed: z.boolean().optional(),
  class_started_on_time: z.boolean().optional(),
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
  
  // Classroom Organization
  students_grouped_by_level: z.boolean().optional(),
  children_grouped_appropriately: z.boolean().optional(),
  students_active_participation: z.boolean().optional(),
  students_fully_involved: z.boolean().optional(),
  
  // Teacher Planning
  has_session_plan: z.boolean().optional(),
  followed_session_plan: z.boolean().optional(),
  no_session_plan_reason: z.string().optional(),
  no_follow_plan_reason: z.string().optional(),
  session_plan_appropriate: z.boolean().optional(),
  
  // Classroom Materials
  teaching_materials: z.any().optional(),
  materials_present: z.string().optional(),
  
  // Activities
  number_of_activities: z.number().min(1).max(3).optional(),
  
  // Activity 1
  activity1_name_language: z.string().optional(),
  activity1_name_numeracy: z.string().optional(),
  activity1_duration: z.number().min(0).optional(),
  activity1_clear_instructions: z.boolean().optional(),
  activity1_no_clear_instructions_reason: z.string().optional(),
  activity1_followed_process: z.boolean().optional(),
  activity1_not_followed_reason: z.string().optional(),
  activity1_type: z.string().optional(),
  activity1_demonstrated: z.boolean().optional(),
  activity1_students_practice: z.string().optional(),
  activity1_small_groups: z.string().optional(),
  activity1_individual: z.string().optional(),
  
  // Activity 2
  activity2_name_language: z.string().optional(),
  activity2_name_numeracy: z.string().optional(),
  activity2_duration: z.number().min(0).optional(),
  activity2_clear_instructions: z.boolean().optional(),
  activity2_no_clear_instructions_reason: z.string().optional(),
  activity2_followed_process: z.boolean().optional(),
  activity2_not_followed_reason: z.string().optional(),
  activity2_type: z.string().optional(),
  activity2_demonstrated: z.boolean().optional(),
  activity2_students_practice: z.string().optional(),
  activity2_small_groups: z.string().optional(),
  activity2_individual: z.string().optional(),
  
  // Activity 3
  activity3_name_language: z.string().optional(),
  activity3_name_numeracy: z.string().optional(),
  activity3_duration: z.number().min(0).optional(),
  activity3_clear_instructions: z.boolean().optional(),
  activity3_no_clear_instructions_reason: z.string().optional(),
  activity3_demonstrated: z.boolean().optional(),
  activity3_students_practice: z.string().optional(),
  activity3_small_groups: z.string().optional(),
  activity3_individual: z.string().optional(),
  
  // Feedback and Actions
  observation: z.string().optional(),
  score: z.number().min(0).max(100).optional(),
  follow_up_required: z.boolean().optional(),
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!hasPermission(session.user.role, "update")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const visitId = parseInt(params.id);
    
    if (isNaN(visitId)) {
      return NextResponse.json({ error: "Invalid visit ID" }, { status: 400 });
    }

    // Check if visit exists and user has access
    const existingVisit = await prisma.mentoringVisit.findUnique({
      where: { id: visitId }
    });

    if (!existingVisit) {
      return NextResponse.json({ error: "Mentoring visit not found" }, { status: 404 });
    }

    if (!canAccessVisit(session.user.role, session.user.pilot_school_id, existingVisit.pilot_school_id, existingVisit.mentor_id, session.user.id)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    
    // Validate input
    const validatedData = updateMentoringVisitSchema.parse(body);

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

    // Update mentoring visit
    const visit = await prisma.mentoringVisit.update({
      where: { id: visitId },
      data: {
        ...validatedData,
        visit_date: validatedData.visit_date ? new Date(validatedData.visit_date) : undefined,
        photos: validatedData.photos ? JSON.stringify(validatedData.photos) : undefined
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
        teacher: {
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
            name: true,
            code: true,
            province: {
              select: {
                name_english: true,
                name_khmer: true
              }
            }
          }
        }
      }
    });

    return NextResponse.json({ 
      message: "Mentoring visit updated successfully",
      data: visit 
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    
    console.error("Error updating mentoring visit:", error);
    return NextResponse.json(
      { error: "Internal server error" },
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!hasPermission(session.user.role, "delete")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const visitId = parseInt(params.id);
    
    if (isNaN(visitId)) {
      return NextResponse.json({ error: "Invalid visit ID" }, { status: 400 });
    }

    // Check if visit exists and user has access
    const existingVisit = await prisma.mentoringVisit.findUnique({
      where: { id: visitId }
    });

    if (!existingVisit) {
      return NextResponse.json({ error: "Mentoring visit not found" }, { status: 404 });
    }

    if (!canAccessVisit(session.user.role, session.user.pilot_school_id, existingVisit.pilot_school_id, existingVisit.mentor_id, session.user.id)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Delete mentoring visit
    await prisma.mentoringVisit.delete({
      where: { id: visitId }
    });

    return NextResponse.json({ 
      message: "Mentoring visit deleted successfully" 
    });

  } catch (error) {
    console.error("Error deleting mentoring visit:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}