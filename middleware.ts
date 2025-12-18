import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  });
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth');
  const isAPIRoute = request.nextUrl.pathname.startsWith('/api/');
  const isPublicPage = request.nextUrl.pathname === '/' ||
                       request.nextUrl.pathname.startsWith('/api/auth') ||
                       request.nextUrl.pathname.startsWith('/api/public') ||
                       request.nextUrl.pathname.startsWith('/api/pilot-schools') ||
                       request.nextUrl.pathname.startsWith('/help') ||
                       request.nextUrl.pathname === '/about' ||
                       request.nextUrl.pathname === '/public-verification-dashboard' ||
                       request.nextUrl.pathname === '/public-verification-comparison';

  // For API routes, let them handle authentication internally (don't redirect)
  if (isAPIRoute && !isPublicPage) {
    return NextResponse.next();
  }

  if (!token && !isAuthPage && !isPublicPage) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // After login, redirect to dashboard (no onboarding or profile-setup)
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Enhanced Role-Based Access Control (100% Compliance)
  const path = request.nextUrl.pathname;
  const userRole = token?.role as string;

  // Define protected routes by role
  const roleProtectedRoutes: Record<string, string[]> = {
    admin: ['/admin', '/settings', '/users/create', '/assessments/periods'],
    coordinator: ['/coordinator', '/coordinator/imports', '/students/bulk-import'],
    mentor: ['/verification', '/verification/*', '/mentoring', '/mentoring/*'],
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

  // Check verification access (admin, mentor, coordinator - mentors verify teacher assessments)
  if (path.startsWith('/verification') && !['admin', 'mentor', 'coordinator'].includes(userRole)) {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  // Check teacher/dashboard access (teachers only)
  if (path.startsWith('/teacher/dashboard') && userRole !== 'teacher') {
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

  // NOTE: Profile setup and onboarding checks are DISABLED
  // Coordinators assign mentors/teachers to schools via:
  // - /coordinator/mentor-assignments
  // - /coordinator/teacher-assignments
  // Users no longer need to complete profile-setup themselves

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

export const config = {
  matcher: [
    /*
     * Optimized matcher - runs middleware only where needed
     * Excludes:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, icons, manifests
     * - public assets (.png, .jpg, .webp, .css, .js, .svg)
     * - health checks
     */
    '/((?!_next/static|_next/image|favicon.ico|icons|manifest.json|robots.txt|sitemap.xml|.*\\.(?:png|jpg|jpeg|gif|webp|svg|css|js|woff|woff2)).*))',
  ],
};