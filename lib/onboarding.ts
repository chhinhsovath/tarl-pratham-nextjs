// Onboarding step completion helper
export async function markOnboardingStepComplete(stepId: string) {
  try {
    const response = await fetch('/api/onboarding/complete-step', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ stepId }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log(`✅ Auto-marked onboarding step '${stepId}' as complete`);
      return data;
    }
  } catch (error) {
    console.error('Error auto-marking onboarding step:', error);
  }
  return null;
}

// Check if user should auto-complete step based on page visit
export function shouldAutoCompleteStep(
  pathname: string,
  userRole: string
): string | null {
  // Only auto-complete for teacher and mentor roles
  if (!['teacher', 'mentor'].includes(userRole)) {
    return null;
  }

  // Mapping of pages to onboarding steps
  const pageToStepMap: Record<string, string> = {
    '/students': userRole === 'mentor' ? 'test_student_management' : 'add_students',
    '/assessments': userRole === 'mentor' ? 'test_assessments' : 'conduct_baseline',
    '/mentoring': userRole === 'mentor' ? 'plan_visits' : null,
    '/reports': userRole === 'teacher' ? 'track_progress' : null,
  };

  // Check if current path matches any auto-complete page
  for (const [page, stepId] of Object.entries(pageToStepMap)) {
    if (pathname.startsWith(page) && stepId) {
      return stepId;
    }
  }

  return null;
}
