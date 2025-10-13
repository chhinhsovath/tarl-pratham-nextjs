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

    // Coordinators have admin-like access - NO restrictions
    // Filter to show only production data (exclude test records)
    const schoolFilter: any = {
      is_temporary: false,
      record_status: 'production'
    };
    const userFilter: any = {
      is_active: true
    };

    console.log(`[COORDINATOR STATS] User role: ${session.user.role} - Full access granted (production data only)`);

    const today = new Date();
    const todayStart = new Date(today.setHours(0, 0, 0, 0));
    const weekStart = new Date(today.setDate(today.getDate() - 7));
    const monthStart = new Date(today.setMonth(today.getMonth() - 1));

    // Fetch metrics in smaller batches to avoid connection pool exhaustion
    // Batch 1: Basic counts (5 queries)
    const [
      total_schools,
      total_students,
      active_students,
      total_teachers,
      active_teachers,
    ] = await Promise.all([
      prisma.pilotSchool.count(), // Both admin and coordinator see all schools
      prisma.student.count({ where: schoolFilter }),
      prisma.student.count({ where: { ...schoolFilter, is_active: true } }),
      prisma.user.count({ where: { ...userFilter, role: 'teacher' } }),
      prisma.user.count({ where: { ...userFilter, role: 'teacher', is_active: true } }),
    ]);

    // Batch 2: Assessments (5 queries)
    const [
      total_mentors,
      total_assessments,
      assessments_today,
      assessments_this_week,
      assessments_this_month,
    ] = await Promise.all([
      prisma.user.count({ where: { ...userFilter, role: 'mentor', is_active: true } }),
      prisma.assessment.count({ where: schoolFilter }),
      prisma.assessment.count({ where: { ...schoolFilter, created_at: { gte: todayStart } } }),
      prisma.assessment.count({ where: { ...schoolFilter, created_at: { gte: weekStart } } }),
      prisma.assessment.count({ where: { ...schoolFilter, created_at: { gte: monthStart } } }),
    ]);

    // Batch 3: Assessment types and distributions (6 queries)
    const [
      baseline_assessments,
      midline_assessments,
      endline_assessments,
      students_by_gender,
      students_by_grade,
      schools_by_province,
    ] = await Promise.all([
      prisma.assessment.count({ where: { ...schoolFilter, assessment_type: 'baseline' } }),
      prisma.assessment.count({ where: { ...schoolFilter, assessment_type: 'midline' } }),
      prisma.assessment.count({ where: { ...schoolFilter, assessment_type: 'endline' } }),
      prisma.student.groupBy({
        by: ['gender'],
        where: { is_active: true, is_temporary: false, record_status: 'production' },
        _count: { id: true }
      }),
      prisma.student.groupBy({
        by: ['grade'],
        where: { is_active: true, is_temporary: false, record_status: 'production' },
        _count: { id: true }
      }),
      prisma.pilotSchool.groupBy({ by: ['province'], _count: { id: true } }), // Both admin and coordinator see all provinces
    ]);

    // Batch 4: Assessment creator and subject breakdown
    const [
      assessments_by_mentor,
      assessments_by_teacher,
      language_assessments,
      math_assessments,
      pending_verifications,
    ] = await Promise.all([
      prisma.assessment.count({ where: { ...schoolFilter, assessed_by_mentor: true } }),
      prisma.assessment.count({ where: { ...schoolFilter, assessed_by_mentor: false } }),
      prisma.assessment.count({ where: { ...schoolFilter, subject: 'Language' } }),
      prisma.assessment.count({ where: { ...schoolFilter, subject: 'Math' } }),
      prisma.assessment.count({ where: { ...schoolFilter, verified_by_id: null } }),
    ]);

    // Format gender distribution
    const gender_distribution = {
      male: students_by_gender.find(g => g.gender === 'male')?._count.id || 0,
      female: students_by_gender.find(g => g.gender === 'female')?._count.id || 0,
    };

    // Format grade distribution and sort by grade
    const grade_distribution = students_by_grade
      .map(g => ({
        grade: g.grade || 0,
        count: g._count.id
      }))
      .sort((a, b) => a.grade - b.grade);

    // Format province distribution
    const province_distribution = schools_by_province.map(p => ({
      province: p.province || 'Unknown',
      schools: p._count.id
    }));

    // Return in format expected by coordinator page
    return NextResponse.json({
      // Top-level stats for dashboard cards
      total_schools: total_schools,
      total_teachers: total_teachers,
      total_mentors: total_mentors,
      total_students: total_students,
      total_assessments: total_assessments,
      pending_verifications: pending_verifications,
      recent_imports: 0, // TODO: Track bulk imports
      active_mentoring_visits: 0, // TODO: Track active mentoring visits
      languages_configured: 2, // EN/KH

      // Detailed breakdowns for charts/analytics
      schools: {
        total: total_schools,
        by_province: province_distribution,
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
        },
        by_creator: {
          mentor: assessments_by_mentor,
          teacher: assessments_by_teacher,
        },
        by_subject: {
          language: language_assessments,
          math: math_assessments,
        },
        pending_verification: pending_verifications,
      },
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
