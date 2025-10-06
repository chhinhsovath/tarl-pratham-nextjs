import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// const prisma = new PrismaClient(); // REMOVED: Use shared singleton from @/lib/prisma

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'pending';
    const assessment_type = searchParams.get('assessment_type');
    const subject = searchParams.get('subject');
    const school_id = searchParams.get('school_id');
    const date_from = searchParams.get('date_from');
    const date_to = searchParams.get('date_to');

    // Build where clause
    const where: any = {};

    // Filter by record status
    if (status === 'pending') {
      where.record_status = { in: ['draft', 'submitted', null] };
    } else if (status === 'verified') {
      where.record_status = 'verified';
    } else if (status === 'rejected') {
      where.record_status = 'rejected';
    }

    // Apply filters
    if (assessment_type) where.assessment_type = assessment_type;
    if (subject) where.subject = subject;
    if (school_id) where.pilot_school_id = parseInt(school_id);

    if (date_from && date_to) {
      where.assessed_date = {
        gte: new Date(date_from),
        lte: new Date(date_to),
      };
    }

    // Role-based filtering
    if (session.user.role === 'mentor') {
      where.pilot_school_id = session.user.pilot_school_id;
    } else if (session.user.role === 'teacher') {
      where.added_by_id = parseInt(session.user.id);
    }

    const assessments = await prisma.assessment.findMany({
      where,
      include: {
        student: {
          select: {
            id: true,
            name: true,
            student_id: true,
            age: true,
            gender: true,
          },
        },
        added_by: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
        pilot_school: {
          select: {
            id: true,
            school_name: true,
            school_code: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
      take: 100,
    });

    return NextResponse.json({ assessments });
  } catch (error) {
    console.error('Error fetching assessments for verification:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch assessments',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
