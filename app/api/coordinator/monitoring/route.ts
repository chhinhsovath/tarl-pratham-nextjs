import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';


export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admin and coordinator can access monitoring
    if (session.user.role !== 'admin' && session.user.role !== 'coordinator') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Create clean Date objects without mutation
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);

    const weekAgo = new Date(now);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekStart = new Date(weekAgo.getFullYear(), weekAgo.getMonth(), weekAgo.getDate(), 0, 0, 0, 0);

    // For DateTime field comparison in Prisma
    const todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);

    // Fetch all metrics in parallel
    const [
      total_users,
      active_users,
      total_schools,
      total_students,
      total_assessments,
      assessments_today,
      assessments_this_week,
      pending_verifications,
      baseline_active,
      midline_active,
      endline_active,
      recent_activities_raw,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { is_active: true } }),
      prisma.pilotSchool.count(),
      prisma.student.count({ where: { is_active: true } }),
      prisma.assessment.count(),
      prisma.assessment.count({
        where: {
          created_at: { gte: todayStart },
        },
      }),
      prisma.assessment.count({
        where: {
          created_at: { gte: weekStart },
        },
      }),
      prisma.assessment.count({
        where: {
          verified_at: null,
          record_status: 'production',
        },
      }),
      prisma.pilotSchool.count({
        where: {
          baseline_start_date: { not: null },
          baseline_end_date: { not: null },
          AND: [
            { baseline_start_date: { lte: todayDate.toISOString() } },
            { baseline_end_date: { gte: todayDate.toISOString() } },
          ],
        },
      }),
      prisma.pilotSchool.count({
        where: {
          midline_start_date: { not: null },
          midline_end_date: { not: null },
          AND: [
            { midline_start_date: { lte: todayDate.toISOString() } },
            { midline_end_date: { gte: todayDate.toISOString() } },
          ],
        },
      }),
      prisma.pilotSchool.count({
        where: {
          endline_start_date: { not: null },
          endline_end_date: { not: null },
          AND: [
            { endline_start_date: { lte: todayDate.toISOString() } },
            { endline_end_date: { gte: todayDate.toISOString() } },
          ],
        },
      }),
      prisma.assessment.findMany({
        take: 20,
        orderBy: { created_at: 'desc' },
        include: {
          added_by: {
            select: { name: true },
          },
          student: {
            select: { name: true },
          },
        },
      }),
    ]);

    // Format recent activities
    const recent_activities = recent_activities_raw.map((assessment) => ({
      id: assessment.id,
      type: 'assessment',
      description: `New ${assessment.assessment_type} assessment for ${assessment.student?.name}`,
      user_name: assessment.added_by?.name || 'Unknown',
      created_at: assessment.created_at.toISOString(),
    }));

    // Calculate system stats (mock values - would need actual implementation)
    const system_stats = {
      database_size: '2.5 GB',
      uptime: '15 days',
      last_backup: '2 hours ago',
    };

    return NextResponse.json({
      total_users,
      active_users,
      total_schools,
      total_students,
      total_assessments,
      assessments_today,
      assessments_this_week,
      pending_verifications,
      active_periods: {
        baseline: baseline_active,
        midline: midline_active,
        endline: endline_active,
      },
      recent_activities,
      system_stats,
    });
  } catch (error) {
    console.error('Error fetching system health:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch system health',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
