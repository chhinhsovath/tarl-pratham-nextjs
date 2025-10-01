/**
 * IP Whitelisting System for Enhanced Admin Security
 *
 * @version 1.0
 * @date 2025-10-01
 */

import { prisma } from '@/lib/prisma';
import { NextRequest } from 'next/server';
import { getClientIp } from './audit';

/**
 * Check if IP is whitelisted for the given role
 */
export async function isIpWhitelisted(
  request: NextRequest,
  userRole: string
): Promise<{ allowed: boolean; reason?: string }> {
  // IP whitelisting only applies to admin and coordinator roles
  if (userRole !== 'admin' && userRole !== 'coordinator') {
    return { allowed: true }; // No IP restriction for other roles
  }

  // In development mode, allow all IPs
  if (process.env.NODE_ENV === 'development') {
    return { allowed: true };
  }

  // Check if IP whitelisting is enabled
  const ipWhitelistEnabled = process.env.IP_WHITELIST_ENABLED === 'true';
  if (!ipWhitelistEnabled) {
    return { allowed: true }; // IP whitelisting disabled
  }

  const clientIp = getClientIp(request);
  if (!clientIp) {
    return {
      allowed: false,
      reason: 'Could not determine client IP address',
    };
  }

  try {
    // Check if IP is in whitelist
    const whitelist = await prisma.ipWhitelist.findFirst({
      where: {
        ip_address: clientIp,
        is_active: true,
      },
    });

    if (!whitelist) {
      return {
        allowed: false,
        reason: `IP address ${clientIp} is not whitelisted for ${userRole} access`,
      };
    }

    // Check if this IP is allowed for this specific role
    const allowedRoles = whitelist.allowed_roles as string[] | null;
    if (allowedRoles && !allowedRoles.includes(userRole)) {
      return {
        allowed: false,
        reason: `IP address ${clientIp} is not authorized for ${userRole} role`,
      };
    }

    return { allowed: true };
  } catch (error) {
    console.error('IP whitelist check error:', error);
    // On error, deny access for security
    return {
      allowed: false,
      reason: 'IP whitelist verification failed',
    };
  }
}

/**
 * Add IP to whitelist
 */
export async function addToWhitelist(
  ipAddress: string,
  description: string,
  allowedRoles: string[],
  addedBy: number
): Promise<void> {
  await prisma.ipWhitelist.create({
    data: {
      ip_address: ipAddress,
      description,
      allowed_roles: allowedRoles,
      is_active: true,
      added_by: addedBy,
    },
  });
}

/**
 * Remove IP from whitelist
 */
export async function removeFromWhitelist(ipAddress: string): Promise<void> {
  await prisma.ipWhitelist.update({
    where: { ip_address: ipAddress },
    data: { is_active: false },
  });
}

/**
 * Get all whitelisted IPs
 */
export async function getWhitelistedIps() {
  return prisma.ipWhitelist.findMany({
    where: { is_active: true },
    orderBy: { created_at: 'desc' },
  });
}

/**
 * Check if IP has been flagged for suspicious activity
 */
export async function checkSuspiciousActivity(
  ipAddress: string,
  lookbackHours: number = 24
): Promise<{ suspicious: boolean; reason?: string; deniedAttempts?: number }> {
  const since = new Date(Date.now() - lookbackHours * 60 * 60 * 1000);

  // Check audit logs for denied access attempts
  const deniedAttempts = await prisma.auditLog.count({
    where: {
      ip_address: ipAddress,
      status: 'denied',
      created_at: {
        gte: since,
      },
    },
  });

  // Flag as suspicious if more than 10 denied attempts in the lookback period
  if (deniedAttempts > 10) {
    return {
      suspicious: true,
      reason: `${deniedAttempts} denied access attempts in the last ${lookbackHours} hours`,
      deniedAttempts,
    };
  }

  return { suspicious: false, deniedAttempts };
}
