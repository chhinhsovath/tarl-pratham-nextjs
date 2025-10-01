/**
 * Comprehensive Input Validation Schemas
 * Using Zod for type-safe validation
 *
 * @version 1.0
 * @date 2025-10-01
 */

import { z } from 'zod';

/**
 * User validation schemas
 */
export const userCreateSchema = z.object({
  name: z.string().min(1, "សូមបញ្ចូលឈ្មោះ").max(255, "ឈ្មោះវែងពេក"),
  email: z.string().email("អ៊ីមែលមិនត្រឹមត្រូវ"),
  password: z.string().min(8, "ពាក្យសម្ងាត់ត្រូវមានយ៉ាងតិច 8 តួអក្សរ")
    .regex(/[A-Z]/, "ពាក្យសម្ងាត់ត្រូវមានអក្សរធំយ៉ាងតិច 1")
    .regex(/[a-z]/, "ពាក្យសម្ងាត់ត្រូវមានអក្សរតូចយ៉ាងតិច 1")
    .regex(/[0-9]/, "ពាក្យសម្ងាត់ត្រូវមានលេខយ៉ាងតិច 1"),
  role: z.enum(["admin", "coordinator", "mentor", "teacher", "viewer"]),
  province: z.string().optional(),
  district: z.string().optional(),
  commune: z.string().optional(),
  village: z.string().optional(),
  subject: z.string().optional(),
  phone: z.string().regex(/^\+?[0-9]{9,15}$/, "លេខទូរស័ព្ទមិនត្រឹមត្រូវ").optional(),
  pilot_school_id: z.number().int().positive().optional(),
});

export const userUpdateSchema = userCreateSchema.partial().omit({ password: true }).extend({
  password: z.string().min(8).regex(/[A-Z]/).regex(/[a-z]/).regex(/[0-9]/).optional(),
});

/**
 * Student validation schemas
 */
export const studentCreateSchema = z.object({
  name: z.string().min(1, "សូមបញ្ចូលឈ្មោះសិស្ស").max(255),
  age: z.number().int().min(5, "អាយុត្រូវតែច្រើនជាង 5 ឆ្នាំ").max(25, "អាយុមិនត្រឹមត្រូវ").optional(),
  gender: z.enum(["male", "female", "other"], { errorMap: () => ({ message: "សូមជ្រើសរើសភេទ" }) }).optional(),
  pilot_school_id: z.number().int().positive().optional(),
  school_class_id: z.number().int().positive().optional(),
  guardian_name: z.string().max(255).optional(),
  guardian_phone: z.string().regex(/^\+?[0-9]{9,15}$/).optional(),
  address: z.string().max(500).optional(),
  photo: z.string().url().optional(),
  baseline_khmer_level: z.string().optional(),
  baseline_math_level: z.string().optional(),
  midline_khmer_level: z.string().optional(),
  midline_math_level: z.string().optional(),
  endline_khmer_level: z.string().optional(),
  endline_math_level: z.string().optional(),
});

export const studentUpdateSchema = studentCreateSchema.partial();

/**
 * Assessment validation schemas
 */
export const assessmentCreateSchema = z.object({
  student_id: z.number().int().positive("សូមជ្រើសរើសសិស្ស"),
  pilot_school_id: z.number().int().positive().optional(),
  assessment_type: z.enum(["ដើមគ្រា", "ពាក់កណ្តាលគ្រា", "ចុងគ្រា"], {
    errorMap: () => ({ message: "សូមជ្រើសរើសប្រភេទការវាយតម្លៃ" })
  }),
  subject: z.enum(["khmer", "math"], {
    errorMap: () => ({ message: "សូមជ្រើសរើសមុខវិជ្ជា" })
  }),
  level: z.enum(["beginner", "letter", "word", "paragraph", "story"], {
    errorMap: () => ({ message: "សូមជ្រើសរើសកម្រិត" })
  }).optional(),
  score: z.number().min(0, "ពិន្ទុមិនអាចតិចជាង 0").max(100, "ពិន្ទុមិនអាចលើសពី 100").optional(),
  notes: z.string().max(5000).optional(),
  assessed_date: z.string().datetime().or(z.date()).optional(),
});

export const assessmentUpdateSchema = assessmentCreateSchema.partial().omit({ student_id: true });

/**
 * Mentoring Visit validation schemas
 */
export const mentoringVisitCreateSchema = z.object({
  mentor_id: z.number().int().positive(),
  teacher_id: z.number().int().positive().optional(),
  pilot_school_id: z.number().int().positive().optional(),
  school_id: z.number().int().positive().optional(),
  visit_date: z.string().datetime().or(z.date()),
  level: z.string().optional(),
  purpose: z.string().max(1000).optional(),
  activities: z.string().max(5000).optional(),
  observations: z.string().max(5000).optional(),
  recommendations: z.string().max(5000).optional(),
  follow_up_actions: z.string().max(5000).optional(),
  participants_count: z.number().int().min(0).optional(),
  duration_minutes: z.number().int().min(0).max(600).optional(),
  status: z.enum(["scheduled", "in_progress", "completed", "cancelled"]).default("scheduled"),
});

export const mentoringVisitUpdateSchema = mentoringVisitCreateSchema.partial().omit({ mentor_id: true });

/**
 * Pagination validation
 */
export const paginationSchema = z.object({
  page: z.number().int().positive().default(1).or(z.string().transform((val) => parseInt(val) || 1)),
  limit: z.number().int().min(1).max(100).default(10).or(z.string().transform((val) => parseInt(val) || 10)),
  search: z.string().max(255).optional(),
  sortBy: z.string().max(100).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

/**
 * ID parameter validation
 */
export const idSchema = z.object({
  id: z.number().int().positive().or(z.string().transform((val) => parseInt(val))),
});

/**
 * Query filter validation
 */
export const filterSchema = z.object({
  role: z.enum(["admin", "coordinator", "mentor", "teacher", "viewer"]).optional(),
  province: z.string().max(100).optional(),
  district: z.string().max(100).optional(),
  pilot_school_id: z.number().int().positive().optional(),
  school_class_id: z.number().int().positive().optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
  assessment_type: z.enum(["ដើមគ្រា", "ពាក់កណ្តាលគ្រា", "ចុងគ្រា"]).optional(),
  subject: z.enum(["khmer", "math"]).optional(),
  status: z.string().max(50).optional(),
  is_active: z.boolean().or(z.string().transform((val) => val === "true")).optional(),
  is_temporary: z.boolean().or(z.string().transform((val) => val === "true")).optional(),
  include_test_data: z.boolean().or(z.string().transform((val) => val === "true")).optional(),
});

/**
 * Validate request body
 */
export async function validateBody<T>(schema: z.ZodSchema<T>, body: any): Promise<{
  success: boolean;
  data?: T;
  errors?: z.ZodError;
}> {
  try {
    const data = await schema.parseAsync(body);
    return { success: true, data };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error };
    }
    throw error;
  }
}

/**
 * Format Zod errors for API response
 */
export function formatValidationErrors(errors: z.ZodError): {
  message: string;
  fields: Record<string, string[]>;
} {
  const fields: Record<string, string[]> = {};

  for (const error of errors.errors) {
    const field = error.path.join('.');
    if (!fields[field]) {
      fields[field] = [];
    }
    fields[field].push(error.message);
  }

  return {
    message: "ទិន្នន័យមិនត្រឹមត្រូវ សូមពិនិត្យឡើងវិញ",
    fields,
  };
}
