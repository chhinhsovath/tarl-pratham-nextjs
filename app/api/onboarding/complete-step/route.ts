import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { stepId } = body;

    if (!stepId) {
      return NextResponse.json({
        error: 'Missing required field: stepId'
      }, { status: 400 });
    }

    const userId = parseInt(session.user.id);

    // Get current user
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get current onboarding completed steps
    let completedSteps: string[] = [];

    if (user.onboarding_completed) {
      try {
        const parsed = typeof user.onboarding_completed === 'string'
          ? JSON.parse(user.onboarding_completed)
          : user.onboarding_completed;
        completedSteps = Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        console.error('Error parsing onboarding_completed:', e);
        completedSteps = [];
      }
    }

    // Add the new step if not already completed
    if (!completedSteps.includes(stepId)) {
      completedSteps.push(stepId);

      // Update user with new completed steps
      await prisma.user.update({
        where: { id: userId },
        data: {
          onboarding_completed: JSON.stringify(completedSteps),
          updated_at: new Date()
        }
      });

      console.log(`✅ Marked step '${stepId}' as completed for user ${userId}`);
    }

    return NextResponse.json({
      success: true,
      completedSteps,
      message: `Step '${stepId}' marked as completed`
    });

  } catch (error) {
    console.error('Error completing onboarding step:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
