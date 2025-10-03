/**
 * Activity Tracking Utility
 * Automatically tracks user activities for onboarding progress
 */

export type ActivityType =
  | 'student_add'
  | 'student_edit'
  | 'student_view'
  | 'assessment_add'
  | 'assessment_view'
  | 'report_view'
  | 'mentoring_add'
  | 'class_add';

/**
 * Track user activity for onboarding
 * Call this after successful user actions
 *
 * @param activityType - Type of activity performed
 * @returns Promise with tracking result and any newly completed steps
 */
export async function trackActivity(activityType: ActivityType): Promise<{
  success: boolean;
  newlyCompletedSteps?: string[];
  message?: string;
}> {
  try {
    const response = await fetch('/api/onboarding/track-activity', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ activityType }),
    });

    if (response.ok) {
      const data = await response.json();
      return {
        success: true,
        newlyCompletedSteps: data.newlyCompletedSteps || [],
        message: data.message,
      };
    }

    return { success: false };
  } catch (error) {
    console.error('Error tracking activity:', error);
    return { success: false };
  }
}

/**
 * Get current activity tracking status
 * Returns all tracked activities and step progress
 */
export async function getActivityStatus(): Promise<{
  activities: string[];
  completedSteps: string[];
  stepProgress: Record<string, {
    total: number;
    completed: number;
    completedActivities: string[];
    isComplete: boolean;
  }>;
} | null> {
  try {
    const response = await fetch('/api/onboarding/track-activity');

    if (response.ok) {
      return await response.json();
    }

    return null;
  } catch (error) {
    console.error('Error fetching activity status:', error);
    return null;
  }
}
