import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';


export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admin and coordinator can bulk update periods
    if (session.user.role !== 'admin' && session.user.role !== 'coordinator') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { school_ids, ...periodDates } = body;

    if (!school_ids || !Array.isArray(school_ids) || school_ids.length === 0) {
      return NextResponse.json(
        { error: 'school_ids array is required' },
        { status: 400 }
      );
    }

    // Update all schools that are not locked
    const result = await prisma.pilotSchool.updateMany({
      where: {
        id: { in: school_ids },
        is_locked: false,
      },
      data: {
        baseline_start_date: periodDates.baseline_start_date || null,
        baseline_end_date: periodDates.baseline_end_date || null,
        midline_start_date: periodDates.midline_start_date || null,
        midline_end_date: periodDates.midline_end_date || null,
        endline_start_date: periodDates.endline_start_date || null,
        endline_end_date: periodDates.endline_end_date || null,
      },
    });

    return NextResponse.json({
      message: `Updated ${result.count} schools successfully`,
      updated_count: result.count,
      success: true,
    });
  } catch (error) {
    console.error('Error bulk updating periods:', error);
    return NextResponse.json(
      {
        error: 'Failed to bulk update periods',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
