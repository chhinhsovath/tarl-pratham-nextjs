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

    // Validate and normalize subject values (accept both English and Khmer)
    const subjectMapping: Record<string, string> = {
      'khmer': 'khmer',
      'ភាសាខ្មែរ': 'khmer',
      'math': 'math',
      'គណិតវិទ្យា': 'math',
      'both': 'both',
      'ទាំងពីរ': 'both'
    };

    const normalizedSubject = subjectMapping[subject];
    if (!normalizedSubject) {
      return NextResponse.json({
        error: 'Invalid subject value. Must be: khmer/ភាសាខ្មែរ, math/គណិតវិទ្យា, or both/ទាំងពីរ',
        received: subject
      }, { status: 400 });
    }

    // Validate and normalize holding_classes values (accept both English and Khmer)
    const classMapping: Record<string, string> = {
      'grade_4': 'grade_4',
      'ថ្នាក់ទី៤': 'grade_4',
      'ថ្នាក់ទី4': 'grade_4',
      'grade_5': 'grade_5',
      'ថ្នាក់ទី៥': 'grade_5',
      'ថ្នាក់ទី5': 'grade_5',
      'both': 'both',
      'ទាំងពីរ': 'both'
    };

    let normalizedClass = classMapping[holding_classes];

    // Handle comma-separated values (old format) - convert to "both"
    if (!normalizedClass && holding_classes.includes(',')) {
      console.log('⚠️ Detected comma-separated holding_classes, converting to "both":', holding_classes);
      normalizedClass = 'both';
    }

    if (!normalizedClass) {
      return NextResponse.json({
        error: 'Invalid holding_classes value. Must be: grade_4/ថ្នាក់ទី៤, grade_5/ថ្នាក់ទី៥, or both/ទាំងពីរ',
        received: holding_classes
      }, { status: 400 });
    }

    const userId = parseInt(session.user.id);
    const isQuickLogin = session.user.isQuickLogin;

    console.log('👤 User ID from session:', userId);
    console.log('👤 Login type:', isQuickLogin ? 'Quick Login' : 'Regular');
    console.log('👤 Full session user:', session.user);

    // Query unified users table
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      console.error('❌ User not found with ID:', userId);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    console.log('✅ Found user:', user.name || user.username, isQuickLogin ? '(username login)' : '(email login)');

    // Get school details for location
    const school = await prisma.pilot_schools.findUnique({
      where: { id: parseInt(pilot_school_id) }
    });

    // Check if this is first time profile setup
    const wasFirstTime = !user.pilot_school_id || !user.subject || !user.holding_classes;
    const isMentor = user.role === 'mentor';
    const isTeacher = user.role === 'teacher';

    // Prepare update data
    let updateData: any = {
      pilot_school_id: parseInt(pilot_school_id),
      subject: normalizedSubject,  // Use normalized English value
      holding_classes: normalizedClass,  // Use normalized English value
      phone: phone || null,
      province: school?.province || null,
      district: school?.district || null,
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
        updateData.onboarding_completed_at = new Date();
      }
    }

    // Update user profile in unified users table
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData
    });

    console.log('✅ Updated user successfully:', updatedUser.id);
    console.log('✅ Onboarding marked complete:', wasFirstTime);

    // Auto-create MentorSchoolAssignment records for mentors
    if (isMentor && pilot_school_id) {
      // Map subject from user profile format to assignment format
      const subjectMapping: Record<string, string[]> = {
        'khmer': ['Language'],
        'math': ['Math'],
        'both': ['Language', 'Math']
      };

      const assignmentSubjects = subjectMapping[normalizedSubject] || [];

      for (const assignmentSubject of assignmentSubjects) {
        try {
          // Check if assignment already exists
          const existingAssignment = await prisma.mentor_school_assignments.findFirst({
            where: {
              mentor_id: userId,
              pilot_school_id: parseInt(pilot_school_id),
              subject: assignmentSubject,
            }
          });

          if (!existingAssignment) {
            // Create new assignment
            await prisma.mentor_school_assignments.create({
              data: {
                mentor_id: userId,
                pilot_school_id: parseInt(pilot_school_id),
                subject: assignmentSubject,
                assigned_by_id: userId, // Self-assigned
                notes: 'Auto-created from profile setup',
                is_active: true,
              }
            });

            console.log(`✅ Created mentor assignment: ${assignmentSubject} at school ${pilot_school_id}`);
          } else {
            console.log(`ℹ️ Assignment already exists: ${assignmentSubject} at school ${pilot_school_id}`);
          }
        } catch (assignmentError: any) {
          console.error(`❌ Error creating mentor assignment for ${assignmentSubject}:`, assignmentError.message);
          // Don't fail the whole profile update if assignment creation fails
        }
      }
    }

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        pilot_school_id: updatedUser.pilot_school_id,
        subject: updatedUser.subject,
        holding_classes: updatedUser.holding_classes,
        province: updatedUser.province,
        district: updatedUser.district,
        onboarding_completed: updatedUser.onboarding_completed
      }
    });

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