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
    const assessment_type = searchParams.get('assessment_type') || '';
    const subject = searchParams.get('subject') || '';
    const search = searchParams.get('search') || '';
    
    // NO PAGINATION - GET ALL RECORDS

    // Build where clause
    // Query for teacher assessments (baseline, midline, endline) to check their verification status
    const where: any = {
      // Show original assessment types (not verification types)
      assessment_type: {
        in: ['baseline', 'midline', 'endline']
      }
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
          pagination: { page: 1, limit: 0, total: 0, pages: 1 },
          statistics: { pending: 0, verified: 0, rejected: 0, total: 0 }
        });
      }
    }

    // GET ALL verification assessments - no status filtering

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

    // First count how many we should get
    const expectedCount = await prisma.assessment.count({ where });
    
    // Fetch ALL assessments with related data - NO LIMIT
    const assessments = await prisma.assessment.findMany({
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
      orderBy: { created_at: 'desc' }
    });
    
    const total = expectedCount;

    // Get statistics
    let baseWhere: any = {
      // Count teacher assessment types and their verification status
      assessment_type: {
        in: ['baseline', 'midline', 'endline']
      }
    };

    if (session.user.role === 'mentor') {
      const mentorSchoolIds = await getMentorSchoolIds(parseInt(session.user.id));
      if (mentorSchoolIds.length > 0) {
        baseWhere.pilot_school_id = { in: mentorSchoolIds };
      } else {
        baseWhere = { id: -1 };
      }
    }

    // Optimized statistics calculation using database aggregation
    const [allTeacherAssessments, allVerificationAssessments] = await Promise.all([
      prisma.assessment.findMany({
        where: baseWhere,
        select: { id: true, assessment_type: true, subject: true, student_id: true }
      }),
      prisma.assessment.findMany({
        where: {
          // Don't spread baseWhere as it has conflicting assessment_type
          assessment_type: {
            in: ['baseline_verification', 'midline_verification', 'endline_verification']
          },
          // Only apply school filtering if mentor
          ...(session.user.role === 'mentor' && baseWhere.pilot_school_id 
            ? { pilot_school_id: baseWhere.pilot_school_id } 
            : {})
        },
        select: { 
          id: true, 
          assessment_type: true, 
          subject: true, 
          student_id: true,
          verification_notes: true 
        }
      })
    ]);

    // Create a map for faster lookup of verification assessments
    const verificationMap = new Map();
    allVerificationAssessments.forEach(verification => {
      const originalType = verification.assessment_type.replace('_verification', '');
      const key = `${verification.student_id}-${originalType}-${verification.subject}`;
      verificationMap.set(key, verification);
    });

    // Calculate statistics
    let pendingCount = 0;
    let verifiedCount = 0;
    let rejectedCount = 0;

    allTeacherAssessments.forEach(assessment => {
      const key = `${assessment.student_id}-${assessment.assessment_type}-${assessment.subject}`;
      const verification = verificationMap.get(key);

      if (verification) {
        if (verification.verification_notes?.toLowerCase().includes('rejected')) {
          rejectedCount++;
        } else {
          verifiedCount++;
        }
      } else {
        pendingCount++;
      }
    });

    const statistics = {
      pending: pendingCount,
      verified: verifiedCount,
      rejected: rejectedCount,
      total: pendingCount + verifiedCount + rejectedCount
    };

    // Always log to help debug the issue
    console.log(`API: Returning ${assessments.length} assessments (expected: ${total})`);

    return NextResponse.json({
      assessments,
      pagination: {
        page: 1,
        limit: total,
        total: total,
        pages: 1
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
