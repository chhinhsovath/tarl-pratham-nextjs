import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getMentorSchoolIds } from '@/lib/mentorAssignments';


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

    // Filter by verification status
    if (status === 'pending') {
      // Pending = not yet verified (verified_by_id is null)
      where.verified_by_id = null;
    } else if (status === 'verified') {
      // Verified = has verified_by_id
      where.verified_by_id = { not: null };
      // Optionally filter out rejected ones if there's a rejection indicator
    } else if (status === 'rejected') {
      // For rejected, we might need a separate field or use verification_notes
      // For now, treat as verified but with specific notes pattern
      where.verified_by_id = { not: null };
      // You might want to add a separate is_rejected boolean field in the future
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
      // Mentors can see assessments from ALL their assigned schools
      const mentorSchoolIds = await getMentorSchoolIds(parseInt(session.user.id));
      if (mentorSchoolIds.length > 0) {
        where.pilot_school_id = { in: mentorSchoolIds };
        console.log(`[VERIFICATION] Mentor ID: ${session.user.id}, accessing schools: ${mentorSchoolIds.join(', ')}`);
      } else {
        // No schools assigned to this mentor - return no assessments
        where.id = -1;
        console.log(`[VERIFICATION] Mentor ID: ${session.user.id}, no schools assigned`);
      }
    } else if (session.user.role === 'teacher') {
      where.added_by_id = parseInt(session.user.id);
    }

    // Check if this is for export (get all records)
    const isExport = searchParams.get('export') === 'true';
    
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
        verified_by: {
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
      // Only apply limit for regular viewing, not for export
      ...(isExport ? {} : { take: 100 }),
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
