import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * Activity Tracking API
 * Tracks user actions and auto-completes onboarding steps when all sub-tasks done
 *
 * Activity types:
 * - student_add: Added a student
 * - student_edit: Edited a student
 * - student_view: Viewed student list
 * - assessment_add: Created an assessment
 * - assessment_view: Viewed assessment list
 * - report_view: Viewed reports
 * - mentoring_add: Created mentoring visit
 * - class_add: Created a class
 */

// Map activities to onboarding steps
const ACTIVITY_TO_STEP_MAP: Record<string, { stepId: string; requiredActivities: string[] }> = {
  // Step 2: Student Management (Teacher/Mentor)
  test_student_management: {
    stepId: 'test_student_management',
    requiredActivities: ['student_add', 'student_edit', 'student_view']
  },
  add_students: {
    stepId: 'add_students',
    requiredActivities: ['student_add', 'student_edit', 'student_view']
  },

  // Step 3: Assessment (Teacher/Mentor)
  test_assessments: {
    stepId: 'test_assessments',
    requiredActivities: ['assessment_add', 'assessment_view']
  },
  conduct_baseline: {
    stepId: 'conduct_baseline',
    requiredActivities: ['assessment_add', 'assessment_view']
  },

  // Step 4: Progress Tracking/Mentoring (Teacher/Mentor)
  track_progress: {
    stepId: 'track_progress',
    requiredActivities: ['report_view']
  },
  plan_visits: {
    stepId: 'plan_visits',
    requiredActivities: ['mentoring_add']
  }
};

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { activityType } = body;

    if (!activityType) {
      return NextResponse.json({ error: 'Activity type required' }, { status: 400 });
    }

    const userId = parseInt(session.user.id);

    // Get user's current onboarding data
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        onboarding_completed: true,
        onboarding_activities: true,
        role: true
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Parse existing activities
    let activities: string[] = [];
    if (user.onboarding_activities) {
      try {
        activities = typeof user.onboarding_activities === 'string'
          ? JSON.parse(user.onboarding_activities)
          : user.onboarding_activities;
      } catch (e) {
        activities = [];
      }
    }

    // Add new activity if not already tracked
    if (!activities.includes(activityType)) {
      activities.push(activityType);

      // Update user's activities
      await prisma.user.update({
        where: { id: userId },
        data: {
          onboarding_activities: JSON.stringify(activities),
          updated_at: new Date()
        }
      });
    }

    // Check if any step should be auto-completed
    const completedSteps: string[] = user.onboarding_completed
      ? (typeof user.onboarding_completed === 'string'
          ? JSON.parse(user.onboarding_completed)
          : user.onboarding_completed)
      : [];

    let newlyCompletedSteps: string[] = [];

    // Check each step's requirements
    for (const [stepKey, stepConfig] of Object.entries(ACTIVITY_TO_STEP_MAP)) {
      const { stepId, requiredActivities } = stepConfig;

      // Skip if already completed
      if (completedSteps.includes(stepId)) {
        continue;
      }

      // Check if all required activities are done
      const allActivitiesDone = requiredActivities.every(activity =>
        activities.includes(activity)
      );

      if (allActivitiesDone) {
        completedSteps.push(stepId);
        newlyCompletedSteps.push(stepId);
      }
    }

    // Update completed steps if any new ones
    if (newlyCompletedSteps.length > 0) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          onboarding_completed: JSON.stringify(completedSteps),
          updated_at: new Date()
        }
      });
    }

    return NextResponse.json({
      success: true,
      activityTracked: activityType,
      totalActivities: activities.length,
      activities,
      completedSteps,
      newlyCompletedSteps,
      message: newlyCompletedSteps.length > 0
        ? `🎉 អបអរសាទរ! អ្នកបានបញ្ចប់ជំហានថ្មី ${newlyCompletedSteps.length} ជំហាន`
        : 'សកម្មភាពត្រូវបានកត់ត្រា'
    });

  } catch (error) {
    console.error('Error tracking activity:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET: Retrieve user's activity tracking status
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = parseInt(session.user.id);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        onboarding_completed: true,
        onboarding_activities: true,
        role: true
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Parse activities
    let activities: string[] = [];
    if (user.onboarding_activities) {
      try {
        activities = typeof user.onboarding_activities === 'string'
          ? JSON.parse(user.onboarding_activities)
          : user.onboarding_activities;
      } catch (e) {
        activities = [];
      }
    }

    // Parse completed steps
    let completedSteps: string[] = [];
    if (user.onboarding_completed) {
      try {
        completedSteps = typeof user.onboarding_completed === 'string'
          ? JSON.parse(user.onboarding_completed)
          : user.onboarding_completed;
      } catch (e) {
        completedSteps = [];
      }
    }

    // Calculate sub-task progress for each step
    const stepProgress: Record<string, {
      total: number;
      completed: number;
      completedActivities: string[];
      isComplete: boolean;
    }> = {};

    for (const [stepKey, stepConfig] of Object.entries(ACTIVITY_TO_STEP_MAP)) {
      const { stepId, requiredActivities } = stepConfig;

      const completedActivities = requiredActivities.filter(activity =>
        activities.includes(activity)
      );

      stepProgress[stepId] = {
        total: requiredActivities.length,
        completed: completedActivities.length,
        completedActivities,
        isComplete: completedSteps.includes(stepId)
      };
    }

    return NextResponse.json({
      activities,
      completedSteps,
      stepProgress,
      role: user.role
    });

  } catch (error) {
    console.error('Error fetching activity tracking:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
