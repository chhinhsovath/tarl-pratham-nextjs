import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Validation schema for updating mentoring visit
const updateMentoringVisitSchema = z.object({
  pilot_school_id: z.number().optional(),
  teacher_id: z.number().optional(),
  visit_date: z.string().transform((str) => new Date(str)).optional(),
  observation: z.string().optional(),
  score: z.number().min(0).max(100).optional(),
  photo: z.string().optional(),
  action_plan: z.string().optional(),
  follow_up_required: z.boolean().optional(),
  questionnaire_data: z.record(z.any()).optional(),
  region: z.string().optional(),
  cluster: z.string().optional(),
  program_type: z.string().optional(),
  class_in_session: z.boolean().optional(),
  class_not_in_session_reason: z.string().optional(),
  full_session_observed: z.boolean().optional(),
  grade_group: z.string().optional(),
  grades_observed: z.array(z.string()).optional(),
  subject_observed: z.string().optional(),
  language_levels_observed: z.array(z.string()).optional(),
  numeracy_levels_observed: z.array(z.string()).optional(),
  
  // Student Data Section
  total_students_enrolled: z.number().optional(),
  students_present: z.number().optional(),
  students_improved: z.number().optional(),
  classes_conducted_before: z.number().optional(),
  
  // Delivery questions
  class_started_on_time: z.boolean().optional(),
  late_start_reason: z.string().optional(),
  
  // Classroom Materials
  teaching_materials: z.array(z.string()).optional(),
  
  // Classroom Organization
  students_grouped_by_level: z.boolean().optional(),
  students_active_participation: z.boolean().optional(),
  
  // Teacher Planning
  teacher_has_lesson_plan: z.boolean().optional(),
  no_lesson_plan_reason: z.string().optional(),
  followed_lesson_plan: z.boolean().optional(),
  not_followed_reason: z.string().optional(),
  plan_appropriate_for_levels: z.boolean().optional(),
  lesson_plan_feedback: z.string().optional(),
  
  // Activity Tracking
  num_activities_observed: z.number().optional(),
  
  // Activity 1 Details
  activity1_type: z.string().optional(),
  activity1_duration: z.number().optional(),
  activity1_clear_instructions: z.boolean().optional(),
  activity1_unclear_reason: z.string().optional(),
  activity1_followed_process: z.boolean().optional(),
  activity1_not_followed_reason: z.string().optional(),
  
  // Activity 2 Details
  activity2_type: z.string().optional(),
  activity2_duration: z.number().optional(),
  activity2_clear_instructions: z.boolean().optional(),
  activity2_unclear_reason: z.string().optional(),
  activity2_followed_process: z.boolean().optional(),
  activity2_not_followed_reason: z.string().optional(),
  
  // Overall Teacher Feedback
  teacher_feedback: z.string().optional(),
  
  // Additional structured data storage
  activities_data: z.record(z.any()).optional(),
}).partial();

// Helper function to check permissions
function hasPermission(userRole: string, action: string): boolean {
  const permissions = {
    admin: ['view', 'create', 'update', 'delete'],
    coordinator: ['view', 'create', 'update', 'delete'],
    mentor: ['view', 'create', 'update', 'delete'],
    teacher: ['view'],
    viewer: ['view']
  };

  return permissions[userRole as keyof typeof permissions]?.includes(action) || false;
}

// Helper function to check if user can access mentoring visit
function canAccessMentoringVisit(userRole: string, userId: number, mentoringVisit: any): boolean {
  if (userRole === 'admin' || userRole === 'coordinator') {
    return true;
  }

  if (userRole === 'mentor') {
    return mentoringVisit.mentor_id === userId;
  }

  if (userRole === 'teacher') {
    return mentoringVisit.teacher_id === userId;
  }

  if (userRole === 'viewer') {
    return true;
  }

  return false;
}

// GET /api/mentoring-visits/[id] - Get single mentoring visit
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!hasPermission(session.user.role, 'view')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const mentoringVisit = await prisma.mentoring_visits.findUnique({
      where: { id },
      include: {
        mentor: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        teacher: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        pilot_schools: {
          select: {
            id: true,
            school_name: true,
            school_code: true
          }
        }
      }
    });

    if (!mentoringVisit) {
      return NextResponse.json({ error: 'Mentoring visit not found' }, { status: 404 });
    }

    if (!canAccessMentoringVisit(session.user.role, parseInt(session.user.id), mentoringVisit)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({ data: mentoringVisit });

  } catch (error) {
    console.error('Error fetching mentoring visit:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/mentoring-visits/[id] - Update mentoring visit
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!hasPermission(session.user.role, 'update')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    // Check if mentoring visit exists and user has access
    const existingMentoringVisit = await prisma.mentoring_visits.findUnique({
      where: { id }
    });

    if (!existingMentoringVisit) {
      return NextResponse.json({ error: 'Mentoring visit not found' }, { status: 404 });
    }

    if (!canAccessMentoringVisit(session.user.role, parseInt(session.user.id), existingMentoringVisit)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Check if locked
    if (existingMentoringVisit.is_locked) {
      return NextResponse.json({ error: 'Mentoring visit is locked and cannot be modified' }, { status: 403 });
    }

    const body = await request.json();
    
    // Validate input
    const validatedData = updateMentoringVisitSchema.parse(body);

    // Verify pilot school exists if being updated
    if (validatedData.pilot_school_id) {
      const pilotSchool = await prisma.pilot_schools.findUnique({
        where: { id: validatedData.pilot_school_id }
      });
      
      if (!pilotSchool) {
        return NextResponse.json(
          { error: 'Invalid pilot school ID' },
          { status: 400 }
        );
      }
    }

    // Verify teacher exists if being updated
    if (validatedData.teacher_id) {
      const teacher = await prisma.users.findFirst({
        where: { 
          id: validatedData.teacher_id,
          role: 'teacher'
        }
      });
      
      if (!teacher) {
        return NextResponse.json(
          { error: 'Invalid teacher ID' },
          { status: 400 }
        );
      }
    }

    // Update mentoring visit
    const mentoringVisit = await prisma.mentoring_visits.update({
      where: { id },
      data: {
        ...validatedData,
        updated_at: new Date()
      },
      include: {
        mentor: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        teacher: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        pilot_schools: {
          select: {
            id: true,
            school_name: true,
            school_code: true
          }
        }
      }
    });

    return NextResponse.json({ 
      message: 'Mentoring visit updated successfully',
      data: mentoringVisit 
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Error updating mentoring visit:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/mentoring-visits/[id] - Delete mentoring visit
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!hasPermission(session.user.role, 'delete')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    // Check if mentoring visit exists and user has access
    const existingMentoringVisit = await prisma.mentoring_visits.findUnique({
      where: { id }
    });

    if (!existingMentoringVisit) {
      return NextResponse.json({ error: 'Mentoring visit not found' }, { status: 404 });
    }

    if (!canAccessMentoringVisit(session.user.role, parseInt(session.user.id), existingMentoringVisit)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Check if locked
    if (existingMentoringVisit.is_locked) {
      return NextResponse.json({ error: 'Mentoring visit is locked and cannot be deleted' }, { status: 403 });
    }

    // For mentors deleting temporary mentoring visits, hard delete
    // For others, soft delete (mark as deleted status)
    if (session.user.role === 'mentor' && existingMentoringVisit.is_temporary) {
      await prisma.mentoring_visits.delete({
        where: { id }
      });
    } else {
      await prisma.mentoring_visits.update({
        where: { id },
        data: { status: 'deleted' }
      });
    }

    return NextResponse.json({ 
      message: 'Mentoring visit deleted successfully' 
    });

  } catch (error) {
    console.error('Error deleting mentoring visit:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}