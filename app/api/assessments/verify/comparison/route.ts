import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getMentorSchoolIds } from '@/lib/mentorAssignments';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'សូមចូលប្រើប្រាស់ប្រព័ន្ធជាមុនសិន' },
        { status: 401 }
      );
    }

    // Only admin, coordinator, and mentor can access comparison data
    if (!['admin', 'coordinator', 'mentor'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'អ្នកមិនមានសិទ្ធិចូលទៅទំព័រនេះទេ' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const assessment_type = searchParams.get('assessment_type') || '';
    const subject = searchParams.get('subject') || '';
    const school_id = searchParams.get('school_id') || '';

    // Build where clause for teacher assessments
    const teacherWhere: any = {
      // Only original teacher assessments
      mentor_assessment_id: null,
      created_by_role: 'teacher'
    };

    // If mentor, filter by assigned schools only
    if (session.user.role === 'mentor') {
      const mentorSchoolIds = await getMentorSchoolIds(parseInt(session.user.id));
      if (mentorSchoolIds.length > 0) {
        teacherWhere.pilot_school_id = { in: mentorSchoolIds };
      } else {
        // Mentor has no assigned schools, return empty result
        return NextResponse.json({ comparisons: [] });
      }
    }

    // Apply filters
    if (assessment_type) {
      teacherWhere.assessment_type = assessment_type;
    }
    if (subject) {
      teacherWhere.subject = subject;
    }
    if (school_id) {
      teacherWhere.pilot_school_id = parseInt(school_id);
    }

    // Fetch all teacher assessments with their verification assessments
    const teacherAssessments = await prisma.assessment.findMany({
      where: teacherWhere,
      include: {
        student: {
          select: {
            id: true,
            student_id: true,
            name: true,
            gender: true,
            age: true,
            grade: true
          }
        },
        pilot_school: {
          select: {
            id: true,
            school_name: true,
            school_code: true,
            province: true,
            district: true
          }
        },
        added_by: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: [
        { pilot_school_id: 'asc' },
        { created_at: 'desc' }
      ]
    });

    // For each teacher assessment, find the corresponding mentor verification
    const comparisons = await Promise.all(
      teacherAssessments.map(async (teacherAssessment) => {
        // Find mentor verification assessment for the same student, type, and subject
        const mentorVerification = await prisma.assessment.findFirst({
          where: {
            mentor_assessment_id: teacherAssessment.id,
            student_id: teacherAssessment.student_id,
            assessment_type: teacherAssessment.assessment_type,
            subject: teacherAssessment.subject
          },
          include: {
            added_by: {
              select: {
                id: true,
                name: true
              }
            }
          }
        });

        return {
          // Student info
          student_id: teacherAssessment.student?.student_id,
          student_name: teacherAssessment.student?.name,
          gender: teacherAssessment.student?.gender,
          age: teacherAssessment.student?.age,
          grade: teacherAssessment.student?.grade,
          
          // School info
          school_name: teacherAssessment.pilot_school?.school_name,
          school_code: teacherAssessment.pilot_school?.school_code,
          province: teacherAssessment.pilot_school?.province,
          district: teacherAssessment.pilot_school?.district,
          
          // Assessment info
          assessment_type: teacherAssessment.assessment_type,
          subject: teacherAssessment.subject,
          
          // Teacher assessment
          teacher_name: teacherAssessment.added_by?.name,
          teacher_assessment_id: teacherAssessment.id,
          teacher_level: teacherAssessment.level,
          teacher_score: teacherAssessment.score,
          teacher_assessment_date: teacherAssessment.created_at,
          teacher_responses: teacherAssessment.responses,
          
          // Mentor verification
          mentor_name: mentorVerification?.added_by?.name || null,
          mentor_assessment_id: mentorVerification?.id || null,
          mentor_level: mentorVerification?.level || null,
          mentor_score: mentorVerification?.score || null,
          mentor_verification_date: mentorVerification?.created_at || null,
          mentor_responses: mentorVerification?.responses || null,
          
          // Verification status
          verification_status: mentorVerification ? 'verified' : 'pending',
          score_difference: mentorVerification ? 
            Math.abs(teacherAssessment.score - mentorVerification.score) : null,
          level_match: mentorVerification ? 
            teacherAssessment.level === mentorVerification.level : null,
          
          // Additional verification info
          verified_at: teacherAssessment.verified_at,
          verification_notes: teacherAssessment.verification_notes
        };
      })
    );

    // Calculate summary statistics
    const stats = {
      total_assessments: comparisons.length,
      verified_count: comparisons.filter(c => c.verification_status === 'verified').length,
      pending_count: comparisons.filter(c => c.verification_status === 'pending').length,
      level_match_count: comparisons.filter(c => c.level_match === true).length,
      average_score_difference: comparisons
        .filter(c => c.score_difference !== null)
        .reduce((sum, c) => sum + (c.score_difference || 0), 0) / 
        comparisons.filter(c => c.score_difference !== null).length || 0
    };

    return NextResponse.json({
      comparisons,
      statistics: stats
    });

  } catch (error) {
    console.error('Error fetching comparison data:', error);
    return NextResponse.json(
      {
        error: 'មានបញ្ហាក្នុងការទាញយកទិន្នន័យប្រៀបធៀប',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}