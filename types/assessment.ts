/**
 * Assessment System Type Definitions
 *
 * Aligned with:
 * - Database schema (Prisma)
 * - Excel forms (Language & Math assessment sheets)
 * - API contracts
 * - Multi-platform consistency (Next.js + Flutter)
 */

import { LANGUAGE_LEVELS, MATH_LEVELS, ASSESSMENT_TYPES, SUBJECTS } from '@/lib/constants/assessment-levels';

// ============================================================================
// Base Types from Constants
// ============================================================================

export type AssessmentType = typeof ASSESSMENT_TYPES[keyof typeof ASSESSMENT_TYPES];
export type Subject = typeof SUBJECTS[keyof typeof SUBJECTS];
export type LanguageLevel = typeof LANGUAGE_LEVELS[number];
export type MathLevel = typeof MATH_LEVELS[number];
export type AssessmentLevel = LanguageLevel | MathLevel;

export type RecordStatus = 'production' | 'test_mentor' | 'test_teacher' | 'archived';
export type Gender = 'male' | 'female' | 'other';
export type UserRole = 'admin' | 'coordinator' | 'mentor' | 'teacher' | 'viewer';

// ============================================================================
// Student Types
// ============================================================================

export interface Student {
  id: number;
  name: string;
  age?: number | null;
  gender?: Gender | null;
  pilot_school_id?: number | null;
  school_class_id?: number | null;
  guardian_name?: string | null;
  guardian_phone?: string | null;
  address?: string | null;
  photo?: string | null;

  // Assessment level fields - direct storage matching Excel forms
  baseline_khmer_level?: LanguageLevel | null;
  baseline_math_level?: MathLevel | null;
  midline_khmer_level?: LanguageLevel | null;
  midline_math_level?: MathLevel | null;
  endline_khmer_level?: LanguageLevel | null;
  endline_math_level?: MathLevel | null;

  // Data ownership & temporary status
  is_active: boolean;
  is_temporary: boolean;
  added_by_id?: number | null;
  added_by_mentor: boolean;
  assessed_by_mentor: boolean;
  mentor_created_at?: Date | null;
  record_status: RecordStatus;
  created_by_role?: UserRole | null;
  test_session_id?: string | null;

  // Timestamps
  created_at: Date;
  updated_at: Date;

  // Relations (populated when included)
  pilot_school?: PilotSchool | null;
  school_class?: SchoolClass | null;
  added_by?: User | null;
  assessments?: Assessment[];
}

export interface CreateStudentRequest {
  name: string;
  age?: number;
  gender?: Gender;
  pilot_school_id?: number;
  school_class_id?: number;
  guardian_name?: string;
  guardian_phone?: string;
  address?: string;
  photo?: string;
  baseline_khmer_level?: LanguageLevel;
  baseline_math_level?: MathLevel;
  midline_khmer_level?: LanguageLevel;
  midline_math_level?: MathLevel;
  endline_khmer_level?: LanguageLevel;
  endline_math_level?: MathLevel;
  is_temporary?: boolean;
}

export interface UpdateStudentRequest {
  id: number;
  name?: string;
  age?: number;
  gender?: Gender;
  pilot_school_id?: number;
  school_class_id?: number;
  guardian_name?: string;
  guardian_phone?: string;
  address?: string;
  photo?: string;
  baseline_khmer_level?: LanguageLevel;
  baseline_math_level?: MathLevel;
  midline_khmer_level?: LanguageLevel;
  midline_math_level?: MathLevel;
  endline_khmer_level?: LanguageLevel;
  endline_math_level?: MathLevel;
}

export interface StudentListResponse {
  data: Student[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// ============================================================================
// Assessment Types
// ============================================================================

export interface Assessment {
  id: number;
  student_id: number;
  pilot_school_id?: number | null;

  // Assessment classification
  assessment_type: AssessmentType;
  subject: Subject;
  level?: AssessmentLevel | null;

  // Assessment data
  score?: number | null;
  notes?: string | null;
  assessed_date?: Date | null;

  // Data ownership & temporary status
  added_by_id?: number | null;
  is_temporary: boolean;
  assessed_by_mentor: boolean;
  mentor_assessment_id?: string | null;
  record_status: RecordStatus;
  created_by_role?: UserRole | null;
  test_session_id?: string | null;

  // Timestamps
  created_at: Date;
  updated_at: Date;

  // Relations (populated when included)
  student?: Student;
  pilot_school?: PilotSchool | null;
  added_by?: User | null;
}

export interface CreateAssessmentRequest {
  student_id: number;
  pilot_school_id?: number;
  assessment_type: AssessmentType;
  subject: Subject;
  level?: AssessmentLevel;
  score?: number;
  notes?: string;
  assessed_date?: string; // ISO 8601 string
}

export interface UpdateAssessmentRequest {
  id: number;
  assessment_type?: AssessmentType;
  subject?: Subject;
  level?: AssessmentLevel;
  score?: number;
  notes?: string;
  assessed_date?: string; // ISO 8601 string
}

export interface BulkAssessmentRequest {
  assessments: CreateAssessmentRequest[];
  pilot_school_id?: number;
}

export interface BulkAssessmentResponse {
  message: string;
  data: {
    successful: Assessment[];
    errors: string[];
    total_processed: number;
    successful_count: number;
    error_count: number;
  };
}

export interface AssessmentListResponse {
  data: Assessment[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// ============================================================================
// Mentoring Visit Types
// ============================================================================

export interface MentoringVisit {
  id: number;
  mentor_id: number;
  pilot_school_id?: number | null;
  visit_date: Date;

  // Observation data
  observations?: string | null;
  recommendations?: string | null;
  action_plan?: string | null;
  follow_up_actions?: string | null;
  photos?: any | null; // JSON

  // Visit metadata
  participants_count?: number | null;
  duration_minutes?: number | null;
  status: string;

  // Activity tracking
  activities_data?: any | null; // JSON

  // Timestamps
  created_at: Date;
  updated_at: Date;

  // Relations (populated when included)
  mentor?: User;
  pilot_school?: PilotSchool | null;
}

export interface CreateMentoringVisitRequest {
  pilot_school_id: number;
  visit_date: string; // ISO 8601 string
  observations?: string;
  recommendations?: string;
  action_plan?: string;
  follow_up_actions?: string;
  photos?: any;
  participants_count?: number;
  duration_minutes?: number;
  activities_data?: any;
}

// ============================================================================
// School & User Types
// ============================================================================

export interface PilotSchool {
  id: number;
  province: string;
  district: string;
  cluster_id?: number | null;
  cluster: string;
  school_name: string;
  school_code: string;
  baseline_start_date?: Date | null;
  baseline_end_date?: Date | null;
  midline_start_date?: Date | null;
  midline_end_date?: Date | null;
  endline_start_date?: Date | null;
  endline_end_date?: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface SchoolClass {
  id: number;
  school_id: number;
  name: string;
  grade: number;
  teacher_name?: string | null;
  student_count?: number | null;
  created_at: Date;
  updated_at: Date;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  pilot_school_id?: number | null;
  province?: string | null;
  district?: string | null;
  test_mode_enabled: boolean;
}

// ============================================================================
// API Response Types
// ============================================================================

export interface ApiSuccessResponse<T> {
  message?: string;
  data: T;
}

export interface ApiErrorResponse {
  error: string;
  message?: string;
  code?: string;
  meta?: any;
  details?: any;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface StudentFilterParams extends PaginationParams {
  search?: string;
  gender?: Gender;
  school_class_id?: number;
  pilot_school_id?: number;
  is_temporary?: boolean;
  include_test_data?: boolean;
}

export interface AssessmentFilterParams extends PaginationParams {
  search?: string;
  assessment_type?: AssessmentType;
  subject?: Subject;
  pilot_school_id?: number;
  student_id?: number;
  is_temporary?: boolean;
}

// ============================================================================
// Form State Types (for frontend)
// ============================================================================

export interface StudentFormState {
  name: string;
  age?: number;
  gender?: Gender;
  guardian_name?: string;
  guardian_phone?: string;
  address?: string;
  pilot_school_id?: number;
  school_class_id?: number;
}

export interface AssessmentFormState {
  student_id: number;
  assessment_type: AssessmentType;
  subject: Subject;
  level?: AssessmentLevel;
  score?: number;
  notes?: string;
  assessed_date?: Date;
}

// ============================================================================
// Permission Helper Types
// ============================================================================

export interface PermissionCheck {
  canCreate: boolean;
  canRead: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  canViewTestData: boolean;
  canModifyProductionData: boolean;
  canModifyTestData: boolean;
}

export interface UserPermissions {
  role: UserRole;
  pilot_school_id?: number | null;
  test_mode_enabled: boolean;
  student: PermissionCheck;
  assessment: PermissionCheck;
  mentoring_visit: PermissionCheck;
}
