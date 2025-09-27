import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Get overall statistics for coordinator
    const [
      totalSchools,
      totalTeachers,
      totalMentors,
      totalCoordinators,
      totalUsers
    ] = await Promise.all([
      prisma.pilotSchool.count(),
      prisma.user.count({ where: { role: 'teacher' } }),
      prisma.user.count({ where: { role: 'mentor' } }),
      prisma.user.count({ where: { role: 'coordinator' } }),
      prisma.user.count({
        where: {
          role: { in: ['teacher', 'mentor', 'coordinator'] }
        }
      })
    ]);

    // Get import statistics for this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const [
      schoolsThisMonth,
      usersThisMonth,
      schoolsToday,
      usersToday
    ] = await Promise.all([
      prisma.pilotSchool.count({
        where: {
          created_at: {
            gte: startOfMonth
          }
        }
      }),
      prisma.user.count({
        where: {
          role: { in: ['teacher', 'mentor'] },
          created_at: {
            gte: startOfMonth
          }
        }
      }),
      prisma.pilotSchool.count({
        where: {
          created_at: {
            gte: startOfToday
          }
        }
      }),
      prisma.user.count({
        where: {
          role: { in: ['teacher', 'mentor'] },
          created_at: {
            gte: startOfToday
          }
        }
      })
    ]);

    const response = {
      statistics: {
        total_schools: totalSchools,
        total_teachers: totalTeachers,
        total_mentors: totalMentors,
        total_coordinators: totalCoordinators,
        total_users: totalUsers,
        import_stats: {
          schools_this_month: schoolsThisMonth,
          users_this_month: usersThisMonth,
          schools_today: schoolsToday,
          users_today: usersToday
        },
        system_languages: {
          current: 'km',
          current_name: 'ភាសាខ្មែរ (Khmer)',
          available: {
            en: 'English',
            km: 'ភាសាខ្មែរ (Khmer)'
          }
        }
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching coordinator dashboard data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch coordinator dashboard data' },
      { status: 500 }
    );
  }
}