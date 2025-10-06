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

    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    // Count total schools
    const total_schools = await prisma.pilotSchool.count();

    // Count schools with active baseline period
    const baseline_active = await prisma.pilotSchool.count({
      where: {
        AND: [
          { baseline_start_date: { lte: todayStr } },
          { baseline_end_date: { gte: todayStr } },
        ],
      },
    });

    // Count schools with active midline period
    const midline_active = await prisma.pilotSchool.count({
      where: {
        AND: [
          { midline_start_date: { lte: todayStr } },
          { midline_end_date: { gte: todayStr } },
        ],
      },
    });

    // Count schools with active endline period
    const endline_active = await prisma.pilotSchool.count({
      where: {
        AND: [
          { endline_start_date: { lte: todayStr } },
          { endline_end_date: { gte: todayStr } },
        ],
      },
    });

    // Count locked schools
    const locked_schools = await prisma.pilotSchool.count({
      where: { is_locked: true },
    });

    return NextResponse.json({
      total_schools,
      baseline_active,
      midline_active,
      endline_active,
      locked_schools,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch stats',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
