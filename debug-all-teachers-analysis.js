/**
 * Analyze assessment data for ALL teachers in the system
 * Check if the incomplete data issue is widespread or specific to one teacher
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function analyzeAllTeachers() {
  try {
    console.log('🔍 ANALYZING ASSESSMENT DATA FOR ALL TEACHERS\n');

    // Get all teachers
    const allTeachers = await prisma.users.findMany({
      where: { role: 'teacher' },
      select: {
        id: true,
        name: true,
        email: true,
        pilot_school_id: true,
      },
      orderBy: { id: 'asc' }
    });

    console.log(`Found ${allTeachers.length} teachers in system\n`);
    console.log('=' .repeat(100));
    console.log('Teacher Analysis Report');
    console.log('=' .repeat(100) + '\n');

    const teacherStats = [];

    for (const teacher of allTeachers) {
      try {
        // Get students created by this teacher
        const students = await prisma.students.findMany({
          where: {
            added_by_id: teacher.id,
            is_active: true,
          },
          select: {
            id: true,
            student_id: true,
            name: true,
          }
        });

        if (students.length === 0) continue;

        const studentIds = students.map(s => s.id);

        // Get all assessments for these students
        const assessments = await prisma.assessments.findMany({
          where: {
            student_id: { in: studentIds },
          },
          select: {
            student_id: true,
            assessment_type: true,
            record_status: true,
          }
        });

        // Analyze completion
        const assessmentsByStudent = {};
        assessments.forEach(a => {
          if (!assessmentsByStudent[a.student_id]) {
            assessmentsByStudent[a.student_id] = {
              baseline: false,
              midline: false,
              endline: false,
              assessmentCount: 0,
            };
          }
          const data = assessmentsByStudent[a.student_id];
          if (a.assessment_type === 'baseline') data.baseline = true;
          if (a.assessment_type === 'midline') data.midline = true;
          if (a.assessment_type === 'endline') data.endline = true;
          data.assessmentCount++;
        });

        // Count completion status
        const complete = Object.values(assessmentsByStudent).filter(
          s => s.baseline && s.midline && s.endline
        ).length;

        const incomplete = students.length - complete;
        const incompletePercent = ((incomplete / students.length) * 100).toFixed(1);

        const noAssessment = students.length - assessments.reduce((acc, a) => {
          return acc + (assessmentsByStudent[a.student_id] ? 1 : 0);
        }, 0);

        teacherStats.push({
          id: teacher.id,
          name: teacher.name,
          email: teacher.email,
          school_id: teacher.pilot_school_id,
          totalStudents: students.length,
          totalAssessments: assessments.length,
          complete: complete,
          incomplete: incomplete,
          incompletePercent: parseFloat(incompletePercent),
          noAssessment: students.filter(s => !assessmentsByStudent[s.id]).length,
        });

      } catch (error) {
        console.error(`Error processing teacher ${teacher.name}:`, error.message);
      }
    }

    // Sort by incomplete percentage (highest first)
    teacherStats.sort((a, b) => b.incompletePercent - a.incompletePercent);

    // Print detailed table
    console.log('📊 TEACHER ASSESSMENT COMPLETION ANALYSIS\n');
    console.log(
      'Teacher'.padEnd(25) +
      'Students'.padEnd(10) +
      'Assess'.padEnd(10) +
      'Complete'.padEnd(10) +
      'Incomplete'.padEnd(12) +
      'No Data'.padEnd(8) +
      'Rate\n'
    );
    console.log('-'.repeat(100));

    teacherStats.forEach(t => {
      const rate = t.totalStudents > 0 ? ((t.complete / t.totalStudents) * 100).toFixed(1) : '0.0';
      console.log(
        t.name.substring(0, 24).padEnd(25) +
        t.totalStudents.toString().padEnd(10) +
        t.totalAssessments.toString().padEnd(10) +
        t.complete.toString().padEnd(10) +
        t.incomplete.toString().padEnd(12) +
        t.noAssessment.toString().padEnd(8) +
        `${rate}%`
      );
    });

    console.log('\n' + '='.repeat(100) + '\n');

    // Statistics summary
    const avgIncomplete = (teacherStats.reduce((sum, t) => sum + t.incompletePercent, 0) / teacherStats.length).toFixed(1);
    const avgCompletion = (teacherStats.reduce((sum, t) => sum + (t.complete / t.totalStudents * 100), 0) / teacherStats.length).toFixed(1);

    console.log('📈 SYSTEM-WIDE STATISTICS\n');
    console.log(`Total teachers with students: ${teacherStats.length}`);
    console.log(`Total students across all teachers: ${teacherStats.reduce((sum, t) => sum + t.totalStudents, 0)}`);
    console.log(`Total assessments across system: ${teacherStats.reduce((sum, t) => sum + t.totalAssessments, 0)}\n`);

    console.log(`Average incomplete rate: ${avgIncomplete}%`);
    console.log(`Average completion rate: ${avgCompletion}%\n`);

    // Find teachers with issues
    const problematicTeachers = teacherStats.filter(t => t.incompletePercent > 80);
    const goodTeachers = teacherStats.filter(t => t.incompletePercent <= 20);

    console.log(`🔴 TEACHERS WITH HIGH INCOMPLETE RATE (>80%): ${problematicTeachers.length}`);
    console.log(`🟢 TEACHERS WITH HIGH COMPLETION RATE (>80%): ${goodTeachers.length}\n`);

    if (problematicTeachers.length > 0) {
      console.log('Teachers with >80% incomplete data:\n');
      problematicTeachers.forEach(t => {
        console.log(`  ${t.name}`);
        console.log(`    - Students: ${t.totalStudents}`);
        console.log(`    - Assessments: ${t.totalAssessments}`);
        console.log(`    - Incomplete: ${t.incompletePercent}%`);
        console.log();
      });
    }

    if (goodTeachers.length > 0) {
      console.log('\nTeachers with >80% completion rate:\n');
      goodTeachers.forEach(t => {
        const completion = ((t.complete / t.totalStudents) * 100).toFixed(1);
        console.log(`  ${t.name}: ${completion}% complete (${t.complete}/${t.totalStudents} students)`);
      });
      console.log();
    }

    // Check specific teacher
    const hoatTeacher = teacherStats.find(t => t.email === 'hoat.vimol.kam@teacher.tarl.edu.kh');
    if (hoatTeacher) {
      console.log(`\n🔍 SPECIFIC TEACHER: Hoat Vimol`);
      console.log(`   Rank: #${teacherStats.indexOf(hoatTeacher) + 1} (highest incomplete rate)`);
      console.log(`   Incomplete Rate: ${hoatTeacher.incompletePercent}%`);
      console.log(`   Status: ${hoatTeacher.incompletePercent > 50 ? '🔴 HIGH PRIORITY' : 'Normal'}`);
    }

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

analyzeAllTeachers();
