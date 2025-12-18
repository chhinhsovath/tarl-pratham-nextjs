import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * POST /api/test-data/promote-to-production
 * Promote test data to production status
 * This converts test_mentor or test_teacher data to production data
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

    // Only admins, coordinators, and mentors can promote data to production
    if (!['admin', 'coordinator', 'mentor'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'អ្នកមិនមានសិទ្ធិផ្លាស់ប្តូរទិន្នន័យទៅផលិតកម្ម' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      test_session_id,
      user_id,
      record_status,
      student_ids,
      assessment_ids,
      mentoring_visit_ids
    } = body;

    // Build where clauses based on provided filters
    const studentWhere: any = {};
    const assessmentWhere: any = {};
    const mentoringVisitWhere: any = {};

    // Filter by specific IDs (most specific)
    if (student_ids && Array.isArray(student_ids) && student_ids.length > 0) {
      studentWhere.id = { in: student_ids };
    } else if (test_session_id) {
      // Filter by session
      studentWhere.test_session_id = test_session_id;
      assessmentWhere.test_session_id = test_session_id;
      mentoringVisitWhere.test_session_id = test_session_id;
    } else if (user_id) {
      // Filter by user
      const targetUserId = parseInt(user_id);
      studentWhere.added_by_id = targetUserId;
      assessmentWhere.added_by_id = targetUserId;
      mentoringVisitWhere.mentor_id = targetUserId;
    } else if (record_status) {
      // Filter by status
      studentWhere.record_status = record_status;
      assessmentWhere.record_status = record_status;
      mentoringVisitWhere.record_status = record_status;
    } else {
      return NextResponse.json(
        { error: 'ត្រូវការផ្តល់ test_session_id, user_id, record_status, ឬ IDs ជាក់លាក់' },
        { status: 400 }
      );
    }

    // Ensure we're only promoting test data
    if (!student_ids) {
      studentWhere.record_status = studentWhere.record_status || { in: ['test_mentor', 'test_teacher'] };
      assessmentWhere.record_status = assessmentWhere.record_status || { in: ['test_mentor', 'test_teacher'] };
      mentoringVisitWhere.record_status = mentoringVisitWhere.record_status || { in: ['test_mentor', 'test_teacher'] };
    }

    if (assessment_ids && Array.isArray(assessment_ids) && assessment_ids.length > 0) {
      assessmentWhere.id = { in: assessment_ids };
    }

    if (mentoring_visit_ids && Array.isArray(mentoring_visit_ids) && mentoring_visit_ids.length > 0) {
      mentoringVisitWhere.id = { in: mentoring_visit_ids };
    }

    // Count records before promotion
    const [studentCount, assessmentCount, mentoringVisitCount] = await Promise.all([
      prisma.students.count({ where: studentWhere }),
      prisma.assessments.count({ where: assessmentWhere }),
      prisma.mentoringVisit.count({ where: mentoringVisitWhere })
    ]);

    if (studentCount === 0 && assessmentCount === 0 && mentoringVisitCount === 0) {
      return NextResponse.json(
        { error: 'រកមិនឃើញទិន្នន័យសាកល្បងដែលត្រូវផ្លាស់ប្តូរ' },
        { status: 404 }
      );
    }

    // Perform promotion in transaction
    const result = await prisma.$transaction(async (tx) => {
      const updates = [];

      // Promote students
      if (studentCount > 0) {
        updates.push(
          tx.students.updateMany({
            where: studentWhere,
            data: {
              record_status: 'production',
              is_temporary: false,
              test_session_id: null
            }
          })
        );
      }

      // Promote assessments
      if (assessmentCount > 0) {
        updates.push(
          tx.assessment.updateMany({
            where: assessmentWhere,
            data: {
              record_status: 'production',
              is_temporary: false,
              test_session_id: null
            }
          })
        );
      }

      // Promote mentoring visits
      if (mentoringVisitCount > 0) {
        updates.push(
          tx.mentoringVisit.updateMany({
            where: mentoringVisitWhere,
            data: {
              record_status: 'production',
              is_temporary: false,
              test_session_id: null
            }
          })
        );
      }

      await Promise.all(updates);

      return {
        students: studentCount,
        assessments: assessmentCount,
        mentoring_visits: mentoringVisitCount
      };
    });

    // If promoting by session, mark session as completed
    if (test_session_id) {
      await prisma.testSession.update({
        where: { id: test_session_id },
        data: {
          status: 'completed',
          student_count: 0,
          assessment_count: 0,
          mentoring_visit_count: 0
        }
      });
    }

    return NextResponse.json({
      success: true,
      message: 'បានផ្លាស់ប្តូរទិន្នន័យទៅផលិតកម្មដោយជោគជ័យ',
      promoted: {
        students: result.students,
        assessments: result.assessments,
        mentoring_visits: result.mentoring_visits,
        total: result.students + result.assessments + result.mentoring_visits
      },
      details: {
        promoted_by: session.user.name,
        promoted_at: new Date().toISOString(),
        filter_used: test_session_id ? 'session' :
                     user_id ? 'user' :
                     student_ids ? 'specific_ids' :
                     record_status ? 'status' : 'unknown'
      }
    });

  } catch (error) {
    console.error('Promote to production error:', error);
    return NextResponse.json(
      {
        error: 'មានបញ្ហាក្នុងការផ្លាស់ប្តូរទិន្នន័យ',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/test-data/promote-to-production
 * Preview what data would be promoted (dry run)
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

    if (!['admin', 'coordinator', 'mentor'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'អ្នកមិនមានសិទ្ធិមើលទិន្នន័យនេះ' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const test_session_id = searchParams.get('test_session_id');
    const user_id = searchParams.get('user_id');
    const record_status = searchParams.get('record_status');

    // Build where clauses
    const studentWhere: any = {};
    const assessmentWhere: any = {};
    const mentoringVisitWhere: any = {};

    if (test_session_id) {
      studentWhere.test_session_id = test_session_id;
      assessmentWhere.test_session_id = test_session_id;
      mentoringVisitWhere.test_session_id = test_session_id;
    } else if (user_id) {
      const targetUserId = parseInt(user_id);
      studentWhere.added_by_id = targetUserId;
      assessmentWhere.added_by_id = targetUserId;
      mentoringVisitWhere.mentor_id = targetUserId;
    } else if (record_status) {
      studentWhere.record_status = record_status;
      assessmentWhere.record_status = record_status;
      mentoringVisitWhere.record_status = record_status;
    } else {
      // Default: show all test data
      studentWhere.record_status = { in: ['test_mentor', 'test_teacher'] };
      assessmentWhere.record_status = { in: ['test_mentor', 'test_teacher'] };
      mentoringVisitWhere.record_status = { in: ['test_mentor', 'test_teacher'] };
    }

    // Get preview data
    const [students, assessments, mentoringVisits] = await Promise.all([
      prisma.students.findMany({
        where: studentWhere,
        select: {
          id: true,
          name: true,
          record_status: true,
          test_session_id: true,
          users_assessments_added_by_idTousers: { select: { id: true, name: true } },
          created_at: true
        },
        take: 100 // Limit preview
      }),
      prisma.assessments.findMany({
        where: assessmentWhere,
        select: {
          id: true,
          assessment_type: true,
          subject: true,
          record_status: true,
          test_session_id: true,
          users_assessments_added_by_idTousers: { select: { id: true, name: true } },
          students: { select: { id: true, name: true } },
          assessed_date: true
        },
        take: 100
      }),
      prisma.mentoringVisit.findMany({
        where: mentoringVisitWhere,
        select: {
          id: true,
          visit_date: true,
          record_status: true,
          test_session_id: true,
          mentor: { select: { id: true, name: true } },
          pilot_schools: { select: { id: true, school_name: true } },
          created_at: true
        },
        take: 100
      })
    ]);

    // Get counts
    const [studentCount, assessmentCount, mentoringVisitCount] = await Promise.all([
      prisma.students.count({ where: studentWhere }),
      prisma.assessments.count({ where: assessmentWhere }),
      prisma.mentoringVisit.count({ where: mentoringVisitWhere })
    ]);

    return NextResponse.json({
      preview: {
        students: students,
        assessments: assessments,
        mentoring_visits: mentoringVisits
      },
      counts: {
        students: studentCount,
        assessments: assessmentCount,
        mentoring_visits: mentoringVisitCount,
        total: studentCount + assessmentCount + mentoringVisitCount
      },
      warning: studentCount > 100 || assessmentCount > 100 || mentoringVisitCount > 100 ?
        'មានទិន្នន័យច្រើនជាងដែលបានបង្ហាញ សូមប្រើតម្រងបន្ថែម' : null
    });

  } catch (error) {
    console.error('Preview promotion error:', error);
    return NextResponse.json(
      {
        error: 'មានបញ្ហាក្នុងការមើលទិន្នន័យ',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}