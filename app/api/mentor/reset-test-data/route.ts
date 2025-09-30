import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * POST /api/mentor/reset-test-data
 * Manually reset all test data created by the current mentor
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Check authentication
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized - Please login first' },
        { status: 401 }
      );
    }

    // Check role - only mentors can reset test data
    if (session.user.role !== 'mentor') {
      return NextResponse.json(
        { error: 'Only mentors can reset test data' },
        { status: 403 }
      );
    }

    const mentorId = parseInt(session.user.id);

    // Count records before deletion
    const [
      assessmentCount,
      studentCount,
      mentoringVisitCount
    ] = await Promise.all([
      prisma.assessment.count({
        where: {
          record_status: 'test_mentor',
          added_by_id: mentorId
        }
      }),
      prisma.student.count({
        where: {
          record_status: 'test_mentor',
          added_by_id: mentorId
        }
      }),
      prisma.mentoringVisit.count({
        where: {
          record_status: 'test_mentor',
          mentor_id: mentorId
        }
      })
    ]);

    // Delete test data in correct order (respecting foreign keys)
    await prisma.$transaction([
      // 1. Delete assessments first (they reference students)
      prisma.assessment.deleteMany({
        where: {
          record_status: 'test_mentor',
          added_by_id: mentorId
        }
      }),

      // 2. Delete students
      prisma.student.deleteMany({
        where: {
          record_status: 'test_mentor',
          added_by_id: mentorId
        }
      }),

      // 3. Delete mentoring visits
      prisma.mentoringVisit.deleteMany({
        where: {
          record_status: 'test_mentor',
          mentor_id: mentorId
        }
      })
    ]);

    return NextResponse.json({
      success: true,
      message: 'បានលុបទិន្នន័យសាកល្បងដោយជោគជ័យ',
      deleted: {
        assessments: assessmentCount,
        students: studentCount,
        mentoring_visits: mentoringVisitCount,
        total: assessmentCount + studentCount + mentoringVisitCount
      }
    });

  } catch (error) {
    console.error('Reset test data error:', error);
    return NextResponse.json(
      {
        error: 'មានបញ្ហាក្នុងការលុបទិន្នន័យសាកល្បង',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}