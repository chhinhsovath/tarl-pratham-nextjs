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

    // Build where clause for TEACHER assessments (baseline, midline, endline)
    const teacherWhere: any = {
      assessment_type: {
        in: ['baseline', 'midline', 'endline']
      }
    };

    // If mentor, filter by assigned schools only
    if (session.user.role === 'mentor') {
      const mentorSchoolIds = await getMentorSchoolIds(parseInt(session.user.id));
      if (mentorSchoolIds.length > 0) {
        teacherWhere.pilot_school_id = { in: mentorSchoolIds };
      } else {
        // Mentor has no assigned schools, return empty result
        return NextResponse.json({ comparisons: [], statistics: {} });
      }
    }

    // Apply filters
    if (assessment_type && !assessment_type.includes('_verification')) {
      teacherWhere.assessment_type = assessment_type;
    }
    if (subject) {
      teacherWhere.subject = subject;
    }
    if (school_id) {
      teacherWhere.pilot_school_id = parseInt(school_id);
    }

    // Fetch ALL teacher assessments (these are the primary records we want to show)
    const teacherAssessments = await prisma.assessment.findMany({
      where: teacherWhere,
      select: {
        id: true,
        assessment_type: true,
        subject: true,
        level: true,
        notes: true,
        created_at: true,
        student_id: true,
        pilot_school_id: true,
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
      // No take limit - get ALL records
    });

    console.log(`Found ${teacherAssessments.length} teacher assessments`);

    // Now fetch ALL verification assessments to match with teacher assessments
    const verificationWhere: any = {
      assessment_type: {
        in: ['baseline_verification', 'midline_verification', 'endline_verification']
      }
    };

    // Apply same school filter for mentor
    if (session.user.role === 'mentor') {
      const mentorSchoolIds = await getMentorSchoolIds(parseInt(session.user.id));
      if (mentorSchoolIds.length > 0) {
        verificationWhere.pilot_school_id = { in: mentorSchoolIds };
      }
    }

    // Fetch verification assessments
    const verificationAssessments = await prisma.assessment.findMany({
      where: verificationWhere,
      select: {
        id: true,
        assessment_type: true,
        subject: true,
        level: true,
        notes: true,
        created_at: true,
        student_id: true,
        pilot_school_id: true,
        verification_notes: true,
        verified_at: true,
        assessed_date: true,
        added_by: {
          select: {
            id: true,
            name: true
          }
        }
      }
      // No take limit - get ALL records
    });

    console.log(`Found ${verificationAssessments.length} verification assessments`);

    // Create a map of verification assessments for faster lookup
    const verificationMap = new Map();
    verificationAssessments.forEach(verification => {
      const originalType = verification.assessment_type.replace('_verification', '');
      const key = `${verification.student_id}-${originalType}-${verification.subject}`;
      verificationMap.set(key, verification);
    });

    // Process ALL teacher assessments to create comparisons
    // This will show ALL 2,216 pending + 124 verified records
    const comparisons = teacherAssessments.map((teacherAssessment) => {
      const key = `${teacherAssessment.student_id}-${teacherAssessment.assessment_type}-${teacherAssessment.subject}`;
      const verificationAssessment = verificationMap.get(key);

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
        
        // Teacher assessment (always present)
        teacher_name: teacherAssessment.added_by?.name || 'Unknown Teacher',
        teacher_assessment_id: teacherAssessment.id,
        teacher_level: teacherAssessment.level,
        teacher_score: null, // Score field doesn't exist in database
        teacher_assessment_date: teacherAssessment.assessed_date || teacherAssessment.created_at,
        teacher_responses: null, // Responses field doesn't exist
        
        // Mentor verification (may be null if pending)
        mentor_name: verificationAssessment?.added_by?.name || 'រង់ចាំផ្ទៀងផ្ទាត់',
        mentor_assessment_id: verificationAssessment?.id || null,
        mentor_level: verificationAssessment?.level || null,
        mentor_score: null, // Score field doesn't exist
        mentor_verification_date: verificationAssessment ? (verificationAssessment.assessed_date || verificationAssessment.created_at) : null,
        mentor_responses: null, // Responses field doesn't exist
        
        // Verification status
        verification_status: verificationAssessment ? 'verified' : 'pending',
        score_difference: null, // Can't calculate without scores
        level_match: verificationAssessment && teacherAssessment.level && verificationAssessment.level ? 
          teacherAssessment.level === verificationAssessment.level : null,
        
        // Additional verification info
        verified_at: verificationAssessment?.verified_at || null,
        verification_notes: verificationAssessment?.verification_notes || null
      };
    });

    // Calculate summary statistics
    const verifiedComparisons = comparisons.filter(c => c.verification_status === 'verified');
    const pendingComparisons = comparisons.filter(c => c.verification_status === 'pending');
    
    const stats = {
      total_assessments: comparisons.length,
      verified_count: verifiedComparisons.length,
      pending_count: pendingComparisons.length,
      level_match_count: verifiedComparisons.filter(c => c.level_match === true).length,
      level_mismatch_count: verifiedComparisons.filter(c => c.level_match === false).length,
      no_verification_count: pendingComparisons.length
    };

    console.log(`Returning ${comparisons.length} total comparisons (${stats.pending_count} pending, ${stats.verified_count} verified)`);

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