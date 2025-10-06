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

    // Only admin can lock/unlock periods
    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden - Admin only' }, { status: 403 });
    }

    const schoolId = parseInt(params.id);
    if (isNaN(schoolId)) {
      return NextResponse.json({ error: 'Invalid school ID' }, { status: 400 });
    }

    const { lock } = await request.json();

    await prisma.pilotSchool.update({
      where: { id: schoolId },
      data: { is_locked: lock },
    });

    return NextResponse.json({
      message: `School ${lock ? 'locked' : 'unlocked'} successfully`,
      success: true,
    });
  } catch (error) {
    console.error('Error toggling lock:', error);
    return NextResponse.json(
      {
        error: 'Failed to toggle lock status',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
