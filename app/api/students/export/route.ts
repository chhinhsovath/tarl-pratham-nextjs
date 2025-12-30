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

    // Fetch all students with related data
    console.log('[Students Export] Fetching students from database...');
    const students = await prisma.students.findMany({
      where: whereClause,
      include: {
        pilot_schools: true,
        school_classes: {
          include: {
            schools: true,
          },
        },
        users: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });

    console.log(`[Students Export] Found ${students.length} students`);

    // Create workbook
    const workbook = XLSX.utils.book_new();

    // Prepare student data for export
    const studentsData = students.map((student) => ({
      'Student ID': student.id,
      'Student Code': student.student_id || '',
      'Name': student.name,
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
      'Class': student.school_classes?.name || '',
      'Baseline Khmer Level': student.baseline_khmer_level || '',
      'Baseline Math Level': student.baseline_math_level || '',
      'Midline Khmer Level': student.midline_khmer_level || '',
      'Midline Math Level': student.midline_math_level || '',
      'Endline Khmer Level': student.endline_khmer_level || '',
      'Endline Math Level': student.endline_math_level || '',
      'Added By': student.users?.name || '',
      'Added By Role': student.created_by_role || student.users?.role || '',
      'Added By Mentor': student.added_by_mentor ? 'Yes' : 'No',
      'Is Temporary': student.is_temporary ? 'Yes' : 'No',
      'Record Status': student.record_status === 'production' ? 'ផលិតកម្ម' :
                       student.record_status === 'test_teacher' ? 'សាកល្បង (គ្រូ)' :
                       student.record_status === 'test_mentor' ? 'សាកល្បង (អ្នកណែនាំ)' :
                       student.record_status || '',
      'Active': student.is_active ? 'Yes' : 'No',
      'Created At': student.created_at.toISOString().split('T')[0],
      'Updated At': student.updated_at.toISOString().split('T')[0],
    }));

    // Create worksheet
    const studentsSheet = XLSX.utils.json_to_sheet(studentsData);

    // Auto-size columns
    const maxWidth = 50;
    const columnWidths = [
      { wch: 10 }, // Student ID
      { wch: 15 }, // Student Code
      { wch: 25 }, // Name
      { wch: 10 }, // Gender
      { wch: 8 },  // Age
      { wch: 8 },  // Grade
      { wch: 12 }, // Date of Birth
      { wch: 20 }, // Guardian Name
      { wch: 15 }, // Guardian Phone
      { wch: 30 }, // Address
      { wch: 30 }, // School
      { wch: 15 }, // School Code
      { wch: 15 }, // Province
      { wch: 15 }, // District
      { wch: 15 }, // Cluster
      { wch: 15 }, // Class
      { wch: 20 }, // Baseline Khmer
      { wch: 20 }, // Baseline Math
      { wch: 20 }, // Midline Khmer
      { wch: 20 }, // Midline Math
      { wch: 20 }, // Endline Khmer
      { wch: 20 }, // Endline Math
      { wch: 20 }, // Added By
      { wch: 15 }, // Added By Role
      { wch: 12 }, // Added By Mentor
      { wch: 12 }, // Is Temporary
      { wch: 15 }, // Record Status
      { wch: 10 }, // Active
      { wch: 12 }, // Created At
      { wch: 12 }, // Updated At
    ];

    studentsSheet['!cols'] = columnWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, studentsSheet, 'Students');

    // Generate Excel file
    console.log('[Students Export] Generating Excel file...');
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    // Create filename with timestamp
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `TaRL_Students_Export_${timestamp}.xlsx`;

    console.log(`[Students Export] Export completed successfully: ${filename}`);
    console.log(`[Students Export] Total students exported: ${studentsData.length}`);

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
