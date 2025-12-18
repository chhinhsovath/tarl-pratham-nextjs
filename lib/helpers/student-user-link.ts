/**
 * Smart Student-User Linking Helper
 *
 * Links student data with teacher/user profile information
 * Uses user's email, username, role, school_id, subject, province
 * to intelligently enrich student information display
 */

import { prisma } from '@/lib/prisma';

export interface EnrichedStudentData {
  // Student core data
  id: number;
  name: string;
  age?: number;
  gender?: string;

  // Assessment levels
  baseline_khmer_level?: string;
  baseline_math_level?: string;
  midline_khmer_level?: string;
  midline_math_level?: string;
  endline_khmer_level?: string;
  endline_math_level?: string;

  // Linked teacher/user information
  teacher?: {
    id: number;
    name: string;
    email: string;
    username?: string;
    role: string;
    subject?: string;
    province?: string;
    district?: string;
    phone?: string;
  };

  // School information
  school?: {
    id: number;
    school_name: string;
    school_code: string;
    province?: string;
    district?: string;
  };

  // Class information
  class?: {
    id: number;
    name: string;
    grade_level?: string;
  };
}

/**
 * Get enriched student data with linked teacher and school information
 */
export async function getEnrichedStudentData(
  studentId: number
): Promise<EnrichedStudentData | null> {
  const student = await prisma.students.findUnique({
    where: { id: studentId },
    include: {
      users_assessments_added_by_idTousers: {
        select: {
          id: true,
          name: true,
          email: true,
          username: true,
          role: true,
          subject: true,
          province: true,
          district: true,
          phone: true
        }
      },
      pilot_schools: {
        select: {
          id: true,
          school_name: true,
          school_code: true,
          province: true,
          district: true
        }
      },
      school_class: {
        select: {
          id: true,
          name: true,
          grade_level: true
        }
      }
    }
  });

  if (!student) return null;

  return {
    id: student.id,
    name: student.name,
    age: student.age ?? undefined,
    gender: student.gender ?? undefined,
    baseline_khmer_level: student.baseline_khmer_level ?? undefined,
    baseline_math_level: student.baseline_math_level ?? undefined,
    midline_khmer_level: student.midline_khmer_level ?? undefined,
    midline_math_level: student.midline_math_level ?? undefined,
    endline_khmer_level: student.endline_khmer_level ?? undefined,
    endline_math_level: student.endline_math_level ?? undefined,
    teacher: student.added_by ? {
      id: student.added_by.id,
      name: student.added_by.name,
      email: student.added_by.email,
      username: student.added_by.username ?? undefined,
      role: student.added_by.role,
      subject: student.added_by.subject ?? undefined,
      province: student.added_by.province ?? undefined,
      district: student.added_by.district ?? undefined,
      phone: student.added_by.phone ?? undefined
    } : undefined,
    school: student.pilot_school ? {
      id: student.pilot_schools.id,
      school_name: student.pilot_schools.school_name,
      school_code: student.pilot_schools.school_code,
      province: student.pilot_schools.province ?? undefined,
      district: student.pilot_schools.district ?? undefined
    } : undefined,
    class: student.school_class ? {
      id: student.school_class.id,
      name: student.school_class.name,
      grade_level: student.school_class.grade_level ?? undefined
    } : undefined
  };
}

/**
 * Get multiple enriched students with smart filtering by teacher profile
 */
export async function getEnrichedStudentsList(filters: {
  teacherId?: number;
  schoolId?: number;
  province?: string;
  subject?: string;
  role?: string;
  limit?: number;
  offset?: number;
}) {
  const where: any = {
    is_active: true
  };

  // Smart filtering based on teacher profile
  if (filters.teacherId) {
    where.added_by_id = filters.teacherId;
  }

  if (filters.schoolId) {
    where.pilot_school_id = filters.schoolId;
  }

  // Smart province-based filtering
  if (filters.province) {
    where.pilot_school = {
      province: filters.province
    };
  }

  const students = await prisma.students.findMany({
    where,
    include: {
      users_assessments_added_by_idTousers: {
        select: {
          id: true,
          name: true,
          email: true,
          username: true,
          role: true,
          subject: true,
          province: true,
          district: true,
          phone: true
        }
      },
      pilot_schools: {
        select: {
          id: true,
          school_name: true,
          school_code: true,
          province: true,
          district: true
        }
      },
      school_class: {
        select: {
          id: true,
          name: true,
          grade_level: true
        }
      }
    },
    take: filters.limit ?? 50,
    skip: filters.offset ?? 0,
    orderBy: { created_at: 'desc' }
  });

  return students.map(student => ({
    id: student.id,
    name: student.name,
    age: student.age ?? undefined,
    gender: student.gender ?? undefined,
    baseline_khmer_level: student.baseline_khmer_level ?? undefined,
    baseline_math_level: student.baseline_math_level ?? undefined,
    midline_khmer_level: student.midline_khmer_level ?? undefined,
    midline_math_level: student.midline_math_level ?? undefined,
    endline_khmer_level: student.endline_khmer_level ?? undefined,
    endline_math_level: student.endline_math_level ?? undefined,
    teacher: student.added_by ? {
      id: student.added_by.id,
      name: student.added_by.name,
      email: student.added_by.email,
      username: student.added_by.username ?? undefined,
      role: student.added_by.role,
      subject: student.added_by.subject ?? undefined,
      province: student.added_by.province ?? undefined,
      district: student.added_by.district ?? undefined,
      phone: student.added_by.phone ?? undefined
    } : undefined,
    school: student.pilot_school ? {
      id: student.pilot_schools.id,
      school_name: student.pilot_schools.school_name,
      school_code: student.pilot_schools.school_code,
      province: student.pilot_schools.province ?? undefined,
      district: student.pilot_schools.district ?? undefined
    } : undefined,
    class: student.school_class ? {
      id: student.school_class.id,
      name: student.school_class.name,
      grade_level: student.school_class.grade_level ?? undefined
    } : undefined
  }));
}

/**
 * Smart student display helper - formats student info with teacher context
 */
export function formatStudentDisplay(student: EnrichedStudentData): string {
  const parts = [student.name];

  if (student.class?.name) {
    parts.push(`ថ្នាក់: ${student.class.name}`);
  }

  if (student.school?.school_name) {
    parts.push(`សាលា: ${student.school.school_name}`);
  }

  if (student.teacher?.name) {
    parts.push(`គ្រូ: ${student.teacher.name}`);
  }

  if (student.school?.province) {
    parts.push(`ខេត្ត: ${student.school.province}`);
  }

  return parts.join(' | ');
}

/**
 * Check if teacher can access student based on profile matching
 */
export function canTeacherAccessStudent(
  teacherProfile: {
    id: number;
    role: string;
    pilot_school_id?: number;
    province?: string;
  },
  student: EnrichedStudentData
): boolean {
  // Admin and coordinators can access all
  if (teacherProfile.role === 'admin' || teacherProfile.role === 'coordinator') {
    return true;
  }

  // Teachers can only access their own school's students
  if (teacherProfile.role === 'teacher' || teacherProfile.role === 'mentor') {
    if (teacherProfile.pilot_school_id && student.school?.id) {
      return teacherProfile.pilot_school_id === student.school.id;
    }

    // Fallback to province match
    if (teacherProfile.province && student.school?.province) {
      return teacherProfile.province === student.school.province;
    }
  }

  return false;
}
