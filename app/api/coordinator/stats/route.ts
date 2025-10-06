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

    // Only admin and coordinator can access stats
    if (session.user.role !== 'admin' && session.user.role !== 'coordinator') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const today = new Date();
    const todayStart = new Date(today.setHours(0, 0, 0, 0));
    const weekStart = new Date(today.setDate(today.getDate() - 7));
    const monthStart = new Date(today.setMonth(today.getMonth() - 1));

    // Fetch all metrics in parallel for performance
    const [
      total_schools,
      total_students,
      active_students,
      total_teachers,
      active_teachers,
      total_mentors,
      total_assessments,
      assessments_today,
      assessments_this_week,
      assessments_this_month,
      baseline_assessments,
      midline_assessments,
      endline_assessments,
      students_by_gender,
      students_by_grade,
      schools_by_province,
    ] = await Promise.all([
      // Schools
      prisma.pilotSchool.count(),

      // Students
      prisma.student.count(),
      prisma.student.count({ where: { is_active: true } }),

      // Teachers
      prisma.user.count({ where: { role: 'teacher' } }),
      prisma.user.count({ where: { role: 'teacher', is_active: true } }),

      // Mentors
      prisma.user.count({ where: { role: 'mentor', is_active: true } }),

      // Assessments
      prisma.assessment.count(),
      prisma.assessment.count({
        where: { created_at: { gte: todayStart } }
      }),
      prisma.assessment.count({
        where: { created_at: { gte: weekStart } }
      }),
      prisma.assessment.count({
        where: { created_at: { gte: monthStart } }
      }),

      // Assessment types
      prisma.assessment.count({
        where: { assessment_type: 'baseline' }
      }),
      prisma.assessment.count({
        where: { assessment_type: 'midline' }
      }),
      prisma.assessment.count({
        where: { assessment_type: 'endline' }
      }),

      // Students by gender
      prisma.student.groupBy({
        by: ['gender'],
        where: { is_active: true },
        _count: { id: true }
      }),

      // Students by grade
      prisma.student.groupBy({
        by: ['grade'],
        where: { is_active: true },
        _count: { id: true },
        orderBy: { grade: 'asc' }
      }),

      // Schools by province
      prisma.pilotSchool.groupBy({
        by: ['province'],
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } }
      }),
    ]);

    // Format gender distribution
    const gender_distribution = {
      male: students_by_gender.find(g => g.gender === 'male')?._count.id || 0,
      female: students_by_gender.find(g => g.gender === 'female')?._count.id || 0,
    };

    // Format grade distribution
    const grade_distribution = students_by_grade.map(g => ({
      grade: g.grade || 0,
      count: g._count.id
    }));

    // Format province distribution
    const province_distribution = schools_by_province.map(p => ({
      province: p.province || 'Unknown',
      schools: p._count.id
    }));

    return NextResponse.json({
      schools: {
        total: total_schools,
      },
      students: {
        total: total_students,
        active: active_students,
        by_gender: gender_distribution,
        by_grade: grade_distribution,
      },
      teachers: {
        total: total_teachers,
        active: active_teachers,
      },
      mentors: {
        total: total_mentors,
      },
      assessments: {
        total: total_assessments,
        today: assessments_today,
        this_week: assessments_this_week,
        this_month: assessments_this_month,
        by_type: {
          baseline: baseline_assessments,
          midline: midline_assessments,
          endline: endline_assessments,
        }
      },
      provinces: province_distribution,
    });
  } catch (error) {
    console.error('Error fetching coordinator stats:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch coordinator stats',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
