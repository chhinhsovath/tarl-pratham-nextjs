import { prisma } from "@/lib/prisma";
import { canMentorAccessSchool, getMentorSchoolIds } from "@/lib/mentorAssignments";

/**
 * Authorization middleware for mentor access control
 * Validates if a mentor can perform actions on specific resources
 */

export interface AuthorizationResult {
  authorized: boolean;
  reason?: string;
  allowedSchools?: number[];
}

/**
 * Check if mentor can access a student
 * @param mentorId - The mentor's user ID
 * @param studentId - The student ID to check
 * @returns Authorization result
 */
export async function canMentorAccessStudent(
  mentorId: number,
  studentId: number
): Promise<AuthorizationResult> {
  try {
    const student = await prisma.students.findUnique({
      where: { id: studentId },
      select: { pilot_school_id: true },
    });

    if (!student) {
      return {
        authorized: false,
        reason: "Student not found",
      };
    }

    if (!student.pilot_school_id) {
      return {
        authorized: false,
        reason: "Student has no school assigned",
      };
    }

    const hasAccess = await canMentorAccessSchool(mentorId, student.pilot_school_id);

    return {
      authorized: hasAccess,
      reason: hasAccess ? undefined : "Mentor is not assigned to this student's school",
    };
  } catch (error) {
    console.error("Error checking mentor student access:", error);
    return {
      authorized: false,
      reason: "Authorization check failed",
    };
  }
}

/**
 * Check if mentor can access an assessment
 * @param mentorId - The mentor's user ID
 * @param assessmentId - The assessment ID to check
 * @param checkSubject - Whether to also validate subject assignment
 * @returns Authorization result
 */
export async function canMentorAccessAssessment(
  mentorId: number,
  assessmentId: number,
  checkSubject: boolean = true
): Promise<AuthorizationResult> {
  try {
    const assessment = await prisma.assessments.findUnique({
      where: { id: assessmentId },
      select: {
        pilot_school_id: true,
        subject: true,
      },
    });

    if (!assessment) {
      return {
        authorized: false,
        reason: "Assessment not found",
      };
    }

    if (!assessment.pilot_school_id) {
      return {
        authorized: false,
        reason: "Assessment has no school assigned",
      };
    }

    // Check school access
    const schoolAccess = checkSubject
      ? await canMentorAccessSchool(mentorId, assessment.pilot_school_id, assessment.subject)
      : await canMentorAccessSchool(mentorId, assessment.pilot_school_id);

    return {
      authorized: schoolAccess,
      reason: schoolAccess
        ? undefined
        : `Mentor is not assigned to this school${checkSubject ? " for this subject" : ""}`,
    };
  } catch (error) {
    console.error("Error checking mentor assessment access:", error);
    return {
      authorized: false,
      reason: "Authorization check failed",
    };
  }
}

/**
 * Check if mentor can access a mentoring visit
 * @param mentorId - The mentor's user ID
 * @param visitId - The visit ID to check
 * @returns Authorization result
 */
export async function canMentorAccessVisit(
  mentorId: number,
  visitId: number
): Promise<AuthorizationResult> {
  try {
    const visit = await prisma.mentoring_visits.findUnique({
      where: { id: visitId },
      select: {
        mentor_id: true,
        pilot_school_id: true,
      },
    });

    if (!visit) {
      return {
        authorized: false,
        reason: "Mentoring visit not found",
      };
    }

    // Mentors can always access their own visits
    if (visit.mentor_id === mentorId) {
      return { authorized: true };
    }

    // Check if mentor can access this school
    if (!visit.pilot_school_id) {
      return {
        authorized: false,
        reason: "Visit has no school assigned",
      };
    }

    const hasAccess = await canMentorAccessSchool(mentorId, visit.pilot_school_id);

    return {
      authorized: hasAccess,
      reason: hasAccess ? undefined : "Mentor is not assigned to this visit's school",
    };
  } catch (error) {
    console.error("Error checking mentor visit access:", error);
    return {
      authorized: false,
      reason: "Authorization check failed",
    };
  }
}

/**
 * Filter a list of students to only those accessible by mentor
 * @param mentorId - The mentor's user ID
 * @param studentIds - Array of student IDs to filter
 * @returns Array of accessible student IDs
 */
export async function filterAccessibleStudents(
  mentorId: number,
  studentIds: number[]
): Promise<number[]> {
  if (studentIds.length === 0) return [];

  const allowedSchoolIds = await getMentorSchoolIds(mentorId);

  const students = await prisma.students.findMany({
    where: {
      id: { in: studentIds },
      pilot_school_id: { in: allowedSchoolIds },
    },
    select: { id: true },
  });

  return students.map((s) => s.id);
}

/**
 * Get Prisma where clause for mentor's accessible resources
 * This is a comprehensive filter that works for students, assessments, etc.
 * @param mentorId - The mentor's user ID
 * @param options - Additional filtering options
 * @returns Prisma where clause
 */
export async function getMentorAccessWhereClause(
  mentorId: number,
  options?: {
    subject?: string;
    includeOwnRecords?: boolean; // Include records created by mentor
    recordCreatorField?: string; // Field name for creator (e.g., 'added_by_id')
  }
): Promise<any> {
  const schoolIds = await getMentorSchoolIds(mentorId, options?.subject);

  if (schoolIds.length === 0) {
    // No schools assigned
    if (options?.includeOwnRecords && options?.recordCreatorField) {
      // At least show records they created
      return {
        [options.recordCreatorField]: mentorId,
      };
    }
    return { pilot_school_id: -1 }; // No results
  }

  const whereClause: any = {
    pilot_school_id: { in: schoolIds },
  };

  // Optionally include records created by the mentor (even if at other schools)
  if (options?.includeOwnRecords && options?.recordCreatorField) {
    return {
      OR: [whereClause, { [options.recordCreatorField]: mentorId }],
    };
  }

  return whereClause;
}

/**
 * Validate mentor can create a record at a specific school
 * @param mentorId - The mentor's user ID
 * @param schoolId - The school where record will be created
 * @param subject - Optional: Subject being created
 * @returns Authorization result
 */
export async function canMentorCreateAtSchool(
  mentorId: number,
  schoolId: number,
  subject?: string
): Promise<AuthorizationResult> {
  const hasAccess = await canMentorAccessSchool(mentorId, schoolId, subject);

  return {
    authorized: hasAccess,
    reason: hasAccess
      ? undefined
      : `Mentor is not assigned to this school${subject ? ` for ${subject}` : ""}`,
  };
}

/**
 * Get comprehensive authorization context for a mentor
 * Useful for dashboard initialization and permission checks
 * @param mentorId - The mentor's user ID
 * @returns Object with all authorization details
 */
export async function getMentorAuthContext(mentorId: number) {
  const schoolIds = await getMentorSchoolIds(mentorId);
  const languageSchoolIds = await getMentorSchoolIds(mentorId, "Language");
  const mathSchoolIds = await getMentorSchoolIds(mentorId, "Math");

  return {
    mentor_id: mentorId,
    has_assignments: schoolIds.length > 0,
    accessible_schools: schoolIds,
    language_schools: languageSchoolIds,
    math_schools: mathSchoolIds,
    can_access_students: schoolIds.length > 0,
    can_create_assessments: schoolIds.length > 0,
    can_create_visits: schoolIds.length > 0,
  };
}
