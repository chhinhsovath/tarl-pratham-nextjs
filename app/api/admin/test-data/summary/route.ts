import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/admin/test-data/summary
 * Get summary of test data by record_status
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'សូមចូលប្រើប្រាស់ប្រព័ន្ធជាមុនសិន' },
        { status: 401 }
      );
    }

    // Only admins and coordinators can view test data summary
    if (!['admin', 'coordinator'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'អ្នកមិនមានសិទ្ធិមើលទិន្នន័យនេះ' },
        { status: 403 }
      );
    }

    // Get counts grouped by record_status
    const studentCounts = await prisma.student.groupBy({
      by: ['record_status'],
      _count: {
        id: true
      },
      where: {
        record_status: {
          in: ['test_mentor', 'test_teacher', 'demo', 'archived']
        }
      }
    });

    const assessmentCounts = await prisma.assessment.groupBy({
      by: ['record_status'],
      _count: {
        id: true
      },
      where: {
        record_status: {
          in: ['test_mentor', 'test_teacher', 'demo', 'archived']
        }
      }
    });

    const mentoringVisitCounts = await prisma.mentoringVisit.groupBy({
      by: ['record_status'],
      _count: {
        id: true
      },
      where: {
        record_status: {
          in: ['test_mentor', 'test_teacher', 'demo', 'archived']
        }
      }
    });

    // Combine counts by status
    const statusMap = new Map<string, { students: number; assessments: number; mentoring_visits: number }>();

    studentCounts.forEach(item => {
      const status = item.record_status || 'production';
      if (!statusMap.has(status)) {
        statusMap.set(status, { students: 0, assessments: 0, mentoring_visits: 0 });
      }
      statusMap.get(status)!.students = item._count.id;
    });

    assessmentCounts.forEach(item => {
      const status = item.record_status || 'production';
      if (!statusMap.has(status)) {
        statusMap.set(status, { students: 0, assessments: 0, mentoring_visits: 0 });
      }
      statusMap.get(status)!.assessments = item._count.id;
    });

    mentoringVisitCounts.forEach(item => {
      const status = item.record_status || 'production';
      if (!statusMap.has(status)) {
        statusMap.set(status, { students: 0, assessments: 0, mentoring_visits: 0 });
      }
      statusMap.get(status)!.mentoring_visits = item._count.id;
    });

    // Convert to array
    const summary = Array.from(statusMap.entries()).map(([status, counts]) => ({
      record_status: status,
      students: counts.students,
      assessments: counts.assessments,
      mentoring_visits: counts.mentoring_visits,
      total: counts.students + counts.assessments + counts.mentoring_visits
    }));

    // Sort by total descending
    summary.sort((a, b) => b.total - a.total);

    return NextResponse.json({
      summary,
      total_test_data: summary.reduce((sum, item) => sum + item.total, 0)
    });

  } catch (error) {
    console.error('Get test data summary error:', error);
    return NextResponse.json(
      {
        error: 'មានបញ្ហាក្នុងការទាញយកសង្ខេបទិន្នន័យ',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}