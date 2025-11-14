import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import * as XLSX from 'xlsx';

const prisma = new PrismaClient();

/**
 * Students Statistics Export API
 * Exports comprehensive student statistics with multiple sheets
 * GET /api/students/statistics-export
 * Only accessible by admin, coordinator, and super_admin
 */
export async function GET(request: NextRequest) {
  try {
    // Authentication check
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please login first.' },
        { status: 401 }
      );
    }

    // Authorization check - only admin, coordinator, super_admin
    const userRole = (session.user as any).role;
    if (!['admin', 'coordinator', 'super_admin'].includes(userRole)) {
      return NextResponse.json(
        { error: 'Access denied. Only admin, coordinator, and super_admin can export statistics.' },
        { status: 403 }
      );
    }

    console.log(`[Statistics Export] Starting export by ${session.user.email} (${userRole})`);

    // Create workbook
    const workbook = XLSX.utils.book_new();

    // ============================================
    // SHEET 1: SUMMARY STATISTICS
    // ============================================
    console.log('[Statistics Export] Generating summary statistics...');

    const summaryStats = await prisma.$queryRaw<any[]>`
      SELECT
        COUNT(*) as total_students,
        COUNT(*) FILTER (WHERE is_active = true) as active_students,
        COUNT(*) FILTER (WHERE is_active = false) as inactive_students,
        COUNT(*) FILTER (WHERE record_status = 'production') as production_students,
        COUNT(*) FILTER (WHERE record_status = 'test_teacher') as test_teacher_students,
        COUNT(*) FILTER (WHERE record_status = 'test_mentor') as test_mentor_students,
        COUNT(*) FILTER (WHERE record_status = 'demo') as demo_students,
        COUNT(*) FILTER (WHERE is_temporary = true) as temporary_students
      FROM students
    `;

    const summary = summaryStats[0];
    const summaryData = [
      ['Metric', 'Count', 'Percentage'],
      ['Total Students', Number(summary.total_students), '100%'],
      ['Active Students', Number(summary.active_students), `${((Number(summary.active_students) / Number(summary.total_students)) * 100).toFixed(1)}%`],
      ['Inactive Students', Number(summary.inactive_students), `${((Number(summary.inactive_students) / Number(summary.total_students)) * 100).toFixed(1)}%`],
      ['Production Students', Number(summary.production_students), `${((Number(summary.production_students) / Number(summary.total_students)) * 100).toFixed(1)}%`],
      ['Test Teacher Students', Number(summary.test_teacher_students), `${((Number(summary.test_teacher_students) / Number(summary.total_students)) * 100).toFixed(1)}%`],
      ['Test Mentor Students', Number(summary.test_mentor_students), `${((Number(summary.test_mentor_students) / Number(summary.total_students)) * 100).toFixed(1)}%`],
      ['Demo Students', Number(summary.demo_students), `${((Number(summary.demo_students) / Number(summary.total_students)) * 100).toFixed(1)}%`],
      ['Temporary Students', Number(summary.temporary_students), `${((Number(summary.temporary_students) / Number(summary.total_students)) * 100).toFixed(1)}%`],
    ];

    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    summarySheet['!cols'] = [{ wch: 30 }, { wch: 15 }, { wch: 15 }];
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary Statistics');

    // ============================================
    // SHEET 2: GENDER DISTRIBUTION
    // ============================================
    console.log('[Statistics Export] Generating gender distribution...');

    const genderStats = await prisma.$queryRaw<any[]>`
      SELECT
        gender,
        COUNT(*) as count,
        ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 1) as percentage
      FROM students
      WHERE is_active = true
      GROUP BY gender
      ORDER BY count DESC
    `;

    const genderData = [
      ['Gender', 'Count', 'Percentage'],
      ...genderStats.map(row => [
        row.gender || 'Not Specified',
        Number(row.count),
        `${Number(row.percentage)}%`
      ])
    ];

    const genderSheet = XLSX.utils.aoa_to_sheet(genderData);
    genderSheet['!cols'] = [{ wch: 20 }, { wch: 15 }, { wch: 15 }];
    XLSX.utils.book_append_sheet(workbook, genderSheet, 'Gender Distribution');

    // ============================================
    // SHEET 3: GRADE DISTRIBUTION
    // ============================================
    console.log('[Statistics Export] Generating grade distribution...');

    const gradeStats = await prisma.$queryRaw<any[]>`
      SELECT
        grade,
        COUNT(*) as count,
        ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 1) as percentage
      FROM students
      WHERE is_active = true AND grade IS NOT NULL
      GROUP BY grade
      ORDER BY grade
    `;

    const gradeData = [
      ['Grade', 'Count', 'Percentage'],
      ...gradeStats.map(row => [
        `Grade ${row.grade}`,
        Number(row.count),
        `${Number(row.percentage)}%`
      ])
    ];

    const gradeSheet = XLSX.utils.aoa_to_sheet(gradeData);
    gradeSheet['!cols'] = [{ wch: 20 }, { wch: 15 }, { wch: 15 }];
    XLSX.utils.book_append_sheet(workbook, gradeSheet, 'Grade Distribution');

    // ============================================
    // SHEET 4: SCHOOL DISTRIBUTION
    // ============================================
    console.log('[Statistics Export] Generating school distribution...');

    const schoolStats = await prisma.$queryRaw<any[]>`
      SELECT
        ps.school_name,
        ps.school_code,
        ps.province,
        ps.district,
        ps.cluster,
        COUNT(s.id) as student_count,
        COUNT(s.id) FILTER (WHERE s.gender = 'male' OR s.gender = 'ប្រុស') as male_count,
        COUNT(s.id) FILTER (WHERE s.gender = 'female' OR s.gender = 'ស្រី') as female_count,
        COUNT(s.id) FILTER (WHERE s.grade = 4) as grade_4_count,
        COUNT(s.id) FILTER (WHERE s.grade = 5) as grade_5_count
      FROM students s
      LEFT JOIN pilot_schools ps ON s.pilot_school_id = ps.id
      WHERE s.is_active = true
      GROUP BY ps.school_name, ps.school_code, ps.province, ps.district, ps.cluster
      ORDER BY student_count DESC
    `;

    const schoolData = [
      ['School Name', 'School Code', 'Province', 'District', 'Cluster', 'Total Students', 'Male', 'Female', 'Grade 4', 'Grade 5'],
      ...schoolStats.map(row => [
        row.school_name || 'Not Assigned',
        row.school_code || '',
        row.province || '',
        row.district || '',
        row.cluster || '',
        Number(row.student_count),
        Number(row.male_count),
        Number(row.female_count),
        Number(row.grade_4_count),
        Number(row.grade_5_count)
      ])
    ];

    const schoolSheet = XLSX.utils.aoa_to_sheet(schoolData);
    schoolSheet['!cols'] = [
      { wch: 35 }, // School Name
      { wch: 15 }, // School Code
      { wch: 15 }, // Province
      { wch: 15 }, // District
      { wch: 15 }, // Cluster
      { wch: 15 }, // Total
      { wch: 10 }, // Male
      { wch: 10 }, // Female
      { wch: 10 }, // Grade 4
      { wch: 10 }  // Grade 5
    ];
    XLSX.utils.book_append_sheet(workbook, schoolSheet, 'Schools Distribution');

    // ============================================
    // SHEET 5: PROVINCE SUMMARY
    // ============================================
    console.log('[Statistics Export] Generating province summary...');

    const provinceStats = await prisma.$queryRaw<any[]>`
      SELECT
        ps.province,
        COUNT(DISTINCT ps.id) as school_count,
        COUNT(s.id) as student_count,
        COUNT(s.id) FILTER (WHERE s.gender = 'male' OR s.gender = 'ប្រុស') as male_count,
        COUNT(s.id) FILTER (WHERE s.gender = 'female' OR s.gender = 'ស្រី') as female_count
      FROM students s
      LEFT JOIN pilot_schools ps ON s.pilot_school_id = ps.id
      WHERE s.is_active = true
      GROUP BY ps.province
      ORDER BY student_count DESC
    `;

    const provinceData = [
      ['Province', 'Schools', 'Total Students', 'Male', 'Female', 'Male %', 'Female %'],
      ...provinceStats.map(row => {
        const total = Number(row.student_count);
        const male = Number(row.male_count);
        const female = Number(row.female_count);
        return [
          row.province || 'Not Assigned',
          Number(row.school_count),
          total,
          male,
          female,
          `${((male / total) * 100).toFixed(1)}%`,
          `${((female / total) * 100).toFixed(1)}%`
        ];
      })
    ];

    const provinceSheet = XLSX.utils.aoa_to_sheet(provinceData);
    provinceSheet['!cols'] = [
      { wch: 20 }, // Province
      { wch: 12 }, // Schools
      { wch: 15 }, // Total
      { wch: 10 }, // Male
      { wch: 10 }, // Female
      { wch: 10 }, // Male %
      { wch: 10 }  // Female %
    ];
    XLSX.utils.book_append_sheet(workbook, provinceSheet, 'Province Summary');

    // ============================================
    // SHEET 6: ASSESSMENT LEVELS OVERVIEW
    // ============================================
    console.log('[Statistics Export] Generating assessment levels overview...');

    const assessmentStats = await prisma.$queryRaw<any[]>`
      SELECT
        'Baseline Khmer' as assessment_type,
        baseline_khmer_level as level,
        COUNT(*) as count
      FROM students
      WHERE is_active = true AND baseline_khmer_level IS NOT NULL
      GROUP BY baseline_khmer_level

      UNION ALL

      SELECT
        'Baseline Math' as assessment_type,
        baseline_math_level as level,
        COUNT(*) as count
      FROM students
      WHERE is_active = true AND baseline_math_level IS NOT NULL
      GROUP BY baseline_math_level

      UNION ALL

      SELECT
        'Midline Khmer' as assessment_type,
        midline_khmer_level as level,
        COUNT(*) as count
      FROM students
      WHERE is_active = true AND midline_khmer_level IS NOT NULL
      GROUP BY midline_khmer_level

      UNION ALL

      SELECT
        'Midline Math' as assessment_type,
        midline_math_level as level,
        COUNT(*) as count
      FROM students
      WHERE is_active = true AND midline_math_level IS NOT NULL
      GROUP BY midline_math_level

      UNION ALL

      SELECT
        'Endline Khmer' as assessment_type,
        endline_khmer_level as level,
        COUNT(*) as count
      FROM students
      WHERE is_active = true AND endline_khmer_level IS NOT NULL
      GROUP BY endline_khmer_level

      UNION ALL

      SELECT
        'Endline Math' as assessment_type,
        endline_math_level as level,
        COUNT(*) as count
      FROM students
      WHERE is_active = true AND endline_math_level IS NOT NULL
      GROUP BY endline_math_level

      ORDER BY assessment_type, count DESC
    `;

    const assessmentData = [
      ['Assessment Type', 'Level', 'Student Count'],
      ...assessmentStats.map(row => [
        row.assessment_type,
        row.level,
        Number(row.count)
      ])
    ];

    const assessmentSheet = XLSX.utils.aoa_to_sheet(assessmentData);
    assessmentSheet['!cols'] = [{ wch: 20 }, { wch: 30 }, { wch: 15 }];
    XLSX.utils.book_append_sheet(workbook, assessmentSheet, 'Assessment Levels');

    // ============================================
    // SHEET 7: DETAILED STUDENT LIST
    // ============================================
    console.log('[Statistics Export] Fetching detailed student list...');

    const students = await prisma.students.findMany({
      where: { is_active: true },
      include: {
        pilot_school: true,
        school_class: true,
        added_by: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });

    const studentDetailData = [
      [
        'ID', 'Student Code', 'Name', 'Gender', 'Age', 'Grade', 'School', 'School Code',
        'Province', 'District', 'Cluster', 'Guardian Name', 'Guardian Phone',
        'Baseline Khmer', 'Baseline Math', 'Midline Khmer', 'Midline Math',
        'Endline Khmer', 'Endline Math', 'Added By', 'Record Status', 'Created At'
      ],
      ...students.map(s => [
        s.id,
        s.student_id || '',
        s.name,
        s.gender || '',
        s.age || '',
        s.grade || '',
        s.pilot_school?.school_name || '',
        s.pilot_school?.school_code || '',
        s.pilot_school?.province || '',
        s.pilot_school?.district || '',
        s.pilot_school?.cluster || '',
        s.guardian_name || '',
        s.guardian_phone || '',
        s.baseline_khmer_level || '',
        s.baseline_math_level || '',
        s.midline_khmer_level || '',
        s.midline_math_level || '',
        s.endline_khmer_level || '',
        s.endline_math_level || '',
        s.added_by?.name || '',
        s.record_status || '',
        s.created_at.toISOString().split('T')[0]
      ])
    ];

    const studentDetailSheet = XLSX.utils.aoa_to_sheet(studentDetailData);
    studentDetailSheet['!cols'] = [
      { wch: 8 }, { wch: 15 }, { wch: 25 }, { wch: 10 }, { wch: 8 }, { wch: 8 },
      { wch: 30 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 20 },
      { wch: 15 }, { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 },
      { wch: 20 }, { wch: 20 }, { wch: 15 }, { wch: 12 }
    ];
    XLSX.utils.book_append_sheet(workbook, studentDetailSheet, 'Student Details');

    // ============================================
    // GENERATE EXCEL FILE
    // ============================================
    console.log('[Statistics Export] Generating Excel file...');
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    // Create filename with timestamp
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `TaRL_Student_Statistics_${timestamp}.xlsx`;

    console.log(`[Statistics Export] Export completed successfully: ${filename}`);
    console.log(`[Statistics Export] Total students: ${students.length}`);

    // Return the Excel file
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error: any) {
    console.error('[Statistics Export] Error during export:', error);
    return NextResponse.json(
      {
        error: 'Failed to export statistics',
        message: error.message,
        details: error.stack,
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
