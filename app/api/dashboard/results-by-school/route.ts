import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const subject = searchParams.get('subject') || 'khmer';
    const cycle = searchParams.get('cycle') || 'baseline';
    const school_id = searchParams.get('school_id');
    const province = searchParams.get('province');
    const district = searchParams.get('district');
    const cluster = searchParams.get('cluster');

    // Build where clause for filtering
    const where: any = {
      subject: subject,
      assessment_type: cycle
    };

    if (school_id) {
      where.student = {
        pilot_school_id: parseInt(school_id)
      };
    }

    // Get assessments grouped by school
    const assessments = await prisma.assessment.findMany({
      where,
      include: {
        student: {
          include: {
            pilot_school: {
              select: {
                id: true,
                school_name: true,
                province: true,
                district: true,
                cluster: true
              }
            }
          }
        }
      }
    });

    // Group assessments by school and level
    const schoolStats: Record<string, {
      school_name: string;
      school_id: number;
      levels: Record<string, number>;
      total: number;
    }> = {};

    assessments.forEach(assessment => {
      const schoolId = assessment.student?.pilot_school?.id;
      const schoolName = assessment.student?.pilot_school?.school_name || 'Unknown School';
      const level = assessment.level || 'beginner';

      if (!schoolId) return;

      if (!schoolStats[schoolId]) {
        schoolStats[schoolId] = {
          school_name: schoolName,
          school_id: schoolId,
          levels: {
            beginner: 0,
            letter: 0,
            word: 0,
            paragraph: 0,
            story: 0
          },
          total: 0
        };
      }

      schoolStats[schoolId].levels[level] = (schoolStats[schoolId].levels[level] || 0) + 1;
      schoolStats[schoolId].total += 1;
    });

    // Convert counts to percentages
    const schoolData = Object.values(schoolStats).map(school => ({
      school: school.school_name,
      school_id: school.school_id,
      beginner: school.total > 0 ? (school.levels.beginner / school.total) * 100 : 0,
      letter: school.total > 0 ? (school.levels.letter / school.total) * 100 : 0,
      word: school.total > 0 ? (school.levels.word / school.total) * 100 : 0,
      paragraph: school.total > 0 ? (school.levels.paragraph / school.total) * 100 : 0,
      story: school.total > 0 ? (school.levels.story / school.total) * 100 : 0,
      total_students: school.total
    }));

    // Format data for horizontal bar chart (Chart.js format)
    const chartData = {
      labels: schoolData.map(s => s.school),
      datasets: [
        {
          label: subject === 'khmer' ? 'ដំណាក់កាលដើម' : 'លេខ 1-9',
          backgroundColor: 'rgba(239, 68, 68, 0.8)',
          data: schoolData.map(s => s.beginner),
          counts: schoolData.map(s => Math.round((s.beginner / 100) * s.total_students))
        },
        {
          label: subject === 'khmer' ? 'អក្សរ' : 'លេខ 10-99',
          backgroundColor: 'rgba(245, 158, 11, 0.8)',
          data: schoolData.map(s => s.letter),
          counts: schoolData.map(s => Math.round((s.letter / 100) * s.total_students))
        },
        {
          label: subject === 'khmer' ? 'ពាក្យ' : 'បូក/ដក',
          backgroundColor: 'rgba(59, 130, 246, 0.8)',
          data: schoolData.map(s => s.word),
          counts: schoolData.map(s => Math.round((s.word / 100) * s.total_students))
        },
        {
          label: subject === 'khmer' ? 'កថាខណ្ឌ' : 'គុណ/ចែក',
          backgroundColor: 'rgba(34, 197, 94, 0.8)',
          data: schoolData.map(s => s.paragraph),
          counts: schoolData.map(s => Math.round((s.paragraph / 100) * s.total_students))
        },
        {
          label: subject === 'khmer' ? 'សាច់រឿង' : 'ចម្រុះ',
          backgroundColor: 'rgba(168, 85, 247, 0.8)',
          data: schoolData.map(s => s.story),
          counts: schoolData.map(s => Math.round((s.story / 100) * s.total_students))
        }
      ]
    };

    return NextResponse.json({ chartData });
  } catch (error: any) {
    console.error('Error fetching school results:', error);
    return NextResponse.json(
      {
        error: 'មានបញ្ហាក្នុងការទាញយកលទ្ធផលតាមសាលា',
        details: error.message,
        code: error.code
      },
      { status: 500 }
    );
  }
}