import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/users/quick-login - Public endpoint for getting DEMO users only
// SECURITY: This endpoint is public and should NEVER expose real user data
export async function GET(request: NextRequest) {
  try {
    // SECURITY FIX: Only return users marked as test/demo users
    // Never expose real production user accounts in the login dropdown

    let users;

    try {
      // Only show users with test_mode_enabled = true OR record_status = 'demo'
      // This prevents exposing real user accounts to the public
      users = await prisma.user.findMany({
        select: {
          id: true,
          username: true,
          role: true,
          province: true,
          subject: true
        },
        where: {
          is_active: true,
          username: { not: null },
          // SECURITY: Only show demo/test accounts
          OR: [
            { test_mode_enabled: true },
            // Add a name pattern check for demo accounts
            { username: { startsWith: 'demo_' } },
            { username: { startsWith: 'test_' } }
          ]
        },
        orderBy: [
          { role: 'asc' },
          { username: 'asc' }
        ]
      });
    } catch (dbError) {
      console.warn("Database not available, providing hardcoded demo users:", dbError);
      users = [];
    }

    // If no demo users found, provide hardcoded demo users
    if (users.length === 0) {
      users = [
        {
          id: 1,
          username: "demo_admin",
          role: "admin",
          province: null,
          subject: null
        },
        {
          id: 2,
          username: "demo_coordinator",
          role: "coordinator",
          province: "កំពង់ចាម",
          subject: null
        },
        {
          id: 3,
          username: "demo_mentor_math",
          role: "mentor",
          province: "កណ្តាល",
          subject: "Math"
        },
        {
          id: 4,
          username: "demo_mentor_language",
          role: "mentor",
          province: "សៀមរាប",
          subject: "Language"
        },
        {
          id: 5,
          username: "demo_teacher_math",
          role: "teacher",
          province: "បាត់ដំបង",
          subject: "Math"
        },
        {
          id: 6,
          username: "demo_teacher_language",
          role: "teacher",
          province: "ព្រះសីហនុ",
          subject: "Language"
        },
        {
          id: 7,
          username: "demo_viewer",
          role: "viewer",
          province: null,
          subject: null
        }
      ];
    }

    return NextResponse.json({
      users,
      total: users.length,
      message: "Demo users only - real accounts not shown for security"
    });

  } catch (error) {
    console.error("Error fetching quick login users:", error);

    // Fallback demo users
    const demoUsers = [
      {
        id: 1,
        username: "demo_admin",
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