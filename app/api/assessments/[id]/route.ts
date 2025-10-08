import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Helper function to check permissions
function hasPermission(userRole: string, action: string): boolean {
  const permissions = {
    admin: ["view", "create", "update", "delete"],
    coordinator: ["view", "create", "update", "delete"],
    mentor: ["view", "create", "update"],
    teacher: ["view", "create", "update"],
    viewer: ["view"]
  };

  return permissions[userRole as keyof typeof permissions]?.includes(action) || false;
}

// Helper function to check if user can access assessment data
function canAccessAssessment(userRole: string, userPilotSchoolId: number | null, assessmentPilotSchoolId: number | null): boolean {
  if (userRole === "admin" || userRole === "coordinator") {
    return true;
  }

  if ((userRole === "mentor" || userRole === "teacher") && userPilotSchoolId) {
    return assessmentPilotSchoolId === userPilotSchoolId;
  }

  return false;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!hasPermission(session.user.role, "view")) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const assessmentId = parseInt(params.id);

    if (isNaN(assessmentId)) {
      return NextResponse.json({ error: 'Invalid assessment ID' }, { status: 400 });
    }

    const assessment = await prisma.assessment.findUnique({
      where: { id: assessmentId },
      include: {
        student: {
          include: {
            school_class: {
              include: {
                school: {
                  select: { name: true }
                }
              }
            },
            pilot_school: {
              select: { school_name: true, school_code: true }
            }
          }
        },
        pilot_school: {
          select: { school_name: true, school_code: true }
        },
        added_by: {
          select: { name: true, role: true }
        },
        assessment_histories: {
          orderBy: { created_at: 'desc' }
        }
      }
    });

    if (!assessment) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
    }

    // Check if user can access this assessment
    if (!canAccessAssessment(session.user.role, session.user.pilot_school_id, assessment.pilot_school_id)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({ assessment });

  } catch (error) {
    console.error('Assessment fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch assessment' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!hasPermission(session.user.role, "update")) {
      return NextResponse.json({ error: 'Forbidden - No update permission' }, { status: 403 });
    }

    const assessmentId = parseInt(params.id);
    const body = await request.json();

    if (isNaN(assessmentId)) {
      return NextResponse.json({ error: 'Invalid assessment ID' }, { status: 400 });
    }

    const {
      student_id,
      assessment_type,
      subject,
      level,
      notes,
      assessed_date,
      assessment_sample,
      student_consent
    } = body;

    // Check if assessment exists
    const existingAssessment = await prisma.assessment.findUnique({
      where: { id: assessmentId },
      select: {
        id: true,
        pilot_school_id: true,
        student_id: true,
        assessment_type: true,
        subject: true,
        level: true,
        notes: true,
        assessed_date: true,
        assessment_sample: true,
        student_consent: true,
        is_locked: true,
        verified_by_id: true
      }
    });

    if (!existingAssessment) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
    }

    // Check if user can access this assessment
    if (!canAccessAssessment(session.user.role, session.user.pilot_school_id, existingAssessment.pilot_school_id)) {
      return NextResponse.json({ error: 'Forbidden - Cannot update assessments from other schools' }, { status: 403 });
    }

    // Teachers can only update unverified and unlocked assessments
    if (session.user.role === 'teacher') {
      if (existingAssessment.is_locked || existingAssessment.verified_by_id) {
        return NextResponse.json({
          error: 'មិនអាចកែប្រែការវាយតម្លៃបានទេ ព្រោះការវាយតម្លៃនេះត្រូវបានផ្ទៀងផ្ទាត់ ឬចាក់សោរួចហើយ។ សូមទាក់ទងអ្នកគ្រប់គ្រងប្រសិនបើចង់កែប្រែ។',
          message: 'Cannot update verified or locked assessment. Only admins and coordinators can update verified/locked assessments.'
        }, { status: 403 });
      }
    }

    // Update assessment
    const updatedAssessment = await prisma.assessment.update({
      where: { id: assessmentId },
      data: {
        student_id: student_id || existingAssessment.student_id,
        assessment_type: assessment_type || existingAssessment.assessment_type,
        subject: subject || existingAssessment.subject,
        level: level || existingAssessment.level,
        notes: notes !== undefined ? notes : existingAssessment.notes,
        assessed_date: assessed_date ? new Date(assessed_date) : existingAssessment.assessed_date,
        assessment_sample: assessment_sample || existingAssessment.assessment_sample,
        student_consent: student_consent || existingAssessment.student_consent,
        updated_at: new Date()
      },
      include: {
        student: {
          select: { name: true }
        },
        added_by: {
          select: { name: true, role: true }
        },
        pilot_school: {
          select: { school_name: true }
        }
      }
    });

    // Create history record
    await prisma.assessmentHistory.create({
      data: {
        assessment_id: assessmentId,
        field_name: 'updated',
        old_value: JSON.stringify({
          student_id: existingAssessment.student_id,
          assessment_type: existingAssessment.assessment_type,
          subject: existingAssessment.subject,
          level: existingAssessment.level,
          notes: existingAssessment.notes,
          assessed_date: existingAssessment.assessed_date,
          assessment_sample: existingAssessment.assessment_sample,
          student_consent: existingAssessment.student_consent
        }),
        new_value: JSON.stringify({
          student_id: updatedAssessment.student_id,
          assessment_type: updatedAssessment.assessment_type,
          subject: updatedAssessment.subject,
          level: updatedAssessment.level,
          notes: updatedAssessment.notes,
          assessed_date: updatedAssessment.assessed_date,
          assessment_sample: updatedAssessment.assessment_sample,
          student_consent: updatedAssessment.student_consent
        }),
        changed_by: parseInt(session.user.id)
      }
    });

    // Update student level field
    if (level && level !== existingAssessment.level) {
      const levelUpdateField = `${updatedAssessment.assessment_type}_${updatedAssessment.subject}_level`;
      await prisma.student.update({
        where: { id: updatedAssessment.student_id },
        data: {
          [levelUpdateField]: level
        }
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Assessment updated successfully',
      assessment: updatedAssessment
    });

  } catch (error) {
    console.error('Assessment update error:', error);
    return NextResponse.json(
      { error: 'Failed to update assessment' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check permissions - only admin and coordinator can delete
    if (!hasPermission(session.user.role, "delete")) {
      return NextResponse.json({
        error: 'Forbidden - Only admins and coordinators can delete assessments'
      }, { status: 403 });
    }

    const assessmentId = parseInt(params.id);

    if (isNaN(assessmentId)) {
      return NextResponse.json({ error: 'Invalid assessment ID' }, { status: 400 });
    }

    // Check if assessment exists
    const existingAssessment = await prisma.assessment.findUnique({
      where: { id: assessmentId },
      select: { pilot_school_id: true }
    });

    if (!existingAssessment) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
    }

    // Check if user can access this assessment
    if (!canAccessAssessment(session.user.role, session.user.pilot_school_id, existingAssessment.pilot_school_id)) {
      return NextResponse.json({ error: 'Forbidden - Cannot delete assessments from other schools' }, { status: 403 });
    }

    // Delete assessment histories first
    await prisma.assessmentHistory.deleteMany({
      where: { assessment_id: assessmentId }
    });

    // Delete assessment
    await prisma.assessment.delete({
      where: { id: assessmentId }
    });

    return NextResponse.json({
      success: true,
      message: 'Assessment deleted successfully'
    });

  } catch (error) {
    console.error('Assessment deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete assessment' },
      { status: 500 }
    );
  }
}