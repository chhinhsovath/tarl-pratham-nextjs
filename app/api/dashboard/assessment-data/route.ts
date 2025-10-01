import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const subject = searchParams.get('subject') || 'khmer';

    // Build where clause based on user role
    let whereClause: any = { is_active: true };

    // Role-based filtering
    if (session.user.role === 'teacher') {
      whereClause.teacher_id = parseInt(session.user.id);
    } else if (session.user.role === 'mentor' && session.user.pilot_school_id) {
      whereClause.student = {
        pilot_school_id: session.user.pilot_school_id
      };
    }
    // Admin and Coordinator see all data

    // Fetch all assessments for this user's scope, filtered by subject
    const assessments = await prisma.assessment.findMany({
      where: {
        ...whereClause,
        subject: subject // Filter by subject (khmer or math)
      },
      select: {
        assessment_type: true,
        level: true,
        subject: true
      }
    });

    // Level mappings - unified for both khmer and math
    const levelMap: Record<string, string> = {
      // Khmer levels
      'មិនចេះអាន': 'beginner',
      'ស្គាល់អក្សរ': 'letter',
      'អានពាក្យ': 'word',
      'អានប្រយោគ': 'paragraph',
      'អានកថាខណ្ឌ': 'story',
      'អានរឿងខ្លី': 'story',
      'អានស្ទាបស្ទង់': 'story',
      // Math levels
      'មិនចេះរាប់': 'beginner',
      'រាប់ ១-៩': 'letter',
      'រាប់ ១-៩៩': 'word',
      'បូកដក': 'paragraph',
      'គុណ': 'story',
      'ចែក': 'story'
    };

    // Initialize result structure
    const result = {
      baseline: { beginner: 0, letter: 0, word: 0, paragraph: 0, story: 0 },
      midline: { beginner: 0, letter: 0, word: 0, paragraph: 0, story: 0 },
      endline: { beginner: 0, letter: 0, word: 0, paragraph: 0, story: 0 }
    };

    // Count assessments by type and level
    assessments.forEach(assessment => {
      const assessmentType = assessment.assessment_type?.toLowerCase();
      if (!assessmentType || !['baseline', 'midline', 'endline'].includes(assessmentType)) return;

      const mappedLevel = levelMap[assessment.level || ''];

      if (mappedLevel && result[assessmentType as keyof typeof result][mappedLevel as keyof typeof result.baseline] !== undefined) {
        result[assessmentType as keyof typeof result][mappedLevel as keyof typeof result.baseline]++;
      }
    });

    return NextResponse.json({
      success: true,
      data: result,
      meta: {
        total_assessments: assessments.length,
        user_role: session.user.role,
        subject: subject
      }
    });
  } catch (error) {
    console.error('Assessment data error:', error);

    return NextResponse.json({
      error: 'Failed to fetch assessment data',
      message: error instanceof Error ? error.message : 'Unknown error',
      details: 'Check database connection and assessment table structure'
    }, { status: 500 });
  }
}