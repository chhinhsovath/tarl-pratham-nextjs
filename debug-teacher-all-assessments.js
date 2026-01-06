/**
 * Debug: Check ALL assessments entered by this teacher (not just their own students)
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function debugAllTeacherAssessments() {
  try {
    console.log('🔍 CHECKING ALL ASSESSMENTS ENTERED BY TEACHER\n');

    const teacher = await prisma.users.findUnique({
      where: { email: 'hoat.vimol.kam@teacher.tarl.edu.kh' },
      select: { id: true, name: true }
    });

    console.log(`Teacher: ${teacher.name} (ID: ${teacher.id})\n`);

    // Get ALL assessments added by this teacher
    const allAssessments = await prisma.assessments.findMany({
      where: {
        added_by_id: teacher.id,
      },
      select: {
        id: true,
        student_id: true,
        assessment_type: true,
        subject: true,
        level: true,
        record_status: true,
        created_at: true,
        students: {
          select: {
            id: true,
            student_id: true,
            name: true,
            added_by_id: true,
          }
        }
      },
      orderBy: [
        { student_id: 'asc' },
        { assessment_type: 'asc' }
      ]
    });

    console.log(`Total assessments entered by teacher: ${allAssessments.length}\n`);

    // Group by student
    const byStudent = {};
    allAssessments.forEach(a => {
      if (!byStudent[a.student_id]) {
        byStudent[a.student_id] = [];
      }
      byStudent[a.student_id].push(a);
    });

    console.log('Assessments by Student:\n');
    Object.entries(byStudent).forEach(([studentId, assessments]) => {
      const assessment = assessments[0];
      const studentName = assessment.students?.name || 'Unknown';
      const createdByTeacher = assessment.students?.added_by_id === teacher.id ? '(✅ Teacher)' : '(⚠️ Other)';

      const types = [...new Set(assessments.map(a => a.assessment_type))].join(', ');
      console.log(`${studentName} (${studentId}) ${createdByTeacher}: ${types} [${assessments.length} assessments]`);
    });

    console.log('\n\n📊 SUMMARY:\n');

    // Check how many are for students created by this teacher vs others
    const ownStudents = allAssessments.filter(a => a.students?.added_by_id === teacher.id);
    const otherStudents = allAssessments.filter(a => a.students?.added_by_id !== teacher.id);

    console.log(`Assessments for own students: ${ownStudents.length}`);
    console.log(`Assessments for other students: ${otherStudents.length}`);
    console.log(`Total: ${allAssessments.length}`);

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

debugAllTeacherAssessments();
