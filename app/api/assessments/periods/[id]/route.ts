import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';


export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admin and coordinator can update periods
    if (session.user.role !== 'admin' && session.user.role !== 'coordinator') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const schoolId = parseInt(params.id);
    if (isNaN(schoolId)) {
      return NextResponse.json({ error: 'Invalid school ID' }, { status: 400 });
    }

    const body = await request.json();

    // Check if school is locked
    const school = await prisma.pilotSchool.findUnique({
      where: { id: schoolId },
      select: { is_locked: true },
    });

    if (school?.is_locked) {
      return NextResponse.json(
        { error: 'Cannot update locked school periods' },
        { status: 400 }
      );
    }

    // Helper function to convert date string to Date object
    const parseDate = (dateString: string | null | undefined): Date | null => {
      if (!dateString) return null;
      // Create Date object from YYYY-MM-DD string
      const date = new Date(dateString + 'T00:00:00.000Z');
      return isNaN(date.getTime()) ? null : date;
    };

    // Update the school periods
    await prisma.pilotSchool.update({
      where: { id: schoolId },
      data: {
        baseline_start_date: parseDate(body.baseline_start_date),
        baseline_end_date: parseDate(body.baseline_end_date),
        midline_start_date: parseDate(body.midline_start_date),
        midline_end_date: parseDate(body.midline_end_date),
        endline_start_date: parseDate(body.endline_start_date),
        endline_end_date: parseDate(body.endline_end_date),
      },
    });

    return NextResponse.json({
      message: 'Assessment periods updated successfully',
      success: true,
    });
  } catch (error) {
    console.error('Error updating assessment periods:', error);
    return NextResponse.json(
      {
        error: 'Failed to update assessment periods',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
