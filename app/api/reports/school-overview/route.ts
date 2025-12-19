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

    // Build where clause based on user role
    const where: any = {};

    // Coordinators have admin-like access - see all schools (no filter)
    console.log(`[SCHOOL OVERVIEW] User role: ${session.user.role} - Full access granted`);

    // OPTIMIZED: Fetch schools with all related data in efficient batches
    const schools = await prisma.pilot_schools.findMany({
      where,
      select: {
        id: true,
        school_name: true,
        school_code: true,
      },
      orderBy: { school_name: 'asc' }
    });

    // Get all school IDs
    const schoolIds = schools.map(s => s.id);

    // BATCH 1: Student counts per school (1 query instead of N queries)
    const studentCounts = await prisma.students.groupBy({
      by: ['pilot_school_id'],
      where: { pilot_school_id: { in: schoolIds }, is_active: true },
      _count: { id: true }
    });

    // BATCH 2: Assessment counts by school and type (1 query instead of N*4 queries)
    const assessmentsByType = await prisma.assessments.groupBy({
      by: ['pilot_school_id', 'assessment_type'],
      where: { pilot_school_id: { in: schoolIds } },
      _count: { id: true }
    });

    // BATCH 3: Total assessments per school (1 query)
    const totalAssessmentCounts = await prisma.assessments.groupBy({
      by: ['pilot_school_id'],
      where: { pilot_school_id: { in: schoolIds } },
      _count: { id: true }
    });

    // BATCH 4: Verified assessments per school (1 query)
    const verifiedCounts = await prisma.assessments.groupBy({
      by: ['pilot_school_id'],
      where: { pilot_school_id: { in: schoolIds }, verified_by_id: { not: null } },
      _count: { id: true }
    });

    // BATCH 5: Mentoring visits per school (1 query)
    const mentoringVisitCounts = await prisma.mentoring_visits.groupBy({
      by: ['pilot_school_id'],
      where: { pilot_school_id: { in: schoolIds } },
      _count: { id: true }
    });

    // BATCH 6: Mentors per school (1 query)
    const mentors = await prisma.user.findMany({
      where: {
        pilot_school_id: { in: schoolIds },
        role: 'mentor',
        is_active: true
      },
      select: {
        pilot_school_id: true,
        name: true
      }
    });

    // Build lookup maps for O(1) access
    const studentCountMap = new Map(studentCounts.map(s => [s.pilot_school_id, s._count.id]));
    const totalAssessmentMap = new Map(totalAssessmentCounts.map(a => [a.pilot_school_id, a._count.id]));
    const verifiedMap = new Map(verifiedCounts.map(v => [v.pilot_school_id, v._count.id]));
    const mentoringVisitMap = new Map(mentoringVisitCounts.map(m => [m.pilot_school_id, m._count.id]));
    const mentorMap = new Map(mentors.map(m => [m.pilot_school_id, m.name]));

    // Build assessment type maps
    const baselineMap = new Map<number, number>();
    const midlineMap = new Map<number, number>();
    const endlineMap = new Map<number, number>();

    assessmentsByType.forEach(a => {
      if (a.assessment_type === 'baseline') baselineMap.set(a.pilot_school_id, a._count.id);
      if (a.assessment_type === 'midline') midlineMap.set(a.pilot_school_id, a._count.id);
      if (a.assessment_type === 'endline') endlineMap.set(a.pilot_school_id, a._count.id);
    });

    // Transform data using lookups (no DB queries)
    const schoolOverviewData = schools.map((school) => {
      const totalStudents = studentCountMap.get(school.id) || 0;
      const baselineCount = baselineMap.get(school.id) || 0;
      const midlineCount = midlineMap.get(school.id) || 0;
      const endlineCount = endlineMap.get(school.id) || 0;
      const totalAssessments = totalAssessmentMap.get(school.id) || 0;
      const verifiedCount = verifiedMap.get(school.id) || 0;
      const mentoringVisits = mentoringVisitMap.get(school.id) || 0;
      const mentorName = mentorMap.get(school.id);

      return {
        school_id: school.id,
        school_name: school.school_name,
        school_code: school.school_code,
        total_students: totalStudents,
        baseline_count: baselineCount,
        midline_count: midlineCount,
        endline_count: endlineCount,
        total_assessments: totalAssessments,
        verified_count: verifiedCount,
        mentoring_visits: mentoringVisits,
        has_mentor: !!mentorName,
        mentor_name: mentorName || null,
      };
    });

    // Calculate summary statistics
    const summary = {
      total_schools: schools.length,
      total_students: schoolOverviewData.reduce((sum, s) => sum + s.total_students, 0),
      schools_with_baseline: schoolOverviewData.filter(s => s.baseline_count > 0).length,
      schools_with_midline: schoolOverviewData.filter(s => s.midline_count > 0).length,
      schools_with_endline: schoolOverviewData.filter(s => s.endline_count > 0).length,
      schools_with_verification: schoolOverviewData.filter(s => s.verified_count > 0).length,
      schools_with_mentoring: schoolOverviewData.filter(s => s.mentoring_visits > 0).length,
      total_assessments: schoolOverviewData.reduce((sum, s) => sum + s.total_assessments, 0),
    };

    return NextResponse.json({
      schools: schoolOverviewData,
      summary,
    });
  } catch (error) {
    console.error('Error fetching school overview:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch school overview',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
