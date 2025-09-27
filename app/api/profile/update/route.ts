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
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if this was first-time setup
    const wasFirstTime = !user.pilot_school_id || !user.subject || !user.holding_classes;
    const isMentor = user.role === 'mentor';

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

    // Get school details for location
    const school = await prisma.pilotSchool.findUnique({
      where: { id: parseInt(pilot_school_id) }
    });

    if (school) {
      updateData.province = school.province;
      updateData.district = school.district;
    }

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData
    });

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

  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}