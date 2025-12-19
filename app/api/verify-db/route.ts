import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/verify-db
 * Verify database connection and return basic stats
 * Public endpoint for deployment verification
 */
export async function GET(request: NextRequest) {
  try {
    // Get basic statistics - Prisma connects automatically on first query
    const [userCount, schoolCount, studentCount, assessmentCount] = await Promise.all([
      prisma.user.count(),
      prisma.pilot_schools.count(),
      prisma.students.count(),
      prisma.assessments.count(),
    ]);

    // Get database info from environment
    const dbUrl = process.env.DATABASE_URL || '';
    const match = dbUrl.match(/@([^:]+):(\d+)\/([^?]+)/);
    const host = match ? match[1] : 'unknown';
    const database = match ? match[3] : 'unknown';

    // Get sample school to verify data access
    const sampleSchool = await prisma.pilot_schools.findFirst({
      select: {
        id: true,
        school_name: true,
        province: true,
      },
    });

    return NextResponse.json({
      status: 'connected',
      timestamp: new Date().toISOString(),
      database: {
        host,
        name: database,
        connection: 'successful',
      },
      stats: {
        users: userCount,
        schools: schoolCount,
        students: studentCount,
        assessments: assessmentCount,
      },
      sample: sampleSchool || null,
      message: '✅ Database connection successful!',
    });
  } catch (error) {
    console.error('Database verification error:', error);
    
    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: 'Failed to connect to database',
        message: error instanceof Error ? error.message : 'Unknown error',
        details: {
          DATABASE_URL: process.env.DATABASE_URL ? 'Set' : 'Not set',
          POSTGRES_HOST: process.env.POSTGRES_HOST || 'Not set',
          POSTGRES_DATABASE: process.env.POSTGRES_DATABASE || 'Not set',
        },
      },
      { status: 500 }
    );
  }
}
