// Assessment Type Definitions with Correct Khmer Terminology
// ការកំណត់ប្រភេទវាយតម្លៃដោយប្រើភាសាខ្មែរត្រឹមត្រូវ

// Assessment Phase Types - ប្រភេទដំណាក់កាលវាយតម្លៃ
export type AssessmentPhase = 'ដើមគ្រា' | 'ពាក់កណ្តាលគ្រា' | 'ចុងគ្រា';

// Assessment Subject Types - ប្រភេទមុខវិជ្ជា
export type AssessmentSubject = 'khmer' | 'math';

// Assessment Level Types - ប្រភេទកម្រិត
export type AssessmentLevel = 'beginner' | 'letter' | 'word' | 'paragraph' | 'story';

// Assessment Interface - ចំណុចប្រទាក់វាយតម្លៃ
export interface Assessment {
  id: number;
  student_id: number;
  pilot_school_id?: number;
  assessment_type: AssessmentPhase;
  subject: AssessmentSubject;
  level?: AssessmentLevel;
  score?: number;
  notes?: string;
  assessed_date?: Date | string;
  added_by_id?: number;
  is_temporary?: boolean;
  assessed_by_mentor?: boolean;
  mentor_assessment_id?: string;
  created_at: Date | string;
  updated_at: Date | string;
}

// Assessment Create/Update Data - ទិន្នន័យបង្កើត/ធ្វើបច្ចុប្បន្នភាពវាយតម្លៃ
export interface AssessmentCreateData {
  student_id: number;
  pilot_school_id?: number;
  assessment_type: AssessmentPhase;
  subject: AssessmentSubject;
  level?: AssessmentLevel;
  score?: number;
  notes?: string;
  assessed_date?: string;
}

export interface AssessmentUpdateData extends Partial<AssessmentCreateData> {
  id: number;
}

// Bulk Assessment Data - ទិន្នន័យវាយតម្លៃជាដុំ
export interface BulkAssessmentData {
  assessments: AssessmentCreateData[];
  pilot_school_id?: number;
}

// Assessment Filter Interface - ចំណុចប្រទាក់ត្រង
export interface AssessmentFilter {
  search?: string;
  student_id?: number;
  pilot_school_id?: number;
  assessment_type?: AssessmentPhase;
  subject?: AssessmentSubject;
  date_from?: string;
  date_to?: string;
  is_temporary?: boolean;
  page?: number;
  limit?: number;
}

// Assessment Response Interface - ចំណុចប្រទាក់ចម្លើយតប
export interface AssessmentResponse {
  data: Assessment[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Assessment Phase Labels - ស្លាកដំណាក់កាលវាយតម្លៃ
export const ASSESSMENT_PHASE_LABELS: Record<AssessmentPhase, string> = {
  'ដើមគ្រា': 'ដើមគ្រា',
  'ពាក់កណ្តាលគ្រា': 'ពាក់កណ្តាលគ្រា', 
  'ចុងគ្រា': 'ចុងគ្រា'
};

// Assessment Subject Labels - ស្លាកមុខវិជ្ជា
export const ASSESSMENT_SUBJECT_LABELS: Record<AssessmentSubject, string> = {
  'khmer': 'ភាសាខ្មែរ',
  'math': 'គណិតវិទ្យា'
};

// Assessment Level Labels - ស្លាកកម្រិត
export const ASSESSMENT_LEVEL_LABELS: Record<AssessmentLevel, string> = {
  'beginner': 'ចាប់ផ្តើម',
  'letter': 'អក្សរ',
  'word': 'ពាក្យ',
  'paragraph': 'កថាខណ្ឌ',
  'story': 'រឿង'
};

// Assessment Phase Colors - ពណ៌ដំណាក់កាលវាយតម្លៃ
export const ASSESSMENT_PHASE_COLORS: Record<AssessmentPhase, string> = {
  'ដើមគ្រា': 'blue',
  'ពាក់កណ្តាលគ្រា': 'orange',
  'ចុងគ្រា': 'green'
};

// Assessment Subject Colors - ពណ៌មុខវិជ្ជា
export const ASSESSMENT_SUBJECT_COLORS: Record<AssessmentSubject, string> = {
  'khmer': 'purple',
  'math': 'cyan'
};

// Helper Functions - មុខងារជំនួយ

/**
 * Check if assessment type is valid Khmer phase
 * ពិនិត្យថាតើប្រភេទវាយតម្លៃជាដំណាក់កាលខ្មែរត្រឹមត្រូវដែរឬទេ
 */
export function isValidAssessmentPhase(phase: string): phase is AssessmentPhase {
  return ['ដើមគ្រា', 'ពាក់កណ្តាលគ្រា', 'ចុងគ្រា'].includes(phase);
}

/**
 * Get assessment phase label
 * ទទួលយកស្លាកដំណាក់កាលវាយតម្លៃ
 */
export function getAssessmentPhaseLabel(phase: AssessmentPhase): string {
  return ASSESSMENT_PHASE_LABELS[phase];
}

/**
 * Get assessment subject label  
 * ទទួលយកស្លាកមុខវិជ្ជា
 */
export function getAssessmentSubjectLabel(subject: AssessmentSubject): string {
  return ASSESSMENT_SUBJECT_LABELS[subject];
}

/**
 * Get assessment level label
 * ទទួលយកស្លាកកម្រិត
 */
export function getAssessmentLevelLabel(level: AssessmentLevel): string {
  return ASSESSMENT_LEVEL_LABELS[level];
}

/**
 * Get assessment phase color
 * ទទួលយកពណ៌ដំណាក់កាលវាយតម្លៃ
 */
export function getAssessmentPhaseColor(phase: AssessmentPhase): string {
  return ASSESSMENT_PHASE_COLORS[phase];
}

/**
 * Get assessment subject color
 * ទទួលយកពណ៌មុខវិជ្ជា
 */
export function getAssessmentSubjectColor(subject: AssessmentSubject): string {
  return ASSESSMENT_SUBJECT_COLORS[subject];
}

// Legacy English to Khmer mapping (for migration support)
// ការផ្គូផ្គងភាសាអង់គ្លេសទៅខ្មែរបុរាណ (សម្រាប់ការដាក់ជំនួសដែលគាំទ្រ)
export const LEGACY_ASSESSMENT_TYPE_MAP: Record<string, AssessmentPhase> = {
  'baseline': 'ដើមគ្រា',
  'midline': 'ពាក់កណ្តាលគ្រា',
  'endline': 'ចុងគ្រា'
};

/**
 * Convert legacy English assessment type to Khmer
 * បម្លែងប្រភេទវាយតម្លៃភាសាអង់គ្លេសបុរាណទៅខ្មែរ
 */
export function convertLegacyAssessmentType(legacyType: string): AssessmentPhase | null {
  return LEGACY_ASSESSMENT_TYPE_MAP[legacyType] || null;
}

/**
 * Get all assessment phases
 * ទទួលយកដំណាក់កាលវាយតម្លៃទាំងអស់
 */
export function getAllAssessmentPhases(): AssessmentPhase[] {
  return ['ដើមគ្រា', 'ពាក់កណ្តាលគ្រា', 'ចុងគ្រា'];
}

/**
 * Get all assessment subjects
 * ទទួលយកមុខវិជ្ជាវាយតម្លៃទាំងអស់
 */
export function getAllAssessmentSubjects(): AssessmentSubject[] {
  return ['khmer', 'math'];
}

/**
 * Get all assessment levels
 * ទទួលយកកម្រិតវាយតម្លៃទាំងអស់
 */
export function getAllAssessmentLevels(): AssessmentLevel[] {
  return ['beginner', 'letter', 'word', 'paragraph', 'story'];
}