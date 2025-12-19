import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';


export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of day for consistent comparison

    // Count total schools
    const total_schools = await prisma.pilot_schools.count();

    // Count schools with active baseline period
    const baseline_active = await prisma.pilot_schools.count({
      where: {
        AND: [
          { baseline_start_date: { lte: today } },
          { baseline_end_date: { gte: today } },
        ],
      },
    });

    // Count schools with active midline period
    const midline_active = await prisma.pilot_schools.count({
      where: {
        AND: [
          { midline_start_date: { lte: today } },
          { midline_end_date: { gte: today } },
        ],
      },
    });

    // Count schools with active endline period
    const endline_active = await prisma.pilot_schools.count({
      where: {
        AND: [
          { endline_start_date: { lte: today } },
          { endline_end_date: { gte: today } },
        ],
      },
    });

    // Count locked schools
    const locked_schools = await prisma.pilot_schools.count({
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
