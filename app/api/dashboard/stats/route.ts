import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Simple counts matching Laravel exactly
    const [totalStudents, totalAssessments, totalSchools, totalMentoringVisits] = await Promise.all([
      prisma.student.count().catch(() => 0),
      prisma.assessments.count().catch(() => 0),
      prisma.pilotSchool.count().catch(() => 0),
      prisma.mentoringVisit.count().catch(() => 0)
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalStudents,
        totalAssessments,
        totalSchools,
        totalMentoringVisits
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);

    return NextResponse.json({
      error: 'Failed to fetch dashboard statistics',
      message: error instanceof Error ? error.message : 'Unknown error',
      details: 'Check database connection and table structure'
    }, { status: 500 });
  }
}