# TaRL Assessment System - Implementation Guide

**Target Audience:** Developers implementing CRUD operations
**Last Updated:** 2025-10-02

---

## Quick Reference: Assessment Levels

### Language (Khmer) - Use These Exact Values
```typescript
const LANGUAGE_LEVELS = [
  'beginner',        // កម្រិតដំបូង
  'letter',          // តួអក្សរ
  'word',            // ពាក្យ
  'paragraph',       // កថាខណ្ឌ
  'story',           // រឿង
  'comprehension1',  // ការអានយល់ន័យ១
  'comprehension2'   // ការអានយល់ន័យ២
]
```

### Math - Use These Exact Values
```typescript
const MATH_LEVELS = [
  'beginner',        // កម្រិតដំបូង
  'number_1digit',   // លេខ១ខ្ទង់
  'number_2digit',   // លេខ២ខ្ទង់
  'subtraction',     // ប្រមាណវិធីដក
  'division',        // ប្រមាណវិធីចែក
  'word_problems'    // ចំណោទ
]
```

---

## Implementation Checklist

### 1. Update Assessment Validation Schema

**File:** `/app/api/assessments/route.ts`

**Current Problem:**
```typescript
// ❌ Wrong - doesn't match Excel forms
level: z.enum(["beginner", "letter", "word", "paragraph", "story"])
```

**Required Fix:**
```typescript
// ✅ Correct - matches Excel forms exactly
const LANGUAGE_LEVELS = ['beginner', 'letter', 'word', 'paragraph', 'story', 'comprehension1', 'comprehension2'] as const;
const MATH_LEVELS = ['beginner', 'number_1digit', 'number_2digit', 'subtraction', 'division', 'word_problems'] as const;

// Dynamic validation based on subject
const assessmentSchema = z.object({
  student_id: z.number().min(1, "Student ID is required"),
  assessment_type: z.enum(["baseline", "midline", "endline"]),
  subject: z.enum(["language", "math"]),
  level: z.string().optional(),
  score: z.number().min(0).max(100).optional(),
  notes: z.string().optional(),
  assessed_date: z.string().datetime().optional(),
}).refine((data) => {
  if (!data.level) return true;

  if (data.subject === 'language') {
    return LANGUAGE_LEVELS.includes(data.level as any);
  } else if (data.subject === 'math') {
    return MATH_LEVELS.includes(data.level as any);
  }
  return false;
}, {
  message: "Invalid level for the selected subject",
  path: ["level"]
});
```

### 2. Create Shared Constants File

**File:** `/lib/constants/assessment-levels.ts`

```typescript
export const ASSESSMENT_TYPES = {
  BASELINE: 'baseline',
  MIDLINE: 'midline',
  ENDLINE: 'endline'
} as const;

export const SUBJECTS = {
  LANGUAGE: 'language',
  MATH: 'math'
} as const;

export const LANGUAGE_LEVELS = [
  'beginner',
  'letter',
  'word',
  'paragraph',
  'story',
  'comprehension1',
  'comprehension2'
] as const;

export const MATH_LEVELS = [
  'beginner',
  'number_1digit',
  'number_2digit',
  'subtraction',
  'division',
  'word_problems'
] as const;

export const LANGUAGE_LEVEL_LABELS = {
  beginner: 'កម្រិតដំបូង',
  letter: 'តួអក្សរ',
  word: 'ពាក្យ',
  paragraph: 'កថាខណ្ឌ',
  story: 'រឿង',
  comprehension1: 'ការអានយល់ន័យ១',
  comprehension2: 'ការអានយល់ន័យ២'
} as const;

export const MATH_LEVEL_LABELS = {
  beginner: 'កម្រិតដំបូង',
  number_1digit: 'លេខ១ខ្ទង់',
  number_2digit: 'លេខ២ខ្ទង់',
  subtraction: 'ប្រមាណវិធីដក',
  division: 'ប្រមាណវិធីចែក',
  word_problems: 'ចំណោទ'
} as const;

// Helper function to get levels by subject
export function getLevelsBySubject(subject: 'language' | 'math') {
  return subject === 'language' ? LANGUAGE_LEVELS : MATH_LEVELS;
}

// Helper function to validate level for subject
export function isValidLevel(subject: 'language' | 'math', level: string): boolean {
  const levels = getLevelsBySubject(subject);
  return levels.includes(level as any);
}

// Helper function to get label for level
export function getLevelLabel(subject: 'language' | 'math', level: string): string {
  if (subject === 'language') {
    return LANGUAGE_LEVEL_LABELS[level as keyof typeof LANGUAGE_LEVEL_LABELS] || level;
  } else {
    return MATH_LEVEL_LABELS[level as keyof typeof MATH_LEVEL_LABELS] || level;
  }
}
```

### 3. Update Student CRUD with Proper Permissions

**File:** `/app/api/students/route.ts`

**Key Points:**
1. ✅ Already implements `record_status` correctly
2. ✅ Already has school-based access control
3. ✅ Already differentiates teacher vs mentor data
4. ⚠️ Need to ensure mentors cannot UPDATE production students

**Add this check in PUT handler:**
```typescript
// In PUT /api/students
// After checking existingStudent

// Mentors can only update temporary (test) students
if (session.user.role === 'mentor' && existingStudent.record_status === 'production') {
  return NextResponse.json({
    error: "អ្នកណែនាំមិនអាចកែប្រែទិន្នន័យផលិតកម្មរបស់គ្រូបាន",
    message: "Mentors cannot modify production student data created by teachers",
    code: "PERMISSION_DENIED"
  }, { status: 403 });
}

// Teachers can only update production students
if (session.user.role === 'teacher' && existingStudent.record_status !== 'production') {
  return NextResponse.json({
    error: "គ្រូមិនអាចកែប្រែទិន្នន័យសាកល្បងបាន",
    message: "Teachers cannot modify test data",
    code: "PERMISSION_DENIED"
  }, { status: 403 });
}
```

### 4. Update Assessment CRUD with Enhanced Validation

**File:** `/app/api/assessments/route.ts`

**Changes Required:**

1. Import shared constants:
```typescript
import { LANGUAGE_LEVELS, MATH_LEVELS, isValidLevel } from '@/lib/constants/assessment-levels';
```

2. Update validation schema (see Section 1)

3. Add level validation in POST handler:
```typescript
// In POST /api/assessments
// After validating input

// Validate level matches subject
if (validatedData.level && !isValidLevel(validatedData.subject, validatedData.level)) {
  return NextResponse.json({
    error: "កម្រិតមិនត្រឹមត្រូវសម្រាប់មុខវិជ្ជានេះ",
    message: `Invalid level "${validatedData.level}" for subject "${validatedData.subject}"`,
    code: "INVALID_LEVEL",
    meta: {
      subject: validatedData.subject,
      level: validatedData.level,
      valid_levels: validatedData.subject === 'language' ? LANGUAGE_LEVELS : MATH_LEVELS
    }
  }, { status: 400 });
}
```

4. Strengthen permission checks:
```typescript
// Mentors can only assess temporary students
if (session.user.role === 'mentor' && student.record_status === 'production') {
  return NextResponse.json({
    error: "អ្នកណែនាំមិនអាចវាយតម្លៃសិស្សផលិតកម្មបាន",
    message: "Mentors can only assess temporary students",
    code: "PERMISSION_DENIED"
  }, { status: 403 });
}
```

### 5. Create TypeScript Types

**File:** `/types/assessment.ts`

```typescript
import { LANGUAGE_LEVELS, MATH_LEVELS, ASSESSMENT_TYPES, SUBJECTS } from '@/lib/constants/assessment-levels';

export type AssessmentType = typeof ASSESSMENT_TYPES[keyof typeof ASSESSMENT_TYPES];
export type Subject = typeof SUBJECTS[keyof typeof SUBJECTS];
export type LanguageLevel = typeof LANGUAGE_LEVELS[number];
export type MathLevel = typeof MATH_LEVELS[number];
export type AssessmentLevel = LanguageLevel | MathLevel;

export interface Student {
  id: number;
  name: string;
  age?: number;
  gender?: string;
  pilot_school_id?: number;
  school_class_id?: number;

  // Assessment level fields
  baseline_khmer_level?: LanguageLevel;
  baseline_math_level?: MathLevel;
  midline_khmer_level?: LanguageLevel;
  midline_math_level?: MathLevel;
  endline_khmer_level?: LanguageLevel;
  endline_math_level?: MathLevel;

  // Ownership fields
  is_temporary: boolean;
  added_by_id?: number;
  added_by_mentor: boolean;
  record_status: 'production' | 'test_mentor' | 'test_teacher' | 'archived';

  created_at: Date;
  updated_at: Date;
}

export interface Assessment {
  id: number;
  student_id: number;
  pilot_school_id?: number;

  assessment_type: AssessmentType;
  subject: Subject;
  level?: AssessmentLevel;
  score?: number;
  notes?: string;
  assessed_date?: Date;

  // Ownership fields
  added_by_id?: number;
  is_temporary: boolean;
  assessed_by_mentor: boolean;
  record_status: 'production' | 'test_mentor' | 'test_teacher' | 'archived';

  created_at: Date;
  updated_at: Date;
}

export interface CreateStudentRequest {
  name: string;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  pilot_school_id?: number;
  school_class_id?: number;
  guardian_name?: string;
  guardian_phone?: string;
  baseline_khmer_level?: LanguageLevel;
  baseline_math_level?: MathLevel;
  // ... other fields
}

export interface CreateAssessmentRequest {
  student_id: number;
  assessment_type: AssessmentType;
  subject: Subject;
  level?: AssessmentLevel;
  score?: number;
  notes?: string;
  assessed_date?: string;
}

export interface BulkAssessmentRequest {
  assessments: CreateAssessmentRequest[];
}
```

---

## Code Examples for Each Role

### Teacher Creates Student (Production)

```typescript
// Frontend (Teacher dashboard)
const createStudent = async (studentData: CreateStudentRequest) => {
  const response = await fetch('/api/students', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: studentData.name,
      age: studentData.age,
      gender: studentData.gender,
      pilot_school_id: studentData.pilot_school_id,  // Optional - auto-assigned
      school_class_id: studentData.school_class_id,
      guardian_name: studentData.guardian_name,
      guardian_phone: studentData.guardian_phone
    })
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || 'Failed to create student');
  }

  return result.data;
};

// Result:
// - record_status = 'production'
// - is_temporary = false
// - added_by_id = teacher's ID
// - pilot_school_id = auto-assigned from teacher profile
```

### Teacher Creates Assessment (Baseline)

```typescript
const createAssessment = async (assessmentData: CreateAssessmentRequest) => {
  const response = await fetch('/api/assessments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      student_id: assessmentData.student_id,
      assessment_type: 'baseline',
      subject: 'language',
      level: 'word',  // Student can read words
      score: 75,
      assessed_date: new Date().toISOString()
    })
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || 'Failed to create assessment');
  }

  return result.data;
};

// Result:
// - Assessment created with record_status = 'production'
// - Student.baseline_khmer_level updated to 'word'
// - Duplicate check ensures no duplicate baseline+language assessment
```

### Mentor Creates Temporary Student (Test Data)

```typescript
const createTemporaryStudent = async (studentData: CreateStudentRequest) => {
  const response = await fetch('/api/students', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: studentData.name,
      age: studentData.age,
      gender: studentData.gender
      // No pilot_school_id needed - auto-assigned from mentor profile
    })
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || 'Failed to create student');
  }

  return result.data;
};

// Result:
// - record_status = 'test_mentor'
// - is_temporary = true
// - added_by_mentor = true
// - added_by_id = mentor's ID
// - pilot_school_id = auto-assigned from mentor profile
// - test_session_id = linked to active test session (if any)
```

### Mentor Creates Observation

```typescript
const createMentoringVisit = async (visitData: any) => {
  const response = await fetch('/api/mentoring-visits', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      pilot_school_id: visitData.pilot_school_id,
      visit_date: new Date().toISOString(),
      observations: visitData.observations,
      action_plan: visitData.action_plan,
      activities_data: {
        activity1_type: 'language',
        activity1_duration: 45,
        activity1_clear_instructions: true,
        // ... activity details
      }
    })
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || 'Failed to create mentoring visit');
  }

  return result.data;
};

// Result:
// - mentor_id = auto-assigned from session
// - record_status = 'test_mentor' (observations are always test data)
// - Stores structured observation data
```

---

## Frontend Integration Examples

### Student List with Filtering (Teacher View)

```typescript
const fetchStudents = async (filters: {
  page?: number;
  limit?: number;
  search?: string;
  gender?: string;
}) => {
  const params = new URLSearchParams();

  if (filters.page) params.append('page', filters.page.toString());
  if (filters.limit) params.append('limit', filters.limit.toString());
  if (filters.search) params.append('search', filters.search);
  if (filters.gender) params.append('gender', filters.gender);

  // Teacher automatically sees only their school's production data
  // include_test_data defaults to false for teachers

  const response = await fetch(`/api/students?${params.toString()}`);
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || 'Failed to fetch students');
  }

  return result;  // { data: [...], pagination: {...} }
};
```

### Student List with Test Data (Mentor View)

```typescript
const fetchStudentsForMentor = async (includeProduction: boolean = true) => {
  const params = new URLSearchParams();
  params.append('page', '1');
  params.append('limit', '50');

  // Mentors can see both test and production data
  // but by default see all data in their school

  const response = await fetch(`/api/students?${params.toString()}`);
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || 'Failed to fetch students');
  }

  return result;
};
```

### Assessment Form with Dynamic Level Dropdown

```typescript
import { LANGUAGE_LEVELS, MATH_LEVELS } from '@/lib/constants/assessment-levels';

const AssessmentForm = ({ studentId }: { studentId: number }) => {
  const [subject, setSubject] = useState<'language' | 'math'>('language');
  const [level, setLevel] = useState('');

  const availableLevels = subject === 'language' ? LANGUAGE_LEVELS : MATH_LEVELS;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch('/api/assessments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        student_id: studentId,
        assessment_type: 'baseline',
        subject: subject,
        level: level,
        assessed_date: new Date().toISOString()
      })
    });

    const result = await response.json();

    if (!response.ok) {
      alert(result.error);
      return;
    }

    alert('Assessment created successfully!');
  };

  return (
    <form onSubmit={handleSubmit}>
      <select value={subject} onChange={(e) => setSubject(e.target.value as any)}>
        <option value="language">Khmer (ខ្មែរ)</option>
        <option value="math">Math (គណិតវិទ្យា)</option>
      </select>

      <select value={level} onChange={(e) => setLevel(e.target.value)}>
        <option value="">Select level...</option>
        {availableLevels.map(lvl => (
          <option key={lvl} value={lvl}>{lvl}</option>
        ))}
      </select>

      <button type="submit">Create Assessment</button>
    </form>
  );
};
```

---

## Testing Scripts

### Test Teacher Workflow

```bash
# 1. Login as teacher
curl -X POST http://localhost:3003/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email": "teacher@test.com", "password": "password"}'

# 2. Create student (should be production)
curl -X POST http://localhost:3003/api/students \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=..." \
  -d '{
    "name": "Test Student",
    "age": 10,
    "gender": "male"
  }'

# 3. Create baseline assessment
curl -X POST http://localhost:3003/api/assessments \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=..." \
  -d '{
    "student_id": 1,
    "assessment_type": "baseline",
    "subject": "language",
    "level": "word"
  }'

# 4. Verify student level field updated
curl http://localhost:3003/api/students/1 \
  -H "Cookie: next-auth.session-token=..."
# Should return: baseline_khmer_level = "word"
```

### Test Mentor Workflow

```bash
# 1. Login as mentor
curl -X POST http://localhost:3003/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"username": "mentor1", "password": "password"}'

# 2. Create temporary student
curl -X POST http://localhost:3003/api/students \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=..." \
  -d '{
    "name": "Temp Student",
    "age": 9,
    "gender": "female"
  }'
# Should return: is_temporary = true, record_status = "test_mentor"

# 3. Try to update teacher's student (should fail)
curl -X PUT http://localhost:3003/api/students \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=..." \
  -d '{
    "id": 1,
    "name": "Updated Name"
  }'
# Should return: 403 Forbidden - Mentors cannot modify production data

# 4. Create mentoring visit
curl -X POST http://localhost:3003/api/mentoring-visits \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=..." \
  -d '{
    "pilot_school_id": 1,
    "visit_date": "2025-10-02T08:00:00Z",
    "observations": "Good progress observed"
  }'
```

---

## Migration Checklist

### Before Deployment

- [ ] Create `/lib/constants/assessment-levels.ts` with all constants
- [ ] Update `/app/api/assessments/route.ts` validation schema
- [ ] Add permission checks to prevent mentor→production and teacher→test modifications
- [ ] Create `/types/assessment.ts` with TypeScript types
- [ ] Update frontend forms to use constant imports
- [ ] Test all role workflows (teacher, mentor, admin)
- [ ] Verify field name consistency (run: `SELECT column_name FROM information_schema.columns WHERE table_name IN ('students', 'assessments') AND column_name ~ '[A-Z]';` should return 0 rows)

### After Deployment

- [ ] Monitor error logs for validation failures
- [ ] Verify assessment level distribution in database
- [ ] Check for any orphaned test data (record_status = 'test_mentor' older than 48 hours)
- [ ] Run data integrity checks (all assessments have matching student level fields)

---

## Common Errors & Solutions

### Error: "Invalid level for subject"
**Cause:** Using language level for math assessment or vice versa
**Solution:** Use dynamic level selection based on subject

### Error: "Mentor must be assigned to a pilot school"
**Cause:** Mentor profile incomplete
**Solution:** Complete onboarding and assign pilot_school_id

### Error: "Assessment already exists"
**Cause:** Duplicate assessment (same student + type + subject)
**Solution:** Use PUT to update existing assessment instead of POST

### Error: "Forbidden - cannot modify production data"
**Cause:** Mentor trying to update teacher's student
**Solution:** Mentors can only work with temporary (test) students

---

**Next Steps:**
1. Implement constant file
2. Update validation schemas
3. Add permission checks
4. Test with real users

