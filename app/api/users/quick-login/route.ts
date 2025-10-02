import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/users/quick-login - Public endpoint for getting quick login users
export async function GET(request: NextRequest) {
  try {
    // This is a public endpoint - no authentication required
    // It provides demo users for the quick login dropdown
    
    let users;
    
    try {
      // Query unified users table for username login type
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
          login_type: 'username'
        },
        orderBy: [
          { role: 'asc' },
          { username: 'asc' }
        ]
      });
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