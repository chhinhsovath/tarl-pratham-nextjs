import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    let quickUsers = [];
    
    try {
      // Try to fetch from database first
      quickUsers = await prisma.quickLoginUser.findMany({
        where: { is_active: true },
        select: {
          id: true,
          username: true,
          role: true,
          province: true,
          subject: true,
          is_active: true
        },
        orderBy: [
          { role: 'asc' },
          { username: 'asc' }
        ]
      });
    } catch (dbError) {
      console.log('QuickLoginUser table not found, using demo users');
      // Fallback demo users if table doesn't exist
      quickUsers = [
        { id: 1, username: 'admin.demo', role: 'admin', province: null, subject: null, is_active: true },
        { id: 2, username: 'coordinator.demo', role: 'coordinator', province: 'ភ្នំពេញ', subject: null, is_active: true },
        { id: 3, username: 'mentor.khmer', role: 'mentor', province: 'កណ្តាល', subject: 'khmer', is_active: true },
        { id: 4, username: 'mentor.math', role: 'mentor', province: 'កណ្តាល', subject: 'math', is_active: true },
        { id: 5, username: 'teacher.grade4', role: 'teacher', province: 'បាត់ដំបង', subject: 'khmer', is_active: true },
        { id: 6, username: 'teacher.grade5', role: 'teacher', province: 'បាត់ដំបង', subject: 'math', is_active: true },
        { id: 7, username: 'viewer.demo', role: 'viewer', province: null, subject: null, is_active: true }
      ];
    }

    // Group users by role for easier display
    const groupedUsers = quickUsers.reduce((groups: Record<string, any[]>, user) => {
      const role = user.role || 'other';
      if (!groups[role]) {
        groups[role] = [];
      }
      groups[role].push(user);
      return groups;
    }, {});

    return NextResponse.json({ 
      users: quickUsers,
      groupedUsers: groupedUsers 
    });
  } catch (error) {
    console.error('Error in quick-users API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}