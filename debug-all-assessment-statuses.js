/**
 * Check ALL assessments for these students, including all record_status values
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function debugAllStatuses() {
  try {
    console.log('🔍 CHECKING ALL ASSESSMENTS WITH ALL RECORD_STATUS VALUES\n');

    const teacher = await prisma.users.findUnique({
      where: { email: 'hoat.vimol.kam@teacher.tarl.edu.kh' },
      select: { id: true }
    });

    // Get all students created by teacher
    const teacherStudents = await prisma.students.findMany({
      where: { added_by_id: teacher.id, pilot_school_id: 30 },
      select: { id: true, name: true }
    });

    const studentIds = teacherStudents.map(s => s.id);
    console.log(`Teacher has ${teacherStudents.length} students\n`);

    // Get ALL assessments for these students, grouped by record_status
    const assessmentsByStatus = {};

    const allAssessments = await prisma.assessments.findMany({
      where: { student_id: { in: studentIds } },
      select: {
        student_id: true,
        assessment_type: true,
        level: true,
        record_status: true,
        is_temporary: true,
        created_at: true,
      }
    });

    allAssessments.forEach(a => {
      const status = a.record_status || 'NULL';
      if (!assessmentsByStatus[status]) {
        assessmentsByStatus[status] = [];
      }
      assessmentsByStatus[status].push(a);
    });

    console.log('📊 ASSESSMENTS BY RECORD_STATUS:\n');
    Object.entries(assessmentsByStatus).forEach(([status, assessments]) => {
      console.log(`${status}: ${assessments.length} assessments`);
    });

    console.log(`\nTotal: ${allAssessments.length} assessments\n`);

    // Show if there are any non-production assessments
    const nonProduction = allAssessments.filter(a => a.record_status !== 'production');
    if (nonProduction.length > 0) {
      console.log(`\n⚠️  NON-PRODUCTION ASSESSMENTS: ${nonProduction.length}\n`);
      nonProduction.forEach(a => {
        const student = teacherStudents.find(s => s.id === a.student_id);
        console.log(`${student.name}: ${a.assessment_type} (status=${a.record_status}, is_temporary=${a.is_temporary})`);
      });
    }

    // Check if any assessments have is_temporary = true
    const tempAssessments = allAssessments.filter(a => a.is_temporary === true);
    if (tempAssessments.length > 0) {
      console.log(`\n⚠️  TEMPORARY ASSESSMENTS: ${tempAssessments.length}\n`);
      tempAssessments.forEach(a => {
        const student = teacherStudents.find(s => s.id === a.student_id);
        console.log(`${student.name}: ${a.assessment_type} (record_status=${a.record_status})`);
      });
    }

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

debugAllStatuses();
