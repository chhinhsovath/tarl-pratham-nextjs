# TaRL Assessment System - Testing Guide

**Last Updated:** 2025-10-02
**Status:** Ready for QA Testing

---

## Quick Start Testing Commands

### 1. Start Development Server
```bash
cd /Users/chhinhsovath/Documents/GitHub/tarl-pratham-nextjs
PORT=3003 npm run dev
```

### 2. Build TypeScript (Check for Errors)
```bash
npx tsc --noEmit
```

### 3. Run Linter
```bash
npm run lint
```

---

## Test Scenarios by Role

### **Teacher Role Tests**

#### Scenario 1: Teacher Creates Student (Production Data)
**Expected:** `record_status = 'production'`, `is_temporary = false`

```bash
# Login as teacher
curl -X POST http://localhost:3003/api/auth/credentials/callback \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teacher@test.com",
    "password": "password"
  }'

# Create student
curl -X POST http://localhost:3003/api/students \
  -H "Content-Type: application/json" \
  -H "Cookie: [SESSION_COOKIE]" \
  -d '{
    "name": "Test Student Production",
    "age": 10,
    "gender": "male"
  }'

# ✅ Expected Response:
# {
#   "message": "បានបង្កើតសិស្សដោយជោគជ័យ",
#   "data": {
#     "id": 123,
#     "record_status": "production",
#     "is_temporary": false,
#     "added_by_mentor": false
#   }
# }
```

#### Scenario 2: Teacher Creates Baseline Language Assessment
**Expected:** Assessment created with level sync to student record

```bash
curl -X POST http://localhost:3003/api/assessments \
  -H "Content-Type: application/json" \
  -H "Cookie: [SESSION_COOKIE]" \
  -d '{
    "student_id": 123,
    "assessment_type": "baseline",
    "subject": "language",
    "level": "word"
  }'

# ✅ Expected Response:
# {
#   "message": "Assessment created successfully",
#   "data": {
#     "id": 456,
#     "student_id": 123,
#     "assessment_type": "baseline",
#     "subject": "language",
#     "level": "word",
#     "record_status": "production"
#   }
# }

# ✅ Verify student record updated:
curl http://localhost:3003/api/students/123 \
  -H "Cookie: [SESSION_COOKIE]"

# Should show: "baseline_khmer_level": "word"
```

#### Scenario 3: Teacher Tries to Update Mentor's Test Student (Should Fail)
**Expected:** 403 Forbidden

```bash
# Assume student ID 999 is a test student (record_status = 'test_mentor')

curl -X PUT http://localhost:3003/api/students \
  -H "Content-Type: application/json" \
  -H "Cookie: [SESSION_COOKIE]" \
  -d '{
    "id": 999,
    "name": "Updated Name"
  }'

# ✅ Expected Response:
# {
#   "error": "គ្រូមិនអាចកែប្រែទិន្នន័យសាកល្បងបាន",
#   "message": "Teachers cannot modify test/temporary students created by mentors",
#   "code": "PERMISSION_DENIED",
#   "meta": {
#     "student_id": 999,
#     "student_record_status": "test_mentor",
#     "user_role": "teacher"
#   }
# }
# Status: 403
```

#### Scenario 4: Teacher Creates Math Assessment with All 6 Levels
**Expected:** Validation accepts all math levels

```bash
# Test each math level
for level in "beginner" "number_1digit" "number_2digit" "subtraction" "division" "word_problems"
do
  curl -X POST http://localhost:3003/api/assessments \
    -H "Content-Type: application/json" \
    -H "Cookie: [SESSION_COOKIE]" \
    -d "{
      \"student_id\": 123,
      \"assessment_type\": \"baseline\",
      \"subject\": \"math\",
      \"level\": \"$level\"
    }"
  echo "\n---"
done

# ✅ All should succeed
```

---

### **Mentor Role Tests**

#### Scenario 5: Mentor Creates Student (Test Data)
**Expected:** `record_status = 'test_mentor'`, `is_temporary = true`

```bash
# Login as mentor
curl -X POST http://localhost:3003/api/auth/credentials/callback \
  -H "Content-Type: application/json" \
  -d '{
    "username": "mentor1",
    "password": "password"
  }'

# Create temporary student
curl -X POST http://localhost:3003/api/students \
  -H "Content-Type: application/json" \
  -H "Cookie: [SESSION_COOKIE]" \
  -d '{
    "name": "Test Student Temporary",
    "age": 9,
    "gender": "female"
  }'

# ✅ Expected Response:
# {
#   "message": "បានបង្កើតសិស្សដោយជោគជ័យ",
#   "data": {
#     "id": 888,
#     "record_status": "test_mentor",
#     "is_temporary": true,
#     "added_by_mentor": true
#   }
# }
```

#### Scenario 6: Mentor Tries to Assess Production Student (Should Fail)
**Expected:** 403 Forbidden

```bash
# Assume student ID 123 is production data

curl -X POST http://localhost:3003/api/assessments \
  -H "Content-Type: application/json" \
  -H "Cookie: [SESSION_COOKIE]" \
  -d '{
    "student_id": 123,
    "assessment_type": "baseline",
    "subject": "language",
    "level": "word"
  }'

# ✅ Expected Response:
# {
#   "error": "អ្នកណែនាំមិនអាចវាយតម្លៃសិស្សផលិតកម្មបាន",
#   "message": "Mentors can only assess temporary (test) students, not production students created by teachers",
#   "code": "PERMISSION_DENIED",
#   "meta": {
#     "student_id": 123,
#     "student_record_status": "production",
#     "user_role": "mentor"
#   }
# }
# Status: 403
```

#### Scenario 7: Mentor Creates Mentoring Visit
**Expected:** Visit record created successfully

```bash
curl -X POST http://localhost:3003/api/mentoring-visits \
  -H "Content-Type: application/json" \
  -H "Cookie: [SESSION_COOKIE]" \
  -d '{
    "pilot_school_id": 1,
    "visit_date": "2025-10-02T08:00:00Z",
    "observations": "Teacher demonstrated good TaRL methodology",
    "action_plan": "Continue with current approach",
    "activities_data": {
      "activity1_type": "language",
      "activity1_duration": 45,
      "activity1_clear_instructions": true
    }
  }'

# ✅ Expected: Success
```

#### Scenario 8: Mentor Deletes Temporary Student (Hard Delete)
**Expected:** Permanent deletion

```bash
curl -X DELETE "http://localhost:3003/api/students?id=888" \
  -H "Cookie: [SESSION_COOKIE]"

# ✅ Expected: Student permanently deleted from database

# Verify deletion
curl "http://localhost:3003/api/students?id=888" \
  -H "Cookie: [SESSION_COOKIE]"

# ✅ Expected: 404 Not Found
```

---

### **Validation Tests**

#### Scenario 9: Invalid Level for Subject (Language level for Math)
**Expected:** Validation error

```bash
curl -X POST http://localhost:3003/api/assessments \
  -H "Content-Type: application/json" \
  -H "Cookie: [SESSION_COOKIE]" \
  -d '{
    "student_id": 123,
    "assessment_type": "baseline",
    "subject": "math",
    "level": "story"
  }'

# ✅ Expected Response:
# {
#   "error": "ទិន្នន័យមិនត្រឹមត្រូវ សូមពិនិត្យឡើងវិញ",
#   "message": "Validation failed",
#   "code": "VALIDATION_ERROR",
#   "meta": [...],
#   "details": [
#     {
#       "path": ["level"],
#       "message": "Invalid level for the selected subject"
#     }
#   ]
# }
# Status: 400
```

#### Scenario 10: Duplicate Assessment Prevention
**Expected:** Error when creating duplicate

```bash
# Create first assessment
curl -X POST http://localhost:3003/api/assessments \
  -H "Content-Type: application/json" \
  -H "Cookie: [SESSION_COOKIE]" \
  -d '{
    "student_id": 123,
    "assessment_type": "baseline",
    "subject": "language",
    "level": "word"
  }'

# Try to create duplicate
curl -X POST http://localhost:3003/api/assessments \
  -H "Content-Type: application/json" \
  -H "Cookie: [SESSION_COOKIE]" \
  -d '{
    "student_id": 123,
    "assessment_type": "baseline",
    "subject": "language",
    "level": "paragraph"
  }'

# ✅ Expected Response:
# {
#   "error": "baseline language assessment already exists for this student"
# }
# Status: 400
```

---

## Frontend Testing Scenarios

### Test 1: Assessment Form - Dynamic Level Dropdown

1. Navigate to assessment creation page
2. Select "Language" subject
3. **✅ Verify:** Level dropdown shows 7 options (beginner, letter, word, paragraph, story, comprehension1, comprehension2)
4. Change subject to "Math"
5. **✅ Verify:** Level dropdown resets and shows 6 options (beginner, number_1digit, number_2digit, subtraction, division, word_problems)
6. **✅ Verify:** Selected level is cleared when subject changes

### Test 2: Student List - Production vs Test Data Filtering

**Teacher View:**
1. Login as teacher
2. Navigate to students list
3. **✅ Verify:** Only sees students with `record_status = 'production'`
4. **✅ Verify:** Does not see temporary students created by mentors

**Mentor View:**
1. Login as mentor
2. Navigate to students list
3. **✅ Verify:** Sees both production and test students from assigned school
4. **✅ Verify:** Can distinguish temporary students (visual indicator)

### Test 3: Permission-Based UI Elements

**Teacher:**
- **✅ Verify:** "Create Student" button visible
- **✅ Verify:** "Create Assessment" button visible
- **✅ Verify:** "Create Mentoring Visit" button NOT visible
- **✅ Verify:** Edit/Delete buttons only on own production students

**Mentor:**
- **✅ Verify:** "Create Temporary Student" button visible
- **✅ Verify:** "Create Assessment" button visible (for temp students only)
- **✅ Verify:** "Create Mentoring Visit" button visible
- **✅ Verify:** Edit/Delete buttons only on own temporary students

---

## Database Integrity Tests

### Test 1: Assessment Level Sync

```sql
-- Create assessment via API then check database

-- 1. Create assessment: subject=language, level=word, assessment_type=baseline
-- 2. Run this query:

SELECT
  s.id,
  s.name,
  s.baseline_khmer_level,
  a.subject,
  a.level,
  a.assessment_type
FROM students s
LEFT JOIN assessments a ON a.student_id = s.id
WHERE s.id = 123;

-- ✅ Expected:
-- baseline_khmer_level = 'word' (matches assessment.level)
```

### Test 2: Record Status Consistency

```sql
-- Check that record_status matches role

SELECT
  created_by_role,
  record_status,
  is_temporary,
  COUNT(*) as count
FROM students
GROUP BY created_by_role, record_status, is_temporary;

-- ✅ Expected:
-- teacher   | production   | false | X
-- mentor    | test_mentor  | true  | Y
```

### Test 3: Snake_case Field Names (No CamelCase Leaks)

```sql
-- Check for any camelCase column names (should return 0 rows)

SELECT column_name
FROM information_schema.columns
WHERE table_name IN ('students', 'assessments', 'mentoring_visits')
  AND column_name ~ '[A-Z]';

-- ✅ Expected: 0 rows (all columns are snake_case)
```

---

## Performance Tests

### Test 1: Bulk Assessment Creation

```bash
# Create 50 assessments at once

curl -X POST http://localhost:3003/api/assessments \
  -H "Content-Type: application/json" \
  -H "Cookie: [SESSION_COOKIE]" \
  -d '{
    "assessments": [
      {"student_id": 1, "assessment_type": "baseline", "subject": "language", "level": "word"},
      {"student_id": 2, "assessment_type": "baseline", "subject": "language", "level": "letter"},
      ...
      {"student_id": 50, "assessment_type": "baseline", "subject": "language", "level": "story"}
    ]
  }'

# ✅ Expected: Completes in < 5 seconds
# ✅ Expected: Returns success/error count
```

### Test 2: Student List Pagination

```bash
# Request large page of students

curl "http://localhost:3003/api/students?page=1&limit=100" \
  -H "Cookie: [SESSION_COOKIE]"

# ✅ Expected: Response time < 2 seconds
# ✅ Expected: Proper pagination metadata
```

---

## Error Handling Tests

### Test 1: Detailed Error Messages (AI_DEVELOPMENT_RULES compliance)

```bash
# Trigger database constraint error (e.g., invalid foreign key)

curl -X POST http://localhost:3003/api/students \
  -H "Content-Type: application/json" \
  -H "Cookie: [SESSION_COOKIE]" \
  -d '{
    "name": "Test",
    "pilot_school_id": 99999
  }'

# ✅ Expected Response Structure:
# {
#   "error": "Khmer error message",
#   "message": "English error details",
#   "code": "ERROR_CODE",
#   "meta": {
#     "field": "pilot_school_id",
#     "constraint": "fkey_constraint_name"
#   }
# }
```

---

## Checklist: Complete 100% Implementation

- [x] Constants file created (`/lib/constants/assessment-levels.ts`)
- [x] TypeScript types updated (`/types/assessment.ts`)
- [x] Assessment API validation updated
- [x] Student API permission checks added
- [x] Frontend AssessmentForm updated with dynamic levels
- [x] Error responses follow AI_DEVELOPMENT_RULES
- [x] Documentation complete
- [ ] All tests pass (run through this guide)
- [ ] No TypeScript errors (`npx tsc --noEmit`)
- [ ] No lint errors (`npm run lint`)
- [ ] Database schema verified (snake_case only)

---

## Troubleshooting

### Issue: "Module not found: @/lib/constants/assessment-levels"
**Solution:** Restart Next.js dev server
```bash
pkill -f "next dev"
PORT=3003 npm run dev
```

### Issue: Assessment validation failing
**Solution:** Check that assessment_type uses English values ('baseline', 'midline', 'endline') not Khmer

### Issue: Permission denied errors
**Solution:** Verify user session has correct `pilot_school_id` and `role`

---

**Next Steps:**
1. Run all test scenarios above
2. Fix any failing tests
3. Deploy to staging environment
4. Conduct user acceptance testing with real teachers and mentors

