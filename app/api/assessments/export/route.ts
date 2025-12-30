import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import * as XLSX from 'xlsx';
import { getMentorSchoolIds } from '@/lib/mentorAssignments';

/**
 * Assessments Export API
 * Exports assessments to Excel with complete information
 * GET /api/assessments/export
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

    // Authorization check
    const userRole = (session.user as any).role;
    if (!['admin', 'coordinator', 'mentor', 'teacher', 'viewer'].includes(userRole)) {
      return NextResponse.json(
        { error: 'Access denied. Insufficient permissions to export assessments.' },
        { status: 403 }
      );
    }

    console.log(`[Assessments Export] Starting export by ${session.user.email} (${userRole})`);

    // Build where clause based on role
    const whereClause: any = {};

    // Apply role-based filters
    if (userRole === 'teacher') {
      // Teachers can only export assessments from their school
      const userPilotSchoolId = (session.user as any).pilot_school_id;
      if (userPilotSchoolId) {
        whereClause.pilot_school_id = userPilotSchoolId;
      } else {
        // Teacher without school assignment - no assessments to export
        whereClause.pilot_school_id = -1; // Non-existent school
      }
    } else if (userRole === 'mentor') {
      // Mentors can export assessments from their assigned schools
      const userId = parseInt(session.user.id);
      const mentorSchoolIds = await getMentorSchoolIds(userId);

      if (mentorSchoolIds.length > 0) {
        whereClause.pilot_school_id = { in: mentorSchoolIds };
      } else {
        // Mentor without assignments - no assessments to export
        whereClause.pilot_school_id = -1; // Non-existent school
      }
    }
    // Admin, Coordinator, and Viewer: no school filter (can see all)

    // Filter by assessment type if provided
    const assessmentType = request.nextUrl.searchParams.get('assessment_type');
    if (assessmentType && ['baseline', 'midline', 'endline'].includes(assessmentType)) {
      whereClause.assessment_type = assessmentType;
    }

    // Filter by subject if provided
    const subject = request.nextUrl.searchParams.get('subject');
    if (subject && ['language', 'math'].includes(subject)) {
      whereClause.subject = subject;
    }

    // Filter by date range if provided
    const dateFrom = request.nextUrl.searchParams.get('date_from');
    const dateTo = request.nextUrl.searchParams.get('date_to');
    if (dateFrom || dateTo) {
      whereClause.assessed_date = {};
      if (dateFrom) {
        whereClause.assessed_date.gte = new Date(dateFrom);
      }
      if (dateTo) {
        const toDate = new Date(dateTo);
        toDate.setHours(23, 59, 59, 999); // Include entire day
        whereClause.assessed_date.lte = toDate;
      }
    }

    // Fetch all assessments with related data
    console.log('[Assessments Export] Fetching assessments from database...');
    const assessments = await prisma.assessments.findMany({
      where: whereClause,
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
      orderBy: [
        { assessed_date: 'desc' },
        { students: { name: 'asc' } },
      ],
    });

    console.log(`[Assessments Export] Found ${assessments.length} assessments to export`);

    if (assessments.length === 0) {
      return NextResponse.json(
        { error: 'No assessments found for export with the given filters.' },
        { status: 404 }
      );
    }

    // Format data for Excel
    const formattedData = assessments.map((assessment) => {
      const assessmentTypeMap: Record<string, string> = {
        baseline: 'មូលដ្ឋាន (Baseline)',
        midline: 'កណ្តាល (Midline)',
        endline: 'បញ្ចប់ (Endline)',
      };

      const subjectMap: Record<string, string> = {
        language: 'ភាសាខ្មែរ (Khmer)',
        math: 'គណិតវិទ្យា (Math)',
      };

      const genderMap: Record<string, string> = {
        male: 'ប្រុស (Male)',
        female: 'ស្រី (Female)',
        other: 'ផ្សេងទៀត (Other)',
      };

      return {
        'Assessment ID': assessment.id,
        'Student ID': assessment.students?.student_id || '-',
        'Student Name': assessment.students?.name || '-',
        Gender: genderMap[assessment.students?.gender || 'other'] || assessment.students?.gender || '-',
        Age: assessment.students?.age || '-',
        Grade: assessment.students?.grade || '-',
        School: assessment.pilot_schools?.school_name || '-',
        'School Code': assessment.pilot_schools?.school_code || '-',
        Province: assessment.pilot_schools?.province || '-',
        'Assessment Type': assessmentTypeMap[assessment.assessment_type] || assessment.assessment_type,
        Subject: subjectMap[assessment.subject] || assessment.subject,
        Level: assessment.level || '-',
        'Assessment Sample': assessment.assessment_sample || '-',
        'Student Consent': assessment.student_consent || '-',
        'Assessed Date': assessment.assessed_date
          ? new Date(assessment.assessed_date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
            })
          : '-',
        'Assessed By Mentor': assessment.assessed_by_mentor ? 'Yes' : 'No',
        'Added By': assessment.users_assessments_added_by_idTousers?.name || '-',
        'Added By Role': assessment.users_assessments_added_by_idTousers?.role || '-',
        'Is Temporary': assessment.is_temporary ? 'Yes' : 'No',
        'Record Status': assessment.record_status || 'production',
        'Created At': new Date(assessment.created_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        }),
        'Updated At': new Date(assessment.updated_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        }),
        Notes: assessment.notes || '-',
      };
    });

    // Create workbook with formatted data
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(formattedData);

    // Set column widths
    const columnWidths = [
      { wch: 12 }, // Assessment ID
      { wch: 12 }, // Student ID
      { wch: 20 }, // Student Name
      { wch: 15 }, // Gender
      { wch: 8 }, // Age
      { wch: 8 }, // Grade
      { wch: 20 }, // School
      { wch: 12 }, // School Code
      { wch: 15 }, // Province
      { wch: 20 }, // Assessment Type
      { wch: 15 }, // Subject
      { wch: 12 }, // Level
      { wch: 20 }, // Assessment Sample
      { wch: 15 }, // Student Consent
      { wch: 15 }, // Assessed Date
      { wch: 15 }, // Assessed By Mentor
      { wch: 15 }, // Added By
      { wch: 12 }, // Added By Role
      { wch: 12 }, // Is Temporary
      { wch: 15 }, // Record Status
      { wch: 20 }, // Created At
      { wch: 20 }, // Updated At
      { wch: 30 }, // Notes
    ];
    worksheet['!cols'] = columnWidths;

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Assessments');

    // Generate Excel file
    const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });

    // Create response with proper headers
    const filename = `assessments_${new Date().toISOString().split('T')[0]}.xlsx`;

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
    });
  } catch (error: any) {
    console.error('[Assessments Export] Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to export assessments',
        message: error.message,
      },
      { status: 500 }
    );
  }
}
