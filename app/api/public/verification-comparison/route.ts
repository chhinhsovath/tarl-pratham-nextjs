import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const assessment_type = searchParams.get('assessment_type') || '';
    const subject = searchParams.get('subject') || '';
    const school_id = searchParams.get('school_id') || '';

    // Build where clause for TEACHER assessments (baseline, midline, endline)
    // Get all assessments (we'll filter mentor ones later if the field exists)
    const teacherWhere: any = {
      assessment_type: {
        in: ['baseline', 'midline', 'endline']
      }
    };

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

    // Fetch ALL teacher assessments
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
        // Verification fields
        verified_by_id: true,
        verified_at: true,
        verification_notes: true,
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
            name: true,
            role: true
          }
        },
        verified_by: {
          select: {
            id: true,
            name: true,
            role: true
          }
        }
      },
      orderBy: [
        { pilot_school_id: 'asc' },
        { created_at: 'desc' }
      ]
    });

    console.log(`[Public] Found ${teacherAssessments.length} assessments`);

    // Since assessed_by_mentor field might not exist in production DB,
    // we'll use verified_by_id to determine if assessment has been verified
    // In this system, verification is tracked on the same record via verified_by_id

    // Process ALL assessments to create comparisons
    const comparisons = teacherAssessments.map((teacherAssessment) => {
      // Check if this assessment has been verified (verified_by_id is not null)
      const isVerified = teacherAssessment.verified_by_id !== null;

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
        teacher_assessment_date: teacherAssessment.assessed_date || teacherAssessment.created_at,

        // Mentor verification (from verified_by on same record)
        // Note: In this system, verification is approval-based, not re-assessment
        // So mentor verifies the teacher's level, they don't assess independently
        mentor_name: isVerified ? (teacherAssessment.verified_by?.name || 'Unknown Mentor') : 'រង់ចាំផ្ទៀងផ្ទាត់',
        mentor_assessment_id: isVerified ? teacherAssessment.id : null,
        mentor_level: isVerified ? teacherAssessment.level : null, // Same level (approval-based)
        mentor_verification_date: teacherAssessment.verified_at,

        // Verification status
        verification_status: isVerified ? 'verified' : 'pending',
        level_match: isVerified ? true : null, // Always true in approval-based system

        // Additional verification info
        verified_at: teacherAssessment.verified_at || null,
        verification_notes: teacherAssessment.verification_notes || null
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

    console.log(`[Public] Returning ${comparisons.length} total comparisons (${stats.pending_count} pending, ${stats.verified_count} verified)`);

    return NextResponse.json({
      comparisons,
      statistics: stats
    });

  } catch (error) {
    console.error('[Public] Error fetching comparison data:', error);
    return NextResponse.json(
      {
        error: 'មានបញ្ហាក្នុងការទាញយកទិន្នន័យប្រៀបធៀប',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
