import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Soft Delete Mentoring Visit API
 * DELETE /api/mentoring-visits/[id]/soft-delete
 * Only Admin and Coordinator can soft-delete mentoring visits
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
          message: 'មានតែអ្នកគ្រប់គ្រងប្រព័ន្ធ និងអ្នកសម្របសម្រួលទេដែលអាចលុបការណែនាំបាន។'
        },
        { status: 403 }
      );
    }

    const visitId = parseInt(params.id);
    if (isNaN(visitId)) {
      return NextResponse.json(
        { error: 'លេខសម្គាល់ការណែនាំមិនត្រឹមត្រូវ។' },
        { status: 400 }
      );
    }

    // Check if mentoring visit exists
    const visit = await prisma.mentoring_visits.findUnique({
      where: { id: visitId },
      include: {
        mentor: true,
        teacher: true,
        pilot_school: true,
      },
    });

    if (!visit) {
      return NextResponse.json(
        { error: 'រកមិនឃើញការណែនាំ។' },
        { status: 404 }
      );
    }

    // Check if visit is already deleted
    if (visit.record_status === 'archived') {
      return NextResponse.json(
        {
          error: 'ការណែនាំត្រូវបានលុបរួចហើយ។',
          message: `ការណែនាំនៅថ្ងៃទី ${new Date(visit.visit_date).toLocaleDateString('km-KH')} ត្រូវបានលុបពីមុនមកហើយ។`
        },
        { status: 400 }
      );
    }

    // Check if visit is locked
    if (visit.is_locked) {
      return NextResponse.json(
        {
          error: 'ការណែនាំត្រូវបានចាក់សោ។',
          message: 'សូមដោះសោការណែនាំជាមុនសិនមុនពេលលុប។'
        },
        { status: 400 }
      );
    }

    console.log(`[Soft Delete] User ${session.user.email} (${userRole}) deleting mentoring visit ID ${visitId}`);
    console.log(`[Soft Delete] Visit date: ${visit.visit_date}`);
    console.log(`[Soft Delete] Mentor: ${visit.mentor.name}, Teacher: ${visit.teacher?.name || 'N/A'}`);
    console.log(`[Soft Delete] School: ${visit.pilot_schools?.school_name || 'N/A'}`);

    // Soft delete the mentoring visit
    const updatedVisit = await prisma.mentoring_visits.update({
      where: { id: visitId },
      data: {
        record_status: 'archived',
        updated_at: new Date(),
      },
    });

    console.log(`[Soft Delete] Successfully soft-deleted mentoring visit ${visitId}`);

    return NextResponse.json({
      success: true,
      message: `ការណែនាំនៅថ្ងៃទី ${new Date(visit.visit_date).toLocaleDateString('km-KH')} ត្រូវបានលុបដោយជោគជ័យ។`,
      data: {
        visit_id: updatedVisit.id,
        visit_date: visit.visit_date,
        mentor: visit.mentor.name,
        teacher: visit.teacher?.name,
        school: visit.pilot_schools?.school_name,
        deleted_at: new Date().toISOString(),
        deleted_by: session.user.email,
      },
    });
  } catch (error: any) {
    console.error('[Soft Delete Mentoring Visit] Error:', error);
    return NextResponse.json(
      {
        error: 'បរាជ័យក្នុងការលុបការណែនាំ។',
        message: error.message,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
