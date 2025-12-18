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
    const assessments = await prisma.assessments.findMany({
      where,
      include: {
        students: {
          include: {
            pilot_schools: {
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

    // Level mappings for chart display
    // Map database level names to standardized chart levels (Level 1-5)
    const levelMapping: Record<string, string> = {
      // Language levels → standardized levels
      'beginner': 'beginner',
      'letter': 'letter',
      'word': 'word',
      'paragraph': 'paragraph',
      'story': 'story',
      'comprehension1': 'comprehension1',
      'comprehension2': 'comprehension2',

      // Math levels → standardized levels (map to equivalent proficiency)
      'number_1digit': 'letter',       // Level 2: 1-Digit = Letter
      'number_2digit': 'word',         // Level 3: 2-Digit = Word
      'subtraction': 'paragraph',      // Level 4: Subtraction = Paragraph
      'division': 'story',             // Level 5: Division = Story
      'word_problems': 'comprehension1' // Advanced: Word Problems = Comprehension 1
    };

    assessments.forEach(assessment => {
      const schoolId = assessment.students?.pilot_schools?.id;
      const schoolName = assessment.students?.pilot_schools?.school_name || 'Unknown School';
      const rawLevel = assessment.level || 'beginner';

      // Map to standardized level for consistent chart display
      const level = levelMapping[rawLevel] || rawLevel;

      if (!schoolId) return;

      if (!schoolStats[schoolId]) {
        schoolStats[schoolId] = {
          school_name: schoolName,
          school_id: schoolId,
          levels: {},
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
      beginner: school.total > 0 ? ((school.levels.beginner || 0) / school.total) * 100 : 0,
      letter: school.total > 0 ? ((school.levels.letter || 0) / school.total) * 100 : 0,
      word: school.total > 0 ? ((school.levels.word || 0) / school.total) * 100 : 0,
      paragraph: school.total > 0 ? ((school.levels.paragraph || 0) / school.total) * 100 : 0,
      story: school.total > 0 ? ((school.levels.story || 0) / school.total) * 100 : 0,
      total_students: school.total
    }));

    // Format data for horizontal bar chart (Chart.js format)
    // CONSISTENT COLORS: Same as StackedPercentageBarChart component
    // Each proficiency level uses ONE color across both Language and Math
    const chartData = {
      labels: schoolData.map(s => s.school),
      datasets: [
        {
          label: subject === 'khmer' ? 'Beginner' : 'Beginner',
          backgroundColor: 'rgba(220, 38, 38, 0.8)',  // RED - Level 1
          data: schoolData.map(s => s.beginner),
          counts: schoolData.map(s => Math.round((s.beginner / 100) * s.total_students))
        },
        {
          label: subject === 'khmer' ? 'Letter' : '1-Digit',
          backgroundColor: 'rgba(249, 115, 22, 0.8)',  // ORANGE - Level 2 (same for Letter/1-Digit)
          data: schoolData.map(s => s.letter),
          counts: schoolData.map(s => Math.round((s.letter / 100) * s.total_students))
        },
        {
          label: subject === 'khmer' ? 'Word' : '2-Digit',
          backgroundColor: 'rgba(234, 179, 8, 0.8)',  // YELLOW - Level 3 (same for Word/2-Digit)
          data: schoolData.map(s => s.word),
          counts: schoolData.map(s => Math.round((s.word / 100) * s.total_students))
        },
        {
          label: subject === 'khmer' ? 'Paragraph' : 'Subtraction',
          backgroundColor: 'rgba(132, 204, 22, 0.8)',  // GREEN - Level 4 (same for Paragraph/Subtraction)
          data: schoolData.map(s => s.paragraph),
          counts: schoolData.map(s => Math.round((s.paragraph / 100) * s.total_students))
        },
        {
          label: subject === 'khmer' ? 'Story' : 'Division',
          backgroundColor: 'rgba(59, 130, 246, 0.8)',  // BLUE - Level 5 (same for Story/Division)
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