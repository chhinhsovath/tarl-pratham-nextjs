import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: 'មិនបានអនុញ្ញាត' },
        { status: 401 }
      );
    }

    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { message: 'សូមបំពេញពាក្យសម្ងាត់ទាំងពីរ' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { message: 'ពាក្យសម្ងាត់ថ្មីត្រូវមានយ៉ាងតិច ៦ តួអក្សរ' },
        { status: 400 }
      );
    }

    // Find user in database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, password: true }
    });

    if (!user) {
      return NextResponse.json(
        { message: 'រកមិនឃើញអ្នកប្រើប្រាស់' },
        { status: 404 }
      );
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.password);

    if (!isValidPassword) {
      return NextResponse.json(
        { message: 'ពាក្យសម្ងាត់បច្ចុប្បន្នមិនត្រឹមត្រូវ' },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    // Update password in database
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedNewPassword }
    });

    return NextResponse.json(
      { message: 'ពាក្យសម្ងាត់បានផ្លាស់ប្តូរបានជោគជ័យ' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Password change error:', error);
    return NextResponse.json(
      { message: 'មានកំហុសមិនរំពឹងទុក' },
      { status: 500 }
    );
  }
}