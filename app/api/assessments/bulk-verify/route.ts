import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// const prisma = new PrismaClient(); // REMOVED: Use shared singleton from @/lib/prisma

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admin, coordinator, and mentor can verify assessments
    if (!['admin', 'coordinator', 'mentor'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { assessment_ids, verification_status, verified_by } = body;

    if (!assessment_ids || !Array.isArray(assessment_ids) || assessment_ids.length === 0) {
      return NextResponse.json(
        { error: 'assessment_ids array is required' },
        { status: 400 }
      );
    }

    if (!verification_status || !['verified', 'rejected'].includes(verification_status)) {
      return NextResponse.json(
        { error: 'verification_status must be "verified" or "rejected"' },
        { status: 400 }
      );
    }

    // Update all assessments that are not locked
    const result = await prisma.assessments.updateMany({
      where: {
        id: { in: assessment_ids },
        is_locked: false,
      },
      data: {
        record_status: verification_status,
        verified_by_id: verified_by ? parseInt(verified_by) : null,
        verified_at: new Date(),
      },
    });

    return NextResponse.json({
      message: `${result.count} assessments ${verification_status} successfully`,
      updated_count: result.count,
      success: true,
    });
  } catch (error) {
    console.error('Error bulk verifying assessments:', error);
    return NextResponse.json(
      {
        error: 'Failed to bulk verify assessments',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
