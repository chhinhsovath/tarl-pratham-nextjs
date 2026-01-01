# Assessment Labels Fix Summary

## Issue Reported
User reported that student 2762 (and many others) show "only midline but no baseline" on the web UI at https://tarl.openplp.com/students

## Investigation Results

### Database Analysis for Student 2762
- **Student ID**: 2762 (ឡេះ ហ្វាទីន)
- **Database Record** (`students` table):
  - `baseline_math_level`: `word_problems` ✅
  - `midline_math_level`: `null` (NO midline data)
  - All other levels: `null`

- **Assessment Records** (`assessments` table):
  - **1 assessment exists**: baseline math word_problems (ID: 1984)
  - **0 midline assessments**
  - **0 endline assessments**

### Root Cause: INCORRECT KHMER LABELS

The issue is **NOT** a data problem. The database is correct. The issue is **MISLABELING** in the UI:

#### ❌ INCORRECT Labels (OLD - Being Used):
```
Baseline  → "មូលដ្ឋាន"
Midline   → "កុលសនភាព"
Endline   → "បញ្ចប់"
```

#### ✅ CORRECT Labels (NEW - Should Use):
```
Baseline  → "តេស្តដើមគ្រា"
Midline   → "តេស្តពាក់កណ្ដាលគ្រា"
Endline   → "តេស្តចុងក្រោយគ្រា"
```

#### Correct Subject Labels:
```
Khmer Language  → "ភាសាខ្មែរ"
Math            → "គណិតវិទ្យា"
```

#### Correct Level Labels:

**ភាសាខ្មែរ (Khmer Language):**
- beginner       → "កម្រិតដំបូង"
- letter         → "តួអក្សរ"
- word           → "ពាក្យ"
- paragraph      → "កថាខណ្ឌ"
- story          → "រឿង"
- comprehension1 → "យល់ន័យ១"
- comprehension2 → "យល់ន័យ២"

**គណិតវិទ្យា (Math):**
- beginner       → "កម្រិតដំបូង"
- number_1digit  → "លេខ១ខ្ទង"
- number_2digit  → "លេខ២ខ្ទង"
- subtraction    → "ប្រមាណវិធីដក"
- division       → "ប្រមាណវិធីចែក"
- word_problems  → "ចំណោទ"

## What I Fixed

### 1. ✅ Updated `/app/students/page.tsx`
- Fixed assessment type labels: "មូលដ្ឋាន" → "តេស្តដើមគ្រា", etc.
- Added imports from `lib/constants/assessment-levels.ts`
- Now displays proper Khmer labels for levels using constants

### 2. ✅ Updated `/app/students/[id]/page.tsx`
- Fixed assessment type labels in assessment history table
- Fixed labels in progress cards
- Now shows proper Khmer level names instead of English codes

### 3. ✅ Verified `/app/assessments/page.tsx`
- Already uses CORRECT labels (lines 296-302, 520-522)
- This is why it shows correctly!

### 4. ✅ Created Constants File Reference
- All correct labels are in: `/lib/constants/assessment-levels.ts`
- This file should be the **single source of truth**

## Files That Still Need Fixing

Based on grep results, these files still use incorrect labels:

### High Priority (User-Facing):
1. `/app/verification/page.tsx` - lines 326, 328, 385-386, 433-434, 551-553, 704-706, 873-875
2. `/app/reports/assessment-analysis/page.tsx` - lines 255-257, 436-438
3. `/app/reports/dashboard/page.tsx` - lines 249-251
4. `/app/schools/[id]/students/page.tsx` - lines 277-282, 344-350, 540-568
5. `/app/public-verification-comparison/page.tsx` - lines 200-201, 239-240, 316-318, 498-500
6. `/app/public-verification-dashboard/page.tsx` - line 250-252
7. `/app/assessments/verify/page.tsx` - lines 732-734
8. `/app/assessments/manage/page.tsx` - lines 369-370, 480-482

### Medium Priority (Components):
9. `/components/dashboards/SimpleDashboard.tsx` - lines 144, 337, 343, 349
10. `/components/teacher/StudentProgressCard.tsx` - line 126
11. `/app/teacher/dashboard/page.tsx` - line 494

### Low Priority (Documentation/Help):
12. `/app/help/page.tsx` - lines 104, 108
13. `/app/help/assessment-entry/page.tsx` - lines 26, 50, 83, 101, 131, 133, 140

## Recommended Fix Strategy

### Quick Fix (Recommended):
Create a global find-and-replace script:

```bash
# Replace in all .tsx files
find app -name "*.tsx" -type f -exec sed -i '' 's/មូលដ្ឋាន/តេស្តដើមគ្រា/g' {} +
find app -name "*.tsx" -type f -exec sed -i '' 's/កុលសនភាព/តេស្តពាក់កណ្ដាលគ្រា/g' {} +
find app -name "*.tsx" -type f -exec sed -i '' 's/បញ្ចប់/តេស្តចុងក្រោយគ្រា/g' {} +
```

**WARNING**: This will replace ALL occurrences, including in contexts where "បញ្ចប់" means "finish/complete" (not assessment type). Review changes carefully.

### Proper Fix (Better):
1. Import constants from `/lib/constants/assessment-levels.ts` in each file
2. Replace hardcoded strings with `ASSESSMENT_TYPE_LABELS_KM[type]`
3. Use helper functions like `getAssessmentTypeLabelKM(type)`

## Testing Verification

### For Student 2762:
- ✅ Database shows: baseline math word_problems
- ✅ Should display: "តេស្តដើមគ្រា: គណិតវិទ្យា: ចំណោទ"
- ❌ Should NOT show midline or endline sections

### Test Cases:
1. Visit `/students` - check student 2762 card
2. Visit `/assessments` - filter by student 2762
3. Visit `/students/2762` - check detail page
4. Verify all 3 pages show consistent data

## Summary

**The data is CORRECT.** The issue is purely **COSMETIC** - wrong Khmer labels making users think data is missing or incorrect.

After fixing labels system-wide, users will see:
- Correct assessment type names in Khmer
- Proper subject names
- Accurate level descriptions in Khmer

This will eliminate confusion about "missing" assessments.
