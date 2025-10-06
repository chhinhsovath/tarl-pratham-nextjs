import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all pilot schools with comprehensive data
    const schools = await prisma.pilot_schools.findMany({
      select: {
        id: true,
        school_name: true,
        school_code: true,
      },
    });

    const schoolOverviewData = await Promise.all(
      schools.map(async (school) => {
        // Count total students
        const totalStudents = await prisma.students.count({
          where: {
            pilot_school_id: school.id,
            is_active: true,
          },
        });

        // Count baseline assessments
        const baselineCount = await prisma.assessments.count({
          where: {
            pilot_school_id: school.id,
            assessment_type: 'baseline',
          },
        });

        // Count midline assessments
        const midlineCount = await prisma.assessments.count({
          where: {
            pilot_school_id: school.id,
            assessment_type: 'midline',
          },
        });

        // Count endline assessments
        const endlineCount = await prisma.assessments.count({
          where: {
            pilot_school_id: school.id,
            assessment_type: 'endline',
          },
        });

        // Count total assessments
        const totalAssessments = await prisma.assessments.count({
          where: {
            pilot_school_id: school.id,
          },
        });

        // Count verified assessments
        const verifiedCount = await prisma.assessments.count({
          where: {
            pilot_school_id: school.id,
            record_status: 'verified',
          },
        });

        // Count mentoring visits
        const mentoringVisits = await prisma.mentoring_visits.count({
          where: {
            pilot_school_id: school.id,
          },
        });

        // Check if school has a mentor assigned
        const mentor = await prisma.users.findFirst({
          where: {
            pilot_school_id: school.id,
            role: 'mentor',
            is_active: true,
          },
          select: {
            name: true,
          },
        });

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
          has_mentor: !!mentor,
          mentor_name: mentor?.name || null,
        };
      })
    );

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
