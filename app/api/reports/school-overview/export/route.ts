import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import * as XLSX from 'xlsx';
import PDFDocument from 'pdfkit';

// Column headers localization
const HEADERS = {
  km: {
    school_code: 'លេខកូដសាលា',
    school_name: 'ឈ្មោះសាលា',
    total_students: 'សិស្សសរុប',
    baseline_assessments: 'ការវាយតម្លៃដំបូង',
    baseline_percent: 'ដំបូង %',
    midline_assessments: 'ការវាយតម្លៃកណ្តាល',
    midline_percent: 'កណ្តាល %',
    endline_assessments: 'ការវាយតម្លៃចុងក្រោយ',
    endline_percent: 'ចុងក្រោយ %',
    total_assessments: 'ការវាយតម្លៃសរុប',
    verified_assessments: 'ការវាយតម្លៃដែលបានផ្ទៀងផ្ទាត់',
    mentoring_visits: 'ការទស្សនាណែនាំ',
    has_mentor: 'មានអ្នកណែនាំ',
    mentor_name: 'ឈ្មោះអ្នកណែនាំ',
    yes: 'មាន',
    no: 'គ្មាន'
  },
  en: {
    school_code: 'School Code',
    school_name: 'School Name',
    total_students: 'Total Students',
    baseline_assessments: 'Baseline Assessments',
    baseline_percent: 'Baseline %',
    midline_assessments: 'Midline Assessments',
    midline_percent: 'Midline %',
    endline_assessments: 'Endline Assessments',
    endline_percent: 'Endline %',
    total_assessments: 'Total Assessments',
    verified_assessments: 'Verified Assessments',
    mentoring_visits: 'Mentoring Visits',
    has_mentor: 'Has Mentor',
    mentor_name: 'Mentor Name',
    yes: 'Yes',
    no: 'No'
  }
};

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'excel'; // 'excel' or 'pdf'
    const lang = searchParams.get('lang') || 'km'; // 'km' or 'en'
    const headers = HEADERS[lang as 'km' | 'en'];

    // OPTIMIZED: Fetch schools with all related data in efficient batches
    const schools = await prisma.pilotSchool.findMany({
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
    const studentCounts = await prisma.student.groupBy({
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
    const mentoringVisitCounts = await prisma.mentoringVisit.groupBy({
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
        [headers.school_code]: school.school_code,
        [headers.school_name]: school.school_name,
        [headers.total_students]: totalStudents,
        [headers.baseline_assessments]: baselineCount,
        [headers.baseline_percent]: totalStudents > 0 ? `${Math.round((baselineCount / totalStudents) * 100)}%` : '0%',
        [headers.midline_assessments]: midlineCount,
        [headers.midline_percent]: totalStudents > 0 ? `${Math.round((midlineCount / totalStudents) * 100)}%` : '0%',
        [headers.endline_assessments]: endlineCount,
        [headers.endline_percent]: totalStudents > 0 ? `${Math.round((endlineCount / totalStudents) * 100)}%` : '0%',
        [headers.total_assessments]: totalAssessments,
        [headers.verified_assessments]: verifiedCount,
        [headers.mentoring_visits]: mentoringVisits,
        [headers.has_mentor]: mentorName ? headers.yes : headers.no,
        [headers.mentor_name]: mentorName || '-',
      };
    });

    if (format === 'pdf') {
      // PDF Export
      const doc = new PDFDocument({ margin: 50 });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));

      return new Promise((resolve) => {
        doc.on('end', () => {
          const pdfBuffer = Buffer.concat(chunks);
          resolve(new NextResponse(pdfBuffer, {
            headers: {
              'Content-Disposition': `attachment; filename="school-overview-${new Date().toISOString().split('T')[0]}.pdf"`,
              'Content-Type': 'application/pdf',
            },
          }));
        });

        // PDF Title
        doc.fontSize(16).text(lang === 'km' ? 'របាយការណ៍សង្ខេបសាលារៀន' : 'School Overview Report', { align: 'center' });
        doc.moveDown();
        doc.fontSize(10).text(`${lang === 'km' ? 'កាលបរិច្ឆេទ' : 'Date'}: ${new Date().toLocaleDateString()}`, { align: 'center' });
        doc.moveDown(2);

        // Table Header
        doc.fontSize(8);
        const startY = doc.y;
        const rowHeight = 20;
        const colWidths = [60, 120, 50, 50, 40, 50, 40, 50, 40, 50, 50];

        // Header row
        let currentX = 50;
        Object.values(headers).slice(0, 11).forEach((header, i) => {
          doc.text(String(header), currentX, startY, { width: colWidths[i], align: 'left' });
          currentX += colWidths[i];
        });

        doc.moveDown();

        // Table Rows
        schoolOverviewData.forEach((row, index) => {
          const y = doc.y;
          if (y > 700) {
            doc.addPage();
            doc.y = 50;
          }

          currentX = 50;
          const values = Object.values(row).slice(0, 11);
          values.forEach((value, i) => {
            doc.text(String(value), currentX, doc.y, { width: colWidths[i], align: 'left' });
            currentX += colWidths[i];
          });

          doc.moveDown(0.5);
        });

        doc.end();
      });
    } else {
      // Excel Export (default)
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

      XLSX.utils.book_append_sheet(wb, ws, lang === 'km' ? 'សង្ខេបសាលារៀន' : 'School Overview');

      // Generate buffer
      const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

      // Return file
      return new NextResponse(buf, {
        headers: {
          'Content-Disposition': `attachment; filename="school-overview-${new Date().toISOString().split('T')[0]}.xlsx"`,
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        },
      });
    }
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
