import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { pilot_school_id, subject, holding_classes, phone } = body;

    // Validate required fields
    if (!pilot_school_id || !subject || !holding_classes) {
      return NextResponse.json({
        error: 'Missing required fields: pilot_school_id, subject, holding_classes'
      }, { status: 400 });
    }

    // Validate subject values
    if (!['khmer', 'math', 'both'].includes(subject)) {
      return NextResponse.json({
        error: 'Invalid subject value'
      }, { status: 400 });
    }

    // Validate holding_classes values
    if (!['grade_4', 'grade_5', 'both'].includes(holding_classes)) {
      return NextResponse.json({
        error: 'Invalid holding_classes value'
      }, { status: 400 });
    }

    const userId = parseInt(session.user.id);
    const isQuickLogin = session.user.isQuickLogin;

    console.log('👤 User ID from session:', userId);
    console.log('👤 Login type:', isQuickLogin ? 'Quick Login' : 'Regular');
    console.log('👤 Full session user:', session.user);

    // Query correct table based on login type
    if (isQuickLogin) {
      const quickUser = await prisma.quickLoginUser.findUnique({
        where: { id: userId }
      });

      if (!quickUser) {
        console.error('❌ Quick login user not found with ID:', userId);
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      console.log('✅ Found quick login user:', quickUser.username);
    } else {
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        console.error('❌ User not found with ID:', userId);
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      console.log('✅ Found user:', user.name, user.email);
    }

    // Get school details for location
    const school = await prisma.pilotSchool.findUnique({
      where: { id: parseInt(pilot_school_id) }
    });

    if (isQuickLogin) {
      // Update quick login user profile
      const updatedQuickUser = await prisma.quickLoginUser.update({
        where: { id: userId },
        data: {
          pilot_school_id: parseInt(pilot_school_id),
          subject,
          holding_classes,
          province: school?.province || null,
          district: school?.district || null,
          updated_at: new Date()
        }
      });

      console.log('✅ Updated quick login user successfully:', updatedQuickUser.id);

      return NextResponse.json({
        success: true,
        user: {
          id: updatedQuickUser.id,
          pilot_school_id: updatedQuickUser.pilot_school_id,
          subject: updatedQuickUser.subject,
          holding_classes: updatedQuickUser.holding_classes,
          province: updatedQuickUser.province,
          district: updatedQuickUser.district
        }
      });
    } else {
      // Regular user update logic
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      const wasFirstTime = !user.pilot_school_id || !user.subject || !user.holding_classes;
      const isMentor = user.role === 'mentor';
      const isTeacher = user.role === 'teacher';

      let updateData: any = {
        pilot_school_id: parseInt(pilot_school_id),
        subject,
        holding_classes,
        phone: phone || null,
        updated_at: new Date()
      };

      // If mentor is setting up profile for the first time, set expiration
      if (isMentor && wasFirstTime) {
        updateData.profile_expires_at = new Date(Date.now() + 48 * 60 * 60 * 1000); // 48 hours
        updateData.original_school_id = user.pilot_school_id;
        updateData.original_subject = user.subject;
        updateData.original_classes = user.holding_classes;
      }

      // Mark profile setup as complete in onboarding
      if (wasFirstTime && (isTeacher || isMentor)) {
        const currentOnboarding = user.onboarding_completed
          ? (typeof user.onboarding_completed === 'string'
              ? JSON.parse(user.onboarding_completed)
              : user.onboarding_completed)
          : [];

        if (!currentOnboarding.includes('complete_profile')) {
          currentOnboarding.push('complete_profile');
          updateData.onboarding_completed = JSON.stringify(currentOnboarding);
        }
      }

      if (school) {
        updateData.province = school.province;
        updateData.district = school.district;
      }

      // Update user profile in the main users table
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: updateData
      });

      console.log('✅ Updated user successfully:', updatedUser.id);

      return NextResponse.json({
        success: true,
        user: {
          id: updatedUser.id,
          pilot_school_id: updatedUser.pilot_school_id,
          subject: updatedUser.subject,
          holding_classes: updatedUser.holding_classes,
          province: updatedUser.province,
          district: updatedUser.district
        }
      });
    }

  } catch (error: any) {
    console.error('❌ Error updating profile:', error);
    console.error('❌ Error stack:', error.stack);
    console.error('❌ Error message:', error.message);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error.message,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}