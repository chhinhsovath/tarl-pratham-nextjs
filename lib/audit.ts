/**
 * Comprehensive Audit Logging System
 * Tracks all CRUD operations with full context
 *
 * @version 1.0
 * @date 2025-10-01
 */

import { prisma } from '@/lib/prisma';
import { NextRequest } from 'next/server';

export type AuditAction = 'create' | 'update' | 'delete' | 'view' | 'export' | 'import' | 'login' | 'logout';
export type AuditStatus = 'success' | 'failed' | 'denied';

export interface AuditLogData {
  userId?: number | null;
  userRole?: string | null;
  userEmail?: string | null;
  action: AuditAction;
  resourceType: string;
  resourceId?: number | null;
  resourceName?: string | null;
  oldValues?: any;
  newValues?: any;
  changedFields?: string[];
  ipAddress?: string | null;
  userAgent?: string | null;
  sessionId?: string | null;
  status: AuditStatus;
  errorMessage?: string | null;
  metadata?: any;
}

/**
 * Extract IP address from Next.js request
 */
export function getClientIp(request: NextRequest): string | null {
  // Check X-Forwarded-For header (for proxies)
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  // Check X-Real-IP header
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }

  // Fallback to connection remote address (might not work in all environments)
  return null;
}

/**
 * Extract user agent from request
 */
export function getUserAgent(request: NextRequest): string | null {
  return request.headers.get('user-agent');
}

/**
 * Create audit log entry
 */
export async function createAuditLog(data: AuditLogData): Promise<void> {
  try {
    await prisma.audit_logs.create({
      data: {
        user_id: data.userId || null,
        user_role: data.userRole || null,
        user_email: data.userEmail || null,
        action: data.action,
        resource_type: data.resourceType,
        resource_id: data.resourceId || null,
        resource_name: data.resourceName || null,
        old_values: data.oldValues ? JSON.parse(JSON.stringify(data.oldValues)) : null,
        new_values: data.newValues ? JSON.parse(JSON.stringify(data.newValues)) : null,
        changed_fields: data.changedFields ? JSON.parse(JSON.stringify(data.changedFields)) : null,
        ip_address: data.ipAddress || null,
        user_agent: data.userAgent || null,
        session_id: data.sessionId || null,
        status: data.status,
        error_message: data.errorMessage || null,
        metadata: data.metadata ? JSON.parse(JSON.stringify(data.metadata)) : null,
      },
    });
  } catch (error) {
    // Don't let audit logging failure break the main operation
    console.error('Failed to create audit log:', error);
  }
}

/**
 * Log successful create operation
 */
export async function logCreate(
  request: NextRequest,
  session: any,
  resourceType: string,
  resourceId: number,
  resourceName: string,
  newValues: any
): Promise<void> {
  await createAuditLog({
    userId: session?.user?.id ? parseInt(session.user.id) : null,
    userRole: session?.user?.role || null,
    userEmail: session?.user?.email || null,
    action: 'create',
    resourceType,
    resourceId,
    resourceName,
    newValues,
    ipAddress: getClientIp(request),
    userAgent: getUserAgent(request),
    status: 'success',
  });
}

/**
 * Log successful update operation
 */
export async function logUpdate(
  request: NextRequest,
  session: any,
  resourceType: string,
  resourceId: number,
  resourceName: string,
  oldValues: any,
  newValues: any,
  changedFields: string[]
): Promise<void> {
  await createAuditLog({
    userId: session?.user?.id ? parseInt(session.user.id) : null,
    userRole: session?.user?.role || null,
    userEmail: session?.user?.email || null,
    action: 'update',
    resourceType,
    resourceId,
    resourceName,
    oldValues,
    newValues,
    changedFields,
    ipAddress: getClientIp(request),
    userAgent: getUserAgent(request),
    status: 'success',
  });
}

/**
 * Log successful delete operation
 */
export async function logDelete(
  request: NextRequest,
  session: any,
  resourceType: string,
  resourceId: number,
  resourceName: string,
  oldValues: any
): Promise<void> {
  await createAuditLog({
    userId: session?.user?.id ? parseInt(session.user.id) : null,
    userRole: session?.user?.role || null,
    userEmail: session?.user?.email || null,
    action: 'delete',
    resourceType,
    resourceId,
    resourceName,
    oldValues,
    ipAddress: getClientIp(request),
    userAgent: getUserAgent(request),
    status: 'success',
  });
}

/**
 * Log denied access attempt
 */
export async function logAccessDenied(
  request: NextRequest,
  session: any,
  resourceType: string,
  action: AuditAction,
  reason: string
): Promise<void> {
  await createAuditLog({
    userId: session?.user?.id ? parseInt(session.user.id) : null,
    userRole: session?.user?.role || null,
    userEmail: session?.user?.email || null,
    action,
    resourceType,
    status: 'denied',
    errorMessage: reason,
    ipAddress: getClientIp(request),
    userAgent: getUserAgent(request),
  });
}

/**
 * Log failed operation
 */
export async function logFailure(
  request: NextRequest,
  session: any,
  resourceType: string,
  action: AuditAction,
  errorMessage: string
): Promise<void> {
  await createAuditLog({
    userId: session?.user?.id ? parseInt(session.user.id) : null,
    userRole: session?.user?.role || null,
    userEmail: session?.user?.email || null,
    action,
    resourceType,
    status: 'failed',
    errorMessage,
    ipAddress: getClientIp(request),
    userAgent: getUserAgent(request),
  });
}

/**
 * Get changed fields between old and new values
 */
export function getChangedFields(oldValues: any, newValues: any): string[] {
  const changed: string[] = [];

  for (const key in newValues) {
    if (newValues[key] !== oldValues[key]) {
      changed.push(key);
    }
  }

  return changed;
}

/**
 * Query audit logs with filters
 */
export async function getAuditLogs(filters: {
  userId?: number;
  resourceType?: string;
  action?: string;
  status?: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}) {
  const where: any = {};

  if (filters.userId) where.user_id = filters.userId;
  if (filters.resourceType) where.resource_type = filters.resourceType;
  if (filters.action) where.action = filters.action;
  if (filters.status) where.status = filters.status;

  if (filters.startDate || filters.endDate) {
    where.created_at = {};
    if (filters.startDate) where.created_at.gte = filters.startDate;
    if (filters.endDate) where.created_at.lte = filters.endDate;
  }

  const [logs, total] = await Promise.all([
    prisma.audit_logs.findMany({
      where,
      orderBy: { created_at: 'desc' },
      take: filters.limit || 50,
      skip: filters.offset || 0,
    }),
    prisma.audit_logs.count({ where }),
  ]);

  return { logs, total };
}

/**
 * Get audit statistics
 */
export async function getAuditStats(startDate: Date, endDate: Date) {
  const stats = await prisma.audit_logs.groupBy({
    by: ['action', 'resource_type', 'status'],
    where: {
      created_at: {
        gte: startDate,
        lte: endDate,
      },
    },
    _count: {
      id: true,
    },
  });

  return stats;
}

/**
 * Delete old audit logs (for maintenance)
 */
export async function cleanupOldAuditLogs(daysToKeep: number = 90): Promise<number> {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

  const result = await prisma.audit_logs.deleteMany({
    where: {
      created_at: {
        lt: cutoffDate,
      },
    },
  });

  return result.count;
}
