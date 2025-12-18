// Cleanup service for temporary data management
// Implements 48-hour auto-deletion rule for mentor-created data

import { prisma } from '@/lib/prisma';

/**
 * Delete temporary mentor data older than 48 hours
 * This includes students and assessments added by mentors
 */
export async function cleanupTemporaryMentorData() {
  const cutoffDate = new Date();
  cutoffDate.setHours(cutoffDate.getHours() - 48);

  try {
    // Start a transaction to ensure data consistency
    const result = await prisma.$transaction(async (tx) => {
      // Find temporary assessments created by mentors older than 48 hours
      const assessmentsToDelete = await tx.assessment.findMany({
        where: {
          is_temporary: true,
          assessed_by_mentor: true,
          created_at: {
            lt: cutoffDate
          }
        },
        select: {
          id: true,
          student_id: true
        }
      });

      // Delete assessment histories first (foreign key constraint)
      const deletedHistories = await tx.assessmentHistory.deleteMany({
        where: {
          assessment_id: {
            in: assessmentsToDelete.map(a => a.id)
          }
        }
      });

      // Delete the assessments
      const deletedAssessments = await tx.assessment.deleteMany({
        where: {
          id: {
            in: assessmentsToDelete.map(a => a.id)
          }
        }
      });

      // Find temporary students created by mentors older than 48 hours
      const studentsToDelete = await tx.students.findMany({
        where: {
          is_temporary: true,
          added_by_mentor: true,
          mentor_created_at: {
            lt: cutoffDate
          }
        },
        select: {
          id: true
        }
      });

      // Delete student interventions first (foreign key constraint)
      await tx.studentIntervention.deleteMany({
        where: {
          student_id: {
            in: studentsToDelete.map(s => s.id)
          }
        }
      });

      // Delete student assessment eligibilities
      await tx.studentAssessmentEligibility.deleteMany({
        where: {
          student_id: {
            in: studentsToDelete.map(s => s.id)
          }
        }
      });

      // Delete remaining assessments for these students
      await tx.assessment.deleteMany({
        where: {
          student_id: {
            in: studentsToDelete.map(s => s.id)
          }
        }
      });

      // Delete the temporary students
      const deletedStudents = await tx.students.deleteMany({
        where: {
          id: {
            in: studentsToDelete.map(s => s.id)
          }
        }
      });

      return {
        deletedAssessments: deletedAssessments.count,
        deletedStudents: deletedStudents.count,
        deletedHistories: deletedHistories.count,
        timestamp: new Date()
      };
    });

    console.log(`Cleanup completed: ${result.deletedStudents} students, ${result.deletedAssessments} assessments deleted`);
    return result;
  } catch (error) {
    console.error('Error during cleanup:', error);
    throw error;
  }
}

/**
 * Mark data as permanent (remove temporary flag)
 * Called when a coordinator or admin verifies the data
 */
export async function markDataAsPermanent(
  type: 'student' | 'assessment',
  ids: number[]
) {
  try {
    if (type === 'student') {
      const result = await prisma.students.updateMany({
        where: {
          id: { in: ids }
        },
        data: {
          is_temporary: false
        }
      });
      
      // Also mark their assessments as permanent
      await prisma.assessments.updateMany({
        where: {
          student_id: { in: ids }
        },
        data: {
          is_temporary: false
        }
      });
      
      return result;
    } else {
      return await prisma.assessments.updateMany({
        where: {
          id: { in: ids }
        },
        data: {
          is_temporary: false
        }
      });
    }
  } catch (error) {
    console.error('Error marking data as permanent:', error);
    throw error;
  }
}

/**
 * Get statistics about temporary data
 */
export async function getTemporaryDataStats() {
  const cutoffDate = new Date();
  cutoffDate.setHours(cutoffDate.getHours() - 48);

  try {
    const [
      totalTempStudents,
      expiredTempStudents,
      totalTempAssessments,
      expiredTempAssessments
    ] = await Promise.all([
      prisma.students.count({
        where: {
          is_temporary: true,
          added_by_mentor: true
        }
      }),
      prisma.students.count({
        where: {
          is_temporary: true,
          added_by_mentor: true,
          mentor_created_at: {
            lt: cutoffDate
          }
        }
      }),
      prisma.assessments.count({
        where: {
          is_temporary: true,
          assessed_by_mentor: true
        }
      }),
      prisma.assessments.count({
        where: {
          is_temporary: true,
          assessed_by_mentor: true,
          created_at: {
            lt: cutoffDate
          }
        }
      })
    ]);

    return {
      students: {
        total: totalTempStudents,
        expired: expiredTempStudents
      },
      assessments: {
        total: totalTempAssessments,
        expired: expiredTempAssessments
      },
      cutoffDate
    };
  } catch (error) {
    console.error('Error getting temporary data stats:', error);
    throw error;
  }
}

/**
 * Check if data should be marked as temporary
 * Based on user role and context
 */
export function shouldMarkAsTemporary(userRole: string): boolean {
  return userRole === 'mentor';
}

/**
 * Add temporary flag metadata to data
 */
export function addTemporaryMetadata(data: any, userId: number, userRole: string) {
  if (shouldMarkAsTemporary(userRole)) {
    return {
      ...data,
      is_temporary: true,
      added_by_mentor: true,
      assessed_by_mentor: true,
      mentor_created_at: new Date(),
      added_by_id: userId
    };
  }
  return {
    ...data,
    is_temporary: false,
    added_by_id: userId
  };
}