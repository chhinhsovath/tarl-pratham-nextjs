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

    // Build base where clause for role-based filtering
    const baseWhere: any = {};

    if (session.user.role === 'mentor') {
      // Mentors can see stats from ALL their assigned schools
      const mentorSchoolIds = await getMentorSchoolIds(parseInt(session.user.id));
      if (mentorSchoolIds.length > 0) {
        baseWhere.pilot_school_id = { in: mentorSchoolIds };
      } else {
        // No schools assigned - return zero stats
        baseWhere.id = -1;
      }
    } else if (session.user.role === 'teacher') {
      baseWhere.added_by_id = parseInt(session.user.id);
    }

    // Count pending assessments (use OR to include null - Prisma doesn't allow null in enum 'in' arrays)
    const pending = await prisma.assessment.count({
      where: {
        ...baseWhere,
        OR: [
          { record_status: { in: ['draft', 'submitted'] } },
          { record_status: null }
        ],
      },
    });

    // Count verified assessments
    const verified = await prisma.assessment.count({
      where: {
        ...baseWhere,
        record_status: 'verified',
      },
    });

    // Count rejected assessments
    const rejected = await prisma.assessment.count({
      where: {
        ...baseWhere,
        record_status: 'rejected',
      },
    });

    // Count locked assessments
    const locked = await prisma.assessment.count({
      where: {
        ...baseWhere,
        is_locked: true,
      },
    });

    return NextResponse.json({
      pending,
      verified,
      rejected,
      locked,
    });
  } catch (error) {
    console.error('Error fetching verification stats:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch stats',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
