import { User } from '@/types/user';

export type UserRole = 'admin' | 'coordinator' | 'mentor' | 'teacher' | 'viewer';

export interface Permission {
  role: UserRole;
  permissions: string[];
}

// Define permissions for each role
export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  admin: [
    'users.view', 'users.create', 'users.edit', 'users.delete', 'users.bulk_import',
    'schools.view', 'schools.create', 'schools.edit', 'schools.delete', 'schools.bulk_import',
    'students.view', 'students.create', 'students.edit', 'students.delete', 'students.bulk_import',
    'assessments.view', 'assessments.create', 'assessments.edit', 'assessments.delete',
    'mentoring.view', 'mentoring.create', 'mentoring.edit', 'mentoring.delete',
    'reports.view', 'reports.export',
    'classes.view', 'classes.create', 'classes.edit', 'classes.delete',
    'settings.view', 'settings.edit',
    'resources.view', 'resources.create', 'resources.edit', 'resources.delete',
    'verification.view', 'verification.approve',
    'coordinator.workspace', 'analytics.dashboard'
  ],
  coordinator: [
    'users.view', 'users.bulk_import',
    'schools.view', 'schools.bulk_import',
    'students.view', 'students.bulk_import',
    'reports.view', 'reports.export',
    'coordinator.workspace',
    'language.manage'
  ],
  mentor: [
    'students.view', 'students.create', 'students.edit', 'students.delete', // temporary only
    'assessments.view', 'assessments.create', 'assessments.edit', 'assessments.delete', // temporary only
    'mentoring.view', 'mentoring.create', 'mentoring.edit', 'mentoring.delete',
    'verification.view', 'verification.approve',
    'reports.view', 'reports.my_mentoring',
    'teacher.workspace', // can access teacher features
    'analytics.dashboard',
    'mentor.test_mode', // can use test environment
    'mentor.reset_data' // can reset test data
  ],
  teacher: [
    'students.view', 'students.create', 'students.edit', // own class only
    'assessments.view', 'assessments.create', 'assessments.edit', // own students only
    'reports.view', 'reports.my_students', 'reports.class_progress',
    'teacher.profile_setup',
    'analytics.dashboard'
  ],
  viewer: [
    'students.view',
    'assessments.view',
    'reports.view',
    'analytics.dashboard'
  ]
};

// Check if user has specific permission
export function hasPermission(user: User | null, permission: string): boolean {
  if (!user || !user.role) return false;
  
  const rolePermissions = ROLE_PERMISSIONS[user.role as UserRole];
  return rolePermissions?.includes(permission) || false;
}

// Check if user has any of the specified permissions
export function hasAnyPermission(user: User | null, permissions: string[]): boolean {
  return permissions.some(permission => hasPermission(user, permission));
}

// Check if user has all specified permissions
export function hasAllPermissions(user: User | null, permissions: string[]): boolean {
  return permissions.every(permission => hasPermission(user, permission));
}

// Get all permissions for a role
export function getRolePermissions(role: UserRole): string[] {
  return ROLE_PERMISSIONS[role] || [];
}

// Check if user can access specific resource
export function canAccessResource(user: User | null, resource: string, action: string = 'view'): boolean {
  return hasPermission(user, `${resource}.${action}`);
}

// Role hierarchy check
export function isAdminOrHigher(user: User | null): boolean {
  return user?.role === 'admin';
}

export function isCoordinatorOrHigher(user: User | null): boolean {
  return user?.role === 'admin' || user?.role === 'coordinator';
}

export function isMentorOrHigher(user: User | null): boolean {
  return user?.role === 'admin' || user?.role === 'coordinator' || user?.role === 'mentor';
}

export function isTeacherOrHigher(user: User | null): boolean {
  return user?.role === 'admin' || user?.role === 'coordinator' || user?.role === 'mentor' || user?.role === 'teacher';
}

// Check if user can manage other users
export function canManageUsers(user: User | null): boolean {
  return hasPermission(user, 'users.create') || hasPermission(user, 'users.edit');
}

// Check if user can bulk import data
export function canBulkImport(user: User | null): boolean {
  return hasAnyPermission(user, ['users.bulk_import', 'schools.bulk_import', 'students.bulk_import']);
}

// Check if data is temporary (created by mentor)
export function isTemporaryData(createdBy: User | null, isTemporary: boolean = false): boolean {
  return isTemporary || (createdBy?.role === 'mentor');
}

// Get accessible schools for user
export function getAccessibleSchools(user: User | null): number[] {
  if (!user) return [];
  
  if (user.role === 'admin' || user.role === 'coordinator') {
    return []; // Can access all schools
  }
  
  if (user.role === 'mentor' || user.role === 'teacher') {
    return user.pilot_school_id ? [user.pilot_school_id] : [];
  }
  
  return [];
}

// Navigation menu permissions
export function canViewDashboard(user: User | null): boolean {
  return !!user; // All authenticated users can view dashboard
}

export function canViewAnalytics(user: User | null): boolean {
  return hasPermission(user, 'analytics.dashboard');
}

export function canViewAdministration(user: User | null): boolean {
  return hasAnyPermission(user, ['users.view', 'schools.view', 'classes.view', 'settings.view']);
}

export function canViewCoordinatorWorkspace(user: User | null): boolean {
  return hasPermission(user, 'coordinator.workspace');
}

export function canViewTeacherWorkspace(user: User | null): boolean {
  return hasPermission(user, 'teacher.workspace') || user?.role === 'teacher';
}

// Menu items configuration
export function getMenuItems(user: User | null) {
  if (!user) return [];

  const items = [];

  // Dashboard (all users)
  items.push({
    key: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'DashboardOutlined'
  });

  // Analytics Dashboard
  if (canViewAnalytics(user)) {
    items.push({
      key: 'analytics',
      label: 'Analytics Dashboard',
      path: '/analytics-dashboard',
      icon: 'BarChartOutlined'
    });
  }

  // Assessments
  if (hasPermission(user, 'assessments.view')) {
    items.push({
      key: 'assessments',
      label: 'Assessments',
      path: '/assessments',
      icon: 'FileTextOutlined'
    });
  }

  // Verification
  if (hasPermission(user, 'verification.view')) {
    items.push({
      key: 'verification',
      label: 'Verification',
      path: '/verification',
      icon: 'CheckCircleOutlined'
    });
  }

  // Students
  if (hasPermission(user, 'students.view')) {
    items.push({
      key: 'students',
      label: 'Students',
      path: '/students',
      icon: 'UserOutlined'
    });
  }

  // Mentoring
  if (hasPermission(user, 'mentoring.view')) {
    items.push({
      key: 'mentoring',
      label: 'Mentoring',
      path: '/mentoring',
      icon: 'TeamOutlined'
    });
  }

  // Reports
  if (hasPermission(user, 'reports.view')) {
    items.push({
      key: 'reports',
      label: 'Reports',
      path: '/reports',
      icon: 'BarChartOutlined',
      children: [
        { key: 'reports-dashboard', label: 'Reports Dashboard', path: '/reports/dashboard' },
        { key: 'student-performance', label: 'Student Performance', path: '/reports/student-performance' },
        { key: 'school-comparison', label: 'School Comparison', path: '/reports/school-comparison' },
        { key: 'mentoring-impact', label: 'Mentoring Impact', path: '/reports/mentoring-impact' },
        { key: 'progress-tracking', label: 'Progress Tracking', path: '/reports/progress-tracking' }
      ]
    });
  }

  // Coordinator Workspace
  if (canViewCoordinatorWorkspace(user)) {
    items.push({
      key: 'coordinator',
      label: 'Coordinator Workspace',
      path: '/coordinator/workspace',
      icon: 'ControlOutlined'
    });
  }

  // Teacher Workspace
  if (canViewTeacherWorkspace(user)) {
    items.push({
      key: 'teacher',
      label: 'Teacher Workspace',
      path: '/teacher/dashboard',
      icon: 'BookOutlined'
    });
  }

  // Administration
  if (canViewAdministration(user)) {
    const adminChildren = [];
    
    if (hasPermission(user, 'users.view')) {
      adminChildren.push({ key: 'users', label: 'Users Management', path: '/users' });
    }
    
    if (hasPermission(user, 'schools.view')) {
      adminChildren.push({ key: 'schools', label: 'Schools Management', path: '/schools' });
    }
    
    if (hasPermission(user, 'classes.view')) {
      adminChildren.push({ key: 'classes', label: 'Classes Management', path: '/classes' });
    }
    
    if (hasPermission(user, 'settings.view')) {
      adminChildren.push({ key: 'settings', label: 'Settings', path: '/settings' });
    }
    
    if (hasPermission(user, 'resources.view')) {
      adminChildren.push({ key: 'resources', label: 'Resources', path: '/resources' });
    }

    if (adminChildren.length > 0) {
      items.push({
        key: 'administration',
        label: 'Administration',
        icon: 'SettingOutlined',
        children: adminChildren
      });
    }
  }

  // Help (all users)
  items.push({
    key: 'help',
    label: 'Help',
    path: '/help',
    icon: 'QuestionCircleOutlined'
  });

  return items;
}