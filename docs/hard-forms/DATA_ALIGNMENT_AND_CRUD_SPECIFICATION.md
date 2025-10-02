# TaRL Assessment System - Complete Data Alignment & CRUD Specification

**Last Updated:** 2025-10-02
**Status:** Authoritative Source for Development

---

## 1. Executive Summary

This document defines the **complete alignment** between:
- Physical Excel forms (Language & Math assessment sheets)
- Database schema (PostgreSQL + Prisma)
- API endpoints and business logic
- Role-based CRUD permissions

**Goal:** Ensure multi-platform consistency (Next.js web + Flutter mobile) with zero field name mismatches.

---

## 2. Assessment Framework Structure

### 2.1 Core Dimensions

| Dimension | Values | Notes |
|-----------|--------|-------|
| **Subjects** | `language` (ខ្មែរ), `math` (គណិតវិទ្យា) | snake_case in database |
| **Grade Levels** | `4`, `5` | Currently Grade 4 & 5 only |
| **Assessment Periods** | `baseline` (តេស្តដើមគ្រា), `midline` (តេស្តពាក់កណ្ដាលគ្រា), `endline` (តេស្តចុងក្រោយគ្រា) | 3-phase cycle |

### 2.2 Assessment Levels by Subject

#### **Language (Khmer) - 7 Levels**
| Level Code | Khmer Name | English Translation | Database Value |
|------------|------------|---------------------|----------------|
| `beginner` | កម្រិតដំបូង | Beginner Level | `beginner` |
| `letter` | តួអក្សរ | Letters/Characters | `letter` |
| `word` | ពាក្យ | Words | `word` |
| `paragraph` | កថាខណ្ឌ | Paragraphs | `paragraph` |
| `story` | រឿង | Stories | `story` |
| `comprehension1` | យល់ន័យ១ | Comprehension 1 | `comprehension1` |
| `comprehension2` | យល់ន័យ២ | Comprehension 2 | `comprehension2` |

#### **Math (គណិតវិទ្យា) - 6 Levels**
| Level Code | Khmer Name | English Translation | Database Value |
|------------|------------|---------------------|----------------|
| `beginner` | កម្រិតដំបូង | Beginner Level | `beginner` |
| `number_1digit` | លេខ១ខ្ទង | 1-digit numbers | `number_1digit` |
| `number_2digit` | លេខ២ខ្ទង | 2-digit numbers | `number_2digit` |
| `subtraction` | ប្រមាណវិធីដក | Subtraction | `subtraction` |
| `division` | ប្រមាណវិធីចែក | Division | `division` |
| `word_problems` | ចំណោទ | Word Problems | `word_problems` |

---

## 3. Database Schema Alignment

### 3.1 Current Schema Status

#### **Student Table** (`students`)
```prisma
model Student {
  id                       Int          @id @default(autoincrement())
  pilot_school_id          Int?
  school_class_id          Int?
  name                     String
  age                      Int?
  gender                   String?

  // Assessment Level Fields - DIRECT STORAGE
  baseline_khmer_level     String?      // Maps to Language levels
  baseline_math_level      String?      // Maps to Math levels
  midline_khmer_level      String?
  midline_math_level       String?
  endline_khmer_level      String?
  endline_math_level       String?

  // Data Ownership & Temporary Status
  is_temporary             Boolean      @default(false)
  added_by_id              Int?
  added_by_mentor          Boolean      @default(false)
  assessed_by_mentor       Boolean      @default(false)
  record_status            RecordStatus @default(production)
  created_by_role          String?
  test_session_id          String?

  // Relations
  assessments              Assessment[]
  added_by                 User?        @relation("StudentAddedBy")
  pilot_school             PilotSchool?
  school_class             SchoolClass?

  created_at               DateTime     @default(now())
  updated_at               DateTime     @updatedAt
}
```

#### **Assessment Table** (`assessments`)
```prisma
model Assessment {
  id                   Int          @id @default(autoincrement())
  student_id           Int
  pilot_school_id      Int?

  // Assessment Classification
  assessment_type      String       // "baseline", "midline", "endline"
  subject              String       // "language", "math"
  level                String?      // One of the level codes above

  // Assessment Data
  score                Float?
  notes                String?
  assessed_date        DateTime?

  // Data Ownership & Temporary Status
  added_by_id          Int?
  is_temporary         Boolean      @default(false)
  assessed_by_mentor   Boolean      @default(false)
  record_status        RecordStatus @default(production)
  created_by_role      String?
  test_session_id      String?

  // Relations
  student              Student
  added_by             User?
  pilot_school         PilotSchool?

  created_at           DateTime     @default(now())
  updated_at           DateTime     @updatedAt
}
```

#### **MentoringVisit Table** (`mentoring_visits`)
```prisma
model MentoringVisit {
  id                  Int          @id @default(autoincrement())
  mentor_id           Int
  pilot_school_id     Int?
  visit_date          DateTime

  // Observation Data
  observations        String?
  recommendations     String?
  action_plan         String?
  activities_data     Json?        // Structured activity tracking

  // Assessment Period Context
  assessment_period   String?      // "baseline", "midline", "endline"

  // Relations
  mentor              User
  pilot_school        PilotSchool?

  created_at          DateTime     @default(now())
  updated_at          DateTime     @updatedAt
}
```

### 3.2 Enum Types

```prisma
enum RecordStatus {
  production      // Real data - created by teachers
  test_teacher    // Test data - created by teachers in test mode
  test_mentor     // Test data - created by mentors (always temporary)
  archived        // Soft-deleted production data
}
```

---

## 4. Role-Based CRUD Permission Matrix

### 4.1 Complete Permission Table

| Entity | Role | CREATE | READ | UPDATE | DELETE | Notes |
|--------|------|--------|------|--------|--------|-------|
| **Student** | Admin | ✅ All | ✅ All | ✅ All | ✅ Hard Delete | Full access |
| | Coordinator | ✅ All | ✅ All | ✅ All | ✅ Soft Delete | Regional oversight |
| | **Teacher** | ✅ Own school | ✅ Own school | ✅ Own records | ✅ Own records | **Production data** |
| | **Mentor** | ✅ Own school (temp) | ✅ Own school | ✅ Own temp records | ✅ Own temp records | **Test data only** |
| | Viewer | ❌ | ✅ Assigned schools | ❌ | ❌ | Read-only |
| **Assessment** | Admin | ✅ All | ✅ All | ✅ All | ✅ Hard Delete | Full access |
| | Coordinator | ✅ All | ✅ All | ✅ All | ✅ Soft Delete | Regional oversight |
| | **Teacher** | ✅ Own students | ✅ Own students | ✅ Own assessments | ✅ Own assessments | **Production data** |
| | **Mentor** | ✅ Temp students | ✅ Own school | ✅ Own temp assessments | ✅ Own temp assessments | **Test data only** |
| | Viewer | ❌ | ✅ Assigned schools | ❌ | ❌ | Read-only |
| **MentoringVisit** | Admin | ✅ All | ✅ All | ✅ All | ✅ Hard Delete | Full access |
| | Coordinator | ✅ All | ✅ All | ✅ All | ✅ Soft Delete | Regional oversight |
| | **Mentor** | ✅ Own visits | ✅ Own visits | ✅ Own visits | ✅ Own visits | Observation records |
| | Teacher | ❌ | ✅ Own school visits | ❌ | ❌ | View mentor feedback |
| | Viewer | ❌ | ✅ Assigned schools | ❌ | ❌ | Read-only |

### 4.2 Critical Business Rules

#### **Rule 1: Data Ownership Segregation**
```javascript
// Teachers create PRODUCTION data
if (userRole === 'teacher') {
  record_status = 'production'
  is_temporary = false
  // Permanent storage - counts in reports
}

// Mentors create TEST data
if (userRole === 'mentor') {
  record_status = 'test_mentor'
  is_temporary = true
  // Temporary storage - for demonstration/training only
}
```

#### **Rule 2: School-Based Access Control**
```javascript
// Teachers: Only access own school
WHERE pilot_school_id = user.pilot_school_id AND record_status = 'production'

// Mentors: Only access own school (including test data)
WHERE pilot_school_id = user.pilot_school_id

// Coordinators: Access assigned region
WHERE province = user.province OR district = user.district
```

#### **Rule 3: Assessment Level Tracking**
```javascript
// When creating/updating assessment, ALWAYS sync to student record
const levelField = `${assessment_type}_${subject}_level`
// Examples:
// - "baseline_khmer_level"
// - "midline_math_level"
// - "endline_khmer_level"

await prisma.student.update({
  where: { id: student_id },
  data: { [levelField]: level }
})
```

#### **Rule 4: Test Data Lifecycle**
```javascript
// Test data auto-expires or gets cleaned up
if (record_status === 'test_mentor' || record_status === 'test_teacher') {
  // Hard delete allowed (no history needed)
  await prisma.student.delete({ where: { id } })
} else {
  // Production data: Soft delete only
  await prisma.student.update({
    where: { id },
    data: { is_active: false, record_status: 'archived' }
  })
}
```

---

## 5. API Endpoint Specification

### 5.1 Student Endpoints

#### **GET /api/students**
**Query Parameters:**
```typescript
{
  page?: number              // Default: 1
  limit?: number             // Default: 10
  search?: string            // Search by name, guardian
  gender?: 'male' | 'female'
  school_class_id?: number
  pilot_school_id?: number
  is_temporary?: boolean
  include_test_data?: boolean  // Admin/Coordinator only
}
```

**Access Control:**
- Teachers: Only `record_status = 'production'` + own school
- Mentors: All data (production + test) from own school
- Admin/Coordinator: All data with `include_test_data` flag

#### **POST /api/students**
**Request Body:**
```typescript
{
  name: string                    // REQUIRED
  age?: number
  gender?: 'male' | 'female'
  pilot_school_id?: number        // Auto-assigned from user profile
  school_class_id?: number
  guardian_name?: string
  guardian_phone?: string
  baseline_khmer_level?: string   // From level enum
  baseline_math_level?: string
  // ... other fields
}
```

**Behavior:**
- Teachers: Creates `record_status = 'production'`
- Mentors: Creates `record_status = 'test_mentor'`, `is_temporary = true`
- Auto-assigns `pilot_school_id` from user's profile
- Links to active `test_session_id` if in test mode

#### **PUT /api/students**
**Request Body:**
```typescript
{
  id: number                      // REQUIRED
  name?: string
  age?: number
  // ... any updatable fields
}
```

**Access Control:**
- Can only update records from own school
- Mentors can only update temporary records
- Teachers can only update production records

#### **DELETE /api/students?id={id}**
**Behavior:**
- Test data: Hard delete (permanent removal)
- Production data: Soft delete (`is_active = false`, `record_status = 'archived'`)

---

### 5.2 Assessment Endpoints

#### **GET /api/assessments**
**Query Parameters:**
```typescript
{
  page?: number
  limit?: number
  search?: string
  assessment_type?: 'baseline' | 'midline' | 'endline'
  subject?: 'language' | 'math'
  pilot_school_id?: number
  student_id?: number
  is_temporary?: boolean
}
```

#### **POST /api/assessments**
**Single Assessment:**
```typescript
{
  student_id: number                          // REQUIRED
  assessment_type: 'baseline' | 'midline' | 'endline'  // REQUIRED
  subject: 'language' | 'math'                // REQUIRED
  level?: string                              // From level enum
  score?: number                              // 0-100
  notes?: string
  assessed_date?: string                      // ISO 8601
}
```

**Bulk Assessment:**
```typescript
{
  assessments: Array<{
    student_id: number
    assessment_type: string
    subject: string
    level?: string
    score?: number
  }>
}
```

**Behavior:**
- Auto-syncs `level` to student record (e.g., `baseline_khmer_level`)
- Prevents duplicate assessments (same student + type + subject)
- Links to `test_session_id` for test data

#### **PUT /api/assessments**
**Request Body:**
```typescript
{
  id: number                     // REQUIRED
  level?: string
  score?: number
  notes?: string
  assessed_date?: string
}
```

**Behavior:**
- Updates assessment record
- Re-syncs `level` to student record if changed

#### **DELETE /api/assessments?id={id}**
**Behavior:**
- Hard delete assessment record
- Clears corresponding level field in student record (sets to `null`)

---

### 5.3 Mentoring Visit Endpoints

#### **GET /api/mentoring-visits**
**Query Parameters:**
```typescript
{
  page?: number
  limit?: number
  search?: string
  pilot_school_id?: number
  mentor_id?: number
  visit_date_from?: string       // ISO date
  visit_date_to?: string         // ISO date
}
```

**Access Control:**
- Teachers: Only visits to their school
- Mentors: Only own visits
- Coordinators: All visits in region

#### **POST /api/mentoring-visits**
**Request Body:**
```typescript
{
  pilot_school_id: number                    // REQUIRED
  visit_date: string                         // REQUIRED (ISO 8601)
  observations?: string
  action_plan?: string
  activities_data?: {
    activity1_type?: string
    activity1_duration?: number
    activity1_clear_instructions?: boolean
    // ... activity fields
  }
  assessment_period?: 'baseline' | 'midline' | 'endline'
  // ... questionnaire fields
}
```

**Behavior:**
- Auto-assigns `mentor_id` from session
- Always creates `record_status = 'test_mentor'` (observations are test data)
- Links to `test_session_id`

---

## 6. Data Flow Diagrams

### 6.1 Teacher Workflow (Production Data)

```
┌─────────────┐
│   Teacher   │
│ Logs In     │
└──────┬──────┘
       │
       ├──> CREATE Student (production)
       │    ├─> record_status = 'production'
       │    ├─> is_temporary = false
       │    └─> pilot_school_id = teacher.pilot_school_id
       │
       ├──> CREATE Assessment (baseline/midline/endline)
       │    ├─> record_status = 'production'
       │    ├─> Sync to student.{period}_{subject}_level
       │    └─> Validates: No duplicate assessments
       │
       ├──> UPDATE Student/Assessment
       │    └─> Only own records at own school
       │
       └──> DELETE Student/Assessment
            └─> Soft delete (archived) for production data
```

### 6.2 Mentor Workflow (Test Data)

```
┌─────────────┐
│   Mentor    │
│ Logs In     │
└──────┬──────┘
       │
       ├──> CREATE Student (temporary, for demonstration)
       │    ├─> record_status = 'test_mentor'
       │    ├─> is_temporary = true
       │    ├─> added_by_mentor = true
       │    └─> Links to active test_session_id
       │
       ├──> CREATE Assessment (on temporary students)
       │    ├─> record_status = 'test_mentor'
       │    ├─> is_temporary = true
       │    └─> assessed_by_mentor = true
       │
       ├──> CREATE MentoringVisit (observation record)
       │    ├─> Documents teacher observation
       │    ├─> Records activities & recommendations
       │    └─> Includes action plan
       │
       └──> DELETE Test Data
            └─> Hard delete (no archiving needed)
```

---

## 7. Validation Rules

### 7.1 Student Validation
```typescript
const studentSchema = z.object({
  name: z.string().min(1, "Student name is required"),
  age: z.number().min(1).max(25).optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
  pilot_school_id: z.number().optional(),        // Auto-assigned
  school_class_id: z.number().optional(),
  baseline_khmer_level: z.enum([
    "beginner", "letter", "word", "paragraph",
    "story", "comprehension1", "comprehension2"
  ]).optional(),
  baseline_math_level: z.enum([
    "beginner", "number_1digit", "number_2digit",
    "subtraction", "division", "word_problems"
  ]).optional(),
  // ... same for midline and endline
})
```

### 7.2 Assessment Validation
```typescript
const assessmentSchema = z.object({
  student_id: z.number().min(1, "Student ID is required"),
  assessment_type: z.enum(["baseline", "midline", "endline"]),
  subject: z.enum(["language", "math"]),
  level: z.string().optional(),                  // Validated against subject-specific enum
  score: z.number().min(0).max(100).optional(),
  assessed_date: z.string().datetime().optional()
})
```

### 7.3 Cross-Field Validation
```typescript
// Ensure level matches subject
if (subject === 'language') {
  validLevels = ['beginner', 'letter', 'word', 'paragraph', 'story', 'comprehension1', 'comprehension2']
} else if (subject === 'math') {
  validLevels = ['beginner', 'number_1digit', 'number_2digit', 'subtraction', 'division', 'word_problems']
}

if (level && !validLevels.includes(level)) {
  throw new Error(`Invalid level "${level}" for subject "${subject}"`)
}
```

---

## 8. API Response Format Standards

### 8.1 Success Response (List)
```json
{
  "data": [/* array of records */],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 125,
    "pages": 13
  }
}
```

### 8.2 Success Response (Single)
```json
{
  "message": "បានបង្កើតសិស្សដោយជោគជ័យ",
  "data": {/* record object */}
}
```

### 8.3 Error Response
```json
{
  "error": "ទិន្នន័យមិនត្រឹមត្រូវ សូមពិនិត្យឡើងវិញ",
  "message": "Validation failed",
  "code": "VALIDATION_ERROR",
  "meta": {
    "field": "student_id",
    "constraint": "required"
  }
}
```

**IMPORTANT:** Always return detailed errors with `message`, `code`, and `meta` (per `AI_DEVELOPMENT_RULES.md`)

---

## 9. Field Name Convention Reference

### 9.1 The Golden Rule
**USE SNAKE_CASE CONSISTENTLY ACROSS ALL LAYERS**

| Platform | Convention | Example |
|----------|-----------|---------|
| Database (PostgreSQL) | snake_case | `baseline_khmer_level` |
| Prisma Schema | snake_case | `baseline_khmer_level` |
| TypeScript Interfaces | snake_case | `baseline_khmer_level` |
| API Request/Response | snake_case | `baseline_khmer_level` |
| Flutter/Dart Models | snake_case | `baseline_khmer_level` |

### 9.2 Common Field Mappings

| Purpose | ✅ Correct | ❌ Wrong |
|---------|-----------|---------|
| Assessment Type | `assessment_type` | `assessmentType` |
| Student ID | `student_id` | `studentId` |
| Pilot School ID | `pilot_school_id` | `pilotSchoolId` |
| Is Temporary | `is_temporary` | `isTemporary` |
| Record Status | `record_status` | `recordStatus` |
| Created At | `created_at` | `createdAt` |
| Baseline Level | `baseline_khmer_level` | `baselineKhmerLevel` |

### 9.3 Assessment Level Fields Pattern
```
{period}_{subject}_level

Examples:
- baseline_khmer_level
- baseline_math_level
- midline_khmer_level
- midline_math_level
- endline_khmer_level
- endline_math_level
```

---

## 10. Testing Checklist

### 10.1 Student CRUD Tests
- [ ] Teacher can create production student at own school
- [ ] Mentor can create temporary student at own school
- [ ] Teacher cannot see temporary (test) students by default
- [ ] Mentor can see both production and test students
- [ ] Teacher can update only own production students
- [ ] Mentor can update only own temporary students
- [ ] Teacher delete = soft delete (archived)
- [ ] Mentor delete = hard delete for test data
- [ ] Auto-assignment of `pilot_school_id` works
- [ ] Test session linking works for test data

### 10.2 Assessment CRUD Tests
- [ ] Teacher can create assessment for own students
- [ ] Mentor can create assessment for temporary students
- [ ] Assessment syncs to student level fields
- [ ] Duplicate assessment prevention works
- [ ] Assessment update re-syncs to student record
- [ ] Assessment delete clears student level field
- [ ] Bulk assessment creation works
- [ ] Level validation matches subject

### 10.3 Permission Tests
- [ ] Teacher cannot access other schools' data
- [ ] Mentor cannot modify production data
- [ ] Viewer role is read-only
- [ ] Coordinator has regional access
- [ ] Admin has full access

### 10.4 Data Integrity Tests
- [ ] Field names match across all layers (no camelCase leaks)
- [ ] Assessment levels validate against correct enum
- [ ] Foreign key constraints work
- [ ] Record status transitions correctly
- [ ] Test data cleanup works

---

## 11. Implementation Priority

### Phase 1: Critical Fixes (Week 1)
1. ✅ Update assessment level enums to match Excel forms exactly
2. ✅ Fix assessment validation to use subject-specific levels
3. ✅ Ensure all field names use snake_case (audit existing code)
4. ✅ Test student-assessment level sync logic

### Phase 2: Role Permission Enforcement (Week 2)
1. ⏳ Strengthen access control in all endpoints
2. ⏳ Add comprehensive permission tests
3. ⏳ Document edge cases (e.g., school transfer scenarios)

### Phase 3: Data Quality & Reporting (Week 3)
1. ⏳ Add data validation reports
2. ⏳ Implement temporary data cleanup jobs
3. ⏳ Create admin dashboard for data health monitoring

---

## 12. References

### Related Documents
- `/docs/hard-forms/Classroom Data Recording - Language - Final with logo.xlsx`
- `/docs/hard-forms/Classroom Data Recording - Math - Final with logo.xlsx`
- `/prisma/schema.prisma`
- `/.claude/AI_DEVELOPMENT_RULES.md`
- `/.claude/API_ERROR_HANDLING_PROTOCOL.md`

### Database Connection
```
Host: 157.10.73.52
Port: 5432
Database: tarl_pratham
User: admin
```

### Quick SQL Queries
```sql
-- Check student count by record status
SELECT record_status, COUNT(*) FROM students GROUP BY record_status;

-- Check assessment distribution
SELECT assessment_type, subject, COUNT(*) FROM assessments GROUP BY assessment_type, subject;

-- Verify field names match convention
SELECT column_name FROM information_schema.columns
WHERE table_name = 'students' AND column_name ~ '[A-Z]';
```

---

**Document Control:**
- Version: 1.0
- Author: Claude Code + Development Team
- Next Review: After Phase 1 implementation
