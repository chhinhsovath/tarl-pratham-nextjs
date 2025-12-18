import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Get basic overview statistics for viewer
    const [
      totalStudents,
      totalSchools,
      totalAssessments
    ] = await Promise.all([
      prisma.student.count(),
      prisma.pilotSchool.count(),
      prisma.assessments.count()
    ]);

    const response = {
      statistics: {
        overview: {
          total_students: totalStudents,
          total_schools: totalSchools,
          total_assessments: totalAssessments
        }
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching viewer dashboard data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch viewer dashboard data' },
      { status: 500 }
    );
  }
}