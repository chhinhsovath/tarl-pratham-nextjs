/**
 * Debug script to investigate assessment issues for teacher: hoat.vimol.kam@teacher.tarl.edu.kh
 * Focus: School "សាលាបឋមសិក្សាសាខា១" (ID: 30)
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function debugTeacherAssessments() {
  try {
    console.log('🔍 DEBUGGING TEACHER ASSESSMENT ISSUES\n');

    // Step 1: Find the teacher
    console.log('Step 1: Finding teacher...');
    const teacher = await prisma.users.findUnique({
      where: { email: 'hoat.vimol.kam@teacher.tarl.edu.kh' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        pilot_school_id: true,
      }
    });

    if (!teacher) {
      console.log('❌ Teacher not found');
      return;
    }

    console.log('✅ Teacher found:');
    console.log(`   ID: ${teacher.id}`);
    console.log(`   Name: ${teacher.name}`);
    console.log(`   Role: ${teacher.role}`);
    console.log(`   School ID: ${teacher.pilot_school_id}\n`);

    // Step 2: Get school info
    console.log('Step 2: Getting school info...');
    const school = await prisma.pilot_schools.findUnique({
      where: { id: teacher.pilot_school_id },
      select: {
        id: true,
        school_name: true,
        school_code: true,
      }
    });

    console.log('✅ School found:');
    console.log(`   ID: ${school.id}`);
    console.log(`   Name: ${school.school_name}`);
    console.log(`   Code: ${school.school_code}\n`);

    // Step 3: Find students created by this teacher
    console.log('Step 3: Finding students created by this teacher...');
    const students = await prisma.students.findMany({
      where: {
        added_by_id: teacher.id,
        pilot_school_id: teacher.pilot_school_id,
      },
      select: {
        id: true,
        student_id: true,
        name: true,
        is_temporary: true,
        record_status: true,
        created_at: true,
      },
      orderBy: { created_at: 'desc' }
    });

    console.log(`✅ Found ${students.length} students created by this teacher\n`);

    // Step 4: Check assessments for these students
    console.log('Step 4: Analyzing assessments for these students...');
    const studentIds = students.map(s => s.id);

    const assessments = await prisma.assessments.findMany({
      where: {
        student_id: { in: studentIds },
      },
      select: {
        id: true,
        student_id: true,
        assessment_type: true,
        subject: true,
        level: true,
        record_status: true,
        assessed_date: true,
        created_at: true,
        added_by_id: true,
      },
      orderBy: [
        { student_id: 'asc' },
        { assessment_type: 'asc' },
        { created_at: 'desc' }
      ]
    });

    console.log(`✅ Found ${assessments.length} total assessments\n`);

    // Step 5: Analyze patterns
    console.log('Step 5: Analyzing assessment patterns...\n');

    // Group by student
    const assessmentsByStudent = {};
    assessments.forEach(a => {
      if (!assessmentsByStudent[a.student_id]) {
        assessmentsByStudent[a.student_id] = [];
      }
      assessmentsByStudent[a.student_id].push(a);
    });

    // Find students with missing assessment types
    console.log('📊 STUDENTS WITH INCOMPLETE ASSESSMENTS:\n');
    let incompleteCount = 0;

    Object.entries(assessmentsByStudent).forEach(([studentId, stuAssessments]) => {
      const student = students.find(s => s.id === parseInt(studentId));
      const hasBaseline = stuAssessments.some(a => a.assessment_type === 'baseline');
      const hasMidline = stuAssessments.some(a => a.assessment_type === 'midline');
      const hasEndline = stuAssessments.some(a => a.assessment_type === 'endline');

      if (!hasBaseline || !hasMidline || !hasEndline) {
        incompleteCount++;
        console.log(`Student: ${student.name} (ID: ${student.student_id})`);
        console.log(`  Created: ${student.created_at}`);
        console.log(`  Status: baseline=${hasBaseline ? '✅' : '❌'}, midline=${hasMidline ? '✅' : '❌'}, endline=${hasEndline ? '✅' : '❌'}`);

        // Show details of assessments
        stuAssessments.forEach(a => {
          console.log(`    - ${a.assessment_type}: Level=${a.level}, RecordStatus=${a.record_status}, Date=${a.assessed_date}, CreatedAt=${a.created_at}`);
        });
        console.log();
      }
    });

    console.log(`\n📈 SUMMARY:`);
    console.log(`Total students created by this teacher: ${students.length}`);
    console.log(`Total assessments: ${assessments.length}`);
    console.log(`Students with missing assessments: ${incompleteCount}`);
    console.log(`Completion rate: ${((students.length - incompleteCount) / students.length * 100).toFixed(1)}%\n`);

    // Step 6: Check record_status distribution
    console.log('Step 6: Record Status Distribution\n');
    const recordStatusDist = {};
    assessments.forEach(a => {
      const status = a.record_status || 'NULL';
      recordStatusDist[status] = (recordStatusDist[status] || 0) + 1;
    });

    Object.entries(recordStatusDist).forEach(([status, count]) => {
      console.log(`  ${status}: ${count} assessments`);
    });

    // Step 7: Check for duplicate assessments (same student, same type, different record_status)
    console.log('\n\nStep 7: Checking for duplicate assessments...\n');

    let duplicateCount = 0;
    Object.entries(assessmentsByStudent).forEach(([studentId, stuAssessments]) => {
      const typeGroups = {};
      stuAssessments.forEach(a => {
        if (!typeGroups[a.assessment_type]) {
          typeGroups[a.assessment_type] = [];
        }
        typeGroups[a.assessment_type].push(a);
      });

      Object.entries(typeGroups).forEach(([type, typeAssessments]) => {
        if (typeAssessments.length > 1) {
          duplicateCount++;
          const student = students.find(s => s.id === parseInt(studentId));
          console.log(`⚠️  ${student.name} has ${typeAssessments.length} ${type} assessments:`);
          typeAssessments.forEach((a, idx) => {
            console.log(`   [${idx + 1}] Level=${a.level}, RecordStatus=${a.record_status}, CreatedAt=${a.created_at}`);
          });
          console.log();
        }
      });
    });

    if (duplicateCount === 0) {
      console.log('✅ No duplicate assessments found\n');
    }

    // Step 8: Check if any baseline assessments have non-production status
    console.log('Step 8: Assessing record_status issues\n');

    let nonProductionBaselines = 0;
    Object.entries(assessmentsByStudent).forEach(([studentId, stuAssessments]) => {
      const baselines = stuAssessments.filter(a => a.assessment_type === 'baseline');
      baselines.forEach(b => {
        if (b.record_status !== 'production') {
          nonProductionBaselines++;
          const student = students.find(s => s.id === parseInt(studentId));
          console.log(`⚠️  ${student.name}: Baseline has record_status="${b.record_status}" (not production)`);
          console.log(`   Created: ${b.created_at}\n`);
        }
      });
    });

    if (nonProductionBaselines === 0) {
      console.log('✅ All baseline assessments have production status\n');
    } else {
      console.log(`⚠️  ${nonProductionBaselines} baseline assessments have non-production status\n`);
    }

  } catch (error) {
    console.error('❌ Error during debug:', error.message);
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

debugTeacherAssessments();
