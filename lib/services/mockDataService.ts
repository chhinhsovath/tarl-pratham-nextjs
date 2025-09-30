/**
 * Mock Data Service for Mentor Test Environment
 * Generates realistic test data for mentors to practice with
 */

export interface MockStudent {
  id: number;
  name: string;
  age: number;
  gender: 'male' | 'female';
  grade_level: 'grade_4' | 'grade_5';
  student_status: 'active' | 'inactive' | 'transferred';
  birth_date: string;
  guardian_name: string;
  guardian_phone: string;
  address: string;
  baseline_khmer_level: string | null;
  baseline_math_level: string | null;
  midline_khmer_level: string | null;
  midline_math_level: string | null;
  endline_khmer_level: string | null;
  endline_math_level: string | null;
  is_temporary: boolean;
  added_by_mentor: boolean;
  record_status: 'production' | 'test_mentor' | 'test_teacher' | 'demo' | 'archived';
  created_by_role: string;
  test_session_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface MockAssessment {
  id: number;
  student_id: number;
  assessment_type: 'baseline' | 'midline' | 'endline';
  subject: 'khmer' | 'math';
  level: string;
  score: number;
  total_questions: number;
  assessed_date: string;
  assessed_by: string;
  is_temporary: boolean;
  assessed_by_mentor: boolean;
  record_status: 'production' | 'test_mentor' | 'test_teacher' | 'demo' | 'archived';
  created_by_role: string;
  test_session_id: string | null;
  created_at: string;
}

export interface MockMentoringVisit {
  id: number;
  visit_date: string;
  school_name: string;
  mentor_name: string;
  duration_minutes: number;
  participants_count: number;
  status: 'scheduled' | 'completed' | 'cancelled';
  observations: string;
  action_items: string;
  is_temporary: boolean;
  record_status: 'production' | 'test_mentor' | 'test_teacher' | 'demo' | 'archived';
  created_by_role: string;
  test_session_id: string | null;
}

// Khmer names for students
const KHMER_FIRST_NAMES_MALE = [
  'សុខា', 'វិរៈ', 'ចន្ទ', 'រតនៈ', 'កុសល', 'ធារ៉ា', 'បញ្ញា', 'ភីរម្យ', 'មករា', 'សូរ្យា'
];

const KHMER_FIRST_NAMES_FEMALE = [
  'សុភា', 'ចន្ទនី', 'ស្រីមាស', 'រស្មី', 'ពេជ្រ', 'សោភា', 'ដារ៉ា', 'លីដា', 'នារី', 'កញ្ញា'
];

const KHMER_LAST_NAMES = [
  'ហេង', 'គឹម', 'លឹម', 'ផាន', 'ចាន់', 'ហ៊ិន', 'ថន', 'សុខ', 'វង្ស', 'ណន',
  'សឺន', 'នួន', 'ឈុន', 'ធីង', 'ស៊ឹម', 'អ៊ូន', 'ម៉េង', 'អេង', 'តាន់', 'ប៉ាក់'
];

const LEVELS = ['beginner', 'letter', 'word', 'paragraph', 'story'];
const PROVINCES = ['ភ្នំពេញ', 'សៀមរាប', 'បាត់ដំបង', 'ពោធិ៍សាត់', 'កំពង់ចាម'];
const DISTRICTS = ['ដូនពេញ', 'ទួលគោក', 'ចំការមន', 'ច្បារអំពៅ', 'ព្រែកលៀប'];

// Generate random date within range
function randomDate(start: Date, end: Date): string {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString().split('T')[0];
}

// Generate random Khmer name
function generateKhmerName(gender: 'male' | 'female'): string {
  const firstName = gender === 'male'
    ? KHMER_FIRST_NAMES_MALE[Math.floor(Math.random() * KHMER_FIRST_NAMES_MALE.length)]
    : KHMER_FIRST_NAMES_FEMALE[Math.floor(Math.random() * KHMER_FIRST_NAMES_FEMALE.length)];
  const lastName = KHMER_LAST_NAMES[Math.floor(Math.random() * KHMER_LAST_NAMES.length)];
  return `${lastName} ${firstName}`;
}

// Generate random phone number
function generatePhoneNumber(): string {
  const prefixes = ['010', '011', '012', '015', '016', '017', '081', '085', '086', '096'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const suffix = Math.floor(Math.random() * 10000000).toString().padStart(7, '0');
  return `${prefix}${suffix}`;
}

// Generate random address
function generateAddress(): string {
  const province = PROVINCES[Math.floor(Math.random() * PROVINCES.length)];
  const district = DISTRICTS[Math.floor(Math.random() * DISTRICTS.length)];
  const village = `ភូមិទី${Math.floor(Math.random() * 10) + 1}`;
  return `${village}, ${district}, ${province}`;
}

/**
 * Generate mock students for testing
 */
export function generateMockStudents(count: number = 20): MockStudent[] {
  const students: MockStudent[] = [];
  const now = new Date().toISOString();

  for (let i = 1; i <= count; i++) {
    const gender: 'male' | 'female' = Math.random() > 0.5 ? 'male' : 'female';
    const age = Math.floor(Math.random() * 3) + 9; // 9-11 years old
    const birthYear = new Date().getFullYear() - age;
    const birthDate = randomDate(new Date(birthYear, 0, 1), new Date(birthYear, 11, 31));

    const hasBaseline = Math.random() > 0.2; // 80% have baseline
    const hasMidline = hasBaseline && Math.random() > 0.5; // 50% of those with baseline
    const hasEndline = hasMidline && Math.random() > 0.7; // 30% of those with midline

    students.push({
      id: i,
      name: generateKhmerName(gender),
      age,
      gender,
      grade_level: Math.random() > 0.5 ? 'grade_4' : 'grade_5',
      student_status: Math.random() > 0.1 ? 'active' : (Math.random() > 0.5 ? 'inactive' : 'transferred'),
      birth_date: birthDate,
      guardian_name: generateKhmerName(Math.random() > 0.5 ? 'male' : 'female'),
      guardian_phone: generatePhoneNumber(),
      address: generateAddress(),
      baseline_khmer_level: hasBaseline ? LEVELS[Math.floor(Math.random() * 3)] : null,
      baseline_math_level: hasBaseline ? LEVELS[Math.floor(Math.random() * 3)] : null,
      midline_khmer_level: hasMidline ? LEVELS[Math.floor(Math.random() * 4) + 1] : null,
      midline_math_level: hasMidline ? LEVELS[Math.floor(Math.random() * 4) + 1] : null,
      endline_khmer_level: hasEndline ? LEVELS[Math.floor(Math.random() * 3) + 2] : null,
      endline_math_level: hasEndline ? LEVELS[Math.floor(Math.random() * 3) + 2] : null,
      is_temporary: true,
      added_by_mentor: true,
      record_status: 'test_mentor',
      created_by_role: 'mentor',
      test_session_id: null,
      created_at: now,
      updated_at: now
    });
  }

  return students;
}

/**
 * Generate mock assessments for given students
 */
export function generateMockAssessments(students: MockStudent[], countPerStudent: number = 3): MockAssessment[] {
  const assessments: MockAssessment[] = [];
  let id = 1;

  students.forEach(student => {
    const assessmentTypes: ('baseline' | 'midline' | 'endline')[] = ['baseline'];

    if (student.midline_khmer_level || student.midline_math_level) {
      assessmentTypes.push('midline');
    }
    if (student.endline_khmer_level || student.endline_math_level) {
      assessmentTypes.push('endline');
    }

    assessmentTypes.forEach(type => {
      // Khmer assessment
      if ((type === 'baseline' && student.baseline_khmer_level) ||
          (type === 'midline' && student.midline_khmer_level) ||
          (type === 'endline' && student.endline_khmer_level)) {
        const level = type === 'baseline' ? student.baseline_khmer_level :
                     type === 'midline' ? student.midline_khmer_level :
                     student.endline_khmer_level;

        const score = Math.floor(Math.random() * 6) + 15; // 15-20
        assessments.push({
          id: id++,
          student_id: student.id,
          assessment_type: type,
          subject: 'khmer',
          level: level || 'beginner',
          score,
          total_questions: 20,
          assessed_date: randomDate(new Date(2024, 0, 1), new Date()),
          assessed_by: 'គ្រូ សុភា',
          is_temporary: true,
          assessed_by_mentor: true,
          record_status: 'test_mentor',
          created_by_role: 'mentor',
          test_session_id: null,
          created_at: new Date().toISOString()
        });
      }

      // Math assessment
      if ((type === 'baseline' && student.baseline_math_level) ||
          (type === 'midline' && student.midline_math_level) ||
          (type === 'endline' && student.endline_math_level)) {
        const level = type === 'baseline' ? student.baseline_math_level :
                     type === 'midline' ? student.midline_math_level :
                     student.endline_math_level;

        const score = Math.floor(Math.random() * 6) + 14; // 14-19
        assessments.push({
          id: id++,
          student_id: student.id,
          assessment_type: type,
          subject: 'math',
          level: level || 'beginner',
          score,
          total_questions: 20,
          assessed_date: randomDate(new Date(2024, 0, 1), new Date()),
          assessed_by: 'គ្រូ សុភា',
          is_temporary: true,
          assessed_by_mentor: true,
          record_status: 'test_mentor',
          created_by_role: 'mentor',
          test_session_id: null,
          created_at: new Date().toISOString()
        });
      }
    });
  });

  return assessments;
}

/**
 * Generate mock mentoring visits
 */
export function generateMockMentoringVisits(count: number = 10): MockMentoringVisit[] {
  const visits: MockMentoringVisit[] = [];
  const schools = [
    'វត្តបូព៌', 'អនុវត្តមាត្តមាន', 'ជ័យជំនះ', 'ចំរើនប្រជាធិបតេយ្យ', 'មិត្តភាពខ្មែរ-ជប៉ុន'
  ];

  const mentors = ['លោក​គ្រូ រតនៈ', 'លោកគ្រូ សុខា', 'អ្នកគ្រូ ចន្ទនី', 'អ្នកគ្រូ សុភា'];

  for (let i = 1; i <= count; i++) {
    const visitDate = randomDate(new Date(2024, 0, 1), new Date());
    const status: 'scheduled' | 'completed' | 'cancelled' =
      new Date(visitDate) > new Date() ? 'scheduled' :
      (Math.random() > 0.1 ? 'completed' : 'cancelled');

    visits.push({
      id: i,
      visit_date: visitDate,
      school_name: schools[Math.floor(Math.random() * schools.length)],
      mentor_name: mentors[Math.floor(Math.random() * mentors.length)],
      duration_minutes: Math.floor(Math.random() * 90) + 60, // 60-150 minutes
      participants_count: Math.floor(Math.random() * 15) + 5, // 5-20 participants
      status,
      observations: status === 'completed' ? 'សង្កេតឃើញការរីកចម្រើនល្អក្នុងការអាន និងគណិតវិទ្យា' : '',
      action_items: status === 'completed' ? '- ត្រូវការសម្ភារៈបង្រៀនបន្ថែម\n- រៀបចំ​វគ្គបណ្តុះបណ្តាលគ្រូ' : '',
      is_temporary: true,
      record_status: 'test_mentor',
      created_by_role: 'mentor',
      test_session_id: null
    });
  }

  return visits.sort((a, b) => new Date(b.visit_date).getTime() - new Date(a.visit_date).getTime());
}

/**
 * Get statistics from mock data
 */
export function getMockStatistics() {
  const students = generateMockStudents(20);
  const assessments = generateMockAssessments(students);

  return {
    total_students: students.length,
    active_students: students.filter(s => s.student_status === 'active').length,
    total_assessments: assessments.length,
    baseline_assessments: assessments.filter(a => a.assessment_type === 'baseline').length,
    midline_assessments: assessments.filter(a => a.assessment_type === 'midline').length,
    endline_assessments: assessments.filter(a => a.assessment_type === 'endline').length,
    avg_khmer_score: Math.round(
      assessments.filter(a => a.subject === 'khmer').reduce((sum, a) => sum + (a.score / a.total_questions) * 100, 0) /
      assessments.filter(a => a.subject === 'khmer').length
    ),
    avg_math_score: Math.round(
      assessments.filter(a => a.subject === 'math').reduce((sum, a) => sum + (a.score / a.total_questions) * 100, 0) /
      assessments.filter(a => a.subject === 'math').length
    )
  };
}

/**
 * Get a single mock student by ID
 */
export function getMockStudentById(id: number): MockStudent | null {
  const students = generateMockStudents(20);
  return students.find(s => s.id === id) || null;
}

/**
 * Get mock assessments for a specific student
 */
export function getMockAssessmentsForStudent(studentId: number): MockAssessment[] {
  const students = generateMockStudents(20);
  const student = students.find(s => s.id === studentId);
  if (!student) return [];

  const allAssessments = generateMockAssessments([student]);
  return allAssessments.filter(a => a.student_id === studentId);
}