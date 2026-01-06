# 🔍 TEACHER ASSESSMENT DATA DEBUG REPORT

**Teacher**: Hoat Vimol (hoat.vimol.kam@teacher.tarl.edu.kh)
**School**: សាលាបឋមសិក្សាសាខា១ (School ID: 30)
**Date**: 2026-01-06
**Status**: ⚠️ **CRITICAL DATA INCONSISTENCY FOUND**

---

## 📊 CURRENT DATA STATE

### Students Summary
- **Total students created by teacher**: 28
- **Total assessments entered**: 39 (39 in production status)
- **All assessments have production status**: YES
- **Temporary assessments**: None

### Assessment Distribution
```
Baseline only:           15 students (53.6%)
Midline only:            3 students (10.7%)
Baseline + Midline:      10 students (35.7%)
Baseline + Midline + Endline: 0 students (0%)
Midline + Endline:       0 students (0%)
Endline only:            0 students (0%)
```

### Students with ONLY Midline (Missing Baseline)
1. **ចាន់ថា ចាន់រីម៉ា** (Student ID: 9090, DB ID: 2666)
   - Has: Midline (word_problems)
   - Missing: Baseline, Endline

2. **ណន​ ម៉ានី** (Student ID: ៩०៩១, DB ID: 2669)
   - Has: Midline (subtraction)
   - Missing: Baseline, Endline

3. **ស្រូយ ប៊ុនឡេង** (Student ID: ៩००९, DB ID: 2693)
   - Has: Midline (subtraction)
   - Missing: Baseline, Endline

---

## 🔴 THE CORE ISSUE

### What User Reported
> "When export there are some students and they show **only midline but not baseline**. But when we check from **teacher role** found that those students have completed **both baseline and midline**."

### What Database Actually Shows
- ✅ Export is correctly showing: Midline = Yes, Baseline = No
- ✅ Database truly contains: Only midline assessments for these students
- ❌ No baseline assessments exist in the database for these 3 students

### Possible Root Causes

**Possibility 1: Unsaved Assessment Data** (Most Likely)
- Teacher entered baseline assessments in the form
- Never clicked "Save" or submission failed silently
- Teacher sees the form data in their browser (not saved to DB)
- Export shows only what's actually in the database (the saved data)

**Possibility 2: Network Issues During Save**
- Teacher clicked save for baseline
- Network error occurred
- Submission appeared to fail but form was cleared
- Teacher assumed data was lost, only saved midline
- Only midline made it to the database

**Possibility 3: Browser Cache/Optimistic Updates**
- Teacher's UI is showing cached/optimistic updates
- Actual database queries show different data
- Teacher sees both but database only has one

**Possibility 4: Duplicate Student Records**
- Baseline and midline were saved to different student records
- Export pulls from one record, teacher sees both on another
- Would explain why "check from teacher role" shows both

---

## 🧪 VERIFICATION REQUIRED

### Step 1: Ask Teacher Specific Questions

For students showing only midline (ចាន់ថា ចាន់រីម៉ា, ណន​ ម៉ានី, ស្រូយ ប៊ុនឡេង):

1. **"Did you enter baseline assessments for these students?"**
   - If YES: Ask when and confirm saving
   - If NO: Explains why they're missing

2. **"Can you see baseline in your form for these students right now?"**
   - If YES: Then data is in browser cache but not DB
   - If NO: Confirms data was never entered

3. **"When did you enter midline for these students?"**
   - Get the date/time to cross-reference with database created_at timestamps

### Step 2: Check Assessment Entry UI Logs

Questions to investigate:
- Is there error handling in the student detail page when saving assessments?
- Do failed saves show error messages to the user?
- Does the form clear after a failed save (giving false success impression)?
- Are there any browser console errors when saving assessments?

### Step 3: Check Network Requests

While teacher is entering assessments:
1. Open browser DevTools (F12)
2. Go to Network tab
3. Enter baseline and midline
4. Watch for failed POST requests
5. Check response status codes

---

## ✅ CURRENT FIX DEPLOYMENT STATUS

The fix we deployed earlier (commit 2ab7129) ensures:
- ✅ Export queries ALL assessments regardless of record_status
- ✅ No assessments are filtered out
- ✅ Assessment status is logged for debugging

**However**: The fix only works with data that EXISTS in the database. If baseline assessments were never saved, they won't appear in the export.

---

## 🎯 RECOMMENDED NEXT STEPS

### Immediate Actions

1. **Ask Teacher Directly** (Pick 1-2 students as examples):
   ```
   "Student [name]:
   - Your export shows: Baseline=No, Midline=Yes
   - But you remember entering both?
   - Can you re-enter the baseline now so we can verify the export works?"
   ```

2. **Monitor Save Process**:
   - Have teacher open browser DevTools
   - Enter baseline and midline
   - Check Network tab for any failed requests
   - Verify both assessments save successfully

3. **Check Form Validation**:
   - Some fields might be required but not validated
   - Form might be submitting partial data

### Investigation Commands

```bash
# Check if there are any error logs from assessment saves
grep -i "assessment.*error\|save.*fail\|validation" /var/log/tarl-pratham.log | tail -50

# Check API response status codes
curl -X GET "https://tarl.openplp.com/api/students/2666" \
  -H "Authorization: Bearer [session-token]" | jq '.assessments'

# Verify assessment endpoint is receiving both
curl -X POST "https://tarl.openplp.com/api/assessments" \
  -H "Content-Type: application/json" \
  -d '{"student_id": 2666, "assessment_type": "baseline", ...}'
```

---

## 📋 DATA INTEGRITY SUMMARY

| Aspect | Status | Evidence |
|--------|--------|----------|
| **Database Consistency** | ✅ GOOD | All assessments in production status |
| **Export Logic** | ✅ GOOD | Correctly pulling all available data |
| **Assessment Counts** | ⚠️ INCOMPLETE | Only 39 assessments for 28 students |
| **Record Status Filtering** | ✅ FIXED | All statuses now included in export |
| **Teacher Data Entry** | ❓ UNKNOWN | Needs verification with teacher |

---

## 🔗 RELATED FILES

- **Export Endpoint**: `app/api/students/export/route.ts` (FIXED - commit 2ab7129)
- **Assessment Verification**: `app/api/assessments/verify/route.ts`
- **Database**: `prisma/schema.prisma`

---

## 📞 WHAT TO ASK THE TEACHER

**Critical Questions** (Use these exact student names):

1. For **ចាន់ថា ចាន់រីម៉ា** (Student ID: 9090):
   - "Did you enter BASELINE assessment for this student?"
   - "Do you see the baseline score in the form right now?"
   - "When was it entered (date/time)?"

2. For **ណន​ ម៉ានី** (Student ID: ៩०៩១):
   - Same questions as above

3. For **ស្រូយ ប៊ុនឡេង** (Student ID: ៩००९):
   - Same questions as above

**If teacher says "Yes, I entered baseline":**
- The baseline data might be in browser cache but not saved to database
- They need to re-enter it with confirmation it's saved

**If teacher says "No, I only entered midline":**
- This explains the export correctly showing only midline
- No bug - export is working as intended

---

## ⚠️ IMPORTANT NOTE

The fix we deployed (fetching all assessments regardless of record_status) is CORRECT and NECESSARY. However, it cannot create assessments that don't exist in the database. The export will now accurately show exactly what's in the database:

- If baseline exists → shows it
- If baseline doesn't exist → shows "No"

The question is whether baseline assessments should exist in the database but don't due to save failures, or whether the teacher only entered midline and remembers entering baseline incorrectly.

---

**Next Step**: Ask teacher about these 3 specific students and their baseline assessments.
