import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/test-sessions/list
 * List all test sessions (admin/coordinator only)
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'សូមចូលប្រើប្រាស់ប្រព័ន្ធជាមុនសិន' },
        { status: 401 }
      );
    }

    // Only admins and coordinators can list all sessions
    if (!['admin', 'coordinator'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'អ្នកមិនមានសិទ្ធិមើលទិន្នន័យនេះ' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status'); // active, expired, archived, completed
    const user_id = searchParams.get('user_id');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (user_id) {
      where.user_id = parseInt(user_id);
    }

    // Get sessions with pagination
    const [sessions, total] = await Promise.all([
      prisma.testSession.findMany({
        where,
        orderBy: [
          { status: 'asc' }, // Active first
          { created_at: 'desc' }
        ],
        skip,
        take: limit
      }),
      prisma.testSession.count({ where })
    ]);

    return NextResponse.json({
      sessions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('List test sessions error:', error);
    return NextResponse.json(
      {
        error: 'មានបញ្ហាក្នុងការទាញយកបញ្ជីសម័យ',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}