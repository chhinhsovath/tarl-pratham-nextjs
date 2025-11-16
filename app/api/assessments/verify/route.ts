import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getMentorSchoolIds } from '@/lib/mentorAssignments';

/**
 * GET /api/assessments/verify
 * Get assessments that need verification (temporary assessments)
 * Only accessible by admin, coordinator, and mentor
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
    const where: any = {
      is_temporary: true
    };

    // Mentors can only verify assessments from their assigned schools
    if (session.user.role === 'mentor') {
      const mentorSchoolIds = await getMentorSchoolIds(parseInt(session.user.id));
      if (mentorSchoolIds.length > 0) {
        where.pilot_school_id = { in: mentorSchoolIds };
      } else {
        // No schools assigned to this mentor - return no assessments
        where.id = -1;
      }
    }

    // Filter by verification status
    if (status === 'verified') {
      where.is_temporary = false;
      where.verified_at = { not: null };
    } else if (status === 'rejected') {
      // Rejected assessments: verified but still temporary (rejected means not approved)
      where.is_temporary = true;
      where.verified_at = { not: null };
      where.verification_notes = { contains: 'Rejected', mode: 'insensitive' };
    } else if (status === 'pending') {
      // Pending: temporary and not verified yet
      where.is_temporary = true;
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
    let baseWhere: any = {};
    if (session.user.role === 'mentor') {
      const mentorSchoolIds = await getMentorSchoolIds(parseInt(session.user.id));
      if (mentorSchoolIds.length > 0) {
        baseWhere = { pilot_school_id: { in: mentorSchoolIds } };
      } else {
        baseWhere = { id: -1 };
      }
    }

    const [pendingCount, verifiedCount, rejectedCount] = await Promise.all([
      // Pending: temporary and not verified
      prisma.assessment.count({
        where: {
          ...baseWhere,
          is_temporary: true,
          verified_at: null
        }
      }),
      // Verified: not temporary and verified
      prisma.assessment.count({
        where: {
          ...baseWhere,
          is_temporary: false,
          verified_at: { not: null }
        }
      }),
      // Rejected: temporary but verified with rejection note
      prisma.assessment.count({
        where: {
          ...baseWhere,
          is_temporary: true,
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

    // Verify mentor can only verify assessments from their assigned schools
    if (session.user.role === 'mentor') {
      const mentorSchoolIds = await getMentorSchoolIds(parseInt(session.user.id));
      const assessmentCheck = await prisma.assessment.findMany({
        where: {
          id: { in: assessment_ids },
          pilot_school_id: { notIn: mentorSchoolIds }
        },
        select: { id: true }
      });

      if (assessmentCheck.length > 0) {
        return NextResponse.json(
          { error: 'អ្នកមិនអាចផ្ទៀងផ្ទាត់ការវាយតម្លៃពីសាលាផ្សេងបានទេ' },
          { status: 403 }
        );
      }
    }

    // Perform action
    const result = await prisma.$transaction(async (tx) => {
      if (action === 'approve') {
        // Mark as permanent (production)
        const updated = await tx.assessment.updateMany({
          where: { id: { in: assessment_ids } },
          data: {
            is_temporary: false,
            record_status: 'production',
            verified_by_id: parseInt(session.user.id),
            verified_at: new Date(),
            verification_notes: notes || null
          }
        });

        // Also mark related students as permanent if all their assessments are verified
        const assessments = await tx.assessment.findMany({
          where: { id: { in: assessment_ids } },
          select: { student_id: true }
        });

        const studentIds = [...new Set(assessments.map(a => a.student_id))];

        for (const studentId of studentIds) {
          const pendingAssessments = await tx.assessment.count({
            where: {
              student_id: studentId,
              is_temporary: true
            }
          });

          if (pendingAssessments === 0) {
            await tx.student.update({
              where: { id: studentId },
              data: {
                is_temporary: false,
                record_status: 'production'
              }
            });
          }
        }

        return { approved: updated.count };
      } else {
        // Reject - keep as temporary but mark as verified with rejection note
        const rejectionNote = notes ? `Rejected: ${notes}` : 'Rejected';
        const updated = await tx.assessment.updateMany({
          where: { id: { in: assessment_ids } },
          data: {
            is_temporary: true, // Keep as temporary
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
