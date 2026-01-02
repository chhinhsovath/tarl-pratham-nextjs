import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Soft Delete Student API
 * DELETE /api/students/[id]/soft-delete
 * Only Admin and Coordinator can soft-delete students
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

    // Authorization check - admin, coordinator, mentor, and teacher can soft-delete
    const userRole = (session.user as any).role;
    if (!['admin', 'coordinator', 'mentor', 'teacher'].includes(userRole)) {
      return NextResponse.json(
        {
          error: 'ការចូលប្រើត្រូវបានបដិសេធ។',
          message: 'អ្នកមិនមានសិទ្ធិលុបសិស្សទេ។'
        },
        { status: 403 }
      );
    }

    const studentId = parseInt(params.id);
    if (isNaN(studentId)) {
      return NextResponse.json(
        { error: 'លេខសម្គាល់សិស្សមិនត្រឹមត្រូវ។' },
        { status: 400 }
      );
    }

    // Check if student exists
    const student = await prisma.students.findUnique({
      where: { id: studentId },
      include: {
        pilot_school: true,
        assessments: {
          where: {
            record_status: 'production',
          },
        },
      },
    });

    if (!student) {
      return NextResponse.json(
        { error: 'រកមិនឃើញសិស្ស។' },
        { status: 404 }
      );
    }

    // Check if student is already deleted
    if (!student.is_active || student.record_status === 'archived') {
      return NextResponse.json(
        {
          error: 'សិស្សត្រូវបានលុបរួចហើយ។',
          message: `សិស្ស ${student.name} ត្រូវបានលុបពីមុនមកហើយ។`
        },
        { status: 400 }
      );
    }

    console.log(`[Soft Delete] User ${session.user.email} (${userRole}) deleting student ID ${studentId}: ${student.name}`);

    // Soft delete the student
    const updatedStudent = await prisma.students.update({
      where: { id: studentId },
      data: {
        is_active: false,
        record_status: 'archived',
        updated_at: new Date(),
      },
    });

    // Also soft delete all related assessments
    if (student.assessments.length > 0) {
      await prisma.assessments.updateMany({
        where: {
          student_id: studentId,
          record_status: 'production',
        },
        data: {
          record_status: 'archived',
          updated_at: new Date(),
        },
      });
      console.log(`[Soft Delete] Also archived ${student.assessments.length} assessments for student ${studentId}`);
    }

    console.log(`[Soft Delete] Successfully soft-deleted student ${studentId}: ${student.name}`);
    console.log(`[Soft Delete] School: ${student.pilot_schools?.school_name || 'N/A'}`);
    console.log(`[Soft Delete] Related assessments archived: ${student.assessments.length}`);

    return NextResponse.json({
      success: true,
      message: `សិស្ស ${student.name} ត្រូវបានលុបដោយជោគជ័យ។`,
      data: {
        student_id: updatedStudent.id,
        student_name: updatedStudent.name,
        school: student.pilot_schools?.school_name,
        assessments_archived: student.assessments.length,
        deleted_at: new Date().toISOString(),
        deleted_by: session.user.email,
      },
    });
  } catch (error: any) {
    console.error('[Soft Delete Student] Error:', error);
    return NextResponse.json(
      {
        error: 'បរាជ័យក្នុងការលុបសិស្ស។',
        message: error.message,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
