import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const school_id = searchParams.get('school_id');
    const province = searchParams.get('province');
    const district = searchParams.get('district');
    const cluster = searchParams.get('cluster');

    // Mock data matching Laravel dashboard exactly
    let stats = {
      total_students: 1247,
      total_assessments: 3457,
      total_schools: 48,
      total_mentoring_visits: 156
    };

    // Apply filters (mock filtering logic)
    if (school_id) {
      stats.total_students = 125;
      stats.total_assessments = 346;
      stats.total_schools = 1;
      stats.total_mentoring_visits = 15;
    } else if (cluster) {
      stats.total_students = 249;
      stats.total_assessments = 691;
      stats.total_schools = 5;
      stats.total_mentoring_visits = 31;
    } else if (district) {
      stats.total_students = 415;
      stats.total_assessments = 1152;
      stats.total_schools = 16;
      stats.total_mentoring_visits = 52;
    } else if (province) {
      stats.total_students = 623;
      stats.total_assessments = 1728;
      stats.total_schools = 24;
      stats.total_mentoring_visits = 78;
    }

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}