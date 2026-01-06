# 🎯 PRODUCTION-ONLY DATA POLICY

**Effective Date**: 2026-01-06
**Policy**: ALL data input, create, update, view, and exports = `record_status = 'production'` ONLY

---

## 📋 SYSTEM-WIDE POLICY

### NO MORE:
- ❌ Test data (`test_mentor`, `test_teacher`)
- ❌ Development data (`development`)
- ❌ Archived data (`archived`)
- ❌ Demo data (`demo`)
- ❌ Draft assessments
- ❌ Temporary students
- ❌ Future assessments in views/exports

### ONLY:
- ✅ `record_status = 'production'` everywhere
- ✅ All data visible to authorized users
- ✅ All data included in exports
- ✅ No hidden/test/development records

---

## 🔍 AUDIT FINDINGS

### Data Creation Endpoints (All Must Set Production)

| Endpoint | File | Lines | Current Status | Action |
|----------|------|-------|-----------------|--------|
| POST /api/students | app/api/students/route.ts | 319-480 | Uses getRecordStatus() | ✅ OK |
| POST /api/students/bulk-import | app/api/students/bulk-import/route.ts | 5-168 | Relies on schema default | ⚠️ CLARIFY |
| POST /api/assessments | app/api/assessments/route.ts | 313-610 | Computes then forces 'production' | 🔴 **BUG** |
| POST /api/assessments (bulk) | app/api/assessments/route.ts | 612-828 | Uses computed recordStatus | ⚠️ CLARIFY |
| POST /api/mentoring-visits | app/api/mentoring-visits/route.ts | 222-348 | Uses direct role logic | ⚠️ USE FUNCTION |
| POST /api/users | app/api/users/route.ts | 290-441 | No record_status handling | ✅ SCHEMA DEFAULT |
| POST /api/users/bulk-import | app/api/users/bulk-import/route.ts | 6-143 | No record_status handling | ✅ SCHEMA DEFAULT |

### Read/View Endpoints (All Must Filter Production)

| Endpoint | File | Filter? | Status |
|----------|------|---------|--------|
| GET /api/students | app/api/students/route.ts | YES (production) | ✅ OK |
| GET /api/assessments | app/api/assessments/route.ts | YES (production) | ✅ OK |
| GET /api/assessments/verify | app/api/assessments/verify/route.ts | YES (production) | ✅ OK |
| GET /api/mentoring-visits | app/api/mentoring-visits/route.ts | CHECK NEEDED | ⚠️ TBD |
| All dashboard endpoints | app/api/dashboard/* | CHECK NEEDED | ⚠️ TBD |
| All reports | app/api/reports/* | CHECK NEEDED | ⚠️ TBD |

### Export Endpoints (All Must Export Production Only)

| Endpoint | File | Filter? | Status |
|----------|------|---------|--------|
| GET /api/students/export | app/api/students/export/route.ts | YES (production) | ✅ OK |
| GET /api/assessments/statistics-export | app/api/students/statistics-export/route.ts | CHECK | ⚠️ TBD |
| Assessment comparison export | app/api/assessments/verify/comparison | CHECK | ⚠️ TBD |

---

## 🔴 CRITICAL BUGS IDENTIFIED

### Bug 1: Assessment POST Endpoint (Lines 391-522)

**File**: app/api/assessments/route.ts

**Problem**:
```typescript
// Lines 391-393: Computes recordStatus based on role
const recordStatus = session.user.role === "mentor" ? 'test_mentor' :
                    (session.user.role === "teacher" && session.user.test_mode_enabled) ? 'test_teacher' :
                    'production';

// ... lots of code ...

// Line 522: IGNORES computed value and forces production!
record_status: 'production',
```

**Impact**: The computed logic is pointless - everything goes to production anyway.

**Fix**: Remove lines 391-393 and all test_mentor/test_teacher logic. Simply use 'production' everywhere.

---

## 📋 REQUIRED CHANGES

### Priority 1: Remove Test Data Creation Logic (HIGH PRIORITY)

**Files to modify**:

1. **app/api/assessments/route.ts** (Lines 391-393, 522, bulk logic)
   - Remove test_mentor/test_teacher computation
   - Ensure ALL assessments are created with record_status='production'
   - Remove is_temporary field logic for assessments

2. **app/api/mentoring-visits/route.ts** (Lines 242-266)
   - Use getRecordStatus() instead of direct role logic
   - Ensure ALL visits are record_status='production'
   - Remove test_mentor/test_teacher logic
   - Remove is_temporary field logic

3. **lib/utils/recordStatus.ts**
   - Simplify getRecordStatus() to ALWAYS return 'production'
   - Remove test_mentor/test_teacher handling
   - Document that this function now only returns 'production'

---

### Priority 2: Ensure All Read Endpoints Filter Production (MEDIUM)

**Files to check/modify**:

1. **All GET endpoints in app/api/**
   - Verify WHERE clause includes `record_status = 'production'`
   - Remove any filters that show test data
   - Dashboard endpoints
   - Report endpoints
   - List endpoints

---

### Priority 3: Verify All Export Endpoints (MEDIUM)

**Files to check**:

1. **app/api/students/export/route.ts** ✅ Already verified (production only)
2. **app/api/students/statistics-export/route.ts** - Check filtering
3. **app/api/assessments/verify/comparison/route.ts** - Check filtering
4. Any other export endpoints

---

### Priority 4: Clean Up Test Data Management (LOW)

**Options**:

1. **Keep endpoints but document as deprecated**:
   - /api/test-data/* endpoints
   - /api/bulk/delete-test-data endpoint
   - Add warnings in code that these are no longer needed

2. **Remove endpoints entirely** (if confident):
   - No need to promote test→production (everything is production)
   - No need to delete test data (doesn't exist)

---

## 🧪 VERIFICATION CHECKLIST

After making changes, verify:

- [ ] All POST endpoints set `record_status = 'production'` explicitly
- [ ] All GET endpoints filter to `record_status = 'production'` only
- [ ] All exports only include `record_status = 'production'`
- [ ] No `is_temporary = true` data created anywhere
- [ ] No `test_session_id` assigned anywhere
- [ ] Mentoring visits only have 'production' status
- [ ] All bulk imports create 'production' data
- [ ] Dashboard shows only production data
- [ ] Reports show only production data
- [ ] No test/demo data visible anywhere

---

## 📝 IMPLEMENTATION STEPS

### Step 1: Fix Assessment Creation (Lines 391-522)
- [ ] Remove test_mentor/test_teacher logic
- [ ] Ensure recordStatus = 'production' always
- [ ] Remove is_temporary logic
- [ ] Test: Create assessment, verify record_status='production'

### Step 2: Fix Mentoring Visits
- [ ] Use getRecordStatus() function
- [ ] Remove direct role-based logic
- [ ] Ensure record_status='production' always
- [ ] Test: Create visit, verify record_status='production'

### Step 3: Simplify getRecordStatus()
- [ ] Make it always return 'production'
- [ ] Add comment explaining policy
- [ ] Update any code that expects other statuses

### Step 4: Audit All Read Endpoints
- [ ] Verify all GET endpoints filter production only
- [ ] Update any that don't have filters
- [ ] Test: Verify no test data visible

### Step 5: Verify All Exports
- [ ] Confirm exports have production filter
- [ ] Test: Export data, verify no non-production

### Step 6: Update Documentation
- [ ] Document production-only policy
- [ ] Mark test endpoints as deprecated
- [ ] Update any developer guides

---

## 🚀 ROLLOUT PLAN

1. **Make code changes** (all Priority 1, 2, 3 items)
2. **Run comprehensive tests**:
   - Create student → verify record_status='production'
   - Create assessment → verify record_status='production'
   - Create mentoring visit → verify record_status='production'
   - List students → verify only production shown
   - Export → verify only production exported
3. **Deploy to production**
4. **Verify in production** (spot check data)

---

## ✅ GUARANTEES AFTER IMPLEMENTATION

- ✅ ALL data is production status
- ✅ ALL views show only production data
- ✅ ALL exports are production-only
- ✅ NO test data anywhere
- ✅ NO hidden/future data
- ✅ NO archived data in views
- ✅ Complete data visibility (what you see is what you get)

---

## 📞 IF QUESTIONS

**Q: What about test data I need for development?**
A: Not applicable. All system data is now production-only. Use test accounts if needed.

**Q: What about future assessments for 700 students?**
A: If you mark them as production, they'll appear in views/exports. If you want to hide them, create a separate status (but current policy is production-only).

**Q: What about archived data?**
A: Not created. All data is production. Once created, data stays visible unless manually deleted.

---

**Policy Owner**: System
**Effective Date**: 2026-01-06
**Last Updated**: 2026-01-06
