import { prisma } from '@/lib/prisma';

/**
 * Cleanup function for mentor-created temporary data
 * Deletes students and assessments created by mentors after 48 hours
 */
export async function cleanupMentorData() {
  try {
    const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);
    
    console.log('Starting mentor data cleanup...');
    
    // Find temporary students older than 48 hours
    const temporaryStudents = await prisma.student.findMany({
      where: {
        is_temporary: true,
        added_by_mentor: true,
        mentor_created_at: {
          lt: fortyEightHoursAgo
        }
      },
      include: {
        assessments: true
      }
    });

    console.log(`Found ${temporaryStudents.length} temporary students to delete`);

    // Delete related assessments first
    for (const student of temporaryStudents) {
      if (student.assessments.length > 0) {
        // Delete assessment histories
        await prisma.assessmentHistory.deleteMany({
          where: {
            assessment_id: {
              in: student.assessments.map(a => a.id)
            }
          }
        });

        // Delete assessments
        await prisma.assessments.deleteMany({
          where: {
            student_id: student.id
          }
        });
      }
    }

    // Delete temporary students
    const deletedStudents = await prisma.student.deleteMany({
      where: {
        id: {
          in: temporaryStudents.map(s => s.id)
        }
      }
    });

    // Find temporary assessments older than 48 hours (orphaned assessments)
    const temporaryAssessments = await prisma.assessments.findMany({
      where: {
        is_temporary: true,
        assessed_by_mentor: true,
        created_at: {
          lt: fortyEightHoursAgo
        }
      }
    });

    console.log(`Found ${temporaryAssessments.length} temporary assessments to delete`);

    // Delete orphaned assessment histories
    if (temporaryAssessments.length > 0) {
      await prisma.assessmentHistory.deleteMany({
        where: {
          assessment_id: {
            in: temporaryAssessments.map(a => a.id)
          }
        }
      });

      // Delete orphaned temporary assessments
      const deletedAssessments = await prisma.assessments.deleteMany({
        where: {
          id: {
            in: temporaryAssessments.map(a => a.id)
          }
        }
      });

      console.log(`Deleted ${deletedAssessments.count} temporary assessments`);
    }

    console.log(`Deleted ${deletedStudents.count} temporary students`);
    console.log('Mentor data cleanup completed successfully');

    return {
      studentsDeleted: deletedStudents.count,
      assessmentsDeleted: temporaryAssessments.length,
      success: true
    };

  } catch (error) {
    console.error('Error during mentor data cleanup:', error);
    return {
      studentsDeleted: 0,
      assessmentsDeleted: 0,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Get temporary data that will be deleted in the next cleanup
 */
export async function getTemporaryDataToExpire() {
  try {
    const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);
    const twentyFourHoursFromNow = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const [temporaryStudents, temporaryAssessments] = await Promise.all([
      prisma.student.findMany({
        where: {
          is_temporary: true,
          added_by_mentor: true,
          mentor_created_at: {
            gte: fortyEightHoursAgo,
            lt: twentyFourHoursFromNow
          }
        },
        select: {
          id: true,
          name: true,
          mentor_created_at: true,
          added_by: {
            select: { name: true }
          }
        }
      }),
      
      prisma.assessments.findMany({
        where: {
          is_temporary: true,
          assessed_by_mentor: true,
          created_at: {
            gte: fortyEightHoursAgo,
            lt: twentyFourHoursFromNow
          }
        },
        select: {
          id: true,
          assessment_type: true,
          subject: true,
          created_at: true,
          student: {
            select: { name: true }
          },
          added_by: {
            select: { name: true }
          }
        }
      })
    ]);

    return {
      students: temporaryStudents,
      assessments: temporaryAssessments,
      total: temporaryStudents.length + temporaryAssessments.length
    };

  } catch (error) {
    console.error('Error getting temporary data to expire:', error);
    return {
      students: [],
      assessments: [],
      total: 0,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Mark mentor data as permanent (remove temporary flags)
 */
export async function markMentorDataAsPermanent(studentIds: number[], assessmentIds: number[]) {
  try {
    const results = await prisma.$transaction(async (tx) => {
      const updatedStudents = studentIds.length > 0 ? await tx.student.updateMany({
        where: {
          id: { in: studentIds },
          is_temporary: true,
          added_by_mentor: true
        },
        data: {
          is_temporary: false,
          added_by_mentor: false,
          mentor_created_at: null
        }
      }) : { count: 0 };

      const updatedAssessments = assessmentIds.length > 0 ? await tx.assessment.updateMany({
        where: {
          id: { in: assessmentIds },
          is_temporary: true,
          assessed_by_mentor: true
        },
        data: {
          is_temporary: false,
          assessed_by_mentor: false
        }
      }) : { count: 0 };

      return {
        students: updatedStudents.count,
        assessments: updatedAssessments.count
      };
    });

    console.log(`Marked ${results.students} students and ${results.assessments} assessments as permanent`);
    
    return {
      success: true,
      studentsUpdated: results.students,
      assessmentsUpdated: results.assessments
    };

  } catch (error) {
    console.error('Error marking mentor data as permanent:', error);
    return {
      success: false,
      studentsUpdated: 0,
      assessmentsUpdated: 0,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Get all temporary mentor data for review
 */
export async function getAllTemporaryMentorData() {
  try {
    const [students, assessments] = await Promise.all([
      prisma.student.findMany({
        where: {
          is_temporary: true,
          added_by_mentor: true
        },
        include: {
          added_by: {
            select: { name: true, role: true }
          },
          pilot_school: {
            select: { name: true }
          }
        },
        orderBy: { mentor_created_at: 'desc' }
      }),

      prisma.assessments.findMany({
        where: {
          is_temporary: true,
          assessed_by_mentor: true
        },
        include: {
          student: {
            select: { name: true }
          },
          added_by: {
            select: { name: true, role: true }
          },
          pilot_school: {
            select: { name: true }
          }
        },
        orderBy: { created_at: 'desc' }
      })
    ]);

    return {
      students,
      assessments,
      total: students.length + assessments.length
    };

  } catch (error) {
    console.error('Error getting all temporary mentor data:', error);
    return {
      students: [],
      assessments: [],
      total: 0,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}