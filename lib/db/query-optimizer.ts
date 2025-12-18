/**
 * Prisma Query Optimization Utilities
 *
 * Provides optimized query patterns to prevent:
 * - N+1 queries
 * - Large data transfers
 * - Inefficient joins
 *
 * All functions use batch operations and proper `select` clauses
 */

import { prisma } from '@/lib/prisma';

/**
 * Batch fetch students by IDs
 *
 * USAGE: Instead of loop with findUnique, use this
 * ❌ Bad:
 *   for (let id of studentIds) {
 *     const student = await prisma.student.findUnique({...})
 *   }
 *
 * ✅ Good:
 *   const students = await batchFetchStudents(studentIds)
 *   const studentMap = new Map(students.map(s => [s.id, s]))
 */
export async function batchFetchStudents(
  studentIds: number[],
  fields?: (keyof typeof studentFieldSelectors)[]
) {
  if (studentIds.length === 0) return [];

  const selector = fields
    ? { [fields[0]]: true, id: true }
    : studentFieldSelectors.minimal;

  return prisma.student.findMany({
    where: { id: { in: studentIds } },
    select: selector as any
  });
}

/**
 * Batch check for existing assessments
 *
 * USAGE: Before bulk creating assessments, check for duplicates
 * ❌ Bad:
 *   for (let item of assessments) {
 *     const existing = await prisma.assessments.findFirst({
 *       where: { student_id, assessment_type, subject }
 *     })
 *   }
 *
 * ✅ Good:
 *   const existing = await batchCheckAssessments(assessments)
 */
export async function batchCheckAssessments(
  assessmentQueries: Array<{
    student_id: number;
    assessment_type: string;
    subject: string;
  }>
) {
  if (assessmentQueries.length === 0) return [];

  // Build OR conditions
  const orConditions = assessmentQueries.map(q => ({
    student_id: q.student_id,
    assessment_type: q.assessment_type,
    subject: q.subject
  }));

  return prisma.assessments.findMany({
    where: { OR: orConditions },
    select: {
      id: true,
      student_id: true,
      assessment_type: true,
      subject: true
    }
  });
}

/**
 * Batch fetch assessments by student IDs
 */
export async function batchFetchAssessmentsByStudents(
  studentIds: number[],
  limit?: number
) {
  if (studentIds.length === 0) return [];

  return prisma.assessments.findMany({
    where: { student_id: { in: studentIds } },
    select: {
      id: true,
      student_id: true,
      assessment_type: true,
      subject: true,
      level: true,
      assessed_date: true
    },
    orderBy: { assessed_date: 'desc' },
    take: limit
  });
}

/**
 * Batch fetch mentor school assignments
 *
 * USAGE: For multiple mentors, get all assignments at once
 */
export async function batchFetchMentorAssignments(mentorIds: number[]) {
  if (mentorIds.length === 0) return [];

  return prisma.mentorSchoolAssignment.findMany({
    where: { mentor_id: { in: mentorIds } },
    select: {
      mentor_id: true,
      pilot_school_id: true,
      subject: true,
      is_active: true
    }
  });
}

/**
 * Group records by key with minimal data transfer
 *
 * USAGE: For analysis/aggregation without loading all records
 */
export async function groupAssessmentsBySubject(
  where?: any
) {
  return prisma.assessments.groupBy({
    by: ['subject', 'assessment_type'],
    where,
    _count: {
      id: true
    },
    _max: {
      assessed_date: true
    }
  });
}

/**
 * Common field selectors to prevent over-fetching
 */
export const studentFieldSelectors = {
  // Minimal fields for existence checks
  minimal: {
    id: true
  },

  // Preview/list display
  preview: {
    id: true,
    name: true,
    grade: true,
    gender: true,
    is_active: true,
    pilot_school_id: true
  },

  // Full detail for editing
  full: {
    id: true,
    student_id: true,
    name: true,
    age: true,
    gender: true,
    grade: true,
    school_class_id: true,
    pilot_school_id: true,
    baseline_khmer_level: true,
    baseline_math_level: true,
    midline_khmer_level: true,
    midline_math_level: true,
    endline_khmer_level: true,
    endline_math_level: true,
    is_active: true,
    added_by_id: true,
    created_at: true
  }
};

export const assessmentFieldSelectors = {
  // Minimal fields for existence checks
  minimal: {
    id: true
  },

  // List display
  preview: {
    id: true,
    student_id: true,
    assessment_type: true,
    subject: true,
    level: true,
    assessed_date: true,
    is_locked: true
  },

  // Full detail with relations
  full: {
    id: true,
    student_id: true,
    pilot_school_id: true,
    assessment_type: true,
    subject: true,
    level: true,
    assessed_date: true,
    verified_by_id: true,
    is_locked: true,
    created_at: true,
    student: {
      select: {
        id: true,
        name: true,
        student_id: true
      }
    }
  }
};

export const pilotSchoolFieldSelectors = {
  minimal: {
    id: true
  },

  preview: {
    id: true,
    school_name: true,
    school_code: true,
    province: true,
    district: true
  },

  full: {
    id: true,
    school_name: true,
    school_code: true,
    province: true,
    district: true,
    cluster: true,
    baseline_start_date: true,
    baseline_end_date: true,
    midline_start_date: true,
    midline_end_date: true,
    endline_start_date: true,
    endline_end_date: true,
    is_locked: true
  }
};

/**
 * Optimized list query with proper pagination
 */
export async function optimizedFindMany<T>(
  model: any,
  options: {
    where?: any;
    skip?: number;
    take?: number;
    orderBy?: any;
    select?: any;
  }
) {
  // Always use limit for serverless
  const take = Math.min(options.take || 10, 100);
  const skip = options.skip || 0;

  const [data, total] = await Promise.all([
    model.findMany({
      where: options.where,
      select: options.select,
      orderBy: options.orderBy,
      skip,
      take
    }),
    model.count({ where: options.where })
  ]);

  return {
    data,
    pagination: {
      skip,
      take,
      total,
      pages: Math.ceil(total / take)
    }
  };
}
