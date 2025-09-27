import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth');
  const isOnboardingPage = request.nextUrl.pathname.startsWith('/onboarding');
  const isProfileSetupPage = request.nextUrl.pathname.startsWith('/profile-setup');
  const isPublicPage = request.nextUrl.pathname === '/' || 
                       request.nextUrl.pathname.startsWith('/api/auth') ||
                       request.nextUrl.pathname.startsWith('/api/public') ||
                       request.nextUrl.pathname.startsWith('/api/pilot-schools');

  if (!token && !isAuthPage && !isPublicPage) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  if (token && isAuthPage) {
    // Check if user needs onboarding
    const needsProfileSetup = needsProfileSetupCheck(token);
    const shouldShowOnboarding = token.show_onboarding !== false && !hasCompletedOnboarding(token);
    
    if (needsProfileSetup) {
      return NextResponse.redirect(new URL('/profile-setup', request.url));
    } else if (shouldShowOnboarding) {
      return NextResponse.redirect(new URL('/onboarding', request.url));
    } else {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // If user is logged in, check onboarding status for protected pages
  if (token && !isOnboardingPage && !isProfileSetupPage && !isPublicPage) {
    const needsProfileSetup = needsProfileSetupCheck(token);
    const shouldShowOnboarding = token.show_onboarding !== false && !hasCompletedOnboarding(token);

    if (needsProfileSetup) {
      return NextResponse.redirect(new URL('/profile-setup', request.url));
    } else if (shouldShowOnboarding && request.nextUrl.pathname !== '/dashboard') {
      return NextResponse.redirect(new URL('/onboarding', request.url));
    }
  }

  // Role-based access control
  const adminPaths = ['/admin', '/users', '/settings'];
  const mentorPaths = ['/mentoring', '/pilot-schools'];
  const teacherPaths = ['/students', '/assessments', '/classes'];

  const path = request.nextUrl.pathname;
  const userRole = token?.role as string;

  if (adminPaths.some(p => path.startsWith(p)) && userRole !== 'admin') {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  if (mentorPaths.some(p => path.startsWith(p)) && !['admin', 'mentor'].includes(userRole)) {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  return NextResponse.next();
}

function needsProfileSetupCheck(token: any): boolean {
  // Check if profile setup is needed based on role
  if (token.role === 'teacher' || token.role === 'mentor') {
    return !token.pilot_school_id || !token.subject || !token.holding_classes;
  }
  return false;
}

function hasCompletedOnboarding(token: any): boolean {
  // Check if user has completed initial onboarding steps
  const onboardingCompleted = token.onboarding_completed;
  if (!onboardingCompleted) return false;
  
  try {
    const completed = typeof onboardingCompleted === 'string' 
      ? JSON.parse(onboardingCompleted) 
      : onboardingCompleted;
    
    // Check if user has completed at least one step for their role
    const roleBasedSteps = {
      'admin': ['setup_system'],
      'teacher': ['complete_profile'],
      'mentor': ['complete_profile'],
      'coordinator': ['system_overview'],
      'viewer': ['explore_dashboard']
    };
    
    const requiredSteps = roleBasedSteps[token.role as keyof typeof roleBasedSteps] || [];
    return requiredSteps.some(step => completed.includes && completed.includes(step));
  } catch (e) {
    return false;
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};