import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admin and coordinator can reset passwords
    if (session.user.role !== 'admin' && session.user.role !== 'coordinator') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { new_password } = await request.json();

    if (!new_password || new_password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    const userId = parseInt(params.id);
    if (isNaN(userId)) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(new_password, 10);

    // Update the password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return NextResponse.json({
      message: 'Password reset successfully',
      success: true,
    });
  } catch (error) {
    console.error('Error resetting password:', error);
    return NextResponse.json(
      {
        error: 'Failed to reset password',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
