import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Build base where clause for role-based filtering
    const baseWhere: any = {};

    if (session.user.role === 'mentor') {
      baseWhere.pilot_school_id = session.user.pilot_school_id;
    } else if (session.user.role === 'teacher') {
      baseWhere.added_by_id = parseInt(session.user.id);
    }

    // Count pending assessments
    const pending = await prisma.assessments.count({
      where: {
        ...baseWhere,
        record_status: { in: ['draft', 'submitted', null] },
      },
    });

    // Count verified assessments
    const verified = await prisma.assessments.count({
      where: {
        ...baseWhere,
        record_status: 'verified',
      },
    });

    // Count rejected assessments
    const rejected = await prisma.assessments.count({
      where: {
        ...baseWhere,
        record_status: 'rejected',
      },
    });

    // Count locked assessments
    const locked = await prisma.assessments.count({
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
