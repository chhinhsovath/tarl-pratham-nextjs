# Testing Guide: Permission Changes Verification

This document provides comprehensive testing procedures to verify all recent permission changes are working correctly.

## 🎯 Features to Verify

### 1. Teacher Delete Permissions
- Teachers can delete students with no assessments
- Teachers can delete students with unverified/unlocked assessments
- Teachers CANNOT delete students with verified OR locked assessments
- Teachers can delete unverified/unlocked assessments
- Teachers can update unverified/unlocked assessments

### 2. Coordinator Approval/Lock Permissions
- Coordinators can verify assessments
- Coordinators can lock/unlock assessments
- Coordinators can lock/unlock mentoring visits
- Coordinators can perform bulk lock/unlock operations

---

## 📋 Manual Testing Checklist

### Setup Test Data
Create test accounts for each role:
- [ ] Admin account
- [ ] Coordinator account (coordinator@prathaminternational.org)
- [ ] Mentor account
- [ ] Teacher account

### Test 1: Teacher Delete Student (No Assessments)

**Steps:**
1. Login as Teacher
2. Create a new student
3. Try to delete the student
4. **Expected:** ✅ Delete succeeds

**Test URL:** `DELETE /api/students/{id}`

### Test 2: Teacher Delete Student (Unverified Assessment)

**Steps:**
1. Login as Teacher
2. Create student with assessment (don't verify)
3. Try to delete the student
4. **Expected:** ✅ Delete succeeds (assessment not verified)

### Test 3: Teacher Delete Student (Verified Assessment)

**Steps:**
1. Login as Coordinator
2. Verify one of teacher's assessments
3. Logout, login as Teacher
4. Try to delete the student with verified assessment
5. **Expected:** ❌ Delete fails with error:
   ```
   "មិនអាចលុបសិស្សបានទេ ព្រោះការវាយតម្លៃរបស់សិស្សនេះត្រូវបានផ្ទៀងផ្ទាត់ ឬចាក់សោរួចហើយ។"
   ```

### Test 4: Teacher Delete Assessment (Unverified)

**Steps:**
1. Login as Teacher
2. Create an assessment
3. Navigate to assessments list
4. Try to delete the assessment
5. **Expected:** ✅ Delete succeeds

**Test URL:** `POST /api/assessments/{id}/delete`

### Test 5: Teacher Delete Assessment (Verified)

**Steps:**
1. Login as Coordinator
2. Verify an assessment
3. Logout, login as Teacher
4. Try to delete the verified assessment
5. **Expected:** ❌ Delete fails with error:
   ```
   "មិនអាចលុបការវាយតម្លៃបានទេ ព្រោះការវាយតម្លៃនេះត្រូវបានផ្ទៀងផ្ទាត់ ឬចាក់សោរួចហើយ។"
   ```

### Test 6: Teacher Update Assessment (Locked)

**Steps:**
1. Login as Coordinator
2. Lock an assessment
3. Logout, login as Teacher
4. Try to update the locked assessment
5. **Expected:** ❌ Update fails with error:
   ```
   "មិនអាចកែប្រែការវាយតម្លៃបានទេ ព្រោះការវាយតម្លៃនេះត្រូវបានផ្ទៀងផ្ទាត់ ឬចាក់សោរួចហើយ។"
   ```

### Test 7: Coordinator Lock Assessment

**Steps:**
1. Login as Coordinator
2. Navigate to assessment details
3. Click "Lock" button
4. **Expected:** ✅ Assessment locked successfully

**Test URL:** `POST /api/assessments/{id}/lock`
**Payload:** `{ "lock": true, "locked_by": coordinatorId }`

### Test 8: Coordinator Unlock Assessment

**Steps:**
1. Login as Coordinator
2. Find a locked assessment
3. Click "Unlock" button
4. **Expected:** ✅ Assessment unlocked successfully

**Test URL:** `POST /api/assessments/{id}/lock`
**Payload:** `{ "lock": false }`

### Test 9: Coordinator Bulk Lock Assessments

**Steps:**
1. Login as Coordinator
2. Select multiple assessments
3. Click "Bulk Lock" button
4. **Expected:** ✅ All selected assessments locked

**Test URL:** `POST /api/assessment-management/bulk-lock-assessments`
**Payload:** `{ "assessment_ids": [1, 2, 3, 4, 5] }`

### Test 10: Coordinator Lock Mentoring Visit

**Steps:**
1. Login as Coordinator
2. Navigate to mentoring visits
3. Select a visit and click "Lock"
4. **Expected:** ✅ Visit locked successfully

**Test URL:** `POST /api/mentoring/{id}/lock`

### Test 11: Mentor Cannot Lock Assessment

**Steps:**
1. Login as Mentor
2. Try to lock an assessment
3. **Expected:** ❌ 403 Forbidden error

### Test 12: Teacher Cannot Lock Assessment

**Steps:**
1. Login as Teacher
2. Try to lock an assessment
3. **Expected:** ❌ 403 Forbidden error

---

## 🔧 API Testing with cURL

### Test Teacher Delete Student (Unverified Assessment)

```bash
# Login as teacher and get session cookie
curl -X POST https://tarl.openplp.com/api/auth/callback/credentials \
  -H "Content-Type: application/json" \
  -d '{"email":"teacher@example.com","password":"password"}' \
  -c cookies.txt

# Try to delete student
curl -X DELETE https://tarl.openplp.com/api/students/1 \
  -b cookies.txt

# Expected: {"success":true,"message":"Student deleted successfully"}
```

### Test Teacher Delete Student (Verified Assessment)

```bash
# First verify assessment as coordinator
curl -X POST https://tarl.openplp.com/api/auth/callback/credentials \
  -H "Content-Type: application/json" \
  -d '{"email":"coordinator@prathaminternational.org","password":"password"}' \
  -c cookies.txt

curl -X PUT https://tarl.openplp.com/api/assessments/1/verify \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"verification_status":"verified"}'

# Logout and login as teacher
curl -X POST https://tarl.openplp.com/api/auth/callback/credentials \
  -H "Content-Type: application/json" \
  -d '{"email":"teacher@example.com","password":"password"}' \
  -c cookies.txt

# Try to delete student with verified assessment
curl -X DELETE https://tarl.openplp.com/api/students/1 \
  -b cookies.txt

# Expected: 403 error with Khmer message
```

### Test Coordinator Lock Assessment

```bash
# Login as coordinator
curl -X POST https://tarl.openplp.com/api/auth/callback/credentials \
  -H "Content-Type: application/json" \
  -d '{"email":"coordinator@prathaminternational.org","password":"password"}' \
  -c cookies.txt

# Lock assessment
curl -X POST https://tarl.openplp.com/api/assessments/1/lock \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"lock":true,"locked_by":2}'

# Expected: {"message":"Assessment locked successfully","success":true}
```

### Test Coordinator Bulk Lock

```bash
# Login as coordinator
curl -X POST https://tarl.openplp.com/api/auth/callback/credentials \
  -H "Content-Type: application/json" \
  -d '{"email":"coordinator@prathaminternational.org","password":"password"}' \
  -c cookies.txt

# Bulk lock assessments
curl -X POST https://tarl.openplp.com/api/assessment-management/bulk-lock-assessments \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"assessment_ids":[1,2,3,4,5]}'

# Expected: Success with count of locked assessments
```

### Test Mentor Cannot Lock (Should Fail)

```bash
# Login as mentor
curl -X POST https://tarl.openplp.com/api/auth/callback/credentials \
  -H "Content-Type: application/json" \
  -d '{"email":"mentor@example.com","password":"password"}' \
  -c cookies.txt

# Try to lock assessment
curl -X POST https://tarl.openplp.com/api/assessments/1/lock \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"lock":true}'

# Expected: {"error":"Forbidden - Admin or Coordinator only"}
```

---

## 🧪 Automated Test Suggestions

Create these test files in `/tests/` directory:

### `tests/teacher-permissions.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Teacher Permissions', () => {
  test('teacher can delete student with no assessments', async ({ page }) => {
    // Login as teacher
    await page.goto('/auth/login');
    await page.fill('[name="email"]', 'teacher@example.com');
    await page.fill('[name="password"]', 'password');
    await page.click('button[type="submit"]');

    // Create student
    await page.goto('/students/create');
    await page.fill('[name="name"]', 'Test Student');
    await page.click('button[type="submit"]');

    // Delete student
    await page.goto('/students');
    await page.click('[data-testid="delete-button"]');
    await page.click('[data-testid="confirm-delete"]');

    // Verify success
    await expect(page.locator('.ant-message-success')).toBeVisible();
  });

  test('teacher cannot delete student with verified assessment', async ({ page }) => {
    // This test requires test data setup
    await page.goto('/students/1');
    await page.click('[data-testid="delete-button"]');

    // Verify error message in Khmer
    await expect(page.locator('.ant-message-error')).toContainText('មិនអាចលុបសិស្សបានទេ');
  });
});
```

### `tests/coordinator-permissions.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Coordinator Permissions', () => {
  test('coordinator can lock assessment', async ({ page }) => {
    await page.goto('/auth/login');
    await page.fill('[name="email"]', 'coordinator@prathaminternational.org');
    await page.fill('[name="password"]', 'password');
    await page.click('button[type="submit"]');

    await page.goto('/assessments/1');
    await page.click('[data-testid="lock-button"]');

    await expect(page.locator('.ant-message-success')).toBeVisible();
  });

  test('coordinator can bulk lock assessments', async ({ page }) => {
    await page.goto('/assessments');

    // Select multiple assessments
    await page.check('[data-testid="checkbox-1"]');
    await page.check('[data-testid="checkbox-2"]');
    await page.check('[data-testid="checkbox-3"]');

    // Bulk lock
    await page.click('[data-testid="bulk-lock"]');

    await expect(page.locator('.ant-message-success')).toContainText('locked successfully');
  });
});
```

---

## 📊 Database Verification Queries

Run these SQL queries to verify data states:

### Check Assessment Lock Status

```sql
SELECT
  id,
  student_id,
  is_locked,
  verified_by_id,
  locked_by_id,
  locked_at
FROM assessments
WHERE student_id = 1;
```

### Check Student Assessments

```sql
SELECT
  s.id,
  s.name,
  COUNT(a.id) as total_assessments,
  COUNT(CASE WHEN a.verified_by_id IS NOT NULL THEN 1 END) as verified_assessments,
  COUNT(CASE WHEN a.is_locked = true THEN 1 END) as locked_assessments
FROM students s
LEFT JOIN assessments a ON a.student_id = s.id
WHERE s.id = 1
GROUP BY s.id, s.name;
```

### Check Who Can Delete Student

```sql
-- Student with ID 1 - can teacher delete?
SELECT
  s.id,
  s.name,
  COUNT(a.id) FILTER (WHERE a.verified_by_id IS NOT NULL OR a.is_locked = true) as blocking_assessments
FROM students s
LEFT JOIN assessments a ON a.student_id = s.id
WHERE s.id = 1
GROUP BY s.id, s.name;

-- If blocking_assessments > 0, teacher CANNOT delete
```

---

## ✅ Verification Checklist Summary

### Student Delete Permissions
- [ ] Teacher deletes student with NO assessments - SUCCESS
- [ ] Teacher deletes student with UNVERIFIED assessments - SUCCESS
- [ ] Teacher deletes student with VERIFIED assessment - FAILS (403)
- [ ] Teacher deletes student with LOCKED assessment - FAILS (403)
- [ ] Admin deletes student with verified assessment - SUCCESS
- [ ] Coordinator deletes student with verified assessment - SUCCESS

### Assessment Delete/Update Permissions
- [ ] Teacher deletes UNVERIFIED assessment - SUCCESS
- [ ] Teacher deletes VERIFIED assessment - FAILS (403)
- [ ] Teacher updates UNLOCKED assessment - SUCCESS
- [ ] Teacher updates LOCKED assessment - FAILS (403)
- [ ] Teacher updates VERIFIED assessment - FAILS (403)

### Coordinator Lock Permissions
- [ ] Coordinator locks assessment - SUCCESS
- [ ] Coordinator unlocks assessment - SUCCESS
- [ ] Coordinator locks mentoring visit - SUCCESS
- [ ] Coordinator unlocks mentoring visit - SUCCESS
- [ ] Coordinator bulk locks assessments - SUCCESS
- [ ] Coordinator bulk unlocks assessments - SUCCESS
- [ ] Coordinator bulk locks mentoring visits - SUCCESS
- [ ] Coordinator bulk unlocks mentoring visits - SUCCESS

### Permission Denials
- [ ] Mentor tries to lock assessment - FAILS (403)
- [ ] Teacher tries to lock assessment - FAILS (403)
- [ ] Mentor tries to lock mentoring visit - FAILS (403)
- [ ] Teacher tries to verify assessment - FAILS (403)

---

## 🎬 Video Recording Test Session

Record a screen session testing each scenario:

1. **Teacher Flow (5 minutes):**
   - Create student
   - Create assessment
   - Delete student (success)
   - Have coordinator verify assessment
   - Try to delete student (fail)
   - Check error message in Khmer

2. **Coordinator Flow (5 minutes):**
   - Verify assessment
   - Lock assessment
   - Bulk lock multiple assessments
   - Lock mentoring visit
   - Unlock assessment

3. **Permission Denial Flow (3 minutes):**
   - Login as mentor
   - Try to lock assessment (403 error)
   - Login as teacher
   - Try to verify assessment (403 error)

---

## 🔍 What to Look For

### Success Indicators:
✅ No console errors
✅ Success messages in Khmer
✅ Database records updated correctly
✅ UI buttons disabled/enabled appropriately
✅ Redirect after successful operations

### Failure Indicators:
❌ 500 server errors
❌ Wrong error messages
❌ Actions succeed when they should fail
❌ UI not reflecting permission changes
❌ Database in inconsistent state

---

## 📝 Testing Report Template

After testing, fill out this report:

```markdown
# Permission Testing Report
Date: YYYY-MM-DD
Tester: [Name]
Environment: https://tarl.openplp.com

## Test Results

### Teacher Permissions
- [ ] PASS/FAIL - Delete student (no assessments)
- [ ] PASS/FAIL - Delete student (unverified assessments)
- [ ] PASS/FAIL - Cannot delete student (verified assessment)
- [ ] PASS/FAIL - Delete unverified assessment
- [ ] PASS/FAIL - Cannot delete verified assessment
- [ ] PASS/FAIL - Cannot update locked assessment

### Coordinator Permissions
- [ ] PASS/FAIL - Lock assessment
- [ ] PASS/FAIL - Unlock assessment
- [ ] PASS/FAIL - Bulk lock assessments
- [ ] PASS/FAIL - Lock mentoring visit

### Issues Found
1. [Description of issue]
2. [Description of issue]

### Recommendations
1. [Recommendation]
2. [Recommendation]
```

---

## 🚀 Quick Smoke Test (2 Minutes)

Fastest way to verify core functionality:

```bash
# 1. Teacher delete student with no assessment (should work)
curl -X DELETE https://tarl.openplp.com/api/students/999 \
  -H "Cookie: session=teacher_session" \
  -v

# 2. Coordinator lock assessment (should work)
curl -X POST https://tarl.openplp.com/api/assessments/1/lock \
  -H "Cookie: session=coordinator_session" \
  -H "Content-Type: application/json" \
  -d '{"lock":true}' \
  -v

# 3. Mentor lock assessment (should fail 403)
curl -X POST https://tarl.openplp.com/api/assessments/1/lock \
  -H "Cookie: session=mentor_session" \
  -H "Content-Type: application/json" \
  -d '{"lock":true}' \
  -v
```

If all 3 tests return expected results, core functionality is working!
