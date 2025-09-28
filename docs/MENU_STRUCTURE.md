# TaRL Pratham - Comprehensive Menu Structure

## Overview
This document outlines the complete menu structure for each user role in the TaRL Pratham system, ensuring 100% feature parity with the Laravel implementation.

## Menu Structure by Role

### 1. Admin Role (Full Access)
```javascript
menuItems = [
  // Dashboard Section
  { 
    path: '/dashboard',
    label: 'ផ្ទាំងគ្រប់គ្រង',
    labelEn: 'Dashboard',
    icon: 'DashboardOutlined'
  },
  { 
    path: '/analytics-dashboard',
    label: 'វិភាគ ផ្ទាំងគ្រប់គ្រង',
    labelEn: 'Analytics Dashboard',
    icon: 'AreaChartOutlined'
  },

  // Assessment Management
  {
    label: 'ការវាយតម្លៃ',
    labelEn: 'Assessments',
    icon: 'FileTextOutlined',
    children: [
      { path: '/assessments', label: 'បញ្ជីការវាយតម្លៃ', labelEn: 'Assessment List' },
      { path: '/assessments/create', label: 'ការវាយតម្លៃថ្មី', labelEn: 'New Assessment' },
      { path: '/assessments/bulk', label: 'វាយតម្លៃច្រើន', labelEn: 'Bulk Assessment' },
      { path: '/assessments/manage', label: 'គ្រប់គ្រងការវាយតម្លៃ', labelEn: 'Manage Assessments' },
      { path: '/assessments/periods', label: 'កំណត់រយៈពេល', labelEn: 'Period Management' },
      { path: '/assessments/verify', label: 'ផ្ទៀងផ្ទាត់', labelEn: 'Verify Assessments' }
    ]
  },

  // Student Management
  {
    label: 'សិស្ស',
    labelEn: 'Students',
    icon: 'TeamOutlined',
    children: [
      { path: '/students', label: 'បញ្ជីសិស្ស', labelEn: 'Student List' },
      { path: '/students/create', label: 'បន្ថែមសិស្សថ្មី', labelEn: 'Add Student' },
      { path: '/students/bulk-import', label: 'នាំចូលច្រើន', labelEn: 'Bulk Import' },
      { path: '/students/progress', label: 'តាមដានវឌ្ឍនភាព', labelEn: 'Track Progress' }
    ]
  },

  // Mentoring System
  {
    label: 'ការចុះអប់រំ និងត្រួតពិនិត្យ',
    labelEn: 'Mentoring Visits',
    icon: 'SolutionOutlined',
    children: [
      { path: '/mentoring-visits', label: 'បញ្ជីការចុះ', labelEn: 'Visit List' },
      { path: '/mentoring-visits/create', label: 'កំណត់ត្រាថ្មី', labelEn: 'New Visit' },
      { path: '/mentoring-visits/statistics', label: 'ស្ថិតិ', labelEn: 'Statistics' },
      { path: '/mentoring-visits/export', label: 'នាំចេញទិន្នន័យ', labelEn: 'Export Data' }
    ]
  },

  // Reports Section
  {
    label: 'របាយការណ៍',
    labelEn: 'Reports',
    icon: 'BarChartOutlined',
    children: [
      { path: '/reports/dashboard', label: 'ផ្ទាំងវិភាគទិន្នន័យ', labelEn: 'Analytics Dashboard' },
      { path: '/reports/student-performance', label: 'លទ្ធផលសិស្ស', labelEn: 'Student Performance' },
      { path: '/reports/school-comparison', label: 'ប្រៀបធៀបសាលា', labelEn: 'School Comparison' },
      { path: '/reports/mentoring-impact', label: 'ផលប៉ះពាល់ការណែនាំ', labelEn: 'Mentoring Impact' },
      { path: '/reports/progress-tracking', label: 'តាមដានវឌ្ឍនភាព', labelEn: 'Progress Tracking' },
      { path: '/reports/attendance', label: 'វត្តមាន', labelEn: 'Attendance' },
      { path: '/reports/intervention', label: 'អន្តរាគមន៍', labelEn: 'Intervention' },
      { path: '/reports/class-progress', label: 'វឌ្ឍនភាពថ្នាក់', labelEn: 'Class Progress' },
      { divider: true },
      { path: '/reports', label: 'របាយការណ៍ទាំងអស់', labelEn: 'All Reports' }
    ]
  },

  // Coordinator Features
  {
    label: 'កន្លែងធ្វើការសម្របសម្រួល',
    labelEn: 'Coordinator Workspace',
    icon: 'AppstoreOutlined',
    children: [
      { path: '/coordinator/workspace', label: 'ផ្ទាំងការងារ', labelEn: 'Workspace' },
      { path: '/coordinator/imports', label: 'នាំចូលទិន្នន័យ', labelEn: 'Bulk Imports' },
      { path: '/coordinator/languages', label: 'គ្រប់គ្រងភាសា', labelEn: 'Language Management' },
      { path: '/coordinator/monitoring', label: 'តាមដានប្រព័ន្ធ', labelEn: 'System Monitoring' }
    ]
  },

  // School Management
  {
    label: 'សាលារៀន',
    labelEn: 'Schools',
    icon: 'BankOutlined',
    children: [
      { path: '/schools', label: 'បញ្ជីសាលា', labelEn: 'School List' },
      { path: '/schools/create', label: 'បន្ថែមសាលាថ្មី', labelEn: 'Add School' },
      { path: '/schools/assignments', label: 'ចាត់តាំងគ្រូ', labelEn: 'Teacher Assignments' },
      { path: '/schools/periods', label: 'កំណត់រយៈពេលវាយតម្លៃ', labelEn: 'Assessment Periods' }
    ]
  },

  // Administration
  {
    label: 'រដ្ឋបាល',
    labelEn: 'Administration',
    icon: 'SafetyOutlined',
    children: [
      { path: '/users', label: 'អ្នកប្រើប្រាស់', labelEn: 'Users', icon: 'UserOutlined' },
      { path: '/users/roles', label: 'តួនាទី', labelEn: 'Roles' },
      { path: '/users/permissions', label: 'សិទ្ធិ', labelEn: 'Permissions' },
      { divider: true },
      { path: '/classes', label: 'ថ្នាក់', labelEn: 'Classes', icon: 'BookOutlined' },
      { path: '/settings', label: 'ការកំណត់', labelEn: 'Settings', icon: 'SettingOutlined' },
      { path: '/resources', label: 'ធនធាន', labelEn: 'Resources', icon: 'FolderOutlined' },
      { path: '/audit-log', label: 'កំណត់ហេតុប្រព័ន្ធ', labelEn: 'Audit Log' },
      { divider: true },
      { path: '/administration', label: 'រដ្ឋបាលទាំងអស់', labelEn: 'All Admin' }
    ]
  },

  // Help Section
  {
    path: '/help',
    label: 'ជំនួយ',
    labelEn: 'Help',
    icon: 'QuestionCircleOutlined'
  }
]
```

### 2. Coordinator Role
```javascript
menuItems = [
  // Primary workspace
  {
    path: '/coordinator/workspace',
    label: 'កន្លែងធ្វើការ',
    labelEn: 'Workspace',
    icon: 'AppstoreOutlined'
  },

  // Bulk Operations
  {
    label: 'នាំចូលទិន្នន័យ',
    labelEn: 'Data Import',
    icon: 'ImportOutlined',
    children: [
      { path: '/coordinator/imports/users', label: 'នាំចូលអ្នកប្រើ', labelEn: 'Import Users' },
      { path: '/coordinator/imports/schools', label: 'នាំចូលសាលា', labelEn: 'Import Schools' },
      { path: '/coordinator/imports/students', label: 'នាំចូលសិស្ស', labelEn: 'Import Students' },
      { path: '/coordinator/imports/templates', label: 'ទម្រង់គំរូ', labelEn: 'Templates' },
      { path: '/coordinator/imports/history', label: 'ប្រវត្តិនាំចូល', labelEn: 'Import History' }
    ]
  },

  // Language Management
  {
    path: '/coordinator/languages',
    label: 'គ្រប់គ្រងភាសា',
    labelEn: 'Language Management',
    icon: 'TranslationOutlined'
  },

  // System Monitoring
  {
    path: '/coordinator/monitoring',
    label: 'តាមដានប្រព័ន្ធ',
    labelEn: 'System Monitoring',
    icon: 'MonitorOutlined'
  },

  // Basic Reports
  {
    label: 'របាយការណ៍',
    labelEn: 'Reports',
    icon: 'BarChartOutlined',
    children: [
      { path: '/reports/dashboard', label: 'ផ្ទាំងវិភាគ', labelEn: 'Analytics' },
      { path: '/reports/school-comparison', label: 'ប្រៀបធៀបសាលា', labelEn: 'School Comparison' }
    ]
  },

  // Help
  {
    path: '/help',
    label: 'ជំនួយ',
    labelEn: 'Help',
    icon: 'QuestionCircleOutlined'
  }
]
```

### 3. Mentor Role
```javascript
menuItems = [
  // Dashboards
  {
    path: '/dashboard',
    label: 'ផ្ទាំងគ្រប់គ្រង',
    labelEn: 'Dashboard',
    icon: 'DashboardOutlined'
  },
  {
    path: '/analytics-dashboard',
    label: 'វិភាគ ផ្ទាំងគ្រប់គ្រង',
    labelEn: 'Analytics Dashboard',
    icon: 'AreaChartOutlined'
  },

  // Assessments (with verification)
  {
    label: 'ការវាយតម្លៃ',
    labelEn: 'Assessments',
    icon: 'FileTextOutlined',
    children: [
      { path: '/assessments', label: 'បញ្ជីការវាយតម្លៃ', labelEn: 'Assessment List' },
      { path: '/assessments/create', label: 'ការវាយតម្លៃថ្មី', labelEn: 'New Assessment' },
      { path: '/assessments/manage', label: 'គ្រប់គ្រងការវាយតម្លៃ', labelEn: 'Manage Assessments' },
      { path: '/assessments/verify', label: 'ផ្ទៀងផ្ទាត់', labelEn: 'Verify' }
    ]
  },

  // Students
  {
    path: '/students',
    label: 'សិស្ស',
    labelEn: 'Students',
    icon: 'TeamOutlined'
  },

  // Mentoring (Primary Focus)
  {
    label: 'ការចុះអប់រំ និងត្រួតពិនិត្យ',
    labelEn: 'Mentoring Visits',
    icon: 'SolutionOutlined',
    children: [
      { path: '/mentoring-visits', label: 'បញ្ជីការចុះ', labelEn: 'My Visits' },
      { path: '/mentoring-visits/create', label: 'កំណត់ត្រាថ្មី', labelEn: 'Record Visit' },
      { path: '/mentoring-visits/schedule', label: 'កាលវិភាគ', labelEn: 'Schedule' },
      { path: '/mentoring-visits/statistics', label: 'ស្ថិតិ', labelEn: 'My Statistics' }
    ]
  },

  // Teacher Support
  {
    path: '/teacher/workspace',
    label: 'កន្លែងធ្វើការគ្រូ',
    labelEn: 'Teacher Workspace',
    icon: 'BookOutlined'
  },

  // Reports
  {
    label: 'របាយការណ៍',
    labelEn: 'Reports',
    icon: 'BarChartOutlined',
    children: [
      { path: '/reports/dashboard', label: 'ផ្ទាំងវិភាគ', labelEn: 'Analytics' },
      { path: '/reports/mentoring-impact', label: 'ផលប៉ះពាល់ការណែនាំ', labelEn: 'Mentoring Impact' },
      { path: '/reports/class-progress', label: 'វឌ្ឍនភាពថ្នាក់', labelEn: 'Class Progress' },
      { path: '/reports/student-performance', label: 'លទ្ធផលសិស្ស', labelEn: 'Student Performance' }
    ]
  },

  // Help
  {
    path: '/help',
    label: 'ជំនួយ',
    labelEn: 'Help',
    icon: 'QuestionCircleOutlined'
  }
]
```

### 4. Teacher Role
```javascript
menuItems = [
  // Dashboard
  {
    path: '/dashboard',
    label: 'ផ្ទាំងគ្រប់គ្រង',
    labelEn: 'Dashboard',
    icon: 'DashboardOutlined'
  },
  {
    path: '/teacher/dashboard',
    label: 'ផ្ទាំងការងាររបស់ខ្ញុំ',
    labelEn: 'My Workspace',
    icon: 'BookOutlined'
  },

  // Assessments (Limited)
  {
    label: 'ការវាយតម្លៃ',
    labelEn: 'Assessments',
    icon: 'FileTextOutlined',
    children: [
      { path: '/assessments', label: 'បញ្ជីការវាយតម្លៃ', labelEn: 'My Assessments' },
      { path: '/assessments/create', label: 'វាយតម្លៃថ្មី', labelEn: 'New Assessment' },
      { path: '/teacher/quick-assessment', label: 'វាយតម្លៃរហ័ស', labelEn: 'Quick Assessment' }
    ]
  },

  // Students (Primary Focus)
  {
    label: 'សិស្សរបស់ខ្ញុំ',
    labelEn: 'My Students',
    icon: 'TeamOutlined',
    children: [
      { path: '/students', label: 'បញ្ជីសិស្ស', labelEn: 'Student List' },
      { path: '/students/create', label: 'បន្ថែមសិស្ស', labelEn: 'Add Student' },
      { path: '/teacher/bulk-add', label: 'បន្ថែមច្រើន', labelEn: 'Bulk Add' },
      { path: '/students/progress', label: 'តាមដានវឌ្ឍនភាព', labelEn: 'Track Progress' }
    ]
  },

  // Class Management
  {
    path: '/teacher/class',
    label: 'ថ្នាក់របស់ខ្ញុំ',
    labelEn: 'My Class',
    icon: 'GroupOutlined'
  },

  // Reports (Limited)
  {
    label: 'របាយការណ៍',
    labelEn: 'Reports',
    icon: 'BarChartOutlined',
    children: [
      { path: '/reports/class-progress', label: 'វឌ្ឍនភាពថ្នាក់', labelEn: 'Class Progress' },
      { path: '/reports/student-performance', label: 'លទ្ធផលសិស្ស', labelEn: 'Student Performance' },
      { path: '/reports/attendance', label: 'វត្តមាន', labelEn: 'Attendance' }
    ]
  },

  // Help
  {
    path: '/help',
    label: 'ជំនួយ',
    labelEn: 'Help',
    icon: 'QuestionCircleOutlined'
  }
]
```

### 5. Viewer Role (Read-Only)
```javascript
menuItems = [
  // Dashboard
  {
    path: '/dashboard',
    label: 'ផ្ទាំងគ្រប់គ្រង',
    labelEn: 'Dashboard',
    icon: 'DashboardOutlined'
  },
  {
    path: '/analytics-dashboard',
    label: 'វិភាគ ផ្ទាំងគ្រប់គ្រង',
    labelEn: 'Analytics Dashboard',
    icon: 'AreaChartOutlined'
  },

  // View Assessments
  {
    label: 'ការវាយតម្លៃ',
    labelEn: 'Assessments',
    icon: 'FileTextOutlined',
    children: [
      { path: '/assessments', label: 'មើលការវាយតម្លៃ', labelEn: 'View Assessments' }
    ]
  },

  // Reports (Full Access to View)
  {
    label: 'របាយការណ៍',
    labelEn: 'Reports',
    icon: 'BarChartOutlined',
    children: [
      { path: '/reports/dashboard', label: 'ផ្ទាំងវិភាគ', labelEn: 'Analytics Dashboard' },
      { path: '/reports/student-performance', label: 'លទ្ធផលសិស្ស', labelEn: 'Student Performance' },
      { path: '/reports/school-comparison', label: 'ប្រៀបធៀបសាលា', labelEn: 'School Comparison' },
      { path: '/reports/progress-tracking', label: 'តាមដានវឌ្ឍនភាព', labelEn: 'Progress Tracking' },
      { path: '/reports/intervention', label: 'អន្តរាគមន៍', labelEn: 'Intervention' },
      { divider: true },
      { path: '/reports', label: 'របាយការណ៍ទាំងអស់', labelEn: 'All Reports' }
    ]
  },

  // Help
  {
    path: '/help',
    label: 'ជំនួយ',
    labelEn: 'Help',
    icon: 'QuestionCircleOutlined'
  }
]
```

## User Profile Menu (All Roles)
```javascript
userMenuItems = [
  // User Info Section
  { type: 'group', label: 'User Info Display' },
  
  // Profile Management
  { path: '/profile', label: 'ប្រវត្តិរូបរបស់ខ្ញុំ', labelEn: 'My Profile', icon: 'UserOutlined' },
  { path: '/profile-setup', label: 'កំណត់ប្រវត្តិរូប', labelEn: 'Profile Setup', icon: 'SettingOutlined' },
  { path: '/profile#password', label: 'ផ្លាស់ពាក្យសម្ងាត់', labelEn: 'Change Password', icon: 'LockOutlined' },
  
  { divider: true },
  
  // Help & Resources
  { path: '/onboarding', label: 'ណែនាំចាប់ផ្តើម', labelEn: 'Getting Started', icon: 'BookOutlined' },
  { path: '/help', label: 'ជំនួយ & ការណែនាំ', labelEn: 'Help & Tutorials', icon: 'QuestionCircleOutlined' },
  { path: '/about', label: 'អំពីគម្រោង', labelEn: 'About Project', icon: 'GlobalOutlined' },
  
  { divider: true },
  
  // Sign Out
  { action: 'signOut', label: 'ចាកចេញ', labelEn: 'Sign Out', icon: 'LogoutOutlined', danger: true }
]
```

## Mobile Navigation (Bottom Tab Bar)
```javascript
mobileNavigation = [
  { path: '/dashboard', icon: 'DashboardOutlined' },
  { path: '/assessments', icon: 'FileTextOutlined' },
  { path: '/students', icon: 'TeamOutlined' },
  { path: '/reports', icon: 'BarChartOutlined' },
  { path: '/profile', icon: 'UserOutlined' }
]
// Note: Visibility based on user role
```

## Implementation Notes

### Role-Based Visibility Rules
1. **Admin**: Full access to all menu items
2. **Coordinator**: Focus on data management and imports
3. **Mentor**: Focus on mentoring visits and teacher support
4. **Teacher**: Focus on classroom and student management
5. **Viewer**: Read-only access to reports and dashboards

### Key Features to Implement
1. Dynamic menu generation based on user role
2. Bilingual support (Khmer primary, English secondary)
3. Icon support for all menu items
4. Nested submenu support
5. Mobile-responsive design with drawer/bottom navigation
6. Permission-based visibility checks
7. Active state highlighting
8. Breadcrumb generation from menu structure

### Laravel Feature Parity Checklist
- [ ] All menu items from Laravel present
- [ ] Same hierarchical structure
- [ ] Same role-based access control
- [ ] Same icon assignments
- [ ] Same route mappings
- [ ] Bilingual labels matching Laravel
- [ ] Mobile menu adaptation
- [ ] User dropdown menu items

### Menu State Management
```typescript
interface MenuState {
  collapsed: boolean;
  openKeys: string[];
  selectedKeys: string[];
  isMobile: boolean;
  mobileMenuOpen: boolean;
}
```

### Permission Helpers
```typescript
const hasRole = (roles: string[]) => roles.includes(session?.user?.role || '');
const canAccess = (permission: string) => userPermissions.includes(permission);
const isFeatureEnabled = (feature: string) => systemFeatures[feature] === true;
```

## Testing Requirements
1. Test each role can only see appropriate menu items
2. Test navigation to all menu routes
3. Test mobile menu functionality
4. Test submenu expand/collapse
5. Test active state highlighting
6. Test permission-based visibility
7. Test bilingual label display