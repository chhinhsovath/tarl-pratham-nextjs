/**
 * Compare what gets exported vs what's in the database
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function debugExportComparison() {
  try {
    console.log('🔍 COMPARING DATABASE vs EXPORT DATA FOR TEACHER\n');

    const teacher = await prisma.users.findUnique({
      where: { email: 'hoat.vimol.kam@teacher.tarl.edu.kh' },
      select: { id: true, name: true }
    });

    console.log(`Teacher: ${teacher.name} (ID: ${teacher.id})\n`);

    // Step 1: Get all students in the school (as export would see them)
    const allSchoolStudents = await prisma.students.findMany({
      where: {
        pilot_school_id: 30,
        is_active: true,
      },
      select: {
        id: true,
        student_id: true,
        name: true,
        added_by_id: true,
      },
      orderBy: { id: 'asc' }
    });

    console.log(`Total ACTIVE students in school 30: ${allSchoolStudents.length}\n`);

    // Step 2: Get students created by THIS teacher
    const teacherStudents = allSchoolStudents.filter(s => s.added_by_id === teacher.id);
    console.log(`Students created by ${teacher.name}: ${teacherStudents.length}\n`);

    // Step 3: Get assessments for these students
    const studentIds = teacherStudents.map(s => s.id);

    console.log('Students created by this teacher:\n');

    teacherStudents.forEach((student, idx) => {
      console.log(`${idx + 1}. ${student.name}`);
      console.log(`   Database ID: ${student.id}`);
      console.log(`   Student ID: ${student.student_id}`);
      console.log(`   Added By: ${student.added_by_id}\n`);
    });

    // Step 4: Get ALL assessments for these students
    const assessments = await prisma.assessments.findMany({
      where: {
        student_id: { in: studentIds },
      },
      select: {
        student_id: true,
        assessment_type: true,
        level: true,
        record_status: true,
        created_at: true,
      },
      orderBy: [
        { student_id: 'asc' },
        { created_at: 'desc' }
      ]
    });

    console.log(`\n✅ Total assessments found: ${assessments.length}\n`);

    // Step 5: Show what the export would return
    console.log('📊 WHAT EXPORT WOULD RETURN:\n');

    const assessmentsByStudent = {};
    assessments.forEach(a => {
      if (!assessmentsByStudent[a.student_id]) {
        assessmentsByStudent[a.student_id] = {
          baseline: null,
          midline: null,
          endline: null,
          baseline_status: null,
          midline_status: null,
          endline_status: null,
        };
      }
      const data = assessmentsByStudent[a.student_id];

      // Take first (most recent) of each type
      if (a.assessment_type === 'baseline' && !data.baseline) {
        data.baseline = a.level;
        data.baseline_status = a.record_status;
      }
      if (a.assessment_type === 'midline' && !data.midline) {
        data.midline = a.level;
        data.midline_status = a.record_status;
      }
      if (a.assessment_type === 'endline' && !data.endline) {
        data.endline = a.level;
        data.endline_status = a.record_status;
      }
    });

    // Create export data
    const exportData = teacherStudents.map((student) => {
      const studentAssessments = assessmentsByStudent[student.id] || {
        baseline: null,
        midline: null,
        endline: null,
      };

      return {
        name: student.name,
        student_id: student.student_id,
        has_baseline: studentAssessments.baseline ? 'Yes' : 'No',
        baseline_level: studentAssessments.baseline || '',
        baseline_status: studentAssessments.baseline_status || '',
        has_midline: studentAssessments.midline ? 'Yes' : 'No',
        midline_level: studentAssessments.midline || '',
        midline_status: studentAssessments.midline_status || '',
        has_endline: studentAssessments.endline ? 'Yes' : 'No',
        endline_level: studentAssessments.endline || '',
        endline_status: studentAssessments.endline_status || '',
      };
    });

    // Show students with incomplete assessments
    const incomplete = exportData.filter(s =>
      s.has_baseline === 'No' ||
      s.has_midline === 'No' ||
      s.has_endline === 'No'
    );

    console.log(`\n🔴 STUDENTS WITH INCOMPLETE ASSESSMENTS IN EXPORT: ${incomplete.length}\n`);

    incomplete.slice(0, 10).forEach((s, idx) => {
      console.log(`${idx + 1}. ${s.name}`);
      console.log(`   Baseline: ${s.has_baseline} ${s.baseline_level ? '(' + s.baseline_level + ')' : ''}`);
      console.log(`   Midline: ${s.has_midline} ${s.midline_level ? '(' + s.midline_level + ')' : ''}`);
      console.log(`   Endline: ${s.has_endline} ${s.endline_level ? '(' + s.endline_level + ')' : ''}\n`);
    });

    console.log(`(Showing first 10 of ${incomplete.length} incomplete students)\n`);

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

debugExportComparison();
