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

    // Only admin, coordinator, and mentor can verify assessments
    if (!['admin', 'coordinator', 'mentor'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const assessmentId = parseInt(params.id);
    if (isNaN(assessmentId)) {
      return NextResponse.json({ error: 'Invalid assessment ID' }, { status: 400 });
    }

    const body = await request.json();
    const { verification_status, verification_notes, verified_by } = body;

    if (!verification_status || !['verified', 'rejected'].includes(verification_status)) {
      return NextResponse.json(
        { error: 'verification_status must be "verified" or "rejected"' },
        { status: 400 }
      );
    }

    // Check if assessment is locked
    const assessment = await prisma.assessments.findUnique({
      where: { id: assessmentId },
      select: { is_locked: true },
    });

    if (assessment?.is_locked) {
      return NextResponse.json(
        { error: 'Cannot verify locked assessment' },
        { status: 400 }
      );
    }

    // Update the assessment
    await prisma.assessments.update({
      where: { id: assessmentId },
      data: {
        record_status: verification_status,
        verification_notes: verification_notes || null,
        verified_by_id: verified_by ? parseInt(verified_by) : null,
        verified_at: new Date(),
      },
    });

    return NextResponse.json({
      message: `Assessment ${verification_status} successfully`,
      success: true,
    });
  } catch (error) {
    console.error('Error verifying assessment:', error);
    return NextResponse.json(
      {
        error: 'Failed to verify assessment',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
