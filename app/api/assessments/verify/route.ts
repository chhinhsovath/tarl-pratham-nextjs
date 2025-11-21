import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getMentorSchoolIds } from '@/lib/mentorAssignments';

/**
 * GET /api/assessments/verify
 * Get assessments that need verification (temporary assessments)
 * Only accessible by admin and coordinator
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'សូមចូលប្រើប្រាស់ប្រព័ន្ធជាមុនសិន' },
        { status: 401 }
      );
    }

    // Only admin, coordinator, and mentor can verify assessments
    if (!['admin', 'coordinator', 'mentor'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'អ្នកមិនមានសិទ្ធិចូលទៅទំព័រនេះទេ' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status') || 'pending'; // pending, verified, rejected
    const assessment_type = searchParams.get('assessment_type') || '';
    const subject = searchParams.get('subject') || '';
    const search = searchParams.get('search') || '';

    const skip = (page - 1) * limit;

    // Build where clause
    // All data is production now - query for unverified teacher assessments
    const where: any = {
      // Only show original assessments (not verification re-assessments)
      mentor_assessment_id: null,
      // Only show assessments created by teachers (mentors verify teacher work)
      created_by_role: 'teacher'
    };

    // If mentor, filter by assigned schools only
    if (session.user.role === 'mentor') {
      const mentorSchoolIds = await getMentorSchoolIds(parseInt(session.user.id));
      if (mentorSchoolIds.length > 0) {
        where.pilot_school_id = { in: mentorSchoolIds };
      } else {
        // Mentor has no assigned schools, return empty result
        return NextResponse.json({
          assessments: [],
          pagination: { page, limit, total: 0, pages: 0 },
          statistics: { pending: 0, verified: 0, rejected: 0, total: 0 }
        });
      }
    }

    // Filter by verification status
    if (status === 'verified') {
      // Verified: has verification timestamp and not rejected
      where.verified_at = { not: null };
      // Exclude rejected: verification_notes either null or doesn't contain "Rejected"
      where.NOT = {
        verification_notes: { contains: 'Rejected', mode: 'insensitive' }
      };
    } else if (status === 'rejected') {
      // Rejected: has verification timestamp with rejection note
      where.verified_at = { not: null };
      where.verification_notes = { contains: 'Rejected', mode: 'insensitive' };
    } else if (status === 'pending') {
      // Pending: not verified yet
      where.verified_at = null;
    }

    // Additional filters
    if (assessment_type) {
      where.assessment_type = assessment_type;
    }

    if (subject) {
      where.subject = subject;
    }

    if (search) {
      where.OR = [
        {
          student: {
            name: { contains: search, mode: 'insensitive' }
          }
        },
        {
          notes: { contains: search, mode: 'insensitive' }
        }
      ];
    }

    // Fetch assessments with related data
    const [assessments, total] = await Promise.all([
      prisma.assessment.findMany({
        where,
        include: {
          student: {
            select: {
              id: true,
              student_id: true,
              name: true,
              gender: true,
              age: true,
              is_temporary: true
            }
          },
          pilot_school: {
            select: {
              id: true,
              school_name: true,
              school_code: true
            }
          },
          added_by: {
            select: {
              id: true,
              name: true,
              role: true
            }
          }
        },
        skip,
        take: limit,
        orderBy: { created_at: 'desc' }
      }),
      prisma.assessment.count({ where })
    ]);

    // Get statistics
    let baseWhere: any = {
      // Only count original teacher assessments (not verification re-assessments)
      mentor_assessment_id: null,
      created_by_role: 'teacher'
    };

    if (session.user.role === 'mentor') {
      const mentorSchoolIds = await getMentorSchoolIds(parseInt(session.user.id));
      if (mentorSchoolIds.length > 0) {
        baseWhere.pilot_school_id = { in: mentorSchoolIds };
      } else {
        baseWhere = { id: -1 };
      }
    }

    const [pendingCount, verifiedCount, rejectedCount] = await Promise.all([
      // Pending: not verified yet
      prisma.assessment.count({
        where: {
          ...baseWhere,
          verified_at: null
        }
      }),
      // Verified: has verification timestamp (not rejected)
      prisma.assessment.count({
        where: {
          ...baseWhere,
          verified_at: { not: null },
          NOT: {
            verification_notes: { contains: 'Rejected', mode: 'insensitive' }
          }
        }
      }),
      // Rejected: verified with rejection note
      prisma.assessment.count({
        where: {
          ...baseWhere,
          verified_at: { not: null },
          verification_notes: { contains: 'Rejected', mode: 'insensitive' }
        }
      })
    ]);

    const statistics = {
      pending: pendingCount,
      verified: verifiedCount,
      rejected: rejectedCount,
      total: pendingCount + verifiedCount + rejectedCount
    };

    return NextResponse.json({
      assessments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      statistics
    });

  } catch (error) {
    console.error('Error fetching verification assessments:', error);
    return NextResponse.json(
      {
        error: 'មានបញ្ហាក្នុងការទាញយកទិន្នន័យ',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/assessments/verify
 * Approve or reject assessments (mark as permanent or reject)
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'សូមចូលប្រើប្រាស់ប្រព័ន្ធជាមុនសិន' },
        { status: 401 }
      );
    }

    // Only admin, coordinator, and mentor can verify assessments
    if (!['admin', 'coordinator', 'mentor'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'អ្នកមិនមានសិទ្ធិផ្ទៀងផ្ទាត់ទិន្នន័យ' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { assessment_ids, action, notes } = body;

    if (!assessment_ids || !Array.isArray(assessment_ids) || assessment_ids.length === 0) {
      return NextResponse.json(
        { error: 'សូមជ្រើសរើសការវាយតម្លៃយ៉ាងហោចណាស់មួយ' },
        { status: 400 }
      );
    }

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: 'សកម្មភាពមិនត្រឹមត្រូវ' },
        { status: 400 }
      );
    }

    // Perform action
    const result = await prisma.$transaction(async (tx) => {
      if (action === 'approve') {
        // Mark as verified (approved)
        const updated = await tx.assessment.updateMany({
          where: { id: { in: assessment_ids } },
          data: {
            verified_by_id: parseInt(session.user.id),
            verified_at: new Date(),
            verification_notes: notes || 'Approved'
          }
        });

        return { approved: updated.count };
      } else {
        // Reject - mark as verified with rejection note
        const rejectionNote = notes ? `Rejected: ${notes}` : 'Rejected';
        const updated = await tx.assessment.updateMany({
          where: { id: { in: assessment_ids } },
          data: {
            verified_by_id: parseInt(session.user.id),
            verified_at: new Date(),
            verification_notes: rejectionNote
          }
        });

        return { rejected: updated.count };
      }
    });

    return NextResponse.json({
      success: true,
      message: action === 'approve'
        ? `បានអនុម័ត ${result.approved} ការវាយតម្លៃ`
        : `បានបដិសេធ ${result.rejected} ការវាយតម្លៃ`,
      result
    });

  } catch (error) {
    console.error('Error verifying assessments:', error);
    return NextResponse.json(
      {
        error: 'មានបញ្ហាក្នុងការផ្ទៀងផ្ទាត់ទិន្នន័យ',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
