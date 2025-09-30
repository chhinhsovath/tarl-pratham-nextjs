import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import { getMockStudentById, getMockAssessmentsForStudent } from '@/lib/services/mockDataService';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;
    const studentId = parseInt(id);

    if (isNaN(studentId)) {
      return NextResponse.json({ error: 'Invalid student ID' }, { status: 400 });
    }

    // Get student info
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        school_class: {
          include: {
            school: {
              select: { name: true }
            }
          }
        },
        pilot_school: {
          select: { school_name: true }
        }
      }
    });

    // If no student and user is mentor, return mock data
    if (!student && session?.user?.role === 'mentor') {
      const mockStudent = getMockStudentById(studentId);
      if (!mockStudent) {
        return NextResponse.json({ error: 'Student not found' }, { status: 404 });
      }

      const mockAssessments = getMockAssessmentsForStudent(studentId);

      // Process mock assessments
      const assessmentHistory = {
        baseline: {
          khmer: mockAssessments.filter(a => a.assessment_type === 'baseline' && a.subject === 'khmer'),
          math: mockAssessments.filter(a => a.assessment_type === 'baseline' && a.subject === 'math')
        },
        midline: {
          khmer: mockAssessments.filter(a => a.assessment_type === 'midline' && a.subject === 'khmer'),
          math: mockAssessments.filter(a => a.assessment_type === 'midline' && a.subject === 'math')
        },
        endline: {
          khmer: mockAssessments.filter(a => a.assessment_type === 'endline' && a.subject === 'khmer'),
          math: mockAssessments.filter(a => a.assessment_type === 'endline' && a.subject === 'math')
        }
      };

      const levelProgression = {
        khmer: {
          baseline: mockStudent.baseline_khmer_level,
          midline: mockStudent.midline_khmer_level,
          endline: mockStudent.endline_khmer_level
        },
        math: {
          baseline: mockStudent.baseline_math_level,
          midline: mockStudent.midline_math_level,
          endline: mockStudent.endline_math_level
        }
      };

      const stats = {
        total_assessments: mockAssessments.length,
        assessment_types: {
          baseline: mockAssessments.filter(a => a.assessment_type === 'baseline').length,
          midline: mockAssessments.filter(a => a.assessment_type === 'midline').length,
          endline: mockAssessments.filter(a => a.assessment_type === 'endline').length
        },
        subjects: {
          khmer: mockAssessments.filter(a => a.subject === 'khmer').length,
          math: mockAssessments.filter(a => a.subject === 'math').length
        },
        temporary_assessments: mockAssessments.length,
        mentor_assessments: mockAssessments.length
      };

      return NextResponse.json({
        student: mockStudent,
        assessments: mockAssessments,
        assessmentHistory,
        levelProgression,
        stats,
        is_mock: true,
        message: '🧪 Test data - Changes will not be saved'
      });
    }

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    // Get assessment history
    const assessments = await prisma.assessment.findMany({
      where: { student_id: studentId },
      include: {
        added_by: {
          select: { name: true, role: true }
        },
        pilot_school: {
          select: { school_name: true }
        }
      },
      orderBy: [
        { assessed_date: 'desc' },
        { created_at: 'desc' }
      ]
    });

    // Group assessments by type and subject
    const assessmentHistory = {
      baseline: {
        khmer: assessments.filter(a => a.assessment_type === 'baseline' && a.subject === 'khmer'),
        math: assessments.filter(a => a.assessment_type === 'baseline' && a.subject === 'math')
      },
      midline: {
        khmer: assessments.filter(a => a.assessment_type === 'midline' && a.subject === 'khmer'),
        math: assessments.filter(a => a.assessment_type === 'midline' && a.subject === 'math')
      },
      endline: {
        khmer: assessments.filter(a => a.assessment_type === 'endline' && a.subject === 'khmer'),
        math: assessments.filter(a => a.assessment_type === 'endline' && a.subject === 'math')
      }
    };

    // Calculate progress
    const calculateProgress = (assessments: any[]) => {
      if (assessments.length < 2) return null;
      
      const latest = assessments[0];
      const previous = assessments[1];
      
      if (!latest.score || !previous.score) return null;
      
      return {
        current: latest.score,
        previous: previous.score,
        improvement: latest.score - previous.score,
        percentChange: ((latest.score - previous.score) / previous.score) * 100
      };
    };

    const progress = {
      khmer: {
        baseline_to_midline: calculateProgress([
          ...assessmentHistory.midline.khmer,
          ...assessmentHistory.baseline.khmer
        ].sort((a, b) => new Date(b.assessed_date || b.created_at).getTime() - new Date(a.assessed_date || a.created_at).getTime())),
        midline_to_endline: calculateProgress([
          ...assessmentHistory.endline.khmer,
          ...assessmentHistory.midline.khmer
        ].sort((a, b) => new Date(b.assessed_date || b.created_at).getTime() - new Date(a.assessed_date || a.created_at).getTime())),
        baseline_to_endline: calculateProgress([
          ...assessmentHistory.endline.khmer,
          ...assessmentHistory.baseline.khmer
        ].sort((a, b) => new Date(b.assessed_date || b.created_at).getTime() - new Date(a.assessed_date || a.created_at).getTime()))
      },
      math: {
        baseline_to_midline: calculateProgress([
          ...assessmentHistory.midline.math,
          ...assessmentHistory.baseline.math
        ].sort((a, b) => new Date(b.assessed_date || b.created_at).getTime() - new Date(a.assessed_date || a.created_at).getTime())),
        midline_to_endline: calculateProgress([
          ...assessmentHistory.endline.math,
          ...assessmentHistory.midline.math
        ].sort((a, b) => new Date(b.assessed_date || b.created_at).getTime() - new Date(a.assessed_date || a.created_at).getTime())),
        baseline_to_endline: calculateProgress([
          ...assessmentHistory.endline.math,
          ...assessmentHistory.baseline.math
        ].sort((a, b) => new Date(b.assessed_date || b.created_at).getTime() - new Date(a.assessed_date || a.created_at).getTime()))
      }
    };

    // Get level progression
    const levelProgression = {
      khmer: {
        baseline: assessmentHistory.baseline.khmer[0]?.level || student.baseline_khmer_level,
        midline: assessmentHistory.midline.khmer[0]?.level || student.midline_khmer_level,
        endline: assessmentHistory.endline.khmer[0]?.level || student.endline_khmer_level
      },
      math: {
        baseline: assessmentHistory.baseline.math[0]?.level || student.baseline_math_level,
        midline: assessmentHistory.midline.math[0]?.level || student.midline_math_level,
        endline: assessmentHistory.endline.math[0]?.level || student.endline_math_level
      }
    };

    // Calculate statistics
    const stats = {
      total_assessments: assessments.length,
      assessment_types: {
        baseline: assessments.filter(a => a.assessment_type === 'baseline').length,
        midline: assessments.filter(a => a.assessment_type === 'midline').length,
        endline: assessments.filter(a => a.assessment_type === 'endline').length
      },
      subjects: {
        khmer: assessments.filter(a => a.subject === 'khmer').length,
        math: assessments.filter(a => a.subject === 'math').length
      },
      temporary_assessments: assessments.filter(a => a.is_temporary).length,
      mentor_assessments: assessments.filter(a => a.assessed_by_mentor).length
    };

    return NextResponse.json({
      student,
      assessments,
      assessmentHistory,
      progress,
      levelProgression,
      stats
    });

  } catch (error) {
    console.error('Assessment history error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch assessment history' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}