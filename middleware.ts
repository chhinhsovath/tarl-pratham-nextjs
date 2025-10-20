import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  });
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth');
  const isOnboardingPage = request.nextUrl.pathname.startsWith('/onboarding');
  const isProfileSetupPage = request.nextUrl.pathname.startsWith('/profile-setup');
  const isBypassPage = request.nextUrl.pathname.startsWith('/bypass');
  const isAPIRoute = request.nextUrl.pathname.startsWith('/api/');
  const isPublicPage = request.nextUrl.pathname === '/' || 
                       request.nextUrl.pathname.startsWith('/api/auth') ||
                       request.nextUrl.pathname.startsWith('/api/public') ||
                       request.nextUrl.pathname.startsWith('/api/pilot-schools') ||
                       request.nextUrl.pathname.startsWith('/help') ||
                       request.nextUrl.pathname === '/about';

  // For API routes, let them handle authentication internally (don't redirect)
  if (isAPIRoute && !isPublicPage) {
    return NextResponse.next();
  }

  if (!token && !isAuthPage && !isPublicPage) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  if (token && isAuthPage) {
    // DISABLED: Profile setup and onboarding checks
    // Coordinators handle all user assignments, so users go directly to dashboard
    // const needsProfileSetup = needsProfileSetupCheck(token);
    // const shouldShowOnboarding = token.show_onboarding !== false && !hasCompletedOnboarding(token);
    //
    // if (needsProfileSetup) {
    //   return NextResponse.redirect(new URL('/profile-setup', request.url));
    // } else if (shouldShowOnboarding) {
    //   return NextResponse.redirect(new URL('/onboarding', request.url));
    // }

    // After login, go directly to dashboard
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // TEMPORARILY DISABLED - Skip all onboarding and profile setup checks
  // if (token && !isOnboardingPage && !isProfileSetupPage && !isPublicPage && !isBypassPage) {
  //   const needsProfileSetup = needsProfileSetupCheck(token);
  //   const shouldShowOnboarding = token.show_onboarding !== false && !hasCompletedOnboarding(token);
  //   if (needsProfileSetup) {
  //     return NextResponse.redirect(new URL('/profile-setup', request.url));
  //   } else if (shouldShowOnboarding && request.nextUrl.pathname !== '/dashboard') {
  //     return NextResponse.redirect(new URL('/onboarding', request.url));
  //   }
  // }

  // Enhanced Role-Based Access Control (100% Compliance)
  const path = request.nextUrl.pathname;
  const userRole = token?.role as string;

  // Define protected routes by role
  const roleProtectedRoutes: Record<string, string[]> = {
    admin: ['/admin', '/settings', '/users/create', '/assessments/periods'],
    coordinator: ['/coordinator', '/coordinator/imports', '/students/bulk-import'],
    mentor: ['/verification', '/assessments/verify'],
    teacher: ['/teacher/dashboard'],
  };

  // Check admin-only routes (with coordinator exceptions)
  if (path.startsWith('/admin') || path === '/settings') {
    // Allow coordinators to access test-data management
    if (path.startsWith('/admin/test-data') && userRole === 'coordinator') {
      // Coordinator allowed
    } else if (userRole !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  // Check coordinator routes (admin can also access)
  if (path.startsWith('/coordinator') && !['admin', 'coordinator'].includes(userRole)) {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  // Check user management (admin and coordinator only)
  if ((path.startsWith('/users') && path !== '/users/me') &&
      !['admin', 'coordinator'].includes(userRole)) {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  // Check verification access (admin, coordinator, and mentor)
  if (path.startsWith('/verification') && !['admin', 'coordinator', 'mentor'].includes(userRole)) {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  // Check school management (admin and coordinator only)
  if (path.startsWith('/schools') && !['admin', 'coordinator'].includes(userRole)) {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  // Check bulk import (admin and coordinator only)
  if (path.includes('/bulk-import') && !['admin', 'coordinator'].includes(userRole)) {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  // DISABLED: Profile setup check (coordinators handle all user assignments)
  // Coordinators set up profiles for mentors and teachers, so no need for self-service profile-setup
  // if (['mentor', 'teacher', 'viewer'].includes(userRole)) {
  //   const pilotSchoolId = token.pilot_school_id;
  //   const subject = token.subject;
  //   const holdingClasses = token.holding_classes;
  //   const schoolRequiredPaths = ['/students', '/assessments', '/mentoring'];
  //   const needsSchool = schoolRequiredPaths.some(p => path.startsWith(p));
  //   const allowedPaths = ['/profile-setup', '/onboarding', '/dashboard', '/help', '/reports', '/profile'];
  //   const isAllowedPath = allowedPaths.some(p => path.startsWith(p));
  //
  //   let hasCompleteProfile = false;
  //   if (userRole === 'teacher') {
  //     hasCompleteProfile = Boolean(pilotSchoolId && subject && holdingClasses);
  //   } else if (userRole === 'mentor') {
  //     hasCompleteProfile = Boolean(pilotSchoolId && subject);
  //   } else if (userRole === 'viewer') {
  //     hasCompleteProfile = Boolean(pilotSchoolId);
  //   }
  //
  //   if (needsSchool && !hasCompleteProfile && !isAllowedPath) {
  //     return NextResponse.redirect(new URL('/profile-setup', request.url));
  //   }
  // }

  // Add security headers to response
  const response = NextResponse.next();
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Add role header for debugging in development
  if (process.env.NODE_ENV === 'development' && userRole) {
    response.headers.set('X-User-Role', userRole);
  }

  return response;
}

function needsProfileSetupCheck(token: any): boolean {
  // TEMPORARILY DISABLED - Always return false to bypass profile setup
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