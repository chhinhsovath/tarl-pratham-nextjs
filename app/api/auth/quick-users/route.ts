import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const quickUsers = await prisma.quickLoginUser.findMany({
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

    return NextResponse.json({ users: quickUsers });
  } catch (error) {
    console.error('Error fetching quick login users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}