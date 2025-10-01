/**
 * Enhanced Users API with 100% Security Compliance
 * Demonstrates all security features:
 * - Centralized RBAC
 * - Field-level permissions
 * - Comprehensive audit logging
 * - Rate limiting
 * - IP whitelisting
 * - Input validation
 *
 * @version 2.0 - 100% Compliance
 * @date 2025-10-01
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// Import centralized security modules
import {
  hasPermission,
  canAccessResource,
  validateFieldPermissions,
  buildUserFilter,
  sanitizeUpdateData,
  checkPermission,
  type UserRole,
} from "@/lib/rbac";

import {
  logCreate,
  logUpdate,
  logDelete,
  logAccessDenied,
  logFailure,
  getChangedFields,
} from "@/lib/audit";

import { withRateLimit } from "@/lib/rate-limit";
import { isIpWhitelisted } from "@/lib/ip-whitelist";

import {
  userCreateSchema,
  userUpdateSchema,
  paginationSchema,
  filterSchema,
  validateBody,
  formatValidationErrors,
} from "@/lib/validation";

/**
 * GET /api/users/secured - List users with full security checks
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Authentication check
    if (!session?.user?.id) {
      await logAccessDenied(request, session, 'users', 'view', 'Not authenticated');
      return NextResponse.json(
        { error: "សូមចូលប្រើប្រាស់ប្រព័ន្ធជាមុនសិន" },
        { status: 401 }
      );
    }

    // Apply rate limiting
    return withRateLimit(request, session, async () => {
      const userRole = session.user.role as UserRole;
      const userId = parseInt(session.user.id);

      // Permission check using centralized RBAC
      const permissionCheck = checkPermission({
        userRole,
        userId,
        userPilotSchoolId: session.user.pilot_school_id,
        resourceType: 'users',
        action: 'view',
      });

      if (!permissionCheck.allowed) {
        await logAccessDenied(request, session, 'users', 'view', permissionCheck.reason || 'Permission denied');
        return NextResponse.json(
          { error: permissionCheck.reason },
          { status: permissionCheck.statusCode || 403 }
        );
      }

      // IP whitelist check for admin/coordinator
      const ipCheck = await isIpWhitelisted(request, userRole);
      if (!ipCheck.allowed) {
        await logAccessDenied(request, session, 'users', 'view', ipCheck.reason || 'IP not whitelisted');
        return NextResponse.json(
          { error: ipCheck.reason },
          { status: 403 }
        );
      }

      // Parse and validate query parameters
      const { searchParams } = new URL(request.url);
      const paginationResult = await validateBody(paginationSchema, {
        page: searchParams.get("page") || "1",
        limit: searchParams.get("limit") || "10",
        search: searchParams.get("search") || "",
        sortBy: searchParams.get("sortBy") || "created_at",
        sortOrder: searchParams.get("sortOrder") || "desc",
      });

      if (!paginationResult.success) {
        return NextResponse.json(
          {
            error: "Invalid pagination parameters",
            details: formatValidationErrors(paginationResult.errors!),
          },
          { status: 400 }
        );
      }

      const { page, limit, search, sortBy, sortOrder } = paginationResult.data!;
      const skip = (page - 1) * limit;

      // Build where clause with security filters
      const where: any = buildUserFilter(userRole, userId);

      // Add search filter
      if (search) {
        where.AND = where.AND || [];
        where.AND.push({
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } }
          ]
        });
      }

      // Query database
      const [users, total] = await Promise.all([
        prisma.user.findMany({
          where,
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            province: true,
            subject: true,
            phone: true,
            pilot_school_id: true,
            onboarding_completed: true,
            is_active: true,
            created_at: true,
            updated_at: true,
            pilot_school: {
              select: {
                id: true,
                school_name: true,
                school_code: true
              }
            }
          },
          skip,
          take: limit,
          orderBy: { [sortBy as string]: sortOrder },
        }),
        prisma.user.count({ where })
      ]);

      return NextResponse.json({
        success: true,
        data: users,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      });
    });

  } catch (error: any) {
    const session = await getServerSession(authOptions);
    await logFailure(request, session, 'users', 'view', error.message);
    console.error("Error fetching users:", error);

    return NextResponse.json(
      {
        success: false,
        error: "មានបញ្ហាក្នុងការទាញយកទិន្នន័យអ្នកប្រើប្រាស់",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/users/secured - Create new user with full security checks
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      await logAccessDenied(request, session, 'users', 'create', 'Not authenticated');
      return NextResponse.json(
        { error: "សូមចូលប្រើប្រាស់ប្រព័ន្ធជាមុនសិន" },
        { status: 401 }
      );
    }

    return withRateLimit(request, session, async () => {
      const userRole = session.user.role as UserRole;
      const userId = parseInt(session.user.id);

      // Permission check
      const permissionCheck = checkPermission({
        userRole,
        userId,
        userPilotSchoolId: session.user.pilot_school_id,
        resourceType: 'users',
        action: 'create',
      });

      if (!permissionCheck.allowed) {
        await logAccessDenied(request, session, 'users', 'create', permissionCheck.reason!);
        return NextResponse.json(
          { error: permissionCheck.reason },
          { status: permissionCheck.statusCode || 403 }
        );
      }

      // IP whitelist check
      const ipCheck = await isIpWhitelisted(request, userRole);
      if (!ipCheck.allowed) {
        await logAccessDenied(request, session, 'users', 'create', ipCheck.reason!);
        return NextResponse.json(
          { error: ipCheck.reason },
          { status: 403 }
        );
      }

      // Validate request body
      const body = await request.json();
      const validation = await validateBody(userCreateSchema, body);

      if (!validation.success) {
        return NextResponse.json(
          {
            success: false,
            error: "ទិន្នន័យមិនត្រឹមត្រូវ",
            details: formatValidationErrors(validation.errors!),
          },
          { status: 400 }
        );
      }

      const validatedData = validation.data!;

      // Check for duplicate email
      const existingUser = await prisma.user.findUnique({
        where: { email: validatedData.email }
      });

      if (existingUser) {
        return NextResponse.json(
          {
            success: false,
            error: "អ៊ីមែលនេះត្រូវបានប្រើប្រាស់រួចហើយ"
          },
          { status: 400 }
        );
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(validatedData.password, 12);

      // Create user
      const newUser = await prisma.user.create({
        data: {
          ...validatedData,
          password: hashedPassword
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          province: true,
          subject: true,
          phone: true,
          pilot_school_id: true,
          created_at: true,
        }
      });

      // Audit log
      await logCreate(
        request,
        session,
        'users',
        newUser.id,
        newUser.name,
        newUser
      );

      return NextResponse.json({
        success: true,
        message: "បានបង្កើតអ្នកប្រើប្រាស់ដោយជោគជ័យ",
        data: newUser
      }, { status: 201 });
    });

  } catch (error: any) {
    const session = await getServerSession(authOptions);
    await logFailure(request, session, 'users', 'create', error.message);
    console.error("Error creating user:", error);

    return NextResponse.json(
      {
        success: false,
        error: "មានបញ្ហាក្នុងការបង្កើតអ្នកប្រើប្រាស់",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/users/secured - Update user with field-level permissions
 */
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      await logAccessDenied(request, session, 'users', 'update', 'Not authenticated');
      return NextResponse.json(
        { error: "សូមចូលប្រើប្រាស់ប្រព័ន្ធជាមុនសិន" },
        { status: 401 }
      );
    }

    return withRateLimit(request, session, async () => {
      const userRole = session.user.role as UserRole;
      const userId = parseInt(session.user.id);

      const body = await request.json();
      const { id: targetUserId, ...updateData } = body;

      if (!targetUserId) {
        return NextResponse.json(
          { error: "សូមផ្តល់លេខសម្គាល់អ្នកប្រើប្រាស់" },
          { status: 400 }
        );
      }

      // Get existing user
      const existingUser = await prisma.user.findUnique({
        where: { id: targetUserId }
      });

      if (!existingUser) {
        return NextResponse.json(
          { error: "រកមិនឃើញអ្នកប្រើប្រាស់" },
          { status: 404 }
        );
      }

      // Permission check
      const permissionCheck = checkPermission({
        userRole,
        userId,
        userPilotSchoolId: session.user.pilot_school_id,
        resourceType: 'users',
        resourceOwnerId: targetUserId,
        action: 'update',
      });

      if (!permissionCheck.allowed) {
        await logAccessDenied(request, session, 'users', 'update', permissionCheck.reason!);
        return NextResponse.json(
          { error: permissionCheck.reason },
          { status: permissionCheck.statusCode || 403 }
        );
      }

      // IP whitelist check
      const ipCheck = await isIpWhitelisted(request, userRole);
      if (!ipCheck.allowed) {
        await logAccessDenied(request, session, 'users', 'update', ipCheck.reason!);
        return NextResponse.json(
          { error: ipCheck.reason },
          { status: 403 }
        );
      }

      // Validate input
      const validation = await validateBody(userUpdateSchema, updateData);

      if (!validation.success) {
        return NextResponse.json(
          {
            success: false,
            error: "ទិន្នន័យមិនត្រឹមត្រូវ",
            details: formatValidationErrors(validation.errors!),
          },
          { status: 400 }
        );
      }

      let validatedData = validation.data!;

      // Field-level permission check
      const fieldValidation = validateFieldPermissions(
        userRole,
        'users',
        Object.keys(validatedData)
      );

      if (!fieldValidation.allowed) {
        return NextResponse.json(
          {
            success: false,
            error: fieldValidation.message,
            forbiddenFields: fieldValidation.forbiddenFields
          },
          { status: 403 }
        );
      }

      // Hash password if updating
      if (validatedData.password) {
        validatedData.password = await bcrypt.hash(validatedData.password, 12);
      }

      // Update user
      const updatedUser = await prisma.user.update({
        where: { id: targetUserId },
        data: validatedData,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          province: true,
          subject: true,
          phone: true,
          pilot_school_id: true,
          updated_at: true,
        }
      });

      // Audit log
      const changedFields = getChangedFields(existingUser, updatedUser);
      await logUpdate(
        request,
        session,
        'users',
        updatedUser.id,
        updatedUser.name,
        existingUser,
        updatedUser,
        changedFields
      );

      return NextResponse.json({
        success: true,
        message: "បានកែប្រែអ្នកប្រើប្រាស់ដោយជោគជ័យ",
        data: updatedUser
      });
    });

  } catch (error: any) {
    const session = await getServerSession(authOptions);
    await logFailure(request, session, 'users', 'update', error.message);
    console.error("Error updating user:", error);

    return NextResponse.json(
      {
        success: false,
        error: "មានបញ្ហាក្នុងការកែប្រែអ្នកប្រើប្រាស់",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/users/secured - Delete user with audit trail
 */
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      await logAccessDenied(request, session, 'users', 'delete', 'Not authenticated');
      return NextResponse.json(
        { error: "សូមចូលប្រើប្រាស់ប្រព័ន្ធជាមុនសិន" },
        { status: 401 }
      );
    }

    return withRateLimit(request, session, async () => {
      const userRole = session.user.role as UserRole;
      const userId = parseInt(session.user.id);

      const { searchParams } = new URL(request.url);
      const targetUserId = parseInt(searchParams.get("id") || "0");

      if (!targetUserId) {
        return NextResponse.json(
          { error: "សូមផ្តល់លេខសម្គាល់អ្នកប្រើប្រាស់" },
          { status: 400 }
        );
      }

      // Cannot delete self
      if (targetUserId === userId) {
        return NextResponse.json(
          { error: "អ្នកមិនអាចលុបគណនីខ្លួនឯងបានទេ" },
          { status: 400 }
        );
      }

      // Get existing user
      const existingUser = await prisma.user.findUnique({
        where: { id: targetUserId }
      });

      if (!existingUser) {
        return NextResponse.json(
          { error: "រកមិនឃើញអ្នកប្រើប្រាស់" },
          { status: 404 }
        );
      }

      // Permission check
      const permissionCheck = checkPermission({
        userRole,
        userId,
        userPilotSchoolId: session.user.pilot_school_id,
        resourceType: 'users',
        action: 'delete',
      });

      if (!permissionCheck.allowed) {
        await logAccessDenied(request, session, 'users', 'delete', permissionCheck.reason!);
        return NextResponse.json(
          { error: permissionCheck.reason },
          { status: permissionCheck.statusCode || 403 }
        );
      }

      // IP whitelist check
      const ipCheck = await isIpWhitelisted(request, userRole);
      if (!ipCheck.allowed) {
        await logAccessDenied(request, session, 'users', 'delete', ipCheck.reason!);
        return NextResponse.json(
          { error: ipCheck.reason },
          { status: 403 }
        );
      }

      // Delete user
      await prisma.user.delete({
        where: { id: targetUserId }
      });

      // Audit log
      await logDelete(
        request,
        session,
        'users',
        targetUserId,
        existingUser.name,
        existingUser
      );

      return NextResponse.json({
        success: true,
        message: "បានលុបអ្នកប្រើប្រាស់ដោយជោគជ័យ"
      });
    });

  } catch (error: any) {
    const session = await getServerSession(authOptions);
    await logFailure(request, session, 'users', 'delete', error.message);
    console.error("Error deleting user:", error);

    return NextResponse.json(
      {
        success: false,
        error: "មានបញ្ហាក្នុងការលុបអ្នកប្រើប្រាស់",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}
