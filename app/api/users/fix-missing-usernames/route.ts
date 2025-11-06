import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/users/fix-missing-usernames
 * Admin-only endpoint to fix users that don't have usernames
 * This allows them to appear in the quick-login dropdown
 *
 * This should be called once to fix all existing users created before the auto-generation feature
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Only admins can run this fix
    if (!session?.user?.id || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Only admins can fix user usernames" },
        { status: 403 }
      );
    }

    // Get all users without usernames
    const usersWithoutUsernames = await prisma.user.findMany({
      where: {
        username: null,
        is_active: true
      },
      select: {
        id: true,
        email: true,
        username: true
      }
    });

    console.log(`Found ${usersWithoutUsernames.length} users without usernames`);

    const results = {
      fixed: [] as any[],
      skipped: [] as any[],
      errors: [] as any[]
    };

    // Process each user
    for (const user of usersWithoutUsernames) {
      try {
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
          generatedUsername: updatedUser.username
        });

        console.log(`✅ Fixed user ${user.email} → username: ${usernameToUse}`);
      } catch (error) {
        console.error(`❌ Error fixing user ${user.email}:`, error);
        results.errors.push({
          id: user.id,
          email: user.email,
          error: (error as any).message
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Fixed ${results.fixed.length} users without usernames`,
      results
    }, { status: 200 });

  } catch (error) {
    console.error("Error in fix-missing-usernames endpoint:", error);
    return NextResponse.json(
      { error: "Internal server error", details: (error as any).message },
      { status: 500 }
    );
  }
}

/**
 * GET /api/users/fix-missing-usernames
 * Admin-only endpoint to check status of users without usernames
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Only admins can check this
    if (!session?.user?.id || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Only admins can check user status" },
        { status: 403 }
      );
    }

    // Count users without usernames
    const count = await prisma.user.count({
      where: {
        username: null,
        is_active: true
      }
    });

    // Get sample of users without usernames (limit 10)
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
      take: 10
    });

    return NextResponse.json({
      status: "ok",
      usersWithoutUsernames: count,
      samples,
      message: count === 0
        ? "All users have usernames! No fix needed."
        : `${count} users without usernames. Call POST to fix them.`
    }, { status: 200 });

  } catch (error) {
    console.error("Error checking usernames status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
