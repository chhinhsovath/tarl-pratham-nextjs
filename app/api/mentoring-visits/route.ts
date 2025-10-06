import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Validation schema for mentoring visit
const mentoringVisitSchema = z.object({
  pilot_school_id: z.number(),
  teacher_id: z.number().optional(),
  visit_date: z.string().transform((str) => new Date(str)),
  observation: z.string().optional(),
  score: z.number().min(0).max(100).optional(),
  photo: z.string().optional(),
  action_plan: z.string().optional(),
  follow_up_required: z.boolean().optional(),
  questionnaire_data: z.record(z.any()).optional(),
  region: z.string().optional(),
  cluster: z.string().optional(),
  mentor_name: z.string().optional(),
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
});

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

// GET /api/mentoring-visits - List mentoring visits
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'សូមចូលប្រើប្រាស់ប្រព័ន្ធជាមុនសិន' }, { status: 401 });
    }

    if (!hasPermission(session.user.role, 'view')) {
      return NextResponse.json({ error: 'អ្នកមិនមានសិទ្ធិមើលទិន្នន័យនេះ' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const pilot_school_id = searchParams.get('pilot_school_id') || '';
    const mentor_id = searchParams.get('mentor_id') || '';
    const visit_date_from = searchParams.get('visit_date_from') || '';
    const visit_date_to = searchParams.get('visit_date_to') || '';
    
    const skip = (page - 1) * limit;
    
    // Build where clause
    const where: any = {};
    
    if (search) {
      where.OR = [
        { mentor_name: { contains: search, mode: 'insensitive' } },
        { observation: { contains: search, mode: 'insensitive' } },
        { action_plan: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    if (pilot_school_id) {
      where.pilot_school_id = parseInt(pilot_school_id);
    }
    
    if (mentor_id) {
      where.mentor_id = parseInt(mentor_id);
    }
    
    if (visit_date_from && visit_date_to) {
      where.visit_date = {
        gte: new Date(visit_date_from),
        lte: new Date(visit_date_to)
      };
    } else if (visit_date_from) {
      where.visit_date = {
        gte: new Date(visit_date_from)
      };
    } else if (visit_date_to) {
      where.visit_date = {
        lte: new Date(visit_date_to)
      };
    }

    // Apply access restrictions based on user role
    if (session.user.role === 'teacher') {
      where.teacher_id = parseInt(session.user.id);
    } else if (session.user.role === 'mentor') {
      if (session.user.pilot_school_id) {
        where.pilot_school_id = session.user.pilot_school_id;
      }
    }

    const [mentoringVisits, total] = await Promise.all([
      prisma.mentoringVisit.findMany({
        where,
        include: {
          mentor: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          pilot_school: {
            select: {
              id: true,
              school_name: true,
              school_code: true
            }
          }
        },
        skip,
        take: limit,
        orderBy: { visit_date: 'desc' }
      }),
      prisma.mentoringVisit.count({ where })
    ]);

    return NextResponse.json({
      data: mentoringVisits,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error: any) {
    console.error('Error fetching mentoring visits:', error);
    return NextResponse.json(
      {
        error: 'មានបញ្ហាក្នុងការទាញយកទិន្នន័យទស្សនកិច្ចណែនាំ',
        details: error.message,
        code: error.code
      },
      { status: 500 }
    );
  }
}

// POST /api/mentoring-visits - Create new mentoring visit
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'សូមចូលប្រើប្រាស់ប្រព័ន្ធជាមុនសិន' }, { status: 401 });
    }

    if (!hasPermission(session.user.role, 'create')) {
      return NextResponse.json({ error: 'អ្នកមិនមានសិទ្ធិបង្កើតទស្សនកិច្ចណែនាំទេ' }, { status: 403 });
    }

    const body = await request.json();

    // Validate input
    const validatedData = mentoringVisitSchema.parse(body);

    // Auto-link to active test session for test data
    let testSessionId = null;
    const recordStatus = session.user.role === 'mentor' ? 'test_mentor' :
                        (session.user.role === 'teacher' && session.user.test_mode_enabled) ? 'test_teacher' :
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

    // Set mentor information
    const mentorData = {
      ...validatedData,
      mentor_id: parseInt(session.user.id),
      mentor_name: session.user.name || 'Unknown Mentor',
      is_temporary: session.user.role === 'mentor',
      expires_at: session.user.role === 'mentor' ? new Date(Date.now() + 48 * 60 * 60 * 1000) : null,
      record_status: recordStatus,
      test_session_id: testSessionId
    };

    // Verify pilot school exists
    if (validatedData.pilot_school_id) {
      const pilotSchool = await prisma.pilotSchool.findUnique({
        where: { id: validatedData.pilot_school_id }
      });
      
      if (!pilotSchool) {
        return NextResponse.json(
          { error: 'លេខសម្គាល់សាលាគំរូមិនត្រឹមត្រូវ' },
          { status: 400 }
        );
      }
    }

    // Verify teacher exists if provided
    if (validatedData.teacher_id) {
      const teacher = await prisma.user.findFirst({
        where: { 
          id: validatedData.teacher_id,
          role: 'teacher'
        }
      });
      
      if (!teacher) {
        return NextResponse.json(
          { error: 'លេខសម្គាល់គ្រូបង្រៀនមិនត្រឹមត្រូវ' },
          { status: 400 }
        );
      }
    }

    // Create mentoring visit
    const mentoringVisit = await prisma.mentoringVisit.create({
      data: mentorData,
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
        pilot_school: {
          select: {
            id: true,
            name: true,
            school_name: true,
            school_code: true
          }
        }
      }
    });

    return NextResponse.json({ 
      message: 'បានបង្កើតទស្សនកិច្ចណែនាំដោយជោគជ័យ',
      data: mentoringVisit 
    }, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'ទិន្នន័យមិនត្រឹមត្រូវ សូមពិនិត្យឡើងវិញ', details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Error creating mentoring visit:', error);
    return NextResponse.json(
      { error: 'មានបញ្ហាក្នុងការបង្កើតទស្សនកិច្ចណែនាំ សូមព្យាយាមម្តងទៀត' },
      { status: 500 }
    );
  }
}