import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import {
  getEnrichedStudentData,
  getEnrichedStudentsList,
  canTeacherAccessStudent
} from '@/lib/helpers/student-user-link';

/**
 * GET /api/students/enriched
 *
 * Returns students with smart-linked teacher/user profile information
 *
 * Query Parameters:
 * - id: Single student ID (optional)
 * - schoolId: Filter by school (optional)
 * - province: Filter by province (optional)
 * - subject: Filter by teacher subject (optional)
 * - limit: Number of results (default: 50)
 * - offset: Pagination offset (default: 0)
 *
 * Response includes:
 * - Student basic info
 * - Teacher profile (email, username, role, subject, province, phone)
 * - School info (name, code, province, district)
 * - Class info (name, grade level)
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        {
          error: 'សូមចូលប្រើប្រាស់ជាមុនសិន',
          message: 'Unauthorized',
          code: 'UNAUTHORIZED'
        },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('id');
    const schoolId = searchParams.get('schoolId');
    const province = searchParams.get('province');
    const subject = searchParams.get('subject');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Single student lookup
    if (studentId) {
      const student = await getEnrichedStudentData(parseInt(studentId));

      if (!student) {
        return NextResponse.json(
          {
            error: 'រកមិនឃើញសិស្ស',
            message: 'Student not found',
            code: 'STUDENT_NOT_FOUND'
          },
          { status: 404 }
        );
      }

      // Check access permissions
      const hasAccess = canTeacherAccessStudent(
        {
          id: parseInt(session.user.id),
          role: session.user.role,
          pilot_school_id: session.user.pilot_school_id ?? undefined,
          province: session.user.province ?? undefined
        },
        student
      );

      if (!hasAccess) {
        return NextResponse.json(
          {
            error: 'អ្នកមិនមានសិទ្ធិចូលមើលសិស្សនេះ',
            message: 'Access denied',
            code: 'ACCESS_DENIED'
          },
          { status: 403 }
        );
      }

      return NextResponse.json({
        message: 'Student data retrieved successfully',
        data: student,
        metadata: {
          teacher_linked: !!student.teacher,
          school_linked: !!student.school,
          class_linked: !!student.class
        }
      });
    }

    // Multiple students with smart filtering
    const filters: any = {
      limit,
      offset
    };

    // Smart filtering based on user role
    if (session.user.role === 'teacher' || session.user.role === 'mentor') {
      if (session.user.pilot_school_id) {
        filters.schoolId = session.user.pilot_school_id;
      } else if (session.user.province) {
        filters.province = session.user.province;
      } else {
        filters.teacherId = parseInt(session.user.id);
      }
    }

    // Override filters if provided (admins only)
    if (session.user.role === 'admin' || session.user.role === 'coordinator') {
      if (schoolId) filters.schoolId = parseInt(schoolId);
      if (province) filters.province = province;
      if (subject) filters.subject = subject;
    }

    const students = await getEnrichedStudentsList(filters);

    // Calculate statistics
    const stats = {
      total_students: students.length,
      with_teacher: students.filter(s => s.teacher).length,
      with_school: students.filter(s => s.school).length,
      with_class: students.filter(s => s.class).length,
      by_province: students.reduce((acc: any, s) => {
        const prov = s.school?.province || 'Unknown';
        acc[prov] = (acc[prov] || 0) + 1;
        return acc;
      }, {}),
      by_teacher_subject: students.reduce((acc: any, s) => {
        const subj = s.teacher?.subject || 'Unknown';
        acc[subj] = (acc[subj] || 0) + 1;
        return acc;
      }, {})
    };

    return NextResponse.json({
      message: 'Students retrieved successfully',
      data: students,
      stats,
      pagination: {
        limit,
        offset,
        count: students.length
      },
      filters_applied: filters
    });

  } catch (error: any) {
    console.error('Error fetching enriched student data:', error);
    return NextResponse.json(
      {
        error: 'មានបញ្ហាក្នុងការទាញយកទិន្នន័យសិស្ស',
        message: error.message || 'Error fetching student data',
        code: 'INTERNAL_ERROR',
        meta: { error: error.message }
      },
      { status: 500 }
    );
  }
}
