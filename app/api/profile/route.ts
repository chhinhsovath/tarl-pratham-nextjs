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

    // Query unified users table
    const user = await prisma.users.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        role: true,
        pilot_school_id: true,
        subject: true,
        holding_classes: true,
        phone: true,
        province: true,
        district: true,
        login_type: true,
        created_at: true,
        updated_at: true
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name || user.username,
        email: user.email,
        role: user.role,
        pilot_school_id: user.pilot_school_id,
        subject: user.subject,
        holding_classes: user.holding_classes,
        phone: user.phone,
        province: user.province,
        district: user.district,
        created_at: user.created_at,
        updated_at: user.updated_at
      },
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