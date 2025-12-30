import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const subject = searchParams.get('subject') || 'khmer';
    // Accept both 'cycle' and 'period' parameters for backward compatibility
    const cycle = searchParams.get('cycle') || searchParams.get('period') || 'baseline';
    const student_id = searchParams.get('student_id');
    const school_id = searchParams.get('school_id');

    console.log('📋 [API] Fetching students for assessment:', {
      user_id: session.user.id,
      role: session.user.role,
      pilot_school_id: session.user.pilot_school_id,
      requested_school_id: school_id,
      subject,
      cycle,
      student_id
    });

    // Build where clause - only active students
    const where: any = {
      is_active: true
    };

    // Apply access restrictions based on user role
    if (session.user.role === 'mentor' || session.user.role === 'teacher') {
      if (session.user.pilot_school_id) {
        where.AND = where.AND || [];
        where.AND.push({ pilot_school_id: session.user.pilot_school_id });

        // Validate that requested school_id matches user's school (if provided)
        if (school_id && parseInt(school_id) !== session.user.pilot_school_id) {
          console.warn(`Teacher ${session.user.id} requested school ${school_id} but only has access to school ${session.user.pilot_school_id}`);
        }
      } else {
        // No access if no pilot school assigned
        console.warn(`Teacher/Mentor ${session.user.id} has no pilot_school_id assigned`);
        where.AND = where.AND || [];
        where.AND.push({ id: -1 }); // Return no students
      }
    } else if (school_id) {
      // Admin/Coordinator can filter by specific school
      where.AND = where.AND || [];
      where.AND.push({ pilot_school_id: parseInt(school_id) });
    }

    // Filter by specific student if provided
    if (student_id) {
      where.AND = where.AND || [];
      where.AND.push({ id: parseInt(student_id) });
    }

    console.log('🔍 [API] Query WHERE clause:', JSON.stringify(where, null, 2));

    const students = await prisma.students.findMany({
      where,
      include: {
        pilot_schools: {
          select: {
            id: true,
            name: true,
            school_name: true
          }
        },
        assessments: {
          where: {
            subject,
            assessment_type: cycle
          },
          select: {
            id: true,
            level: true,
            score: true,
            assessed_date: true,
            is_temporary: true
          }
        }
      },
      orderBy: [
        { name: 'asc' }
      ]
    });

    console.log(`✅ [API] Found ${students.length} students`);

    // Transform the data to match what the frontend expects
    const studentsWithAssessments = students.map(student => {
      const hasAssessment = student.assessments.length > 0;
      const assessment = hasAssessment ? student.assessments[0] : null;

      return {
        id: student.id,
        name: student.name,
        class: student.class || student.grade || 1,
        age: student.age || 7,
        gender: student.gender || 'male',
        pilot_school_id: student.pilot_school_id,
        pilotSchool: {
          school_name: student.pilot_schools?.school_name || student.pilot_schools?.school_name || 'Unknown School'
        },
        has_assessment: hasAssessment,
        assessment_level: assessment?.level || null,
        previous_assessment: null, // Could be enhanced to show previous cycle data
        is_assessment_locked: false, // Could be enhanced based on assessment periods
        is_temporary: student.is_temporary
      };
    });

    // Check assessment period status (simplified)
    const periodStatus = 'active'; // This could be enhanced to check actual periods

    return NextResponse.json({
      students: studentsWithAssessments,
      periodStatus
    });

  } catch (error: any) {
    console.error('❌ [API] Error fetching students for assessment:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      code: error.code
    });
    return NextResponse.json(
      {
        error: 'Failed to fetch students',
        message: error.message,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { student_ids } = body;

    if (!student_ids || !Array.isArray(student_ids) || student_ids.length === 0) {
      return NextResponse.json({ error: 'student_ids array is required' }, { status: 400 });
    }

    // Fetch all assessments for these students
    const assessments = await prisma.assessments.findMany({
      where: {
        student_id: { in: student_ids }
      },
      select: {
        id: true,
        student_id: true,
        subject: true,
        assessment_type: true,
        level: true,
        assessed_date: true
      }
    });

    return NextResponse.json(assessments);

  } catch (error: any) {
    console.error('❌ [API] Error in POST /api/assessments/students:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch assessments',
        message: error.message
      },
      { status: 500 }
    );
  }
}