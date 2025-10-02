/**
 * Assessment Level Constants
 *
 * These constants match the Excel forms exactly:
 * - Classroom Data Recording - Language - Final with logo.xlsx
 * - Classroom Data Recording - Math - Final with logo.xlsx
 *
 * IMPORTANT: Do NOT modify these values without updating the Excel forms
 */

export const ASSESSMENT_TYPES = {
  BASELINE: 'baseline',
  MIDLINE: 'midline',
  ENDLINE: 'endline'
} as const;

export const ASSESSMENT_TYPE_LABELS_KM = {
  baseline: 'តេស្តដើមគ្រា',
  midline: 'តេស្តពាក់កណ្ដាលគ្រា',
  endline: 'តេស្តចុងក្រោយគ្រា'
} as const;

export const ASSESSMENT_TYPE_LABELS_EN = {
  baseline: 'Baseline',
  midline: 'Midline',
  endline: 'Endline'
} as const;

export const SUBJECTS = {
  LANGUAGE: 'language',
  MATH: 'math'
} as const;

export const SUBJECT_LABELS_KM = {
  language: 'ខ្មែរ',
  math: 'គណិតវិទ្យា'
} as const;

export const SUBJECT_LABELS_EN = {
  language: 'Khmer Language',
  math: 'Mathematics'
} as const;

/**
 * Language (Khmer) Assessment Levels - 7 Levels
 * Maps to Excel sheet columns for Language assessment
 *
 * Note: 'story' includes both comprehension levels (យល់ន័យ១ យល់ន័យ២)
 * as shown in the hard forms
 */
export const LANGUAGE_LEVELS = [
  'beginner',
  'letter',
  'word',
  'paragraph',
  'story',
  'comprehension1',
  'comprehension2'
] as const;

export const LANGUAGE_LEVEL_LABELS_KM = {
  beginner: 'កម្រិតដំបូង',
  letter: 'តួអក្សរ',
  word: 'ពាក្យ',
  paragraph: 'កថាខណ្ឌ',
  story: 'រឿង',
  comprehension1: 'យល់ន័យ១',
  comprehension2: 'យល់ន័យ២'
} as const;

export const LANGUAGE_LEVEL_LABELS_EN = {
  beginner: 'Beginner Level',
  letter: 'Letters/Characters',
  word: 'Words',
  paragraph: 'Paragraphs',
  story: 'Stories',
  comprehension1: 'Reading Comprehension 1',
  comprehension2: 'Reading Comprehension 2'
} as const;

/**
 * Math Assessment Levels - 6 Levels
 * Maps to Excel sheet columns for Math assessment
 */
export const MATH_LEVELS = [
  'beginner',
  'number_1digit',
  'number_2digit',
  'subtraction',
  'division',
  'word_problems'
] as const;

export const MATH_LEVEL_LABELS_KM = {
  beginner: 'កម្រិតដំបូង',
  number_1digit: 'លេខ១ខ្ទង',
  number_2digit: 'លេខ២ខ្ទង',
  subtraction: 'ប្រមាណវិធីដក',
  division: 'ប្រមាណវិធីចែក',
  word_problems: 'ចំណោទ'
} as const;

export const MATH_LEVEL_LABELS_EN = {
  beginner: 'Beginner Level',
  number_1digit: '1-Digit Numbers',
  number_2digit: '2-Digit Numbers',
  subtraction: 'Subtraction',
  division: 'Division',
  word_problems: 'Word Problems'
} as const;

/**
 * Grade Levels (Currently supporting Grade 4 and 5)
 */
export const GRADE_LEVELS = [4, 5] as const;

export const GRADE_LABELS_KM = {
  4: 'ថ្នាក់ទី៤',
  5: 'ថ្នាក់ទី៥'
} as const;

export const GRADE_LABELS_EN = {
  4: 'Grade 4',
  5: 'Grade 5'
} as const;

/**
 * Helper function to get levels by subject
 */
export function getLevelsBySubject(subject: 'language' | 'math'): readonly string[] {
  return subject === 'language' ? LANGUAGE_LEVELS : MATH_LEVELS;
}

/**
 * Helper function to validate level for subject
 */
export function isValidLevel(subject: 'language' | 'math', level: string): boolean {
  const levels = getLevelsBySubject(subject);
  return levels.includes(level as any);
}

/**
 * Helper function to get Khmer label for level
 */
export function getLevelLabelKM(subject: 'language' | 'math', level: string): string {
  if (subject === 'language') {
    return LANGUAGE_LEVEL_LABELS_KM[level as keyof typeof LANGUAGE_LEVEL_LABELS_KM] || level;
  } else {
    return MATH_LEVEL_LABELS_KM[level as keyof typeof MATH_LEVEL_LABELS_KM] || level;
  }
}

/**
 * Helper function to get English label for level
 */
export function getLevelLabelEN(subject: 'language' | 'math', level: string): string {
  if (subject === 'language') {
    return LANGUAGE_LEVEL_LABELS_EN[level as keyof typeof LANGUAGE_LEVEL_LABELS_EN] || level;
  } else {
    return MATH_LEVEL_LABELS_EN[level as keyof typeof MATH_LEVEL_LABELS_EN] || level;
  }
}

/**
 * Helper function to get assessment type label
 */
export function getAssessmentTypeLabelKM(type: string): string {
  return ASSESSMENT_TYPE_LABELS_KM[type as keyof typeof ASSESSMENT_TYPE_LABELS_KM] || type;
}

export function getAssessmentTypeLabelEN(type: string): string {
  return ASSESSMENT_TYPE_LABELS_EN[type as keyof typeof ASSESSMENT_TYPE_LABELS_EN] || type;
}

/**
 * Helper function to get subject label
 */
export function getSubjectLabelKM(subject: string): string {
  return SUBJECT_LABELS_KM[subject as keyof typeof SUBJECT_LABELS_KM] || subject;
}

export function getSubjectLabelEN(subject: string): string {
  return SUBJECT_LABELS_EN[subject as keyof typeof SUBJECT_LABELS_EN] || subject;
}

/**
 * Helper function to build student level field name
 * Examples: 'baseline_khmer_level', 'midline_math_level'
 */
export function buildLevelFieldName(
  assessmentType: string,
  subject: string
): string {
  const subjectKey = subject === 'language' ? 'khmer' : 'math';
  return `${assessmentType}_${subjectKey}_level`;
}

/**
 * Helper function to get all level options for a subject
 * Returns array of {value, label_km, label_en}
 */
export function getLevelOptions(subject: 'language' | 'math') {
  const levels = getLevelsBySubject(subject);
  return levels.map(level => ({
    value: level,
    label_km: getLevelLabelKM(subject, level),
    label_en: getLevelLabelEN(subject, level)
  }));
}

/**
 * Helper function to get all assessment type options
 */
export function getAssessmentTypeOptions() {
  return Object.values(ASSESSMENT_TYPES).map(type => ({
    value: type,
    label_km: getAssessmentTypeLabelKM(type),
    label_en: getAssessmentTypeLabelEN(type)
  }));
}

/**
 * Helper function to get all subject options
 */
export function getSubjectOptions() {
  return Object.values(SUBJECTS).map(subject => ({
    value: subject,
    label_km: getSubjectLabelKM(subject),
    label_en: getSubjectLabelEN(subject)
  }));
}
