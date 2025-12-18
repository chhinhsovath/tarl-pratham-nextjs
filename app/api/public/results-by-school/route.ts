import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/public/results-by-school
 *
 * PUBLIC endpoint - NO authentication required
 * Returns school comparison data for homepage chart
 *
 * Query params:
 * - cycle: 'baseline' | 'midline' | 'endline' (default: 'baseline')
 * - subject: 'language' | 'math' | null (optional - if not provided, returns ALL subjects combined)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const cycle = searchParams.get('cycle') || 'baseline';
    const subject = searchParams.get('subject'); // Don't default - null means ALL subjects

    console.log(`[PUBLIC RESULTS BY SCHOOL] Fetching for cycle=${cycle}, subject=${subject || 'ALL'}`);

    // Build where clause for filtering
    const where: any = {
      assessment_type: cycle
    };

    // Only filter by subject if provided
    if (subject) {
      where.subject = subject;
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

    // Level mappings - standardize across language/math
    const levelMapping: Record<string, string> = {
      // Language levels
      'beginner': 'beginner',
      'letter': 'letter',
      'word': 'word',
      'paragraph': 'paragraph',
      'story': 'story',
      'comprehension1': 'comprehension1',
      'comprehension2': 'comprehension2',

      // Math levels → map to equivalent proficiency
      'number_1digit': 'letter',       // Level 2: 1-Digit = Letter
      'number_2digit': 'word',         // Level 3: 2-Digit = Word
      'subtraction': 'paragraph',      // Level 4: Subtraction = Paragraph
      'division': 'story',             // Level 5: Division = Story
      'word_problems': 'comprehension1' // Advanced
    };

    assessments.forEach(assessment => {
      const schoolId = assessment.students?.pilot_schools?.id;
      const schoolName = assessment.students?.pilot_schools?.school_name || 'Unknown School';
      const rawLevel = assessment.level || 'beginner';

      // Map to standardized level
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

    // Convert to array format for chart
    const schoolData = Object.values(schoolStats).map(school => ({
      schoolName: school.school_name,
      school_id: school.school_id,
      levels: school.levels,
      total: school.total
    }));

    console.log(`[PUBLIC RESULTS BY SCHOOL] Found ${schoolData.length} schools with data`);

    return NextResponse.json({
      schools: schoolData,
      cycle: cycle,
      subject: subject || 'all',
      total_schools: schoolData.length
    });

  } catch (error) {
    console.error('[PUBLIC RESULTS BY SCHOOL] Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch school results',
        message: error instanceof Error ? error.message : 'Unknown error',
        schools: []
      },
      { status: 500 }
    );
  }
}
