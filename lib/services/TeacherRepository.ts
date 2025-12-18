// Laravel-style Repository Pattern
// Equivalent to: app/Repositories/TeacherRepository.php

import { prisma } from '@/lib/prisma';

export interface Student {
  id: number;
  student_name: string;
  grade_level: 'grade_4' | 'grade_5';
  recent_score: number;
  baseline_score: number;
  target_score: number;
  last_assessment: string;
  improvement_rate: number;
  status: 'excellent' | 'good' | 'needs_attention' | 'at_risk';
  subject: string;
  school_id?: number;
  teacher_id?: number;
  created_at: string;
  updated_at: string;
}

export interface Assessment {
  id: number;
  student_id: number;
  subject: string;
  assessment_type: 'baseline' | 'midline' | 'endline';
  score: number;
  level: string;
  assessed_date: string;
  teacher_id: number;
  notes?: string;
}

export interface ClassPerformance {
  total_students: number;
  class_average: number;
  improvement_rate: number;
  subject_breakdown: {
    subject: string;
    average: number;
    improvement: number;
    students_above_target: number;
    total_students: number;
  }[];
  performance_distribution: {
    excellent: number;
    good: number;
    fair: number;
    poor: number;
  };
}

export interface PendingTask {
  id: number;
  type: 'assessment' | 'report' | 'mentoring' | 'training';
  title: string;
  due_date: string;
  priority: 'high' | 'medium' | 'low';
  status?: 'pending' | 'in_progress' | 'completed';
  students_count?: number;
  mentor_name?: string;
  description?: string;
}

// Helper function to calculate improvement rate
function calculateImprovementRate(baselineScore: number, recentScore: number): number {
  if (!baselineScore || baselineScore === 0) return 0;
  return Math.round(((recentScore - baselineScore) / baselineScore) * 100);
}

// Helper function to determine status based on score
function getStudentStatus(score: number, targetScore: number): 'excellent' | 'good' | 'needs_attention' | 'at_risk' {
  if (score >= targetScore * 0.9) return 'excellent';
  if (score >= targetScore * 0.7) return 'good';
  if (score >= targetScore * 0.5) return 'needs_attention';
  return 'at_risk';
}

// Laravel-style Repository Class
export class TeacherRepository {

  async findStudentsByTeacher(teacherId: number | string, filters?: {
    grade?: string;
    status?: string;
    subject?: string;
    limit?: number;
  }): Promise<Student[]> {
    try {
      const teacher_id = typeof teacherId === 'string' ? parseInt(teacherId) : teacherId;

      // Get students added by this teacher
      const students = await prisma.student.findMany({
        where: {
          added_by_id: teacher_id,
          is_active: true,
        },
        include: {
          assessments: {
            orderBy: { assessed_date: 'desc' },
            take: 10
          }
        },
        take: filters?.limit || 10,
        orderBy: { created_at: 'desc' }
      });

      // Transform to Student interface
      return students.map(student => {
        const latestAssessment = student.assessments[0];
        const baselineAssessment = student.assessments.find(a => a.assessment_type === 'baseline');

        const recentScore = latestAssessment?.score || 0;
        const baselineScore = baselineAssessment?.score || 0;
        const targetScore = 80; // Default target
        const improvementRate = calculateImprovementRate(baselineScore, recentScore);
        const status = getStudentStatus(recentScore, targetScore);

        // Determine grade level from age or default
        const gradeLevel = (student.age && student.age >= 10 ? 'grade_5' : 'grade_4') as 'grade_4' | 'grade_5';

        return {
          id: student.id,
          student_name: student.name,
          grade_level: gradeLevel,
          recent_score: recentScore,
          baseline_score: baselineScore,
          target_score: targetScore,
          last_assessment: latestAssessment?.assessed_date?.toISOString() || new Date().toISOString(),
          improvement_rate: improvementRate,
          status,
          subject: latestAssessment?.subject || 'ភាសាខ្មែរ',
          teacher_id: teacher_id,
          created_at: student.created_at.toISOString(),
          updated_at: student.updated_at.toISOString()
        };
      });
    } catch (error) {
      console.error('Error fetching students:', error);
      return [];
    }
  }

  async getClassPerformance(teacherId: number | string, period: 'week' | 'month' | 'term' = 'month'): Promise<ClassPerformance> {
    try {
      const teacher_id = typeof teacherId === 'string' ? parseInt(teacherId) : teacherId;

      // Get all students for this teacher
      const students = await prisma.student.findMany({
        where: {
          added_by_id: teacher_id,
          is_active: true
        },
        include: {
          assessments: {
            orderBy: { assessed_date: 'desc' }
          }
        }
      });

      const totalStudents = students.length;
      let totalScore = 0;
      let totalImprovement = 0;
      let khmerScores: number[] = [];
      let mathScores: number[] = [];
      let khmerImprovements: number[] = [];
      let mathImprovements: number[] = [];

      const distribution = {
        excellent: 0,
        good: 0,
        fair: 0,
        poor: 0
      };

      students.forEach(student => {
        const latestAssessment = student.assessments[0];
        const baselineAssessment = student.assessments.find(a => a.assessment_type === 'baseline');

        if (latestAssessment) {
          const score = latestAssessment.score;
          totalScore += score;

          // Calculate improvement
          if (baselineAssessment) {
            const improvement = calculateImprovementRate(baselineAssessment.score, score);
            totalImprovement += improvement;

            // Track by subject
            if (latestAssessment.subject?.includes('ខ្មែរ') || latestAssessment.subject?.includes('khmer')) {
              khmerScores.push(score);
              khmerImprovements.push(improvement);
            } else if (latestAssessment.subject?.includes('គណិត') || latestAssessment.subject?.includes('math')) {
              mathScores.push(score);
              mathImprovements.push(improvement);
            }
          }

          // Performance distribution
          if (score >= 80) distribution.excellent++;
          else if (score >= 60) distribution.good++;
          else if (score >= 40) distribution.fair++;
          else distribution.poor++;
        }
      });

      const classAverage = totalStudents > 0 ? Math.round(totalScore / totalStudents) : 0;
      const improvementRate = totalStudents > 0 ? Math.round(totalImprovement / totalStudents) : 0;

      // Subject breakdown
      const subjectBreakdown = [];

      if (khmerScores.length > 0) {
        const khmerAvg = Math.round(khmerScores.reduce((a, b) => a + b, 0) / khmerScores.length);
        const khmerImprovement = Math.round(khmerImprovements.reduce((a, b) => a + b, 0) / khmerImprovements.length);
        subjectBreakdown.push({
          subject: 'ភាសាខ្មែរ',
          average: khmerAvg,
          improvement: khmerImprovement,
          students_above_target: khmerScores.filter(s => s >= 80).length,
          total_students: khmerScores.length
        });
      }

      if (mathScores.length > 0) {
        const mathAvg = Math.round(mathScores.reduce((a, b) => a + b, 0) / mathScores.length);
        const mathImprovement = Math.round(mathImprovements.reduce((a, b) => a + b, 0) / mathImprovements.length);
        subjectBreakdown.push({
          subject: 'គណិតវិទ្យា',
          average: mathAvg,
          improvement: mathImprovement,
          students_above_target: mathScores.filter(s => s >= 80).length,
          total_students: mathScores.length
        });
      }

      return {
        total_students: totalStudents,
        class_average: classAverage,
        improvement_rate: improvementRate,
        subject_breakdown: subjectBreakdown,
        performance_distribution: distribution
      };
    } catch (error) {
      console.error('Error fetching class performance:', error);
      return {
        total_students: 0,
        class_average: 0,
        improvement_rate: 0,
        subject_breakdown: [],
        performance_distribution: { excellent: 0, good: 0, fair: 0, poor: 0 }
      };
    }
  }

  async getPendingTasks(teacherId: number | string): Promise<PendingTask[]> {
    try {
      const teacher_id = typeof teacherId === 'string' ? parseInt(teacherId) : teacherId;

      // Get students without baseline assessments (pending task)
      const studentsWithoutBaseline = await prisma.student.findMany({
        where: {
          added_by_id: teacher_id,
          is_active: true,
          assessments: {
            none: {
              assessment_type: 'baseline'
            }
          }
        }
      });

      const tasks: PendingTask[] = [];

      if (studentsWithoutBaseline.length > 0) {
        tasks.push({
          id: 1,
          type: 'assessment',
          title: 'ការវាយតម្លៃមូលដ្ឋាន - សិស្សមិនទាន់បានវាយតម្លៃ',
          due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          priority: 'high',
          status: 'pending',
          students_count: studentsWithoutBaseline.length,
          description: `មានសិស្ស ${studentsWithoutBaseline.length} នាក់ដែលមិនទាន់បានវាយតម្លៃមូលដ្ឋាន`
        });
      }

      // Get upcoming mentoring visits
      const upcomingVisits = await prisma.mentoringVisit.findMany({
        where: {
          teacher_id: teacher_id,
          visit_date: {
            gte: new Date()
          },
          status: {
            in: ['scheduled', 'pending']
          }
        },
        include: {
          mentor: {
            select: { name: true }
          }
        },
        take: 5,
        orderBy: { visit_date: 'asc' }
      });

      upcomingVisits.forEach((visit, index) => {
        tasks.push({
          id: index + 10,
          type: 'mentoring',
          title: `ការពិគ្រោះយោបល់ជាមួយអ្នកណែនាំ`,
          due_date: visit.visit_date.toISOString().split('T')[0],
          priority: 'medium',
          status: 'pending',
          mentor_name: visit.mentor?.name || 'Unknown',
          description: visit.visit_purpose || ''
        });
      });

      return tasks;
    } catch (error) {
      console.error('Error fetching pending tasks:', error);
      return [];
    }
  }

  async getDashboardStats(teacherId: number | string) {
    try {
      const teacher_id = typeof teacherId === 'string' ? parseInt(teacherId) : teacherId;

      const [
        totalStudents,
        totalAssessments,
        pendingAssessments,
        completedAssessments
      ] = await Promise.all([
        prisma.student.count({
          where: { added_by_id: teacher_id, is_active: true }
        }),
        prisma.assessments.count({
          where: { added_by_id: teacher_id }
        }),
        prisma.student.count({
          where: {
            added_by_id: teacher_id,
            is_active: true,
            assessments: {
              none: {
                assessment_type: 'baseline'
              }
            }
          }
        }),
        prisma.assessments.count({
          where: {
            added_by_id: teacher_id,
            assessment_type: { in: ['baseline', 'midline', 'endline'] }
          }
        })
      ]);

      // Calculate class average from recent assessments
      const recentAssessments = await prisma.assessments.findMany({
        where: { added_by_id: teacher_id },
        orderBy: { assessed_date: 'desc' },
        take: 50
      });

      const classAverage = recentAssessments.length > 0
        ? Math.round(recentAssessments.reduce((sum, a) => sum + (a.score || 0), 0) / recentAssessments.length)
        : 0;

      return {
        my_students: totalStudents,
        pending_assessments: pendingAssessments,
        completed_assessments: completedAssessments,
        class_average: classAverage,
        improvement_rate: 0 // Will be calculated from baseline vs latest
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return {
        my_students: 0,
        pending_assessments: 0,
        completed_assessments: 0,
        class_average: 0,
        improvement_rate: 0
      };
    }
  }
}

// Export singleton instance
export const teacherRepository = new TeacherRepository();
