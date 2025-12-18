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

    // Authorization check - only admin and coordinator
    const userRole = (session.user as any).role;
    if (!['admin', 'coordinator'].includes(userRole)) {
      return NextResponse.json(
        {
          error: 'ការចូលប្រើត្រូវបានបដិសេធ។',
          message: 'មានតែអ្នកគ្រប់គ្រងប្រព័ន្ធ និងអ្នកសម្របសម្រួលទេដែលអាចលុបការវាយតម្លៃបាន។'
        },
        { status: 403 }
      );
    }

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
        student: {
          include: {
            pilot_school: true,
          },
        },
        added_by: true,
      },
    });

    if (!assessment) {
      return NextResponse.json(
        { error: 'រកមិនឃើញការវាយតម្លៃ។' },
        { status: 404 }
      );
    }

    // Check if assessment is already deleted
    if (assessment.record_status === 'archived') {
      return NextResponse.json(
        {
          error: 'ការវាយតម្លៃត្រូវបានលុបរួចហើយ។',
          message: `ការវាយតម្លៃសម្រាប់សិស្ស ${assessment.student.name} ត្រូវបានលុបពីមុនមកហើយ។`
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
    console.log(`[Soft Delete] Student: ${assessment.student.name}, School: ${assessment.student.pilot_school?.school_name || 'N/A'}`);

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
      message: `ការវាយតម្លៃសម្រាប់សិស្ស ${assessment.student.name} ត្រូវបានលុបដោយជោគជ័យ។`,
      data: {
        assessment_id: updatedAssessment.id,
        assessment_type: updatedAssessment.assessment_type,
        subject: updatedAssessment.subject,
        student_name: assessment.student.name,
        school: assessment.student.pilot_school?.school_name,
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
