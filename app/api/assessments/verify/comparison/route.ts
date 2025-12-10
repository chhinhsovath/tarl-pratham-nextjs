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

    // Build where clause for verification assessments (completed by mentors)
    const verificationWhere: any = {
      // Show verification assessment types - completed by mentors
      assessment_type: {
        in: ['baseline_verification', 'midline_verification', 'endline_verification']
      }
    };

    // If mentor, filter by assigned schools only
    if (session.user.role === 'mentor') {
      const mentorSchoolIds = await getMentorSchoolIds(parseInt(session.user.id));
      if (mentorSchoolIds.length > 0) {
        verificationWhere.pilot_school_id = { in: mentorSchoolIds };
      } else {
        // Mentor has no assigned schools, return empty result
        return NextResponse.json({ comparisons: [] });
      }
    }

    // Apply filters
    if (assessment_type) {
      verificationWhere.assessment_type = assessment_type; // Use exact verification type
    }
    if (subject) {
      verificationWhere.subject = subject;
    }
    if (school_id) {
      verificationWhere.pilot_school_id = parseInt(school_id);
    }

    // Fetch all verification assessments (completed by mentors)
    const verificationAssessments = await prisma.assessment.findMany({
      where: verificationWhere,
      select: {
        id: true,
        assessment_type: true,
        subject: true,
        level: true,  // Important: Include level field
        notes: true,
        created_at: true,
        student_id: true,
        pilot_school_id: true,
        verification_notes: true,
        verified_at: true,
        assessed_date: true,
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

    // For each verification assessment, find the corresponding teacher assessment
    const comparisons = await Promise.all(
      verificationAssessments.map(async (verificationAssessment) => {
        // Build original assessment type (e.g., 'baseline_verification' -> 'baseline')
        const originalType = verificationAssessment.assessment_type.replace('_verification', '');
        
        // Find original teacher assessment for the same student and subject
        const teacherAssessment = await prisma.assessment.findFirst({
          where: {
            student_id: verificationAssessment.student_id,
            assessment_type: originalType,
            subject: verificationAssessment.subject
          },
          select: {
            id: true,
            level: true,  // Important: Include level field
            notes: true,
            created_at: true,
            assessed_date: true,
            added_by: {
              select: {
                id: true,
                name: true
              }
            }
          },
          orderBy: {
            created_at: 'desc' // Get the most recent original assessment
          }
        });

        return {
          // Student info
          student_id: verificationAssessment.student?.student_id,
          student_name: verificationAssessment.student?.name,
          gender: verificationAssessment.student?.gender,
          age: verificationAssessment.student?.age,
          grade: verificationAssessment.student?.grade,
          
          // School info
          school_name: verificationAssessment.pilot_school?.school_name,
          school_code: verificationAssessment.pilot_school?.school_code,
          province: verificationAssessment.pilot_school?.province,
          district: verificationAssessment.pilot_school?.district,
          
          // Assessment info
          assessment_type: originalType, // Show the base type (baseline, midline, endline)
          subject: verificationAssessment.subject,
          
          // Teacher assessment (original)
          teacher_name: teacherAssessment?.added_by?.name || 'Unknown Teacher',
          teacher_assessment_id: teacherAssessment?.id || null,
          teacher_level: teacherAssessment?.level || null,
          teacher_score: null, // Score field doesn't exist in database
          teacher_assessment_date: teacherAssessment?.assessed_date || teacherAssessment?.created_at || null,
          teacher_responses: null, // Responses field doesn't exist
          
          // Mentor verification (this is our primary data now)
          mentor_name: verificationAssessment.added_by?.name || 'Unknown Mentor',
          mentor_assessment_id: verificationAssessment.id,
          mentor_level: verificationAssessment.level,
          mentor_score: null, // Score field doesn't exist  
          mentor_verification_date: verificationAssessment.assessed_date || verificationAssessment.created_at,
          mentor_responses: null, // Responses field doesn't exist
          
          // Verification status
          verification_status: 'verified', // All records here are verification assessments
          score_difference: null, // Can't calculate without scores
          level_match: teacherAssessment && verificationAssessment.level ? 
            teacherAssessment.level === verificationAssessment.level : null,
          
          // Additional verification info
          verified_at: verificationAssessment.verified_at,
          verification_notes: verificationAssessment.verification_notes
        };
      })
    );

    // Calculate summary statistics
    const stats = {
      total_assessments: comparisons.length,
      verified_count: comparisons.length, // All are verification assessments
      pending_count: 0, // No pending since all are completed verifications
      level_match_count: comparisons.filter(c => c.level_match === true).length,
      level_mismatch_count: comparisons.filter(c => c.level_match === false).length,
      no_original_count: comparisons.filter(c => c.teacher_assessment_id === null).length
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