import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Helper function to check permissions
function hasPermission(userRole: string): boolean {
  return ['admin', 'mentor', 'teacher', 'coordinator', 'viewer'].includes(userRole);
}

// GET /api/reports/dashboard - Comprehensive dashboard statistics
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!hasPermission(session.user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const school_id = searchParams.get('school_id') || '';
    const assessment_period = searchParams.get('assessment_period') || '';
    const date_from = searchParams.get('date_from') || '';
    const date_to = searchParams.get('date_to') || '';

    // Build base where clause for role-based access
    let baseWhere: any = { is_active: true };
    
    // Apply role-based restrictions
    if (session.user.role === 'teacher') {
      baseWhere.teacher_id = parseInt(session.user.id);
    } else if (session.user.role === 'mentor' && session.user.pilot_school_id) {
      baseWhere.student = {
        pilot_school_id: session.user.pilot_school_id
      };
    }

    // Apply filters
    if (school_id) {
      baseWhere.student = {
        ...baseWhere.student,
        pilot_school_id: parseInt(school_id)
      };
    }

    if (assessment_period) {
      baseWhere.assessment_period = assessment_period;
    }

    if (date_from && date_to) {
      baseWhere.assessment_date = {
        gte: new Date(date_from),
        lte: new Date(date_to)
      };
    }

    // 1. Overview Statistics
    const [
      totalStudents,
      totalAssessments,
      totalSchools,
      totalTeachers,
      assessments,
      allStudents
    ] = await Promise.all([
      // Total students count
      prisma.student.count({
        where: {
          is_active: true,
          ...(session.user.role === 'mentor' && session.user.pilot_school_id && {
            pilot_school_id: session.user.pilot_school_id
          }),
          ...(school_id && { pilot_school_id: parseInt(school_id) })
        }
      }),
      
      // Total assessments count
      prisma.assessment.count({ where: baseWhere }),
      
      // Total schools count
      prisma.pilotSchool.count({
        where: {
          is_active: true,
          ...(session.user.role === 'mentor' && session.user.pilot_school_id && {
            id: session.user.pilot_school_id
          }),
          ...(school_id && { id: parseInt(school_id) })
        }
      }),
      
      // Total teachers count
      prisma.user.count({
        where: {
          role: 'teacher',
          ...(session.user.role === 'mentor' && session.user.pilot_school_id && {
            pilot_school_id: session.user.pilot_school_id
          })
        }
      }),
      
      // All assessments for calculations
      prisma.assessment.findMany({
        where: baseWhere,
        include: {
          student: {
            include: {
              pilotSchool: true
            }
          }
        },
        orderBy: { assessment_date: 'desc' }
      }),
      
      // All students for completion rate calculation
      prisma.student.findMany({
        where: {
          is_active: true,
          ...(session.user.role === 'mentor' && session.user.pilot_school_id && {
            pilot_school_id: session.user.pilot_school_id
          }),
          ...(school_id && { pilot_school_id: parseInt(school_id) })
        },
        include: {
          assessments: {
            where: baseWhere
          }
        }
      })
    ]);

    // Calculate completion rate
    const studentsWithAssessments = allStudents.filter(student => student.assessments.length > 0).length;
    const assessmentCompletionRate = totalStudents > 0 ? (studentsWithAssessments / totalStudents) * 100 : 0;

    // 2. Performance Distribution
    const khmerLevels = ['មិនចេះអាន', 'ស្គាល់អក្សរ', 'អានពាក្យ', 'អានប្រយោគ', 'អានកថាខណ្ឌ', 'អានរឿងខ្លី', 'អានស្ទាបស្ទង់'];
    const mathLevels = ['មិនចេះរាប់', 'រាប់ ១-៩', 'រាប់ ១-៩៩', 'បូកដក', 'គុណ', 'ចែក'];

    const khmerDistribution = khmerLevels.map(level => {
      const count = assessments.filter(a => a.khmer_level === level).length;
      const percentage = assessments.length > 0 ? (count / assessments.length) * 100 : 0;
      return { level, count, percentage };
    });

    const mathDistribution = mathLevels.map(level => {
      const count = assessments.filter(a => a.math_level === level).length;
      const percentage = assessments.length > 0 ? (count / assessments.length) * 100 : 0;
      return { level, count, percentage };
    });

    // 3. Progress Tracking (comparing baseline vs latest assessments)
    const progressData = { improved: 0, maintained: 0, declined: 0 };
    
    // Group assessments by student and calculate progress
    const studentAssessments = assessments.reduce((acc, assessment) => {
      if (!acc[assessment.student_id]) {
        acc[assessment.student_id] = [];
      }
      acc[assessment.student_id].push(assessment);
      return acc;
    }, {} as Record<number, any[]>);

    Object.values(studentAssessments).forEach((studentAssess: any[]) => {
      if (studentAssess.length >= 2) {
        const sorted = studentAssess.sort((a, b) => new Date(a.assessment_date).getTime() - new Date(b.assessment_date).getTime());
        const baseline = sorted[0];
        const latest = sorted[sorted.length - 1];
        
        const baselineScore = (khmerLevels.indexOf(baseline.khmer_level) + mathLevels.indexOf(baseline.math_level)) / 2;
        const latestScore = (khmerLevels.indexOf(latest.khmer_level) + mathLevels.indexOf(latest.math_level)) / 2;
        
        if (latestScore > baselineScore) {
          progressData.improved++;
        } else if (latestScore === baselineScore) {
          progressData.maintained++;
        } else {
          progressData.declined++;
        }
      }
    });

    const totalWithProgress = progressData.improved + progressData.maintained + progressData.declined;
    const improvementRate = totalWithProgress > 0 ? (progressData.improved / totalWithProgress) * 100 : 0;

    // 4. School Comparison (only for admin/coordinator)
    let schoolComparison: any[] = [];
    if (['admin', 'coordinator'].includes(session.user.role)) {
      const schools = await prisma.pilotSchool.findMany({
        where: {
          is_active: true,
          ...(school_id && { id: parseInt(school_id) })
        },
        include: {
          students: {
            where: { is_active: true },
            include: {
              assessments: {
                where: {
                  ...baseWhere,
                  student: undefined // Remove student filter for school comparison
                }
              }
            }
          }
        }
      });

      schoolComparison = schools.map(school => {
        const schoolAssessments = school.students.flatMap(student => student.assessments);
        const totalStudents = school.students.length;
        
        const avgKhmerLevel = schoolAssessments.length > 0 ? 
          schoolAssessments.reduce((sum, a) => sum + khmerLevels.indexOf(a.khmer_level), 0) / schoolAssessments.length : 0;
        
        const avgMathLevel = schoolAssessments.length > 0 ? 
          schoolAssessments.reduce((sum, a) => sum + mathLevels.indexOf(a.math_level), 0) / schoolAssessments.length : 0;

        // Calculate improvement rate for this school
        const schoolStudentProgress = school.students.reduce((acc, student) => {
          if (student.assessments.length >= 2) {
            const sorted = student.assessments.sort((a, b) => new Date(a.assessment_date).getTime() - new Date(b.assessment_date).getTime());
            const baseline = sorted[0];
            const latest = sorted[sorted.length - 1];
            
            const baselineScore = (khmerLevels.indexOf(baseline.khmer_level) + mathLevels.indexOf(baseline.math_level)) / 2;
            const latestScore = (khmerLevels.indexOf(latest.khmer_level) + mathLevels.indexOf(latest.math_level)) / 2;
            
            if (latestScore > baselineScore) acc.improved++;
            else if (latestScore === baselineScore) acc.maintained++;
            else acc.declined++;
          }
          return acc;
        }, { improved: 0, maintained: 0, declined: 0 });

        const schoolImprovementRate = (schoolStudentProgress.improved + schoolStudentProgress.maintained + schoolStudentProgress.declined) > 0 ?
          (schoolStudentProgress.improved / (schoolStudentProgress.improved + schoolStudentProgress.maintained + schoolStudentProgress.declined)) * 100 : 0;

        return {
          school_name: school.school_name,
          total_students: totalStudents,
          avg_khmer_level: avgKhmerLevel,
          avg_math_level: avgMathLevel,
          improvement_rate: schoolImprovementRate
        };
      });
    }

    // 5. Monthly Trends (last 6 months)
    const monthlyTrends = [];
    for (let i = 5; i >= 0; i--) {
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - i);
      startDate.setDate(1);
      
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 1);
      endDate.setDate(0);

      const monthAssessments = await prisma.assessment.count({
        where: {
          ...baseWhere,
          assessment_date: {
            gte: startDate,
            lte: endDate
          }
        }
      });

      // Calculate improvements for this month
      const monthAssessmentsData = await prisma.assessment.findMany({
        where: {
          ...baseWhere,
          assessment_date: {
            gte: startDate,
            lte: endDate
          }
        }
      });

      const monthStudentProgress = monthAssessmentsData.reduce((acc, assessment) => {
        // Simple improvement calculation - can be enhanced
        if (assessment.khmer_level !== 'មិនចេះអាន' || assessment.math_level !== 'មិនចេះរាប់') {
          acc++;
        }
        return acc;
      }, 0);

      monthlyTrends.push({
        month: startDate.toLocaleDateString('km-KH', { month: 'short', year: 'numeric' }),
        assessments: monthAssessments,
        improvements: monthStudentProgress
      });
    }

    // 6. At-risk students (students with beginner levels)
    const atRiskAssessments = assessments.filter(a => 
      a.khmer_level === 'មិនចេះអាន' || a.math_level === 'មិនចេះរាប់'
    );

    const atRiskStudents = atRiskAssessments.slice(0, 20).map(assessment => ({
      id: assessment.student.id,
      name: assessment.student.name,
      school: assessment.student.pilotSchool.school_name,
      khmer_level: assessment.khmer_level,
      math_level: assessment.math_level,
      last_assessment: assessment.assessment_date
    }));

    const response = {
      overview: {
        total_students: totalStudents,
        total_assessments: totalAssessments,
        total_schools: totalSchools,
        total_teachers: totalTeachers,
        assessment_completion_rate: Math.round(assessmentCompletionRate * 10) / 10,
        improvement_rate: Math.round(improvementRate * 10) / 10
      },
      performance_distribution: {
        khmer: khmerDistribution,
        math: mathDistribution
      },
      progress_tracking: progressData,
      school_comparison: schoolComparison,
      monthly_trends: monthlyTrends,
      at_risk_students: atRiskStudents
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error generating dashboard report:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}