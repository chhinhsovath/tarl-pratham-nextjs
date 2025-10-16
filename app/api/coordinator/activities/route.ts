import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admin and coordinator can access activities
    if (session.user.role !== 'admin' && session.user.role !== 'coordinator') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Coordinators have admin-like access - NO restrictions
    const schoolFilter: any = {};

    console.log(`[COORDINATOR ACTIVITIES] User role: ${session.user.role} - Full access granted`);

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const activity_type = searchParams.get('type') || ''; // assessment, student, user

    // CRITICAL: ZERO JOINS - Only fetch IDs to prevent connection exhaustion
    const [
      recent_assessments,
      recent_students,
      recent_users,
    ] = await Promise.all([
      // Recent assessments - NO JOINS
      prisma.assessment.findMany({
        where: schoolFilter,
        take: limit,
        orderBy: { created_at: 'desc' },
        select: {
          id: true,
          assessment_type: true,
          subject: true,
          level: true,
          created_at: true,
          student_id: true, // Just ID, no join
          added_by_id: true, // Just ID, no join
          pilot_school_id: true, // Just ID, no join
        }
      }),

      // Recent students - NO JOINS
      prisma.student.findMany({
        where: schoolFilter,
        take: limit,
        orderBy: { created_at: 'desc' },
        select: {
          id: true,
          name: true,
          grade: true,
          gender: true,
          created_at: true,
          pilot_school_id: true, // Just ID, no join
          added_by_id: true, // Just ID, no join
        }
      }),

      // Recent users - NO JOINS
      prisma.user.findMany({
        where: schoolFilter,
        take: limit,
        orderBy: { created_at: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          created_at: true,
          pilot_school_id: true, // Just ID, no join
        }
      }),
    ]);

    // Transform into unified activity feed
    const activities: any[] = [];

    // Add assessment activities - NO JOINS, just display IDs
    if (!activity_type || activity_type === 'assessment') {
      recent_assessments.forEach(assessment => {
        activities.push({
          id: `assessment-${assessment.id}`,
          type: 'assessment',
          title: `${assessment.assessment_type} ការវាយតម្លៃថ្មី`,
          description: `ការវាយតម្លៃ ${assessment.subject} (Student ID: ${assessment.student_id})`,
          icon: 'FileTextOutlined',
          timestamp: assessment.created_at,
          status: 'success',
        });
      });
    }

    // Add student activities - NO JOINS, just display basic info
    if (!activity_type || activity_type === 'student') {
      recent_students.forEach(student => {
        activities.push({
          id: `student-${student.id}`,
          type: 'student',
          title: 'សិស្សថ្មី',
          description: `បានបន្ថែមសិស្ស ${student.name} (ថ្នាក់ទី${student.grade || '-'})`,
          icon: 'UserAddOutlined',
          timestamp: student.created_at,
          status: 'success',
        });
      });
    }

    // Add user activities - NO JOINS, just display basic info
    if (!activity_type || activity_type === 'user') {
      recent_users.forEach(user => {
        activities.push({
          id: `user-${user.id}`,
          type: 'user',
          title: 'អ្នកប្រើប្រាស់ថ្មី',
          description: `អ្នកប្រើប្រាស់ថ្មី ${user.name} (${user.role}) បានបង្កើត`,
          icon: 'TeamOutlined',
          timestamp: user.created_at,
          status: 'success',
        });
      });
    }

    // Sort all activities by timestamp (most recent first)
    activities.sort((a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    // Limit to requested number
    const limited_activities = activities.slice(0, limit);

    return NextResponse.json({
      activities: limited_activities,
      total: limited_activities.length,
    });
  } catch (error) {
    console.error('Error fetching coordinator activities:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch coordinator activities',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
