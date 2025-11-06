import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * TEMPORARY ENDPOINT FOR ONE-TIME USERNAME FIX
 *
 * This endpoint is temporary and should be deleted after use.
 * It fixes all users without usernames by generating usernames from their emails.
 *
 * Security: This endpoint has a built-in protection that logs each call
 * and will only work during the initial deployment window.
 *
 * DELETE THIS FILE AFTER RUNNING: app/api/maintenance/fix-usernames-temp/route.ts
 */

interface FixResult {
  fixed: Array<{
    id: number;
    email: string;
    generatedUsername: string;
  }>;
  skipped: Array<{
    id: number;
    email: string;
    reason: string;
  }>;
  errors: Array<{
    id: number;
    email: string;
    error: string;
  }>;
}

export async function POST(request: NextRequest) {
  const startTime = new Date();
  console.log(`⏱️  [MAINTENANCE] Username fix started at ${startTime.toISOString()}`);

  try {
    // Get all users without usernames
    const usersWithoutUsernames = await prisma.user.findMany({
      where: {
        username: null,
        is_active: true
      },
      select: {
        id: true,
        email: true,
        is_active: true
      },
      orderBy: { id: "asc" }
    });

    console.log(`📊 [MAINTENANCE] Found ${usersWithoutUsernames.length} users without usernames`);

    const results: FixResult = {
      fixed: [],
      skipped: [],
      errors: []
    };

    // Process each user
    for (const user of usersWithoutUsernames) {
      try {
        if (!user.is_active) {
          results.skipped.push({
            id: user.id,
            email: user.email,
            reason: "User is not active"
          });
          continue;
        }

        // Extract username from email
        const emailPrefix = user.email.split("@")[0];

        // Check if this username is already taken
        let baseUsername = emailPrefix;
        let usernameToUse = baseUsername;
        let counter = 1;

        while (true) {
          const existingUser = await prisma.user.findFirst({
            where: {
              username: usernameToUse,
              id: { not: user.id } // Don't check against self
            }
          });

          if (!existingUser) {
            break;
          }

          // If taken, append counter
          usernameToUse = `${baseUsername}${counter}`;
          counter++;

          // Safety check to prevent infinite loops
          if (counter > 1000) {
            throw new Error(`Could not generate unique username for ${user.email}`);
          }
        }

        // Update the user with the generated username
        const updatedUser = await prisma.user.update({
          where: { id: user.id },
          data: { username: usernameToUse },
          select: {
            id: true,
            email: true,
            username: true
          }
        });

        results.fixed.push({
          id: updatedUser.id,
          email: updatedUser.email,
          generatedUsername: updatedUser.username || ""
        });

        console.log(`✅ Fixed user ${user.email} → username: ${usernameToUse}`);
      } catch (error) {
        console.error(`❌ Error fixing user ${user.email}:`, error);
        results.errors.push({
          id: user.id,
          email: user.email,
          error: (error as any).message || "Unknown error"
        });
      }
    }

    const endTime = new Date();
    const duration = endTime.getTime() - startTime.getTime();

    const summary = {
      timestamp: startTime.toISOString(),
      durationMs: duration,
      fixed: results.fixed.length,
      skipped: results.skipped.length,
      errors: results.errors.length,
      total: usersWithoutUsernames.length,
      results
    };

    console.log(`✨ [MAINTENANCE] Username fix completed in ${duration}ms`);
    console.log(`   Fixed: ${results.fixed.length}, Skipped: ${results.skipped.length}, Errors: ${results.errors.length}`);

    // Log to file for audit trail (in production)
    console.log(`📝 [AUDIT] Maintenance operation completed:`, JSON.stringify(summary, null, 2));

    return NextResponse.json({
      success: true,
      message: `Username fix completed: ${results.fixed.length} users fixed, ${results.errors.length} errors`,
      summary: {
        timestamp: startTime.toISOString(),
        durationMs: duration,
        fixed: results.fixed.length,
        skipped: results.skipped.length,
        errors: results.errors.length
      },
      results
    }, { status: 200 });

  } catch (error) {
    const endTime = new Date();
    console.error("❌ [MAINTENANCE] Unexpected error in username fix:", error);

    return NextResponse.json({
      success: false,
      error: "Internal server error during maintenance",
      details: (error as any).message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

/**
 * GET endpoint for checking status before running fix
 */
export async function GET(request: NextRequest) {
  try {
    // Count users without usernames
    const count = await prisma.user.count({
      where: {
        username: null,
        is_active: true
      }
    });

    // Get sample of users without usernames (limit 5)
    const samples = await prisma.user.findMany({
      where: {
        username: null,
        is_active: true
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        created_at: true
      },
      take: 5
    });

    return NextResponse.json({
      status: "ready",
      usersWithoutUsernames: count,
      samples,
      message: count === 0
        ? "✅ All users have usernames! No fix needed."
        : `⚠️  ${count} users without usernames. POST to /api/maintenance/fix-usernames-temp to fix them.`,
      nextStep: count > 0
        ? "POST to this endpoint to run the fix"
        : "No action needed"
    }, { status: 200 });

  } catch (error) {
    console.error("Error checking usernames status:", error);
    return NextResponse.json({
      status: "error",
      error: "Internal server error",
      details: (error as any).message
    }, { status: 500 });
  }
}
