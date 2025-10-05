# Assessment Edit Form Update - Complete Coverage

## Overview
Updated the assessment edit form to match the create form's complete data coverage, ensuring all assessment levels are available for both subjects (ភាសាខ្មែរ and គណិតវិទ្យា).

## Changes Made

### File Updated
- `app/assessments/[id]/edit/page.tsx`

### What Was Fixed

#### ❌ Before (Missing Data Points)
The edit form had **hardcoded 5 levels** only:
- កម្រិតដំបូង (beginner)
- តួអក្សរ (letter)
- ពាក្យ (word)
- កថាខណ្ឌ (paragraph)
- រឿង (story)

**Missing levels:**
- ភាសាខ្មែរ: យល់ន័យ១, យល់ន័យ២ (2 comprehension levels)
- គណិតវិទ្យា: All 6 math levels were not dynamically loading

#### ✅ After (Complete Coverage)
The edit form now **dynamically loads levels** based on subject:

**ភាសាខ្មែរ (Language) - 7 Levels:**
1. កម្រិតដំបូង (beginner)
2. តួអក្សរ (letter)
3. ពាក្យ (word)
4. កថាខណ្ឌ (paragraph)
5. រឿង (story)
6. យល់ន័យ១ (comprehension1)
7. យល់ន័យ២ (comprehension2)

**គណិតវិទ្យា (Math) - 6 Levels:**
1. កម្រិតដំបូង (beginner)
2. លេខ១ខ្ទង (number_1digit)
3. លេខ២ខ្ទង (number_2digit)
4. ប្រមាណវិធីដក (subtraction)
5. ប្រមាណវិធីចែក (division)
6. ចំណោទ (word_problems)

### Technical Implementation

#### 1. Added Dynamic Level Management
```typescript
// Import assessment level helpers
import {
  getAssessmentTypeOptions,
  getSubjectOptions,
  getLevelOptions
} from '@/lib/constants/assessment-levels';

// State for dynamic levels
const [selectedSubject, setSelectedSubject] = useState<'language' | 'math'>('language');
const [availableLevels, setAvailableLevels] = useState(getLevelOptions('language'));
```

#### 2. Subject Change Handler
```typescript
const handleSubjectChange = (value: 'language' | 'math') => {
  setSelectedSubject(value);
  // Clear level when subject changes to prevent invalid level-subject combinations
  form.setFieldValue('level', undefined);
};
```

#### 3. Dynamic Level Updates
```typescript
// Update available levels when subject changes
useEffect(() => {
  setAvailableLevels(getLevelOptions(selectedSubject));
}, [selectedSubject]);
```

#### 4. Form Field Updates
- **Assessment Type**: Uses `getAssessmentTypeOptions()` for dynamic rendering
- **Subject**: Uses `getSubjectOptions()` with `onChange` handler
- **Level**: Renders `availableLevels` dynamically based on selected subject

### Consistency with Create Form

Both forms now share:
1. ✅ Same data structure (`WizardData` interface)
2. ✅ Same level constants from `lib/constants/assessment-levels.ts`
3. ✅ Same dynamic subject-level relationship
4. ✅ Same validation (level required)
5. ✅ All 7 language levels + all 6 math levels

### User Experience Improvements

1. **Subject Switching**: When user changes subject, level field automatically:
   - Clears current selection
   - Updates available options
   - Shows correct levels for new subject

2. **Data Integrity**: Prevents invalid combinations like:
   - Math subject with "យល់ន័យ១" level ❌
   - Language subject with "ប្រមាណវិធីដក" level ❌

3. **Visual Feedback**: Level dropdown shows:
   - Language: "7 កម្រិតសម្រាប់ភាសាខ្មែរ"
   - Math: "6 កម្រិតសម្រាប់គណិតវិទ្យា"

## Testing Completed

### ✅ Build Test
```bash
npm run build
# Result: ✓ Compiled successfully
```

### ✅ Form Coverage Verification
- [x] All 7 language levels render correctly
- [x] All 6 math levels render correctly
- [x] Subject change clears level appropriately
- [x] Assessment types use dynamic options
- [x] Form validation works correctly

## Data Flow

```
User loads edit page
  ↓
Fetch assessment data
  ↓
Set subject state (language/math)
  ↓
Load appropriate levels (7 or 6)
  ↓
Populate form fields
  ↓
User can change subject
  ↓
Levels update dynamically
  ↓
Form validates and saves
```

## Files Reference

### Key Files
- **Edit Form**: `app/assessments/[id]/edit/page.tsx`
- **Create Form**: `components/wizards/AssessmentWizard.tsx`
- **Level Constants**: `lib/constants/assessment-levels.ts`
- **Assessment Details Step**: `components/wizards/steps/AssessmentDetailsStep.tsx`

### Constants Used
- `LANGUAGE_LEVELS` - 7 levels array
- `MATH_LEVELS` - 6 levels array
- `LANGUAGE_LEVEL_LABELS_KM` - Khmer labels mapping
- `MATH_LEVEL_LABELS_KM` - Khmer labels mapping
- `getLevelOptions(subject)` - Returns formatted level options

## Impact

### Before Fix
- Edit form could only edit 5 hardcoded levels
- Missing comprehension levels for language
- Missing all math-specific levels
- Inconsistent with create form

### After Fix
- ✅ Edit form covers 100% of assessment levels
- ✅ Matches create form exactly
- ✅ Prevents data entry errors
- ✅ Supports all TaRL assessment framework levels

## Related Documentation

- [Assessment Levels Constants](/lib/constants/assessment-levels.ts)
- [Assessment Wizard](/components/wizards/AssessmentWizard.tsx)
- [TaRL Framework Reference](/docs/note.md)

---

**Status**: ✅ Complete
**Build**: ✅ Passing
**Coverage**: ✅ 100% (7 language + 6 math levels)
