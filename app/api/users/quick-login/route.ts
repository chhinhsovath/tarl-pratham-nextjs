import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/users/quick-login - Public endpoint for getting quick login users
export async function GET(request: NextRequest) {
  try {
    // This is a public endpoint - no authentication required
    // It provides users for the quick login dropdown

    let users;

    try {
      // Query unified users table - return ALL users with usernames (both email and username login types)
      // Include email as fallback for users without username
      users = await prisma.user.findMany({
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          province: true,
          subject: true
        },
        where: {
          is_active: true,
          username: { not: null } // Show all users that have a username
        },
        orderBy: [
          { role: 'asc' },
          { username: 'asc' }
        ]
      });

      console.log(`✅ [QUICK-LOGIN] Found ${users.length} active users with usernames for login dropdown`);

      // Log if we find users without usernames (this should be empty after fix)
      const usersWithoutUsername = await prisma.user.count({
        where: {
          is_active: true,
          username: null
        }
      });

      if (usersWithoutUsername > 0) {
        console.warn(`⚠️  [QUICK-LOGIN] Found ${usersWithoutUsername} active users WITHOUT usernames. These will NOT appear in login dropdown!`);
        console.warn(`🔧 Run: POST /api/users/fix-missing-usernames to fix them.`);
      } else {
        console.log(`✅ [QUICK-LOGIN] No users with missing usernames - all users have usernames!`);
      }
    } catch (dbError) {
      console.warn("Database not available, providing demo users:", dbError);
      users = [];
    }

    // If no users in database, provide demo users for development
    if (users.length === 0) {
      users = [
        {
          id: 1,
          username: "admin123",
          role: "admin",
          province: null,
          subject: null
        },
        {
          id: 2,
          username: "coordinator_pp",
          role: "coordinator",
          province: "Phnom Penh",
          subject: null
        },
        {
          id: 3,
          username: "mentor_math",
          role: "mentor",
          province: "Kandal",
          subject: "Math"
        },
        {
          id: 4,
          username: "teacher_khmer",
          role: "teacher",
          province: "Siem Reap",
          subject: "Khmer"
        },
        {
          id: 5,
          username: "viewer_report",
          role: "viewer",
          province: null,
          subject: null
        }
      ];
    }

    return NextResponse.json({
      users,
      total: users.length
    });

  } catch (error) {
    console.error("Error fetching quick login users:", error);

    // Even if there's an error, provide demo users so the login page works
    const demoUsers = [
      {
        id: 1,
        username: "admin123",
        role: "admin",
        province: null,
        subject: null
      },
      {
        id: 2,
        username: "demo_teacher",
        role: "teacher",
        province: "Demo Province",
        subject: "Demo Subject"
      }
    ];

    return NextResponse.json({
      users: demoUsers,
      total: demoUsers.length
    });
  }
}