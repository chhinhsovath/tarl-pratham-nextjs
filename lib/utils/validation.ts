import * as z from 'zod';

// User validation schemas
export const createUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['admin', 'coordinator', 'mentor', 'teacher', 'viewer']),
  province: z.string().optional(),
  subject: z.string().optional(),
  phone: z.string().optional(),
  pilot_school_id: z.number().optional()
});

export const updateUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  email: z.string().email('Invalid email address').optional(),
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
  role: z.enum(['admin', 'coordinator', 'mentor', 'teacher', 'viewer']).optional(),
  province: z.string().optional(),
  subject: z.string().optional(),
  phone: z.string().optional(),
  pilot_school_id: z.number().optional()
});

// School validation schemas
export const createSchoolSchema = z.object({
  name: z.string().min(2, 'School name must be at least 2 characters'),
  code: z.string().min(2, 'School code must be at least 2 characters'),
  province_id: z.number().min(1, 'Province is required'),
  district: z.string().optional(),
  commune: z.string().optional(),
  village: z.string().optional(),
  school_type: z.string().optional(),
  level: z.string().optional(),
  total_students: z.number().min(0).optional(),
  total_teachers: z.number().min(0).optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  is_active: z.boolean().default(true)
});

export const updateSchoolSchema = createSchoolSchema.partial();

// Student validation schemas
export const createStudentSchema = z.object({
  name: z.string().min(2, 'Student name must be at least 2 characters'),
  age: z.number().min(5).max(20).optional(),
  gender: z.enum(['Male', 'Female']).optional(),
  guardian_name: z.string().optional(),
  guardian_phone: z.string().optional(),
  address: z.string().optional(),
  photo: z.string().optional(),
  school_class_id: z.number().optional(),
  pilot_school_id: z.number().optional()
});

export const updateStudentSchema = createStudentSchema.partial();

// Assessment validation schemas
export const createAssessmentSchema = z.object({
  student_id: z.number().min(1, 'Student is required'),
  pilot_school_id: z.number().optional(),
  assessment_type: z.enum(['baseline', 'midline', 'endline']),
  subject: z.enum(['khmer', 'math']),
  level: z.enum(['beginner', 'letter', 'word', 'paragraph', 'story']).optional(),
  score: z.number().min(0).max(100).optional(),
  notes: z.string().optional(),
  assessed_date: z.string().transform((str) => new Date(str)).optional()
});

export const updateAssessmentSchema = createAssessmentSchema.partial();

// Mentoring visit validation schemas
export const createMentoringVisitSchema = z.object({
  pilot_school_id: z.number().min(1, 'Pilot school is required'),
  visit_date: z.string().transform((str) => new Date(str)),
  level: z.string().optional(),
  purpose: z.string().optional(),
  activities: z.string().optional(),
  observations: z.string().optional(),
  recommendations: z.string().optional(),
  follow_up_actions: z.string().optional(),
  participants_count: z.number().min(0).optional(),
  duration_minutes: z.number().min(0).optional(),
  status: z.enum(['scheduled', 'completed', 'cancelled']).default('scheduled')
});

export const updateMentoringVisitSchema = createMentoringVisitSchema.partial();

// Class validation schemas
export const createClassSchema = z.object({
  school_id: z.number().min(1, 'School is required'),
  name: z.string().min(1, 'Class name is required'),
  grade: z.number().min(1).max(12),
  teacher_name: z.string().optional(),
  student_count: z.number().min(0).optional()
});

export const updateClassSchema = createClassSchema.partial();

// Bulk import validation schemas
export const bulkImportSchema = z.object({
  file: z.any().refine((file) => file instanceof File, 'File is required'),
  preview: z.boolean().default(false)
});

// Filter validation schemas
export const studentFilterSchema = z.object({
  search: z.string().optional(),
  school_class_id: z.number().optional(),
  pilot_school_id: z.number().optional(),
  gender: z.enum(['Male', 'Female']).optional(),
  age_min: z.number().min(5).optional(),
  age_max: z.number().max(20).optional(),
  is_temporary: z.boolean().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20)
});

export const assessmentFilterSchema = z.object({
  search: z.string().optional(),
  student_id: z.number().optional(),
  pilot_school_id: z.number().optional(),
  assessment_type: z.enum(['baseline', 'midline', 'endline']).optional(),
  subject: z.enum(['khmer', 'math']).optional(),
  date_from: z.string().optional(),
  date_to: z.string().optional(),
  is_temporary: z.boolean().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20)
});

export const mentoringFilterSchema = z.object({
  search: z.string().optional(),
  pilot_school_id: z.number().optional(),
  status: z.enum(['scheduled', 'completed', 'cancelled']).optional(),
  date_from: z.string().optional(),
  date_to: z.string().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20)
});

// Form validation helper functions
export function validateRequired(value: any, fieldName: string): string | null {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return `${fieldName} is required`;
  }
  return null;
}

export function validateEmail(email: string): string | null {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Invalid email address';
  }
  return null;
}

export function validatePhone(phone: string): string | null {
  if (phone && phone.length > 0) {
    const phoneRegex = /^[+]?[\d\s\-()]+$/;
    if (!phoneRegex.test(phone) || phone.length < 8) {
      return 'Invalid phone number';
    }
  }
  return null;
}

export function validateAge(age: number): string | null {
  if (age < 5 || age > 20) {
    return 'Age must be between 5 and 20';
  }
  return null;
}

export function validateScore(score: number): string | null {
  if (score < 0 || score > 100) {
    return 'Score must be between 0 and 100';
  }
  return null;
}

export function validateDate(date: string | Date): string | null {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(dateObj.getTime())) {
    return 'Invalid date';
  }
  if (dateObj > new Date()) {
    return 'Date cannot be in the future';
  }
  return null;
}

// File validation
export function validateImageFile(file: File): string | null {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!validTypes.includes(file.type)) {
    return 'Invalid file type. Only JPEG, PNG, and WebP images are allowed.';
  }

  if (file.size > maxSize) {
    return 'File size must be less than 5MB.';
  }

  return null;
}

export function validateExcelFile(file: File): string | null {
  const validTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
    'text/csv'
  ];
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!validTypes.includes(file.type)) {
    return 'Invalid file type. Only Excel (.xlsx, .xls) and CSV files are allowed.';
  }

  if (file.size > maxSize) {
    return 'File size must be less than 10MB.';
  }

  return null;
}

// Async validation functions
export async function validateUniqueEmail(email: string, excludeId?: number): Promise<string | null> {
  try {
    const response = await fetch(`/api/users/validate-email?email=${encodeURIComponent(email)}${excludeId ? `&exclude=${excludeId}` : ''}`);
    const data = await response.json();
    
    if (!data.isUnique) {
      return 'Email address is already in use';
    }
    
    return null;
  } catch (error) {
    console.error('Email validation error:', error);
    return 'Unable to validate email';
  }
}

export async function validateUniqueSchoolCode(code: string, excludeId?: number): Promise<string | null> {
  try {
    const response = await fetch(`/api/schools/validate-code?code=${encodeURIComponent(code)}${excludeId ? `&exclude=${excludeId}` : ''}`);
    const data = await response.json();
    
    if (!data.isUnique) {
      return 'School code is already in use';
    }
    
    return null;
  } catch (error) {
    console.error('School code validation error:', error);
    return 'Unable to validate school code';
  }
}

// Form error handling
export interface FormErrors {
  [key: string]: string | undefined;
}

export function hasFormErrors(errors: FormErrors): boolean {
  return Object.values(errors).some(error => error !== undefined);
}

export function getFirstFormError(errors: FormErrors): string | null {
  const firstError = Object.values(errors).find(error => error !== undefined);
  return firstError || null;
}

export function clearFormErrors(): FormErrors {
  return {};
}

// Common validation messages
export const VALIDATION_MESSAGES = {
  REQUIRED: 'This field is required',
  INVALID_EMAIL: 'Invalid email address',
  INVALID_PHONE: 'Invalid phone number',
  INVALID_DATE: 'Invalid date',
  FUTURE_DATE: 'Date cannot be in the future',
  INVALID_AGE: 'Age must be between 5 and 20',
  INVALID_SCORE: 'Score must be between 0 and 100',
  PASSWORD_TOO_SHORT: 'Password must be at least 6 characters',
  EMAIL_TAKEN: 'Email address is already in use',
  CODE_TAKEN: 'Code is already in use',
  FILE_TOO_LARGE: 'File size is too large',
  INVALID_FILE_TYPE: 'Invalid file type'
};