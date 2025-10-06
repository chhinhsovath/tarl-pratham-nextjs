import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// const prisma = new PrismaClient(); // REMOVED: Use shared singleton from @/lib/prisma

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
    const school = await prisma.pilot_schools.findUnique({
      where: { id: schoolId },
      select: { is_locked: true },
    });

    if (school?.is_locked) {
      return NextResponse.json(
        { error: 'Cannot update locked school periods' },
        { status: 400 }
      );
    }

    // Update the school periods
    await prisma.pilot_schools.update({
      where: { id: schoolId },
      data: {
        baseline_start_date: body.baseline_start_date || null,
        baseline_end_date: body.baseline_end_date || null,
        midline_start_date: body.midline_start_date || null,
        midline_end_date: body.midline_end_date || null,
        endline_start_date: body.endline_start_date || null,
        endline_end_date: body.endline_end_date || null,
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
