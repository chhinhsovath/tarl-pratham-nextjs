import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import * as XLSX from 'xlsx';

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
        const totalStudents = await prisma.students.count({
          where: { pilot_school_id: school.id, is_active: true },
        });

        const baselineCount = await prisma.assessments.count({
          where: { pilot_school_id: school.id, assessment_type: 'baseline' },
        });

        const midlineCount = await prisma.assessments.count({
          where: { pilot_school_id: school.id, assessment_type: 'midline' },
        });

        const endlineCount = await prisma.assessments.count({
          where: { pilot_school_id: school.id, assessment_type: 'endline' },
        });

        const totalAssessments = await prisma.assessments.count({
          where: { pilot_school_id: school.id },
        });

        const verifiedCount = await prisma.assessments.count({
          where: { pilot_school_id: school.id, record_status: 'verified' },
        });

        const mentoringVisits = await prisma.mentoring_visits.count({
          where: { pilot_school_id: school.id },
        });

        const mentor = await prisma.users.findFirst({
          where: {
            pilot_school_id: school.id,
            role: 'mentor',
            is_active: true,
          },
          select: { name: true },
        });

        return {
          'School Code': school.school_code,
          'School Name': school.school_name,
          'Total Students': totalStudents,
          'Baseline Assessments': baselineCount,
          'Baseline %': totalStudents > 0 ? `${Math.round((baselineCount / totalStudents) * 100)}%` : '0%',
          'Midline Assessments': midlineCount,
          'Midline %': totalStudents > 0 ? `${Math.round((midlineCount / totalStudents) * 100)}%` : '0%',
          'Endline Assessments': endlineCount,
          'Endline %': totalStudents > 0 ? `${Math.round((endlineCount / totalStudents) * 100)}%` : '0%',
          'Total Assessments': totalAssessments,
          'Verified Assessments': verifiedCount,
          'Mentoring Visits': mentoringVisits,
          'Has Mentor': mentor ? 'Yes' : 'No',
          'Mentor Name': mentor?.name || '-',
        };
      })
    );

    // Create workbook
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(schoolOverviewData);

    // Set column widths
    ws['!cols'] = [
      { wch: 15 }, // School Code
      { wch: 30 }, // School Name
      { wch: 15 }, // Total Students
      { wch: 20 }, // Baseline Assessments
      { wch: 12 }, // Baseline %
      { wch: 20 }, // Midline Assessments
      { wch: 12 }, // Midline %
      { wch: 20 }, // Endline Assessments
      { wch: 12 }, // Endline %
      { wch: 18 }, // Total Assessments
      { wch: 20 }, // Verified Assessments
      { wch: 16 }, // Mentoring Visits
      { wch: 12 }, // Has Mentor
      { wch: 25 }, // Mentor Name
    ];

    XLSX.utils.book_append_sheet(wb, ws, 'School Overview');

    // Generate buffer
    const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    // Return file
    return new NextResponse(buf, {
      headers: {
        'Content-Disposition': `attachment; filename="school-overview-${new Date().toISOString().split('T')[0]}.xlsx"`,
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
    });
  } catch (error) {
    console.error('Error exporting school overview:', error);
    return NextResponse.json(
      {
        error: 'Failed to export school overview',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
