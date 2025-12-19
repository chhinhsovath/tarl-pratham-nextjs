/**
 * Rate Limiting System
 * Prevents abuse and brute force attacks
 *
 * @version 1.0
 * @date 2025-10-01
 */

import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { getClientIp } from './audit';

export interface RateLimitConfig {
  windowMs: number;      // Time window in milliseconds
  maxRequests: number;   // Maximum requests per window
  blockDurationMs?: number; // How long to block after exceeding limit
}

/**
 * Role-based rate limits
 * Higher privileges get higher limits
 */
export const ROLE_RATE_LIMITS: Record<string, RateLimitConfig> = {
  admin: {
    windowMs: 60 * 1000,      // 1 minute
    maxRequests: 300,          // 300 requests per minute
    blockDurationMs: 5 * 60 * 1000, // 5 minutes block
  },
  coordinator: {
    windowMs: 60 * 1000,      // 1 minute
    maxRequests: 200,          // 200 requests per minute
    blockDurationMs: 10 * 60 * 1000, // 10 minutes block
  },
  mentor: {
    windowMs: 60 * 1000,      // 1 minute
    maxRequests: 150,          // 150 requests per minute
    blockDurationMs: 15 * 60 * 1000, // 15 minutes block
  },
  teacher: {
    windowMs: 60 * 1000,      // 1 minute
    maxRequests: 120,          // 120 requests per minute
    blockDurationMs: 15 * 60 * 1000, // 15 minutes block
  },
  viewer: {
    windowMs: 60 * 1000,      // 1 minute
    maxRequests: 60,           // 60 requests per minute
    blockDurationMs: 30 * 60 * 1000, // 30 minutes block
  },
  anonymous: {
    windowMs: 60 * 1000,      // 1 minute
    maxRequests: 20,           // 20 requests per minute (very restrictive)
    blockDurationMs: 60 * 60 * 1000, // 1 hour block
  },
};

/**
 * Endpoint-specific rate limits (for sensitive endpoints)
 */
export const ENDPOINT_RATE_LIMITS: Record<string, RateLimitConfig> = {
  '/api/auth/callback/credentials': { // Login endpoint
    windowMs: 15 * 60 * 1000,   // 15 minutes
    maxRequests: 5,              // 5 login attempts
    blockDurationMs: 60 * 60 * 1000, // 1 hour block
  },
  '/api/users': {
    windowMs: 60 * 1000,
    maxRequests: 100,
    blockDurationMs: 10 * 60 * 1000,
  },
  '/api/students': {
    windowMs: 60 * 1000,
    maxRequests: 150,
    blockDurationMs: 10 * 60 * 1000,
  },
  '/api/assessments': {
    windowMs: 60 * 1000,
    maxRequests: 150,
    blockDurationMs: 10 * 60 * 1000,
  },
};

/**
 * Check if request is rate limited
 */
export async function checkRateLimit(
  request: NextRequest,
  userRole?: string,
  endpoint?: string
): Promise<{ allowed: boolean; retryAfter?: number; reason?: string }> {
  const ip = getClientIp(request) || 'unknown';
  const normalizedEndpoint = endpoint || new URL(request.url).pathname;

  // Get applicable rate limit config
  const config = getApplicableConfig(normalizedEndpoint, userRole);

  // Get identifier (prefer user ID if authenticated, fallback to IP)
  const identifier = userRole ? `user-${userRole}-${ip}` : `ip-${ip}`;

  // Calculate window start time
  const now = new Date();
  const windowStart = new Date(now.getTime() - config.windowMs);

  try {
    // Check if currently blocked
    const existing = await prisma.rate_limits.findFirst({
      where: {
        identifier,
        endpoint: normalizedEndpoint,
        blocked_until: {
          gt: now,
        },
      },
    });

    if (existing && existing.blocked_until) {
      const retryAfter = Math.ceil((existing.blocked_until.getTime() - now.getTime()) / 1000);
      return {
        allowed: false,
        retryAfter,
        reason: 'Rate limit exceeded. Too many requests.',
      };
    }

    // Clean up old records
    await prisma.rate_limits.deleteMany({
      where: {
        window_start: {
          lt: windowStart,
        },
        blocked_until: null,
      },
    });

    // Get or create rate limit record
    const record = await prisma.rate_limits.upsert({
      where: {
        identifier_endpoint_window_start: {
          identifier,
          endpoint: normalizedEndpoint,
          window_start: windowStart,
        },
      },
      update: {
        requests_count: {
          increment: 1,
        },
      },
      create: {
        identifier,
        endpoint: normalizedEndpoint,
        window_start: windowStart,
        requests_count: 1,
      },
    });

    // Check if exceeded limit
    if (record.requests_count > config.maxRequests) {
      // Block the identifier
      const blockedUntil = new Date(now.getTime() + (config.blockDurationMs || 60 * 60 * 1000));

      await prisma.rate_limits.update({
        where: { id: record.id },
        data: {
          blocked_until: blockedUntil,
        },
      });

      const retryAfter = Math.ceil((config.blockDurationMs || 60 * 60 * 1000) / 1000);

      return {
        allowed: false,
        retryAfter,
        reason: `Rate limit exceeded. Blocked for ${Math.ceil(retryAfter / 60)} minutes.`,
      };
    }

    // Request allowed
    return { allowed: true };
  } catch (error) {
    console.error('Rate limit check error:', error);
    // On error, allow the request (fail open for availability)
    return { allowed: true };
  }
}

/**
 * Get applicable rate limit config
 */
function getApplicableConfig(endpoint: string, userRole?: string): RateLimitConfig {
  // Check for endpoint-specific limit
  if (ENDPOINT_RATE_LIMITS[endpoint]) {
    return ENDPOINT_RATE_LIMITS[endpoint];
  }

  // Check for role-based limit
  if (userRole && ROLE_RATE_LIMITS[userRole]) {
    return ROLE_RATE_LIMITS[userRole];
  }

  // Default to anonymous limit
  return ROLE_RATE_LIMITS.anonymous;
}

/**
 * Middleware wrapper for rate limiting
 */
export async function withRateLimit(
  request: NextRequest,
  session: any,
  handler: () => Promise<NextResponse>
): Promise<NextResponse> {
  const endpoint = new URL(request.url).pathname;
  const userRole = session?.user?.role;

  const rateLimitCheck = await checkRateLimit(request, userRole, endpoint);

  if (!rateLimitCheck.allowed) {
    return NextResponse.json(
      {
        error: rateLimitCheck.reason || 'Too many requests',
        retryAfter: rateLimitCheck.retryAfter,
      },
      {
        status: 429,
        headers: {
          'Retry-After': rateLimitCheck.retryAfter?.toString() || '60',
          'X-RateLimit-Limit': getApplicableConfig(endpoint, userRole).maxRequests.toString(),
          'X-RateLimit-Remaining': '0',
        },
      }
    );
  }

  return handler();
}

/**
 * Get rate limit status for a user/IP
 */
export async function getRateLimitStatus(
  identifier: string,
  endpoint: string
): Promise<{
  requestsCount: number;
  maxRequests: number;
  remaining: number;
  windowStart: Date;
  blockedUntil: Date | null;
}> {
  const config = getApplicableConfig(endpoint);
  const windowStart = new Date(Date.now() - config.windowMs);

  const record = await prisma.rate_limits.findFirst({
    where: {
      identifier,
      endpoint,
      window_start: {
        gte: windowStart,
      },
    },
  });

  if (!record) {
    return {
      requestsCount: 0,
      maxRequests: config.maxRequests,
      remaining: config.maxRequests,
      windowStart,
      blockedUntil: null,
    };
  }

  return {
    requestsCount: record.requests_count,
    maxRequests: config.maxRequests,
    remaining: Math.max(0, config.maxRequests - record.requests_count),
    windowStart: record.window_start,
    blockedUntil: record.blocked_until,
  };
}

/**
 * Cleanup old rate limit records
 */
export async function cleanupRateLimits(): Promise<number> {
  const cutoffDate = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago

  const result = await prisma.rate_limits.deleteMany({
    where: {
      created_at: {
        lt: cutoffDate,
      },
    },
  });

  return result.count;
}
