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
    const cycle = searchParams.get('cycle') || 'baseline';
    const student_id = searchParams.get('student_id');

    // Build where clause - only active students
    const where: any = {
      is_active: true
    };

    // Apply access restrictions based on user role
    if (session.user.role === 'mentor' || session.user.role === 'teacher') {
      if (session.user.pilot_school_id) {
        where.AND = where.AND || [];
        where.AND.push({ pilot_school_id: session.user.pilot_school_id });
      } else {
        // No access if no pilot school assigned
        where.AND = where.AND || [];
        where.AND.push({ id: -1 });
      }
    }

    // Filter by specific student if provided
    if (student_id) {
      where.AND = where.AND || [];
      where.AND.push({ id: parseInt(student_id) });
    }

    const students = await prisma.student.findMany({
      where,
      include: {
        pilot_school: {
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
          school_name: student.pilot_school?.school_name || student.pilot_school?.school_name || 'Unknown School'
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

  } catch (error) {
    console.error('Error fetching students for assessment:', error);
    return NextResponse.json(
      { error: 'Failed to fetch students' },
      { status: 500 }
    );
  }
}