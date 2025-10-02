# Khmer-Only UI Migration Guide

**Date:** 2025-10-02
**Status:** In Progress

## Objective
Remove all English text from the user interface. Display **Khmer only** since the target users know nothing about English.

## Files Updated

### ✅ Wizard Components
- [x] `/components/wizards/steps/AssessmentDetailsStep.tsx` - Removed English from all dropdowns
- [x] `/components/wizards/steps/BulkAssessmentStep.tsx` - Removed English from level options
- [x] `/components/wizards/BulkAssessmentWizard.tsx` - Removed (Baseline), (Midline), (Endline), (Language), (Math)
- [x] `/components/forms/AssessmentForm.tsx` - Changed to Khmer-only labels

### 🔄 Remaining Files to Update

#### Dashboard Components
- [ ] `/components/dashboards/MentorDashboard.tsx` - Update chart labels
- [ ] `/components/dashboards/ViewerDashboard.tsx` - Update chart labels
- [ ] `/components/dashboards/AdminDashboard.tsx` - Update chart labels
- [ ] `/components/dashboards/TeacherDashboard.tsx` - Update any English text
- [ ] `/components/dashboards/CoordinatorDashboard.tsx` - Update any English text

#### Form Components
- [ ] `/components/assessments/BulkAssessmentForm.tsx`
- [ ] `/components/forms/ComprehensiveMentoringForm.tsx`
- [ ] `/components/forms/UserForm.tsx`

#### Other Components
- [ ] `/components/tour/OnboardingTour.tsx`
- [ ] `/components/teacher/StudentProgressCard.tsx`
- [ ] `/components/teacher/ClassPerformanceWidget.tsx`

## Khmer Translations Reference

### Assessment Types
- baseline → តេស្តដើមគ្រា
- midline → តេស្តពាក់កណ្ដាលគ្រា
- endline → តេស្តចុងក្រោយគ្រា

### Subjects
- Language / Khmer Language → ខ្មែរ
- Math / Mathematics → គណិតវិទ្យា

### Language Levels (7)
1. Beginner Level → កម្រិតដំបូង
2. Letters/Characters → តួអក្សរ
3. Words → ពាក្យ
4. Paragraphs → កថាខណ្ឌ
5. Stories → រឿង
6. Reading Comprehension 1 → យល់ន័យ១
7. Reading Comprehension 2 → យល់ន័យ២

### Math Levels (6)
1. Beginner Level → កម្រិតដំបូង
2. 1-Digit Numbers → លេខ១ខ្ទង
3. 2-Digit Numbers → លេខ២ខ្ទង
4. Subtraction → ប្រមាណវិធីដក
5. Division → ប្រមាណវិធីចែក
6. Word Problems → ចំណោទ

### Common UI Terms
- Select → ជ្រើសរើស
- Search → ស្វែងរក
- Save → រក្សាទុក
- Cancel → បោះបង់
- Edit → កែសម្រួល
- Delete → លុប
- Add → បន្ថែម
- View → មើល
- Submit → ដាក់ស្នើ
- Next → បន្ទាប់
- Previous → ថយក្រោយ
- Review → ពិនិត្យ
- Complete → បញ្ចប់

## Testing Checklist

After updates, verify:
- [ ] All dropdown options show Khmer only
- [ ] All button labels in Khmer
- [ ] All form field labels in Khmer
- [ ] All validation messages in Khmer
- [ ] All chart/graph labels in Khmer
- [ ] All table headers in Khmer
- [ ] All placeholders in Khmer
- [ ] No English text visible to end users
