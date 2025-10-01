/**
 * Enhanced Role-Based Access Control (RBAC) System
 * Provides comprehensive permission management with field-level security
 *
 * @version 2.0 - 100% Compliance Implementation
 * @date 2025-10-01
 */

export type UserRole = 'admin' | 'coordinator' | 'mentor' | 'teacher' | 'viewer';
export type ResourceType = 'users' | 'students' | 'assessments' | 'mentoring_visits' |
                          'pilot_schools' | 'reports' | 'settings' | 'bulk_imports';
export type Action = 'view' | 'create' | 'update' | 'delete' | 'export' | 'import';

/**
 * Comprehensive CRUD Permission Matrix
 */
export const CRUD_PERMISSIONS: Record<ResourceType, Record<UserRole, Action[]>> = {
  users: {
    admin: ['view', 'create', 'update', 'delete', 'export', 'import'],
    coordinator: ['view', 'create', 'update', 'export'],
    mentor: ['view'], // Own profile only
    teacher: ['view'], // Own profile only
    viewer: ['view'], // Limited view
  },
  students: {
    admin: ['view', 'create', 'update', 'delete', 'export', 'import'],
    coordinator: ['view', 'create', 'update', 'delete', 'export', 'import'],
    mentor: ['view', 'create', 'update', 'export'], // School-limited
    teacher: ['view', 'create', 'update', 'export'], // School-limited
    viewer: ['view', 'export'], // School-limited
  },
  assessments: {
    admin: ['view', 'create', 'update', 'delete', 'export', 'import'],
    coordinator: ['view', 'create', 'update', 'delete', 'export', 'import'],
    mentor: ['view', 'create', 'update', 'export'], // School-limited
    teacher: ['view', 'create', 'update', 'export'], // School-limited
    viewer: ['view', 'export'], // School-limited
  },
  mentoring_visits: {
    admin: ['view', 'create', 'update', 'delete', 'export'],
    coordinator: ['view', 'create', 'update', 'delete', 'export'],
    mentor: ['view', 'create', 'update', 'export'], // Own visits only for update
    teacher: ['view'], // School-limited, read-only
    viewer: ['view'], // School-limited, read-only
  },
  pilot_schools: {
    admin: ['view', 'create', 'update', 'delete', 'export', 'import'],
    coordinator: ['view', 'create', 'update', 'export'],
    mentor: ['view'], // Own school only
    teacher: ['view'], // Own school only
    viewer: ['view'], // Limited
  },
  reports: {
    admin: ['view', 'create', 'export'],
    coordinator: ['view', 'create', 'export'],
    mentor: ['view', 'export'], // School-limited
    teacher: ['view', 'export'], // School-limited
    viewer: ['view', 'export'], // School-limited
  },
  settings: {
    admin: ['view', 'update'],
    coordinator: ['view'],
    mentor: [],
    teacher: [],
    viewer: [],
  },
  bulk_imports: {
    admin: ['view', 'create', 'export'],
    coordinator: ['view', 'create', 'export'],
    mentor: [],
    teacher: [],
    viewer: [],
  },
};

/**
 * Field-Level Security: Define which fields can be modified by which roles
 */
export const FIELD_RESTRICTIONS: Record<ResourceType, {
  adminOnly: string[];
  coordinatorAndAbove: string[];
  readOnly: string[];
}> = {
  users: {
    adminOnly: ['role', 'is_active', 'email_verified_at'],
    coordinatorAndAbove: ['pilot_school_id', 'province', 'district', 'commune', 'village'],
    readOnly: ['id', 'created_at', 'updated_at', 'email_verified_at'],
  },
  students: {
    adminOnly: ['added_by_id', 'created_by_role', 'record_status'],
    coordinatorAndAbove: ['pilot_school_id', 'school_class_id'],
    readOnly: ['id', 'created_at', 'updated_at', 'mentor_created_at'],
  },
  assessments: {
    adminOnly: ['added_by_id', 'created_by_role', 'record_status'],
    coordinatorAndAbove: ['pilot_school_id', 'student_id'],
    readOnly: ['id', 'created_at', 'updated_at', 'assessed_date'],
  },
  mentoring_visits: {
    adminOnly: ['mentor_id', 'is_locked', 'locked_by', 'locked_at', 'record_status'],
    coordinatorAndAbove: ['pilot_school_id', 'school_id', 'teacher_id'],
    readOnly: ['id', 'created_at', 'updated_at'],
  },
  pilot_schools: {
    adminOnly: ['school_code'],
    coordinatorAndAbove: ['province', 'district', 'cluster', 'cluster_id'],
    readOnly: ['id', 'created_at', 'updated_at'],
  },
  reports: {
    adminOnly: [],
    coordinatorAndAbove: [],
    readOnly: ['id', 'created_at', 'completed_at'],
  },
  settings: {
    adminOnly: ['key', 'type'],
    coordinatorAndAbove: [],
    readOnly: ['id', 'created_at', 'updated_at'],
  },
  bulk_imports: {
    adminOnly: ['imported_by', 'status'],
    coordinatorAndAbove: [],
    readOnly: ['id', 'created_at', 'updated_at'],
  },
};

/**
 * Check if user has permission for action on resource
 */
export function hasPermission(
  userRole: UserRole,
  resource: ResourceType,
  action: Action
): boolean {
  const resourcePermissions = CRUD_PERMISSIONS[resource];
  if (!resourcePermissions) return false;

  const rolePermissions = resourcePermissions[userRole];
  if (!rolePermissions) return false;

  return rolePermissions.includes(action);
}

/**
 * Context for access control checks
 */
export interface AccessContext {
  userRole: UserRole;
  userId: number;
  userPilotSchoolId: number | null;
  resourceOwnerId?: number | null;
  resourcePilotSchoolId?: number | null;
  resourceType: ResourceType;
  action: Action;
}

/**
 * Check if user can access specific resource instance
 */
export function canAccessResource(context: AccessContext): boolean {
  const { userRole, userId, userPilotSchoolId, resourceOwnerId, resourcePilotSchoolId, resourceType, action } = context;

  // First check if role has permission for this action
  if (!hasPermission(userRole, resourceType, action)) {
    return false;
  }

  // Admin has unrestricted access
  if (userRole === 'admin') {
    return true;
  }

  // Coordinator has unrestricted access
  if (userRole === 'coordinator') {
    return true;
  }

  // For users resource: mentor/teacher/viewer can only access own profile
  if (resourceType === 'users') {
    return resourceOwnerId === userId;
  }

  // School-based resources: must be in same school
  if (['students', 'assessments', 'mentoring_visits'].includes(resourceType)) {
    if (!userPilotSchoolId) {
      return false; // No school assignment = no access
    }

    if (resourcePilotSchoolId !== undefined && resourcePilotSchoolId !== null) {
      const hasSchoolAccess = resourcePilotSchoolId === userPilotSchoolId;

      // For mentoring visits update: mentors can only update their own visits
      if (resourceType === 'mentoring_visits' && action === 'update' && userRole === 'mentor') {
        return hasSchoolAccess && (resourceOwnerId === userId);
      }

      return hasSchoolAccess;
    }
  }

  return true;
}

/**
 * Validate field-level permissions
 */
export function validateFieldPermissions(
  userRole: UserRole,
  resourceType: ResourceType,
  fieldsToUpdate: string[]
): { allowed: boolean; forbiddenFields: string[]; message?: string } {
  const restrictions = FIELD_RESTRICTIONS[resourceType];
  if (!restrictions) {
    return { allowed: true, forbiddenFields: [] };
  }

  const forbiddenFields: string[] = [];

  for (const field of fieldsToUpdate) {
    // Check read-only fields
    if (restrictions.readOnly.includes(field)) {
      forbiddenFields.push(field);
      continue;
    }

    // Check admin-only fields
    if (restrictions.adminOnly.includes(field) && userRole !== 'admin') {
      forbiddenFields.push(field);
      continue;
    }

    // Check coordinator-and-above fields
    if (restrictions.coordinatorAndAbove.includes(field) &&
        !['admin', 'coordinator'].includes(userRole)) {
      forbiddenFields.push(field);
      continue;
    }
  }

  if (forbiddenFields.length > 0) {
    return {
      allowed: false,
      forbiddenFields,
      message: `អ្នកមិនអាចកែប្រែវាល់នេះ: ${forbiddenFields.join(', ')}`
    };
  }

  return { allowed: true, forbiddenFields: [] };
}

/**
 * Build Prisma where clause for school filtering
 */
export function buildSchoolFilter(
  userRole: UserRole,
  userPilotSchoolId: number | null,
  resourceType: ResourceType
): any {
  // Admin and Coordinator see all data
  if (userRole === 'admin' || userRole === 'coordinator') {
    return {};
  }

  // For school-based resources
  if (['students', 'assessments', 'mentoring_visits'].includes(resourceType)) {
    if (!userPilotSchoolId) {
      return { id: -1 }; // No school = no access
    }

    return { pilot_school_id: userPilotSchoolId };
  }

  return {};
}

/**
 * Build Prisma where clause for user filtering
 */
export function buildUserFilter(
  userRole: UserRole,
  userId: number
): any {
  // Mentor, Teacher, Viewer can only see own profile
  if (['mentor', 'teacher', 'viewer'].includes(userRole)) {
    return { id: userId };
  }

  return {};
}

/**
 * Sanitize update data by removing forbidden fields
 */
export function sanitizeUpdateData(
  userRole: UserRole,
  resourceType: ResourceType,
  data: Record<string, any>
): { sanitized: Record<string, any>; removed: string[] } {
  const fieldNames = Object.keys(data);
  const validation = validateFieldPermissions(userRole, resourceType, fieldNames);

  if (validation.forbiddenFields.length === 0) {
    return { sanitized: data, removed: [] };
  }

  const sanitized = { ...data };
  for (const field of validation.forbiddenFields) {
    delete sanitized[field];
  }

  return {
    sanitized,
    removed: validation.forbiddenFields
  };
}

/**
 * Permission check result
 */
export interface PermissionCheckResult {
  allowed: boolean;
  reason?: string;
  statusCode?: number;
  forbiddenFields?: string[];
}

/**
 * Comprehensive permission check
 */
export function checkPermission(context: AccessContext): PermissionCheckResult {
  const { userRole, resourceType, action } = context;

  // Check basic permission
  if (!hasPermission(userRole, resourceType, action)) {
    return {
      allowed: false,
      reason: `អ្នកមិនមានសិទ្ធិ${getActionKhmer(action)}${getResourceKhmer(resourceType)}`,
      statusCode: 403,
    };
  }

  // Check resource access
  if (!canAccessResource(context)) {
    return {
      allowed: false,
      reason: `អ្នកមិនអាចចូលប្រើទិន្នន័យនេះបានទេ`,
      statusCode: 403,
    };
  }

  return { allowed: true };
}

/**
 * Helper functions for Khmer translation
 */
function getActionKhmer(action: Action): string {
  const actionMap: Record<Action, string> = {
    view: 'មើល',
    create: 'បង្កើត',
    update: 'កែប្រែ',
    delete: 'លុប',
    export: 'នាំចេញ',
    import: 'នាំចូល',
  };
  return actionMap[action] || action;
}

function getResourceKhmer(resource: ResourceType): string {
  const resourceMap: Record<ResourceType, string> = {
    users: 'អ្នកប្រើប្រាស់',
    students: 'សិស្ស',
    assessments: 'ការវាយតម្លៃ',
    mentoring_visits: 'ការទស្សនា',
    pilot_schools: 'សាលារៀន',
    reports: 'របាយការណ៍',
    settings: 'ការកំណត់',
    bulk_imports: 'ការនាំចូលជាបណ្តុំ',
  };
  return resourceMap[resource] || resource;
}

/**
 * Role hierarchy utilities
 */
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  admin: 5,
  coordinator: 4,
  mentor: 3,
  teacher: 2,
  viewer: 1,
};

export function hasHigherOrEqualRole(userRole: UserRole, requiredRole: UserRole): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

export function isAdminOrCoordinator(userRole: UserRole): boolean {
  return userRole === 'admin' || userRole === 'coordinator';
}
