import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Soft Delete Assessment API
 * DELETE /api/assessments/[id]/soft-delete
 * Only Admin and Coordinator can soft-delete assessments
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authentication check
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'មិនមានការអនុញ្ញាត។ សូមចូលប្រើប្រាស់ជាមុនសិន។' },
        { status: 401 }
      );
    }

    const userRole = (session.user as any).role;
    const userId = parseInt((session.user as any).id);

    const assessmentId = parseInt(params.id);
    if (isNaN(assessmentId)) {
      return NextResponse.json(
        { error: 'លេខសម្គាល់ការវាយតម្លៃមិនត្រឹមត្រូវ។' },
        { status: 400 }
      );
    }

    // Check if assessment exists
    const assessment = await prisma.assessments.findUnique({
      where: { id: assessmentId },
      include: {
        students: {
          include: {
            pilot_schools: true,
          },
        },
        users_assessments_added_by_idTousers: true,
      },
    });

    if (!assessment) {
      return NextResponse.json(
        { error: 'រកមិនឃើញការវាយតម្លៃ។' },
        { status: 404 }
      );
    }

    // Authorization check - admin/coordinator can delete any, others can only delete their own
    const isAdminOrCoordinator = ['admin', 'coordinator'].includes(userRole);
    const isOwner = assessment.added_by_id === userId;

    if (!isAdminOrCoordinator && !isOwner) {
      return NextResponse.json(
        {
          error: 'ការចូលប្រើត្រូវបានបដិសេធ។',
          message: 'អ្នកអាចលុបបានតែការវាយតម្លៃដែលអ្នកបានបង្កើតដោយខ្លួនឯងប៉ុណ្ណោះ។'
        },
        { status: 403 }
      );
    }

    // Check if assessment is already deleted
    if (assessment.record_status === 'archived') {
      return NextResponse.json(
        {
          error: 'ការវាយតម្លៃត្រូវបានលុបរួចហើយ។',
          message: `ការវាយតម្លៃសម្រាប់សិស្ស ${assessment.students.name} ត្រូវបានលុបពីមុនមកហើយ។`
        },
        { status: 400 }
      );
    }

    // Check if assessment is locked
    if (assessment.is_locked) {
      return NextResponse.json(
        {
          error: 'ការវាយតម្លៃត្រូវបានចាក់សោ។',
          message: 'សូមដោះសោការវាយតម្លៃជាមុនសិនមុនពេលលុប។'
        },
        { status: 400 }
      );
    }

    console.log(`[Soft Delete] User ${session.user.email} (${userRole}) deleting assessment ID ${assessmentId}`);
    console.log(`[Soft Delete] Assessment type: ${assessment.assessment_type}, Subject: ${assessment.subject}`);
    console.log(`[Soft Delete] Student: ${assessment.students.name}, School: ${assessment.students.pilot_schools?.school_name || 'N/A'}`);

    // Soft delete the assessment
    const updatedAssessment = await prisma.assessments.update({
      where: { id: assessmentId },
      data: {
        record_status: 'archived',
        updated_at: new Date(),
      },
    });

    console.log(`[Soft Delete] Successfully soft-deleted assessment ${assessmentId}`);

    return NextResponse.json({
      success: true,
      message: `ការវាយតម្លៃសម្រាប់សិស្ស ${assessment.students.name} ត្រូវបានលុបដោយជោគជ័យ។`,
      data: {
        assessment_id: updatedAssessment.id,
        assessment_type: updatedAssessment.assessment_type,
        subject: updatedAssessment.subject,
        student_name: assessment.students.name,
        school: assessment.students.pilot_schools?.school_name,
        deleted_at: new Date().toISOString(),
        deleted_by: session.user.email,
      },
    });
  } catch (error: any) {
    console.error('[Soft Delete Assessment] Error:', error);
    return NextResponse.json(
      {
        error: 'បរាជ័យក្នុងការលុបការវាយតម្លៃ។',
        message: error.message,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
