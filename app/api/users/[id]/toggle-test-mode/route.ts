import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * POST /api/users/[id]/toggle-test-mode
 * Toggle test mode for a teacher
 * Only teachers can use test mode, and only they can toggle their own
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;
    const userId = parseInt(id);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'សូមចូលប្រើប្រាស់ប្រព័ន្ធជាមុនសិន' },
        { status: 401 }
      );
    }

    const currentUserId = parseInt(session.user.id);

    // Only teachers can toggle their own test mode
    // Admins can toggle test mode for any teacher
    const isAdmin = session.user.role === 'admin';
    const isOwnAccount = currentUserId === userId;

    if (!isAdmin && !isOwnAccount) {
      return NextResponse.json(
        { error: 'អ្នកមិនមានសិទ្ធិកែប្រែការកំណត់នេះ' },
        { status: 403 }
      );
    }

    // Get the target user
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        role: true,
        test_mode_enabled: true,
        name: true
      }
    });

    if (!targetUser) {
      return NextResponse.json(
        { error: 'រកមិនឃើញអ្នកប្រើប្រាស់' },
        { status: 404 }
      );
    }

    // Only teachers can have test mode
    if (targetUser.role !== 'teacher') {
      return NextResponse.json(
        { error: 'មានតែគ្រូបង្រៀនប៉ុណ្ណោះដែលអាចប្រើរបៀបសាកល្បង' },
        { status: 400 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { enabled } = body;

    if (typeof enabled !== 'boolean') {
      return NextResponse.json(
        { error: 'តម្លៃ enabled ត្រូវតែជា boolean' },
        { status: 400 }
      );
    }

    // If enabling test mode, check if user already has an active test session
    if (enabled) {
      const activeSession = await prisma.test_sessions.findFirst({
        where: {
          user_id: userId,
          status: 'active'
        }
      });

      if (activeSession) {
        // Already has an active session, just enable test mode
        const updatedUser = await prisma.user.update({
          where: { id: userId },
          data: { test_mode_enabled: true },
          select: {
            id: true,
            name: true,
            role: true,
            test_mode_enabled: true
          }
        });

        return NextResponse.json({
          success: true,
          message: 'បានបើករបៀបសាកល្បងដោយជោគជ័យ',
          user: updatedUser,
          existing_session: activeSession
        });
      }
    }

    // If disabling test mode, check if user has test data
    if (!enabled) {
      const [studentCount, assessmentCount, mentoringVisitCount] = await Promise.all([
        prisma.students.count({
          where: {
            added_by_id: userId,
            record_status: 'test_teacher'
          }
        }),
        prisma.assessments.count({
          where: {
            added_by_id: userId,
            record_status: 'test_teacher'
          }
        }),
        prisma.mentoring_visits.count({
          where: {
            mentor_id: userId,
            record_status: 'test_teacher'
          }
        })
      ]);

      const totalTestData = studentCount + assessmentCount + mentoringVisitCount;

      if (totalTestData > 0) {
        return NextResponse.json({
          error: 'មានទិន្នន័យសាកល្បងនៅសេសសល់',
          warning: 'សូមលុប ឬរក្សាទុកទិន្នន័យសាកល្បងជាមុនសិន',
          test_data_count: {
            students: studentCount,
            assessments: assessmentCount,
            mentoring_visits: mentoringVisitCount,
            total: totalTestData
          }
        }, { status: 400 });
      }
    }

    // Toggle test mode
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { test_mode_enabled: enabled },
      select: {
        id: true,
        name: true,
        role: true,
        test_mode_enabled: true
      }
    });

    return NextResponse.json({
      success: true,
      message: enabled ?
        'បានបើករបៀបសាកល្បងដោយជោគជ័យ' :
        'បានបិទរបៀបសាកល្បងដោយជោគជ័យ',
      user: updatedUser
    });

  } catch (error) {
    console.error('Toggle test mode error:', error);
    return NextResponse.json(
      {
        error: 'មានបញ្ហាក្នុងការកែប្រែរបៀបសាកល្បង',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/users/[id]/toggle-test-mode
 * Get test mode status and related info
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;
    const userId = parseInt(id);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'សូមចូលប្រើប្រាស់ប្រព័ន្ធជាមុនសិន' },
        { status: 401 }
      );
    }

    const currentUserId = parseInt(session.user.id);
    const isAdmin = session.user.role === 'admin';
    const isOwnAccount = currentUserId === userId;

    if (!isAdmin && !isOwnAccount) {
      return NextResponse.json(
        { error: 'អ្នកមិនមានសិទ្ធិមើលការកំណត់នេះ' },
        { status: 403 }
      );
    }

    // Get user info
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        role: true,
        test_mode_enabled: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'រកមិនឃើញអ្នកប្រើប្រាស់' },
        { status: 404 }
      );
    }

    // Get active test session if exists
    const activeSession = await prisma.test_sessions.findFirst({
      where: {
        user_id: userId,
        status: 'active'
      }
    });

    // Get test data counts
    const [studentCount, assessmentCount, mentoringVisitCount] = await Promise.all([
      prisma.students.count({
        where: {
          added_by_id: userId,
          record_status: user.role === 'mentor' ? 'test_mentor' : 'test_teacher'
        }
      }),
      prisma.assessments.count({
        where: {
          added_by_id: userId,
          record_status: user.role === 'mentor' ? 'test_mentor' : 'test_teacher'
        }
      }),
      prisma.mentoring_visits.count({
        where: {
          mentor_id: userId,
          record_status: user.role === 'mentor' ? 'test_mentor' : 'test_teacher'
        }
      })
    ]);

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        test_mode_enabled: user.test_mode_enabled,
        can_use_test_mode: user.role === 'teacher' || user.role === 'mentor'
      },
      active_session: activeSession,
      test_data_count: {
        students: studentCount,
        assessments: assessmentCount,
        mentoring_visits: mentoringVisitCount,
        total: studentCount + assessmentCount + mentoringVisitCount
      }
    });

  } catch (error) {
    console.error('Get test mode status error:', error);
    return NextResponse.json(
      {
        error: 'មានបញ្ហាក្នុងការទាញយកស្ថានភាពរបៀបសាកល្បង',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}