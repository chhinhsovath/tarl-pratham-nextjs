export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'coordinator' | 'mentor' | 'teacher' | 'viewer';
  province?: string;
  subject?: string;
  phone?: string;
  pilot_school_id?: number;
  teacher_profile_setup: boolean;
  mentor_profile_complete: boolean;
  mentor_profile_updated_at?: Date;
  email_verified_at?: Date;
  created_at: Date;
  updated_at: Date;
  pilot_school?: PilotSchool;
}

export interface PilotSchool {
  id: number;
  name: string;
  code: string;
  province_id: number;
  district?: string;
  commune?: string;
  village?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  province?: Province;
}

export interface Province {
  id: number;
  name_english: string;
  name_khmer?: string;
  code: string;
  created_at: Date;
  updated_at: Date;
}

export interface School {
  id: number;
  name: string;
  code: string;
  province_id: number;
  district?: string;
  commune?: string;
  village?: string;
  school_type?: string;
  level?: string;
  total_students?: number;
  total_teachers?: number;
  latitude?: number;
  longitude?: number;
  phone?: string;
  email?: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  province?: Province;
}

export interface SchoolClass {
  id: number;
  school_id: number;
  name: string;
  grade: number;
  teacher_name?: string;
  student_count?: number;
  created_at: Date;
  updated_at: Date;
  school?: School;
  students?: Student[];
}

export interface Student {
  id: number;
  school_class_id?: number;
  pilot_school_id?: number;
  name: string;
  age?: number;
  gender?: 'Male' | 'Female';
  guardian_name?: string;
  guardian_phone?: string;
  address?: string;
  photo?: string;
  baseline_assessment?: string;
  midline_assessment?: string;
  endline_assessment?: string;
  baseline_khmer_level?: string;
  baseline_math_level?: string;
  midline_khmer_level?: string;
  midline_math_level?: string;
  endline_khmer_level?: string;
  endline_math_level?: string;
  is_active: boolean;
  is_temporary: boolean;
  added_by_id?: number;
  added_by_mentor: boolean;
  assessed_by_mentor: boolean;
  mentor_created_at?: Date;
  created_at: Date;
  updated_at: Date;
  school_class?: SchoolClass;
  pilot_school?: PilotSchool;
  added_by?: User;
  assessments?: Assessment[];
}

export interface Assessment {
  id: number;
  student_id: number;
  pilot_school_id?: number;
  assessment_type: 'baseline' | 'midline' | 'endline';
  subject: 'khmer' | 'math';
  level?: 'beginner' | 'letter' | 'word' | 'paragraph' | 'story';
  score?: number;
  notes?: string;
  assessed_date?: Date;
  added_by_id?: number;
  is_temporary: boolean;
  assessed_by_mentor: boolean;
  mentor_assessment_id?: string;
  created_at: Date;
  updated_at: Date;
  student?: Student;
  pilot_school?: PilotSchool;
  added_by?: User;
}

export interface MentoringVisit {
  id: number;
  mentor_id: number;
  pilot_school_id?: number;
  visit_date: Date;
  level?: string;
  purpose?: string;
  activities?: string;
  observations?: string;
  recommendations?: string;
  follow_up_actions?: string;
  photos?: any;
  participants_count?: number;
  duration_minutes?: number;
  status: 'scheduled' | 'completed' | 'cancelled';
  created_at: Date;
  updated_at: Date;
  mentor?: User;
  pilot_school?: PilotSchool;
}

// API Response Types
export interface ApiResponse<T = any> {
  success?: boolean;
  message?: string;
  error?: string;
  data?: T;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Form Types
export interface UserFormData {
  name: string;
  email: string;
  password?: string;
  role: string;
  province?: string;
  subject?: string;
  phone?: string;
  pilot_school_id?: number;
}

export interface SchoolFormData {
  name: string;
  code: string;
  province_id: number;
  district?: string;
  commune?: string;
  village?: string;
  school_type?: string;
  level?: string;
  total_students?: number;
  total_teachers?: number;
  latitude?: number;
  longitude?: number;
  phone?: string;
  email?: string;
  is_active: boolean;
}

export interface StudentFormData {
  name: string;
  age?: number;
  gender?: 'Male' | 'Female';
  guardian_name?: string;
  guardian_phone?: string;
  address?: string;
  photo?: string;
  school_class_id?: number;
  pilot_school_id?: number;
}

export interface AssessmentFormData {
  student_id: number;
  pilot_school_id?: number;
  assessment_type: 'baseline' | 'midline' | 'endline';
  subject: 'khmer' | 'math';
  level?: 'beginner' | 'letter' | 'word' | 'paragraph' | 'story';
  score?: number;
  notes?: string;
  assessed_date?: Date;
}

export interface MentoringVisitFormData {
  pilot_school_id: number;
  visit_date: Date;
  level?: string;
  purpose?: string;
  activities?: string;
  observations?: string;
  recommendations?: string;
  follow_up_actions?: string;
  participants_count?: number;
  duration_minutes?: number;
  status: 'scheduled' | 'completed' | 'cancelled';
}

// Filter Types
export interface BaseFilter {
  search?: string;
  page?: number;
  limit?: number;
}

export interface StudentFilter extends BaseFilter {
  school_class_id?: number;
  pilot_school_id?: number;
  gender?: 'Male' | 'Female';
  age_min?: number;
  age_max?: number;
  is_temporary?: boolean;
}

export interface AssessmentFilter extends BaseFilter {
  student_id?: number;
  pilot_school_id?: number;
  assessment_type?: 'baseline' | 'midline' | 'endline';
  subject?: 'khmer' | 'math';
  date_from?: string;
  date_to?: string;
  is_temporary?: boolean;
}

export interface MentoringFilter extends BaseFilter {
  pilot_school_id?: number;
  status?: 'scheduled' | 'completed' | 'cancelled';
  date_from?: string;
  date_to?: string;
}

// Statistics Types
export interface DashboardStats {
  overview: {
    total_users: number;
    total_schools: number;
    total_pilot_schools: number;
    total_students: number;
    temporary_students: number;
    total_assessments: number;
    temporary_assessments: number;
    total_mentoring_visits: number;
    total_classes: number;
  };
  recent_activity: {
    assessments_last_7_days: number;
    mentoring_visits_last_30_days: number;
    students_added_last_30_days: number;
    assessments_last_30_days: number;
  };
  growth_trends: {
    students_growth: number;
    assessments_growth: number;
  };
  distributions: {
    assessments_by_type: Record<string, number>;
    assessments_by_subject: Record<string, number>;
    students_by_gender: Record<string, number>;
    schools_by_province: Array<{
      province: string;
      province_khmer: string;
      count: number;
    }>;
    mentoring_visits_by_status: Record<string, number>;
  };
}