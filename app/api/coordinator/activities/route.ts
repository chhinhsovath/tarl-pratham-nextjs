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

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const activity_type = searchParams.get('type') || ''; // assessment, student, user

    // Fetch recent activities from multiple sources
    const [
      recent_assessments,
      recent_students,
      recent_users,
    ] = await Promise.all([
      // Recent assessments
      prisma.assessment.findMany({
        take: limit,
        orderBy: { created_at: 'desc' },
        select: {
          id: true,
          assessment_type: true,
          subject: true,
          level: true,
          created_at: true,
          student: {
            select: {
              id: true,
              name: true,
            }
          },
          added_by: {
            select: {
              id: true,
              name: true,
              role: true,
            }
          },
          pilot_school: {
            select: {
              id: true,
              school_name: true,
            }
          }
        }
      }),

      // Recent students added
      prisma.student.findMany({
        take: limit,
        orderBy: { created_at: 'desc' },
        select: {
          id: true,
          name: true,
          grade: true,
          gender: true,
          created_at: true,
          pilot_school: {
            select: {
              id: true,
              school_name: true,
            }
          },
          added_by: {
            select: {
              id: true,
              name: true,
              role: true,
            }
          }
        }
      }),

      // Recent users added
      prisma.user.findMany({
        take: limit,
        orderBy: { created_at: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          created_at: true,
          pilot_school: {
            select: {
              id: true,
              school_name: true,
            }
          }
        }
      }),
    ]);

    // Transform into unified activity feed
    const activities: any[] = [];

    // Add assessment activities
    if (!activity_type || activity_type === 'assessment') {
      recent_assessments.forEach(assessment => {
        activities.push({
          id: `assessment-${assessment.id}`,
          type: 'assessment',
          title: `${assessment.assessment_type} ការវាយតម្លៃថ្មី`,
          description: `${assessment.added_by?.name || 'Unknown'} បានធ្វើការវាយតម្លៃ ${assessment.subject} សម្រាប់សិស្ស ${assessment.student?.name || 'Unknown'}`,
          icon: 'FileTextOutlined',
          timestamp: assessment.created_at,
          metadata: {
            assessment_id: assessment.id,
            student_id: assessment.student?.id,
            student_name: assessment.student?.name,
            teacher_id: assessment.added_by?.id,
            teacher_name: assessment.added_by?.name,
            school_id: assessment.pilot_school?.id,
            school_name: assessment.pilot_school?.school_name,
            assessment_type: assessment.assessment_type,
            subject: assessment.subject,
            level: assessment.level,
          }
        });
      });
    }

    // Add student activities
    if (!activity_type || activity_type === 'student') {
      recent_students.forEach(student => {
        activities.push({
          id: `student-${student.id}`,
          type: 'student',
          title: 'សិស្សថ្មី',
          description: `${student.added_by?.name || 'Unknown'} បានបន្ថែមសិស្ស ${student.name} (ថ្នាក់ទី${student.grade || '-'})`,
          icon: 'UserAddOutlined',
          timestamp: student.created_at,
          metadata: {
            student_id: student.id,
            student_name: student.name,
            grade: student.grade,
            gender: student.gender,
            teacher_id: student.added_by?.id,
            teacher_name: student.added_by?.name,
            school_id: student.pilot_school?.id,
            school_name: student.pilot_school?.school_name,
          }
        });
      });
    }

    // Add user activities
    if (!activity_type || activity_type === 'user') {
      recent_users.forEach(user => {
        activities.push({
          id: `user-${user.id}`,
          type: 'user',
          title: 'អ្នកប្រើប្រាស់ថ្មី',
          description: `អ្នកប្រើប្រាស់ថ្មី ${user.name} (${user.role}) បានបង្កើត`,
          icon: 'TeamOutlined',
          timestamp: user.created_at,
          metadata: {
            user_id: user.id,
            user_name: user.name,
            email: user.email,
            role: user.role,
            school_id: user.pilot_school?.id,
            school_name: user.pilot_school?.school_name,
          }
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
