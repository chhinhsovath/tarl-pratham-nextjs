import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { schoolId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only coordinators and admins can access this endpoint
    if (session.user.role !== 'coordinator' && session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const assessmentType = searchParams.get('assessment_type'); // baseline, midline, endline

    if (!assessmentType) {
      return NextResponse.json({ error: 'assessment_type is required' }, { status: 400 });
    }

    const schoolId = parseInt(params.schoolId);
    if (isNaN(schoolId)) {
      return NextResponse.json({ error: 'Invalid school ID' }, { status: 400 });
    }

    // Fetch students who have completed the specified assessment type for this school
    const students = await prisma.students.findMany({
      where: {
        pilot_school_id: schoolId,
        is_active: true,
        assessments: {
          some: {
            assessment_type: assessmentType,
            record_status: { not: 'archived' }
          }
        }
      },
      select: {
        id: true,
        student_id: true,
        name: true,
        age: true,
        gender: true,
        grade: true,
        created_at: true,
        updated_at: true,
        assessments: {
          where: {
            assessment_type: assessmentType,
            record_status: { not: 'archived' }
          },
          select: {
            id: true,
            subject: true,
            level: true,
            assessed_date: true,
            assessment_sample: true,
            student_consent: true,
            users_assessments_added_by_idTousers: {
              select: {
                id: true,
                name: true,
                role: true
              }
            }
          }
        }
      },
      orderBy: { name: 'asc' }
    });

    return NextResponse.json({
      students,
      school_id: schoolId,
      assessment_type: assessmentType,
      count: students.length
    });

  } catch (error: any) {
    console.error('Error fetching students by assessment type:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch students',
        message: error?.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
}
