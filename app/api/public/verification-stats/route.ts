import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/public/verification-stats
 * Public endpoint to get verification statistics
 * No authentication required
 */
export async function GET(request: NextRequest) {
  try {
    // Get all teacher assessments (baseline, midline, endline)
    const [
      totalStudentsVerified,
      allAssessments,
      mentorVerifications
    ] = await Promise.all([
      // Count unique students that have been verified
      prisma.assessments.findMany({
        where: {
          assessment_type: {
            in: ['baseline', 'midline', 'endline']
          },
          verified_at: {
            not: null
          }
        },
        select: {
          student_id: true,
          verified_by_id: true
        },
        distinct: ['student_id']
      }),

      // Get all teacher assessments
      prisma.assessments.findMany({
        where: {
          assessment_type: {
            in: ['baseline', 'midline', 'endline']
          }
        },
        select: {
          id: true,
          student_id: true,
          assessment_type: true,
          subject: true,
          verified_at: true,
          verified_by_id: true,
          verification_notes: true
        }
      }),

      // Get mentor information for verifications
      prisma.users.findMany({
        where: {
          role: 'mentor',
          assessments_verified: {
            some: {}
          }
        },
        select: {
          id: true,
          name: true,
          _count: {
            select: {
              assessments_verified: {
                where: {
                  verified_at: {
                    not: null
                  }
                }
              }
            }
          }
        }
      })
    ]);

    // Calculate statistics
    const totalAssessments = allAssessments.length;
    const verifiedAssessments = allAssessments.filter(a => a.verified_at !== null);
    const pendingAssessments = totalAssessments - verifiedAssessments.length;

    // Check for rejections
    const rejectedAssessments = verifiedAssessments.filter(a =>
      a.verification_notes?.toLowerCase().includes('rejected')
    );

    // Calculate unique students verified
    const uniqueStudentsVerified = new Set(
      verifiedAssessments.map(a => a.student_id)
    ).size;

    // Mentor statistics - calculate verifications per mentor
    const mentorStats = mentorVerifications.map(mentor => ({
      mentor_id: mentor.id,
      mentor_name: mentor.name,
      verifications_count: mentor._count.assessments_verified
    })).sort((a, b) => b.verifications_count - a.verifications_count);

    // Get verification rate by assessment type
    const verificationByType = {
      baseline: {
        total: allAssessments.filter(a => a.assessment_type === 'baseline').length,
        verified: verifiedAssessments.filter(a => a.assessment_type === 'baseline').length
      },
      midline: {
        total: allAssessments.filter(a => a.assessment_type === 'midline').length,
        verified: verifiedAssessments.filter(a => a.assessment_type === 'midline').length
      },
      endline: {
        total: allAssessments.filter(a => a.assessment_type === 'endline').length,
        verified: verifiedAssessments.filter(a => a.assessment_type === 'endline').length
      }
    };

    // Get verification rate by subject
    const verificationBySubject = {
      language: {
        total: allAssessments.filter(a => a.subject === 'language' || a.subject === 'khmer').length,
        verified: verifiedAssessments.filter(a => a.subject === 'language' || a.subject === 'khmer').length
      },
      math: {
        total: allAssessments.filter(a => a.subject === 'math').length,
        verified: verifiedAssessments.filter(a => a.subject === 'math').length
      }
    };

    const response = {
      overall: {
        total_assessments: totalAssessments,
        verified_assessments: verifiedAssessments.length,
        pending_assessments: pendingAssessments,
        rejected_assessments: rejectedAssessments.length,
        unique_students_verified: uniqueStudentsVerified,
        verification_rate: totalAssessments > 0
          ? ((verifiedAssessments.length / totalAssessments) * 100).toFixed(1)
          : '0.0'
      },
      by_assessment_type: verificationByType,
      by_subject: verificationBySubject,
      mentor_stats: mentorStats,
      top_mentors: mentorStats.slice(0, 10), // Top 10 mentors
      last_updated: new Date().toISOString()
    };

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
      }
    });

  } catch (error) {
    console.error('Error fetching verification stats:', error);
    return NextResponse.json(
      {
        error: 'មានបញ្ហាក្នុងការទាញយកទិន្នន័យ',
        details: error instanceof Error ? error.message : 'Unknown error',
        meta: {
          timestamp: new Date().toISOString(),
          code: 'VERIFICATION_STATS_ERROR'
        }
      },
      { status: 500 }
    );
  }
}
