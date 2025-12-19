import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import * as XLSX from 'xlsx';

const prisma = new PrismaClient();

/**
 * Comprehensive Data Export API
 * Exports all major entities to Excel with multiple sheets
 * GET /api/export/comprehensive
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

    // Authorization check - only admin and coordinator can export
    const userRole = (session.user as any).role;
    if (!['admin', 'coordinator'].includes(userRole)) {
      return NextResponse.json(
        { error: 'Access denied. Only admin and coordinator can export data.' },
        { status: 403 }
      );
    }

    console.log(`[Export] Starting comprehensive export by ${session.user.email} (${userRole})`);

    // Create workbook
    const workbook = XLSX.utils.book_new();

    // ============================================
    // SHEET 1: TEACHERS
    // ============================================
    console.log('[Export] Fetching teachers...');
    const teachers = await prisma.user.findMany({
      where: {
        role: 'teacher',
        is_active: true,
      },
      include: {
        pilot_school: true,
        teacher_assignments: {
          include: {
            pilot_school: true,
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });

    const teachersData = teachers.map((teacher) => ({
      'Teacher ID': teacher.id,
      'Name': teacher.name,
      'Email': teacher.email,
      'Username': teacher.username || teacher.username_login || '',
      'Phone': teacher.phone || '',
      'Sex': teacher.sex || '',
      'School': teacher.pilot_schools?.school_name || '',
      'School Code': teacher.pilot_schools?.school_code || '',
      'Province': teacher.province || teacher.pilot_schools?.province || '',
      'District': teacher.district || teacher.pilot_schools?.district || '',
      'Assigned Subject': teacher.assigned_subject || teacher.subject || '',
      'Holding Classes': teacher.holding_classes || '',
      'Active': teacher.is_active ? 'Yes' : 'No',
      'Login Type': teacher.login_type || 'email',
      'Created At': teacher.created_at.toISOString().split('T')[0],
    }));

    const teachersSheet = XLSX.utils.json_to_sheet(teachersData);
    XLSX.utils.book_append_sheet(workbook, teachersSheet, 'Teachers');

    // ============================================
    // SHEET 2: MENTORS
    // ============================================
    console.log('[Export] Fetching mentors...');
    const mentors = await prisma.user.findMany({
      where: {
        role: 'mentor',
        is_active: true,
      },
      include: {
        pilot_school: true,
        mentor_assignments: {
          include: {
            pilot_school: true,
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });

    const mentorsData = mentors.map((mentor) => ({
      'Mentor ID': mentor.id,
      'Name': mentor.name,
      'Email': mentor.email,
      'Username': mentor.username || mentor.username_login || '',
      'Phone': mentor.phone || '',
      'Sex': mentor.sex || '',
      'Province': mentor.province || '',
      'District': mentor.district || '',
      'Assigned Schools': mentor.mentor_assignments.length,
      'Active': mentor.is_active ? 'Yes' : 'No',
      'Created At': mentor.created_at.toISOString().split('T')[0],
    }));

    const mentorsSheet = XLSX.utils.json_to_sheet(mentorsData);
    XLSX.utils.book_append_sheet(workbook, mentorsSheet, 'Mentors');

    // ============================================
    // SHEET 3: PILOT SCHOOLS
    // ============================================
    console.log('[Export] Fetching pilot schools...');
    const pilotSchools = await prisma.pilot_schools.findMany({
      include: {
        _count: {
          select: {
            students: true,
            assessments: true,
            mentoring_visits: true,
            users: true,
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });

    const schoolsData = pilotSchools.map((school) => ({
      'School ID': school.id,
      'School Name': school.school_name,
      'School Code': school.school_code,
      'Province': school.province,
      'District': school.district,
      'Cluster': school.cluster,
      'Baseline Start': school.baseline_start_date ? school.baseline_start_date.toISOString().split('T')[0] : '',
      'Baseline End': school.baseline_end_date ? school.baseline_end_date.toISOString().split('T')[0] : '',
      'Midline Start': school.midline_start_date ? school.midline_start_date.toISOString().split('T')[0] : '',
      'Midline End': school.midline_end_date ? school.midline_end_date.toISOString().split('T')[0] : '',
      'Endline Start': school.endline_start_date ? school.endline_start_date.toISOString().split('T')[0] : '',
      'Endline End': school.endline_end_date ? school.endline_end_date.toISOString().split('T')[0] : '',
      'Total Students': school._count.students,
      'Total Assessments': school._count.assessments,
      'Total Visits': school._count.mentoring_visits,
      'Total Users': school._count.users,
      'Is Locked': school.is_locked ? 'Yes' : 'No',
      'Created At': school.created_at.toISOString().split('T')[0],
    }));

    const schoolsSheet = XLSX.utils.json_to_sheet(schoolsData);
    XLSX.utils.book_append_sheet(workbook, schoolsSheet, 'Pilot Schools');

    // ============================================
    // SHEET 4: STUDENTS
    // ============================================
    console.log('[Export] Fetching students...');
    const students = await prisma.students.findMany({
      where: {
        is_active: true,
        record_status: 'production',
      },
      include: {
        pilot_school: true,
        school_class: true,
        added_by: true,
      },
      orderBy: { created_at: 'desc' },
    });

    const studentsData = students.map((student) => ({
      'Student ID': student.id,
      'Student Code': student.student_id || '',
      'Name': student.name,
      'Age': student.age || '',
      'Gender': student.gender || '',
      'Grade': student.grade || '',
      'School': student.pilot_schools?.school_name || '',
      'School Code': student.pilot_schools?.school_code || '',
      'Province': student.pilot_schools?.province || '',
      'District': student.pilot_schools?.district || '',
      'Guardian Name': student.guardian_name || '',
      'Guardian Phone': student.guardian_phone || '',
      'Baseline Khmer Level': student.baseline_khmer_level || '',
      'Baseline Math Level': student.baseline_math_level || '',
      'Midline Khmer Level': student.midline_khmer_level || '',
      'Midline Math Level': student.midline_math_level || '',
      'Endline Khmer Level': student.endline_khmer_level || '',
      'Endline Math Level': student.endline_math_level || '',
      'Added By': student.users_assessments_added_by_idTousers?.name || '',
      'Added By Mentor': student.added_by_mentor ? 'Yes' : 'No',
      'Created At': student.created_at.toISOString().split('T')[0],
    }));

    const studentsSheet = XLSX.utils.json_to_sheet(studentsData);
    XLSX.utils.book_append_sheet(workbook, studentsSheet, 'Students');

    // ============================================
    // SHEET 5: ASSESSMENTS - BASELINE
    // ============================================
    console.log('[Export] Fetching baseline assessments...');
    const baselineAssessments = await prisma.assessments.findMany({
      where: {
        assessment_type: 'baseline',
        record_status: 'production',
      },
      include: {
        students: {
          include: {
            pilot_school: true,
          },
        },
        added_by: true,
        verified_by: true,
      },
      orderBy: { assessed_date: 'desc' },
    });

    const baselineData = baselineAssessments.map((assessment) => ({
      'Assessment ID': assessment.id,
      'Student Name': assessment.students.name,
      'Student Code': assessment.students.student_id || '',
      'School': assessment.students.pilot_schools?.school_name || '',
      'School Code': assessment.students.pilot_schools?.school_code || '',
      'Subject': assessment.subject,
      'Level': assessment.level || '',
      'Assessment Sample': assessment.assessment_sample || '',
      'Student Consent': assessment.student_consent || '',
      'Assessed Date': assessment.assessed_date ? assessment.assessed_date.toISOString().split('T')[0] : '',
      'Assessed By': assessment.users_assessments_added_by_idTousers?.name || '',
      'Assessed By Mentor': assessment.assessed_by_mentor ? 'Yes' : 'No',
      'Verified': assessment.verified_by_id ? 'Yes' : 'No',
      'Verified By': assessment.users_assessments_verified_by_idTousers?.name || '',
      'Verified At': assessment.verified_at ? assessment.verified_at.toISOString().split('T')[0] : '',
      'Notes': assessment.notes || '',
      'Created At': assessment.created_at.toISOString().split('T')[0],
    }));

    const baselineSheet = XLSX.utils.json_to_sheet(baselineData);
    XLSX.utils.book_append_sheet(workbook, baselineSheet, 'Assessments - Baseline');

    // ============================================
    // SHEET 6: ASSESSMENTS - MIDLINE
    // ============================================
    console.log('[Export] Fetching midline assessments...');
    const midlineAssessments = await prisma.assessments.findMany({
      where: {
        assessment_type: 'midline',
        record_status: 'production',
      },
      include: {
        students: {
          include: {
            pilot_school: true,
          },
        },
        added_by: true,
        verified_by: true,
      },
      orderBy: { assessed_date: 'desc' },
    });

    const midlineData = midlineAssessments.map((assessment) => ({
      'Assessment ID': assessment.id,
      'Student Name': assessment.students.name,
      'Student Code': assessment.students.student_id || '',
      'School': assessment.students.pilot_schools?.school_name || '',
      'School Code': assessment.students.pilot_schools?.school_code || '',
      'Subject': assessment.subject,
      'Level': assessment.level || '',
      'Assessment Sample': assessment.assessment_sample || '',
      'Student Consent': assessment.student_consent || '',
      'Assessed Date': assessment.assessed_date ? assessment.assessed_date.toISOString().split('T')[0] : '',
      'Assessed By': assessment.users_assessments_added_by_idTousers?.name || '',
      'Assessed By Mentor': assessment.assessed_by_mentor ? 'Yes' : 'No',
      'Verified': assessment.verified_by_id ? 'Yes' : 'No',
      'Verified By': assessment.users_assessments_verified_by_idTousers?.name || '',
      'Verified At': assessment.verified_at ? assessment.verified_at.toISOString().split('T')[0] : '',
      'Notes': assessment.notes || '',
      'Created At': assessment.created_at.toISOString().split('T')[0],
    }));

    const midlineSheet = XLSX.utils.json_to_sheet(midlineData);
    XLSX.utils.book_append_sheet(workbook, midlineSheet, 'Assessments - Midline');

    // ============================================
    // SHEET 7: ASSESSMENTS - ENDLINE
    // ============================================
    console.log('[Export] Fetching endline assessments...');
    const endlineAssessments = await prisma.assessments.findMany({
      where: {
        assessment_type: 'endline',
        record_status: 'production',
      },
      include: {
        students: {
          include: {
            pilot_school: true,
          },
        },
        added_by: true,
        verified_by: true,
      },
      orderBy: { assessed_date: 'desc' },
    });

    const endlineData = endlineAssessments.map((assessment) => ({
      'Assessment ID': assessment.id,
      'Student Name': assessment.students.name,
      'Student Code': assessment.students.student_id || '',
      'School': assessment.students.pilot_schools?.school_name || '',
      'School Code': assessment.students.pilot_schools?.school_code || '',
      'Subject': assessment.subject,
      'Level': assessment.level || '',
      'Assessment Sample': assessment.assessment_sample || '',
      'Student Consent': assessment.student_consent || '',
      'Assessed Date': assessment.assessed_date ? assessment.assessed_date.toISOString().split('T')[0] : '',
      'Assessed By': assessment.users_assessments_added_by_idTousers?.name || '',
      'Assessed By Mentor': assessment.assessed_by_mentor ? 'Yes' : 'No',
      'Verified': assessment.verified_by_id ? 'Yes' : 'No',
      'Verified By': assessment.users_assessments_verified_by_idTousers?.name || '',
      'Verified At': assessment.verified_at ? assessment.verified_at.toISOString().split('T')[0] : '',
      'Notes': assessment.notes || '',
      'Created At': assessment.created_at.toISOString().split('T')[0],
    }));

    const endlineSheet = XLSX.utils.json_to_sheet(endlineData);
    XLSX.utils.book_append_sheet(workbook, endlineSheet, 'Assessments - Endline');

    // ============================================
    // SHEET 8: VERIFIED ASSESSMENTS
    // ============================================
    console.log('[Export] Fetching verified assessments...');
    const verifiedAssessments = await prisma.assessments.findMany({
      where: {
        verified_by_id: {
          not: null,
        },
        record_status: 'production',
      },
      include: {
        students: {
          include: {
            pilot_school: true,
          },
        },
        added_by: true,
        verified_by: true,
      },
      orderBy: { verified_at: 'desc' },
    });

    const verifiedData = verifiedAssessments.map((assessment) => ({
      'Assessment ID': assessment.id,
      'Assessment Type': assessment.assessment_type,
      'Student Name': assessment.students.name,
      'Student Code': assessment.students.student_id || '',
      'School': assessment.students.pilot_schools?.school_name || '',
      'School Code': assessment.students.pilot_schools?.school_code || '',
      'Subject': assessment.subject,
      'Level': assessment.level || '',
      'Assessed Date': assessment.assessed_date ? assessment.assessed_date.toISOString().split('T')[0] : '',
      'Assessed By': assessment.users_assessments_added_by_idTousers?.name || '',
      'Verified By': assessment.users_assessments_verified_by_idTousers?.name || '',
      'Verified At': assessment.verified_at ? assessment.verified_at.toISOString().split('T')[0] : '',
      'Verification Notes': assessment.verification_notes || '',
      'Is Locked': assessment.is_locked ? 'Yes' : 'No',
      'Created At': assessment.created_at.toISOString().split('T')[0],
    }));

    const verifiedSheet = XLSX.utils.json_to_sheet(verifiedData);
    XLSX.utils.book_append_sheet(workbook, verifiedSheet, 'Verified Assessments');

    // ============================================
    // SHEET 9: OBSERVATIONS (MENTORING VISITS)
    // ============================================
    console.log('[Export] Fetching mentoring visits...');
    const mentoringVisits = await prisma.mentoring_visits.findMany({
      where: {
        record_status: 'production',
      },
      include: {
        mentor: true,
        teacher: true,
        pilot_school: true,
      },
      orderBy: { visit_date: 'desc' },
    });

    const observationsData = mentoringVisits.map((visit) => ({
      'Visit ID': visit.id,
      'Visit Date': visit.visit_date.toISOString().split('T')[0],
      'Mentor': visit.mentor.name,
      'Teacher': visit.teacher?.name || '',
      'School': visit.pilot_schools?.school_name || '',
      'School Code': visit.pilot_schools?.school_code || '',
      'Province': visit.province || visit.pilot_schools?.province || '',
      'District': visit.district || visit.pilot_schools?.district || '',
      'Level': visit.level || '',
      'Subject Observed': visit.subject_observed || '',
      'Grades Observed': visit.grades_observed || '',
      'Students Present': visit.students_present || '',
      'Purpose': visit.purpose || '',
      'Activities': visit.activities || '',
      'Observations': visit.observations || '',
      'Class In Session': visit.class_in_session ? 'Yes' : 'No',
      'Has Session Plan': visit.has_session_plan ? 'Yes' : 'No',
      'Followed Session Plan': visit.followed_session_plan ? 'Yes' : 'No',
      'Students Grouped By Level': visit.students_grouped_by_level ? 'Yes' : 'No',
      'Students Active Participation': visit.students_active_participation ? 'Yes' : 'No',
      'Recommendations': visit.recommendations || '',
      'Follow-up Actions': visit.follow_up_actions || '',
      'Follow-up Required': visit.follow_up_required ? 'Yes' : 'No',
      'Status': visit.status,
      'Is Locked': visit.is_locked ? 'Yes' : 'No',
      'Created At': visit.created_at.toISOString().split('T')[0],
    }));

    const observationsSheet = XLSX.utils.json_to_sheet(observationsData);
    XLSX.utils.book_append_sheet(workbook, observationsSheet, 'Observations');

    // ============================================
    // GENERATE EXCEL FILE
    // ============================================
    console.log('[Export] Generating Excel file...');
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    // Create filename with timestamp
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `TaRL_Pratham_Comprehensive_Export_${timestamp}.xlsx`;

    console.log(`[Export] Export completed successfully: ${filename}`);
    console.log(`[Export] Summary:`);
    console.log(`  - Teachers: ${teachersData.length}`);
    console.log(`  - Mentors: ${mentorsData.length}`);
    console.log(`  - Pilot Schools: ${schoolsData.length}`);
    console.log(`  - Students: ${studentsData.length}`);
    console.log(`  - Baseline Assessments: ${baselineData.length}`);
    console.log(`  - Midline Assessments: ${midlineData.length}`);
    console.log(`  - Endline Assessments: ${endlineData.length}`);
    console.log(`  - Verified Assessments: ${verifiedData.length}`);
    console.log(`  - Observations: ${observationsData.length}`);

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
    console.error('[Export] Error during comprehensive export:', error);
    return NextResponse.json(
      {
        error: 'Failed to export data',
        message: error.message,
        details: error.stack,
      },
      { status: 500 }
    );
  }
}
