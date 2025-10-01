import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = parseInt(session.user.id);

    // CRITICAL: Check if quick login user to query correct table
    if (session.user.isQuickLogin) {
      // Quick login users: Query quick_login_users table
      const quickUser = await prisma.quickLoginUser.findUnique({
        where: { id: userId },
        select: {
          id: true,
          username: true,
          role: true,
          province: true,
          subject: true,
          is_active: true,
          created_at: true,
          updated_at: true
        }
      });

      if (!quickUser) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      // Return quick login user data in same format
      return NextResponse.json({
        user: {
          id: quickUser.id,
          name: quickUser.username,
          email: `${quickUser.username}@quick.login`,
          role: quickUser.role,
          pilot_school_id: null, // Quick login users don't have schools
          subject: quickUser.subject,
          holding_classes: null,
          phone: null,
          province: quickUser.province,
          district: null,
          created_at: quickUser.created_at,
          updated_at: quickUser.updated_at
        },
        profileComplete: false // Quick login users always need profile setup
      });
    }

    // Regular users: Query users table
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        pilot_school_id: true,
        subject: true,
        holding_classes: true,
        phone: true,
        province: true,
        district: true,
        created_at: true,
        updated_at: true
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      user,
      profileComplete: !!(user.pilot_school_id && user.subject && user.holding_classes)
    });

  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}