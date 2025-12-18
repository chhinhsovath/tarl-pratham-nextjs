import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';


export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admin and coordinator can lock/unlock assessments
    if (session.user.role !== 'admin' && session.user.role !== 'coordinator') {
      return NextResponse.json({ error: 'Forbidden - Admin or Coordinator only' }, { status: 403 });
    }

    const assessmentId = parseInt(params.id);
    if (isNaN(assessmentId)) {
      return NextResponse.json({ error: 'Invalid assessment ID' }, { status: 400 });
    }

    const { lock, locked_by } = await request.json();

    await prisma.assessments.update({
      where: { id: assessmentId },
      data: {
        is_locked: lock,
        locked_by_id: lock && locked_by ? parseInt(locked_by) : null,
        locked_at: lock ? new Date() : null,
      },
    });

    return NextResponse.json({
      message: `Assessment ${lock ? 'locked' : 'unlocked'} successfully`,
      success: true,
    });
  } catch (error) {
    console.error('Error locking assessment:', error);
    return NextResponse.json(
      {
        error: 'Failed to lock assessment',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
