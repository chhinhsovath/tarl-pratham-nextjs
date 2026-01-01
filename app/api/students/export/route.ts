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

    // Get assessment filter parameter
    const assessmentFilter = request.nextUrl.searchParams.get('assessment_filter') || 'all';
    console.log(`[Students Export] Assessment filter: ${assessmentFilter}`);

    // Instead of student summary data, fetch and export individual assessments
    // This shows each assessment as a separate row
    console.log('[Students Export] Fetching individual assessments...');

    // First, get all students and their assessment counts to filter them
    let studentIds: number[] = [];

    if (assessmentFilter !== 'all') {
      const studentsData = await prisma.students.findMany({
        where: whereClause,
        select: { id: true },
      });

      // Get all assessments for these students
      const allAssessments = await prisma.assessments.findMany({
        where: {
          student_id: { in: studentsData.map(s => s.id) },
        },
        select: {
          student_id: true,
          assessment_type: true,
        },
      });

      // Build map of student_id -> set of assessment types
      const studentAssessmentTypes = new Map<number, Set<string>>();
      allAssessments.forEach(assessment => {
        if (!studentAssessmentTypes.has(assessment.student_id)) {
          studentAssessmentTypes.set(assessment.student_id, new Set());
        }
        studentAssessmentTypes.get(assessment.student_id)!.add(assessment.assessment_type);
      });

      // Filter based on assessment_filter
      if (assessmentFilter === 'both') {
        // Students with at least baseline and endline
        studentIds = Array.from(studentAssessmentTypes.entries())
          .filter(([_, types]) => types.has('baseline') && types.has('endline'))
          .map(([id, _]) => id);
      } else if (assessmentFilter === 'three') {
        // Students with all 3 assessment types (baseline, midline, endline)
        studentIds = Array.from(studentAssessmentTypes.entries())
          .filter(([_, types]) => types.has('baseline') && types.has('midline') && types.has('endline'))
          .map(([id, _]) => id);
      }

      console.log(`[Students Export] Filtered to ${studentIds.length} students with assessment filter: ${assessmentFilter}`);
    }

    // Build the where clause for assessments query
    const assessmentWhere: any = {};

    if (studentIds.length > 0) {
      // If we filtered students, only get assessments for those students
      assessmentWhere.student_id = { in: studentIds };
    } else if (assessmentFilter === 'all') {
      // If no filter, get assessments for all students in the user's school
      const schoolFilter = userRole === 'teacher' ? (session.user as any).pilot_school_id : undefined;
      if (schoolFilter) {
        // Get student IDs from the school first
        const schoolStudents = await prisma.students.findMany({
          where: { pilot_school_id: schoolFilter },
          select: { id: true },
        });
        assessmentWhere.student_id = { in: schoolStudents.map(s => s.id) };
      }
    }

    const assessments = await prisma.assessments.findMany({
      where: assessmentWhere,
      include: {
        students: {
          select: {
            id: true,
            student_id: true,
            name: true,
            gender: true,
            age: true,
            grade: true,
          },
        },
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
        users_assessments_added_by_idTousers: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
      },
      orderBy: [{ assessed_date: 'desc' }],
    });

    console.log(`[Students Export] Found ${assessments.length} assessments`);

    // Create workbook
    const workbook = XLSX.utils.book_new();

    // Prepare assessment data for export - one row per assessment
    const assessmentTypeMap: Record<string, string> = {
      baseline: 'តេស្តដើមគ្រា (Baseline)',
      midline: 'តេស្តពាក់កណ្ដាលគ្រា (Midline)',
      endline: 'តេស្តចុងក្រោយគ្រា (Endline)',
    };

    const subjectMap: Record<string, string> = {
      language: 'ភាសាខ្មែរ (Language)',
      khmer: 'ភាសាខ្មែរ (Language)',
      math: 'គណិតវិទ្យា (Math)',
    };

    const assessmentData = assessments.map((assessment) => ({
      'Assessment ID': assessment.id,
      'Student ID': assessment.students?.student_id || '',
      'Student Name': assessment.students?.name || '',
      'Gender': assessment.students?.gender === 'male' ? 'ប្រុស' : assessment.students?.gender === 'female' ? 'ស្រី' : assessment.students?.gender || '',
      'Age': assessment.students?.age || '',
      'Grade': assessment.students?.grade ? `ទី${assessment.students.grade}` : '',
      'School': assessment.pilot_schools?.school_name || '',
      'School Code': assessment.pilot_schools?.school_code || '',
      'Province': assessment.pilot_schools?.province || '',
      'District': assessment.pilot_schools?.district || '',
      'Cluster': assessment.pilot_schools?.cluster || '',
      'Assessment Type': assessmentTypeMap[assessment.assessment_type] || assessment.assessment_type,
      'Subject': subjectMap[assessment.subject] || assessment.subject,
      'Level': assessment.level || '',
      'Assessment Sample': assessment.assessment_sample || '',
      'Student Consent': assessment.student_consent || '',
      'Assessed Date': assessment.assessed_date ? new Date(assessment.assessed_date).toISOString().split('T')[0] : '',
      'Assessed By Mentor': assessment.assessed_by_mentor ? 'Yes' : 'No',
      'Added By': assessment.users_assessments_added_by_idTousers?.name || '',
      'Added By Role': assessment.users_assessments_added_by_idTousers?.role || '',
      'Is Temporary': assessment.is_temporary ? 'Yes' : 'No',
      'Record Status': assessment.record_status === 'production' ? 'ផលិតកម្ម' : assessment.record_status || '',
      'Created At': new Date(assessment.created_at).toISOString().split('T')[0],
      'Updated At': new Date(assessment.updated_at).toISOString().split('T')[0],
      'Notes': assessment.notes || '',
    }));

    // Create worksheet with assessment data
    const assessmentSheet = XLSX.utils.json_to_sheet(assessmentData);

    // Auto-size columns
    const maxWidth = 50;
    const columnWidths = [
      { wch: 12 }, // Assessment ID
      { wch: 12 }, // Student ID
      { wch: 25 }, // Student Name
      { wch: 10 }, // Gender
      { wch: 8 },  // Age
      { wch: 8 },  // Grade
      { wch: 30 }, // School
      { wch: 15 }, // School Code
      { wch: 15 }, // Province
      { wch: 15 }, // District
      { wch: 15 }, // Cluster
      { wch: 20 }, // Assessment Type
      { wch: 15 }, // Subject
      { wch: 15 }, // Level
      { wch: 20 }, // Assessment Sample
      { wch: 15 }, // Student Consent
      { wch: 15 }, // Assessed Date
      { wch: 15 }, // Assessed By Mentor
      { wch: 20 }, // Added By
      { wch: 15 }, // Added By Role
      { wch: 12 }, // Is Temporary
      { wch: 15 }, // Record Status
      { wch: 12 }, // Created At
      { wch: 12 }, // Updated At
      { wch: 30 }, // Notes
    ];

    assessmentSheet['!cols'] = columnWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, assessmentSheet, 'Assessments');

    // Generate Excel file
    console.log('[Students Export] Generating Excel file...');
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    // Create filename with timestamp
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `TaRL_Students_Export_${timestamp}.xlsx`;

    console.log(`[Students Export] Export completed successfully: ${filename}`);
    console.log(`[Students Export] Total assessments exported: ${assessmentData.length}`);

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
