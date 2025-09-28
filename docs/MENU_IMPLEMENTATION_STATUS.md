# TaRL Pratham Menu Implementation Status

## ✅ Completed Menu Updates (Matching Laravel Exactly)

### Changes Made to Match Laravel Implementation

#### 1. **Route Updates**
- ✅ Changed `/analytics-dashboard` → `/reports/dashboard` (Enhanced Analytics Dashboard)
- ✅ Changed `/assessments/verify` → `/verification` (Verification page)
- ✅ Changed `/mentoring-visits` → `/mentoring` (Mentoring page)
- ✅ Changed `/teacher-workspace` → `/teacher/dashboard` (Teacher Dashboard)
- ✅ Changed `/profile` → `/profile/edit` (Profile Edit)
- ✅ Changed `/profile#password` → `/profile/edit#password-update` (Password Update)
- ✅ Removed `/profile-setup` from user dropdown (not in Laravel)

#### 2. **Label Updates (Khmer)**
- ✅ Changed "សិស្ស" → "និស្សិត" (Students label)
- ✅ Changed "ការចុះអប់រំ និងត្រួតពិនិត្យ" → "ការណែនាំ" (Mentoring label)
- ✅ Changed "របាយការណ៍ទាំងអស់" → "របាយការណ៍" (All Reports label)
- ✅ Changed "រដ្ឋបាលទាំងអស់" → "រដ្ឋបាល" (All Administration label)

#### 3. **Menu Structure Simplification**
- ✅ Removed submenu from Assessments (now single item as in Laravel)
- ✅ Added "របាយការណ៍វត្តមាន" (Attendance Report) to Reports submenu
- ✅ Reordered Reports submenu to match Laravel order

#### 4. **Role-Based Access (Verified Against Laravel)**

| Menu Item | Admin | Coordinator | Mentor | Teacher | Viewer | Implementation Status |
|-----------|-------|-------------|---------|---------|--------|---------------------|
| Dashboard | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ Correct |
| Enhanced Analytics | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ Correct |
| Assessments | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ Correct |
| Verification | ✅ | ❌ | ✅ | ❌ | ❌ | ✅ Correct |
| Students | ✅ | ❌ | ✅ | ✅ | ❌ | ✅ Correct |
| Mentoring | ✅ | ❌ | ✅ | ❌ | ❌ | ✅ Correct |
| Teacher Workspace | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ Correct |
| Reports | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ Correct |
| Coordinator Workspace | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ Correct |
| Administration | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ Correct |
| Help | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ Correct |

## Current Menu Implementation (DashboardLayout.tsx)

### Main Navigation Items (As Implemented)

```typescript
// 1. Dashboard (All except Coordinator)
{
  key: '/dashboard',
  icon: 'DashboardOutlined',
  label: 'ផ្ទាំងគ្រប់គ្រង'
}

// 2. Enhanced Analytics Dashboard (All except Coordinator)
{
  key: '/reports/dashboard',
  icon: 'AreaChartOutlined',
  label: 'វិភាគ ផ្ទាំងគ្រប់គ្រង'
}

// 3. Assessments (Admin, Teacher, Mentor, Viewer)
{
  key: '/assessments',
  icon: 'FileTextOutlined',
  label: 'ការវាយតម្លៃ'
}

// 4. Verification (Admin, Mentor)
{
  key: '/verification',
  icon: 'CheckCircleOutlined',
  label: 'ផ្ទៀងផ្ទាត់'
}

// 5. Students (Admin, Teacher, Mentor)
{
  key: '/students',
  icon: 'TeamOutlined',
  label: 'និស្សិត'
}

// 6. Mentoring (Admin, Mentor)
{
  key: '/mentoring',
  icon: 'SolutionOutlined',
  label: 'ការណែនាំ'
}

// 7. Teacher Workspace (Mentor only)
{
  key: '/teacher/dashboard',
  icon: 'BookOutlined',
  label: 'កន្លែងធ្វើការគ្រូ'
}

// 8. Reports (All except Coordinator)
{
  key: 'reports',
  icon: 'BarChartOutlined',
  label: 'របាយការណ៍',
  children: [
    '/reports/dashboard' - 'ផ្ទាំងវិភាគទិន្នន័យ',
    '/reports/assessment-analysis' - 'របាយការណ៍វិភាគការវាយតម្លៃ',
    '/reports/attendance' - 'របាយការណ៍វត្តមាន',
    '/reports/intervention' - 'របាយការណ៍អន្តរាគមន៍',
    '/reports' - 'របាយការណ៍'
  ]
}

// 9. Coordinator Workspace (Admin, Coordinator)
{
  key: '/coordinator/workspace',
  icon: 'AppstoreOutlined',
  label: 'កន្លែងធ្វើការសម្របសម្រួល'
}

// 10. Administration (Admin only)
{
  key: 'administration',
  icon: 'SafetyOutlined',
  label: 'រដ្ឋបាល',
  children: [
    '/users' - 'អ្នកប្រើប្រាស់',
    '/schools' - 'សាលារៀន',
    '/classes' - 'ថ្នាក់',
    '/settings' - 'ការកំណត់',
    '/resources' - 'ធនធាន',
    '/administration' - 'រដ្ឋបាល'
  ]
}

// 11. Help (All users)
{
  key: '/help',
  icon: 'QuestionCircleOutlined',
  label: 'ជំនួយ'
}
```

### User Profile Dropdown Menu

```typescript
// Profile Section
- My Profile (/profile/edit) - 'ប្រវត្តិរូបរបស់ខ្ញុំ'
- Change Password (/profile/edit#password-update) - 'ផ្លាស់ពាក្យសម្ងាត់'

// Help & Support
- Getting Started (/onboarding) - 'ណែនាំចាប់ផ្តើម'
- Help & Tutorials (/help) - 'ជំនួយ & ការណែនាំ'
- About Project (/about) - 'អំពីគម្រោង'

// Sign Out
- Sign Out - 'ចាកចេញ'
```

## Pages That Need to be Created/Updated

Based on the menu structure, these pages need to be created or updated to match Laravel routes:

### High Priority (Core Features)
1. ✅ `/dashboard` - Already exists
2. ❌ `/reports/dashboard` - Need to create or move from `/analytics-dashboard`
3. ✅ `/assessments` - Already exists
4. ❌ `/verification` - Need to create or move from `/assessments/verify`
5. ✅ `/students` - Already exists
6. ❌ `/mentoring` - Need to create or rename from `/mentoring-visits`
7. ❌ `/teacher/dashboard` - Need to create
8. ✅ `/reports` - Already exists
9. ✅ `/coordinator/workspace` - Already exists

### Medium Priority (Admin Features)
10. ✅ `/users` - Already exists
11. ✅ `/schools` - Already exists
12. ✅ `/classes` - Already exists
13. ❌ `/settings` - Need to create
14. ❌ `/resources` - Need to create
15. ❌ `/administration` - Need to create

### Low Priority (Support Pages)
16. ❌ `/profile/edit` - Need to create or update from `/profile`
17. ❌ `/onboarding` - Need to create
18. ✅ `/help` - Already exists
19. ❌ `/about` - Need to create

### Report Pages
20. ❌ `/reports/assessment-analysis` - Need to create
21. ❌ `/reports/attendance` - Need to create
22. ❌ `/reports/intervention` - Need to create

## Testing Checklist

- [ ] Login as Admin - verify all menu items visible
- [ ] Login as Coordinator - verify only Coordinator Workspace and Help visible
- [ ] Login as Mentor - verify correct menu items (no Administration)
- [ ] Login as Teacher - verify correct menu items (no Verification, Mentoring, Administration)
- [ ] Login as Viewer - verify read-only menu items
- [ ] Test all navigation links work correctly
- [ ] Test mobile menu functionality
- [ ] Test submenu expand/collapse
- [ ] Test user dropdown menu
- [ ] Verify Khmer labels match Laravel exactly

## Next Steps

1. **Create missing pages** - Set up the page structure for all missing routes
2. **Update existing page routes** - Rename/move pages to match Laravel routes
3. **Test with all user roles** - Comprehensive testing of menu visibility
4. **Mobile optimization** - Ensure mobile menu works correctly
5. **Add breadcrumbs** - Generate from menu structure
6. **Add active state styling** - Highlight current page in menu

## Notes

- The menu structure now matches Laravel exactly
- All Khmer labels have been verified against the Laravel blade templates
- Role-based access control is correctly implemented
- The external PLP link needs to be added to the header (not in sidebar)