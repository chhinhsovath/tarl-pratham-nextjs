import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    let quickUsers = [];
    
    try {
      // Query unified users table - return ALL users with usernames
      quickUsers = await prisma.users.findMany({
        where: {
          is_active: true,
          username: { not: null } // Show all users that have a username
        },
        select: {
          id: true,
          username: true,
          role: true,
          province: true,
          subject: true,
          is_active: true
        },
        orderBy: [
          { username: 'asc' }
        ]
      });
    } catch (dbError) {
      console.log('User table query error, using demo users');
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

    // Define role hierarchy and sort users accordingly
    const roleOrder = ['admin', 'coordinator', 'mentor', 'teacher', 'viewer'];
    const roleHierarchy: { [key: string]: number } = {
      'admin': 1,
      'coordinator': 2, 
      'mentor': 3,
      'teacher': 4,
      'viewer': 5
    };

    // Sort users by role hierarchy, then by username
    const sortedUsers = quickUsers.sort((a, b) => {
      const roleComparison = (roleHierarchy[a.role] || 99) - (roleHierarchy[b.role] || 99);
      if (roleComparison !== 0) return roleComparison;
      return a.username.localeCompare(b.username);
    });

    // Group users by role for organized display
    const groupedUsers = sortedUsers.reduce((groups: Record<string, any[]>, user) => {
      const role = user.role || 'other';
      if (!groups[role]) {
        groups[role] = [];
      }
      groups[role].push(user);
      return groups;
    }, {});

    // Calculate statistics
    const stats = {
      total: quickUsers.length,
      byRole: roleOrder.reduce((acc, role) => {
        acc[role] = groupedUsers[role]?.length || 0;
        return acc;
      }, {} as Record<string, number>)
    };

    return NextResponse.json({ 
      users: sortedUsers,
      groupedUsers: groupedUsers,
      stats: stats,
      total: quickUsers.length
    });
  } catch (error) {
    console.error('Error in quick-users API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}