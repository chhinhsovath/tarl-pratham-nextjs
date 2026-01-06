import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import * as XLSX from 'xlsx';

/**
 * Students Export API
 * Exports all active students to Excel with complete information
 * GET /api/students/export
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

    // Authorization check - admin, coordinator, mentor, and teacher can export
    const userRole = (session.user as any).role;
    if (!['admin', 'coordinator', 'mentor', 'teacher'].includes(userRole)) {
      return NextResponse.json(
        { error: 'Access denied. Insufficient permissions to export students.' },
        { status: 403 }
      );
    }

    console.log(`[Students Export] Starting export by ${session.user.email} (${userRole})`);

    // Build where clause based on role
    const whereClause: any = {
      is_active: true,
    };

    // For admin/coordinator/super_admin: export ALL active students by default
    // For other roles: only production data
    const includeTestData = request.nextUrl.searchParams.get('include_test_data') === 'true';
    const exportAll = request.nextUrl.searchParams.get('export_all') === 'true';

    if (['admin', 'coordinator', 'super_admin'].includes(userRole)) {
      // Admin/Coordinator: export all by default, unless explicitly filtered
      if (!exportAll && !includeTestData) {
        // If user explicitly wants production only, filter it
        if (request.nextUrl.searchParams.get('production_only') === 'true') {
          whereClause.record_status = 'production';
        }
        // Otherwise export ALL active students (no filter)
      }
    } else {
      // Teachers/Mentors: only production data by default
      if (!includeTestData) {
        whereClause.record_status = 'production';
      }
    }

    // For teachers: only their school's students
    if (userRole === 'teacher') {
      const userPilotSchoolId = (session.user as any).pilot_school_id;
      if (userPilotSchoolId) {
        whereClause.pilot_school_id = userPilotSchoolId;
      } else {
        // Teacher without school assignment - no students to export
        whereClause.pilot_school_id = -1; // Non-existent school
      }
    }

    // For mentors: only assigned schools' students
    if (userRole === 'mentor') {
      const userId = parseInt(session.user.id);
      const mentorAssignments = await prisma.mentorAssignment.findMany({
        where: { mentor_id: userId },
        select: { pilot_school_id: true },
      });
      const schoolIds = mentorAssignments.map(a => a.pilot_school_id);

      if (schoolIds.length > 0) {
        whereClause.pilot_school_id = { in: schoolIds };
      } else {
        // Mentor without assignments - no students to export
        whereClause.pilot_school_id = -1; // Non-existent school
      }
    }

    // Export students, not assessments - one row per student showing all data
    console.log('[Students Export] Fetching ALL students (not assessments)...');

    // Fetch all students matching the where clause
    const students = await prisma.students.findMany({
      where: whereClause,
      include: {
        pilot_schools: {
          select: {
            id: true,
            school_name: true,
            school_code: true,
            province: true,
            district: true,
            cluster: true,
          },
        },
      },
      orderBy: [{ created_at: 'desc' }],
    });

    console.log(`[Students Export] Found ${students.length} students from school`);

    // Get assessment data for each student to show completion status
    const studentIds = students.map(s => s.id);

    // CRITICAL: Fetch ALL assessments regardless of record_status
    // Students might be filtered by production status, but we want to show ALL their assessments
    // (baseline, midline, endline) even if they were created at different times with different record_status
    // This ensures no assessment type is missing from the export
    const assessmentData = await prisma.assessments.findMany({
      where: {
        student_id: { in: studentIds },
        // Get ALL assessments regardless of record_status to show complete assessment history
        // Don't filter by record_status here - we want all baseline, midline, endline regardless
      },
      select: {
        student_id: true,
        assessment_type: true,
        level: true,
        assessed_date: true,
        record_status: true, // Include record_status so we can log it
      },
      orderBy: [{ assessed_date: 'desc' }],
    });

    console.log(`[Students Export] Found ${assessmentData.length} total assessments for ${studentIds.length} students (ALL record_status values included)`);

    // Group assessments by student and assessment type
    // Take the MOST RECENT assessment of each type (ordered by assessed_date DESC)
    const studentAssessments = new Map<number, any>();
    assessmentData.forEach(assessment => {
      if (!studentAssessments.has(assessment.student_id)) {
        studentAssessments.set(assessment.student_id, {
          baseline: null,
          midline: null,
          endline: null,
          has_baseline: false,
          has_midline: false,
          has_endline: false,
        });
      }
      const data = studentAssessments.get(assessment.student_id);

      // Take the FIRST (most recent) occurrence of each assessment type
      if (assessment.assessment_type === 'baseline' && !data.baseline) {
        data.baseline = assessment.level;
        data.has_baseline = true;
        console.log(`[Students Export] Added baseline for student ${assessment.student_id}: level=${assessment.level}, record_status=${assessment.record_status}`);
      } else if (assessment.assessment_type === 'midline' && !data.midline) {
        data.midline = assessment.level;
        data.has_midline = true;
        console.log(`[Students Export] Added midline for student ${assessment.student_id}: level=${assessment.level}, record_status=${assessment.record_status}`);
      } else if (assessment.assessment_type === 'endline' && !data.endline) {
        data.endline = assessment.level;
        data.has_endline = true;
        console.log(`[Students Export] Added endline for student ${assessment.student_id}: level=${assessment.level}, record_status=${assessment.record_status}`);
      }
    });

    // Create workbook
    const workbook = XLSX.utils.book_new();

    // Prepare student data for export - one row per student (COMPLETE LIST)
    const studentExportData = students.map((student) => {
      const assessments = studentAssessments.get(student.id) || {
        baseline: null,
        midline: null,
        endline: null,
        has_baseline: false,
        has_midline: false,
        has_endline: false,
      };

      return {
        'Student ID': student.student_id || '',
        'Student Name': student.name || '',
        'Gender': student.gender === 'male' ? 'ប្រុស' : student.gender === 'female' ? 'ស្រី' : student.gender || '',
        'Age': student.age || '',
        'Grade': student.grade ? `ទី${student.grade}` : '',
        'Guardian Name': student.guardian_name || '',
        'Guardian Phone': student.guardian_phone || '',
        'Address': student.address || '',
        'School': student.pilot_schools?.school_name || '',
        'School Code': student.pilot_schools?.school_code || '',
        'Province': student.pilot_schools?.province || '',
        'District': student.pilot_schools?.district || '',
        'Cluster': student.pilot_schools?.cluster || '',
        'Has Baseline': assessments.has_baseline ? 'Yes' : 'No',
        'Has Midline': assessments.has_midline ? 'Yes' : 'No',
        'Has Endline': assessments.has_endline ? 'Yes' : 'No',
        'Baseline Level': assessments.baseline || '',
        'Midline Level': assessments.midline || '',
        'Endline Level': assessments.endline || '',
        'Status': student.is_active ? 'Active' : 'Inactive',
        'Is Temporary': student.is_temporary ? 'Yes' : 'No',
        'Record Status': student.record_status === 'production' ? 'ផលិតកម្ម' : student.record_status || '',
        'Created At': new Date(student.created_at).toISOString().split('T')[0],
        'Updated At': new Date(student.updated_at).toISOString().split('T')[0],
      };
    });

    // Create worksheet with student data (one row per student - COMPLETE LIST)
    const studentSheet = XLSX.utils.json_to_sheet(studentExportData);

    // Auto-size columns for student data
    const columnWidths = [
      { wch: 12 }, // Student ID
      { wch: 25 }, // Student Name
      { wch: 10 }, // Gender
      { wch: 8 },  // Age
      { wch: 8 },  // Grade
      { wch: 20 }, // Guardian Name
      { wch: 15 }, // Guardian Phone
      { wch: 30 }, // Address
      { wch: 30 }, // School
      { wch: 12 }, // School Code
      { wch: 15 }, // Province
      { wch: 15 }, // District
      { wch: 15 }, // Cluster
      { wch: 12 }, // Has Baseline
      { wch: 12 }, // Has Midline
      { wch: 12 }, // Has Endline
      { wch: 15 }, // Baseline Level
      { wch: 15 }, // Midline Level
      { wch: 15 }, // Endline Level
      { wch: 10 }, // Status
      { wch: 12 }, // Is Temporary
      { wch: 15 }, // Record Status
      { wch: 12 }, // Created At
      { wch: 12 }, // Updated At
    ];

    studentSheet['!cols'] = columnWidths;

    // Add worksheet to workbook - Student Roster (COMPLETE LIST, one row per student)
    XLSX.utils.book_append_sheet(workbook, studentSheet, 'Student Roster');

    // Generate Excel file
    console.log('[Students Export] Generating Excel file...');
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    // Create filename with timestamp
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `TaRL_Students_Complete_List_${timestamp}.xlsx`;

    console.log(`[Students Export] Export completed successfully: ${filename}`);
    console.log(`[Students Export] Total students exported: ${studentExportData.length} (COMPLETE LIST - all students from school)`);

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
    console.error('[Students Export] Error during export:', error);
    return NextResponse.json(
      {
        error: 'Failed to export students',
        message: error.message,
        details: error.stack,
      },
      { status: 500 }
    );
  }
}
