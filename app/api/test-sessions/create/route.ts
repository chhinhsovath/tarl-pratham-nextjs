import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getTestDataExpiryDate } from '@/lib/utils/recordStatus';
import { v4 as uuidv4 } from 'uuid';

/**
 * POST /api/test-sessions/create
 * Create a new test session for mentor or teacher
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized - Please login first' },
        { status: 401 }
      );
    }

    // Only mentors and teachers with test mode can create test sessions
    if (session.user.role !== 'mentor' && session.user.role !== 'teacher') {
      return NextResponse.json(
        { error: 'Only mentors and teachers can create test sessions' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { notes, expiry_days = 7 } = body;

    const userId = parseInt(session.user.id);

    // Check if user already has an active session
    const existingSession = await prisma.test_sessions.findFirst({
      where: {
        user_id: userId,
        status: 'active'
      }
    });

    if (existingSession) {
      return NextResponse.json(
        {
          error: 'You already have an active test session',
          session: existingSession
        },
        { status: 400 }
      );
    }

    // Create new test session
    const testSession = await prisma.test_sessions.create({
      data: {
        id: uuidv4(),
        user_id: userId,
        user_role: session.user.role,
        expires_at: getTestDataExpiryDate(expiry_days),
        notes: notes || null,
        status: 'active'
      }
    });

    return NextResponse.json({
      success: true,
      message: 'បានបង្កើតសម័យសាកល្បងថ្មីដោយជោគជ័យ',
      session: testSession
    }, { status: 201 });

  } catch (error) {
    console.error('Create test session error:', error);
    return NextResponse.json(
      {
        error: 'មានបញ្ហាក្នុងការបង្កើតសម័យសាកល្បង',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}