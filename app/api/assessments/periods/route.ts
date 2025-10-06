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

    // Get all pilot schools with their assessment periods
    const schools = await prisma.pilotSchool.findMany({
      select: {
        id: true,
        school_name: true,
        school_code: true,
        baseline_start_date: true,
        baseline_end_date: true,
        midline_start_date: true,
        midline_end_date: true,
        endline_start_date: true,
        endline_end_date: true,
        is_locked: true,
      },
      orderBy: {
        school_name: 'asc',
      },
    });

    const periods = schools.map(school => ({
      id: school.id,
      pilot_school_id: school.id,
      school_name: school.school_name,
      baseline_start_date: school.baseline_start_date,
      baseline_end_date: school.baseline_end_date,
      midline_start_date: school.midline_start_date,
      midline_end_date: school.midline_end_date,
      endline_start_date: school.endline_start_date,
      endline_end_date: school.endline_end_date,
      is_locked: school.is_locked || false,
    }));

    return NextResponse.json({ periods });
  } catch (error) {
    console.error('Error fetching assessment periods:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch assessment periods',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
