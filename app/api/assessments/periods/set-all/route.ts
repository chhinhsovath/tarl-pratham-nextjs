import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * PUT /api/assessments/periods/set-all
 * Update ALL non-locked pilot schools with specific assessment periods
 * Only admin and coordinator can use this endpoint
 */
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admin and coordinator can update all periods
    if (session.user.role !== 'admin' && session.user.role !== 'coordinator') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const {
      baseline_start_date,
      baseline_end_date,
      midline_start_date,
      midline_end_date,
      endline_start_date,
      endline_end_date,
    } = body;

    // Validate that at least one period is provided
    if (!baseline_start_date && !midline_start_date && !endline_start_date) {
      return NextResponse.json(
        { error: 'At least one assessment period must be provided' },
        { status: 400 }
      );
    }

    // Convert date strings to Date objects for Prisma
    const convertToDate = (dateString: string | null | undefined): Date | null => {
      if (!dateString) return null;
      // Create Date object from YYYY-MM-DD string with explicit UTC time
      const date = new Date(dateString + 'T00:00:00.000Z');
      return isNaN(date.getTime()) ? null : date;
    };

    // Get count of schools before update
    const totalSchools = await prisma.pilotSchool.count();
    const lockedSchools = await prisma.pilotSchool.count({
      where: { is_locked: true }
    });

    // Update ALL non-locked pilot schools with the specified dates
    const result = await prisma.pilotSchool.updateMany({
      where: {
        is_locked: false, // Only update non-locked schools
      },
      data: {
        baseline_start_date: convertToDate(baseline_start_date),
        baseline_end_date: convertToDate(baseline_end_date),
        midline_start_date: convertToDate(midline_start_date),
        midline_end_date: convertToDate(midline_end_date),
        endline_start_date: convertToDate(endline_start_date),
        endline_end_date: convertToDate(endline_end_date),
      },
    });

    return NextResponse.json({
      message: `Successfully updated assessment periods for all schools`,
      total_schools: totalSchools,
      locked_schools: lockedSchools,
      updated_count: result.count,
      skipped_locked: lockedSchools,
      success: true,
      periods_set: {
        baseline: baseline_start_date && baseline_end_date ?
          `${baseline_start_date} to ${baseline_end_date}` : 'Not set',
        midline: midline_start_date && midline_end_date ?
          `${midline_start_date} to ${midline_end_date}` : 'Not set',
        endline: endline_start_date && endline_end_date ?
          `${endline_start_date} to ${endline_end_date}` : 'Not set',
      }
    });
  } catch (error) {
    console.error('Error setting periods for all schools:', error);
    return NextResponse.json(
      {
        error: 'Failed to set periods for all schools',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
