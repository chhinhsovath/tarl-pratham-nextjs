/**
 * Debug: Find duplicate students in the database
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function debugDuplicates() {
  try {
    console.log('🔍 CHECKING FOR DUPLICATE STUDENTS\n');

    // Find students with the same name and school
    const allStudents = await prisma.students.findMany({
      where: {
        pilot_school_id: 30, // School 30 = សាលាបឋមសិក្សាសាខា១
      },
      select: {
        id: true,
        student_id: true,
        name: true,
        added_by_id: true,
        created_at: true,
        assessments: {
          select: {
            assessment_type: true,
          }
        }
      },
      orderBy: { name: 'asc' }
    });

    console.log(`Total students in school 30: ${allStudents.length}\n`);

    // Group by name to find duplicates
    const byName = {};
    allStudents.forEach(s => {
      if (!byName[s.name]) {
        byName[s.name] = [];
      }
      byName[s.name].push(s);
    });

    console.log('🔴 STUDENTS WITH DUPLICATE NAMES:\n');

    let duplicateCount = 0;
    Object.entries(byName).forEach(([name, students]) => {
      if (students.length > 1) {
        duplicateCount++;
        console.log(`Name: ${name}`);
        students.forEach((s, idx) => {
          const assessmentTypes = [...new Set(s.assessments.map(a => a.assessment_type))].join(', ');
          console.log(`  [${idx + 1}] ID=${s.id}, StudentID=${s.student_id}, AddedBy=${s.added_by_id}, Created=${new Date(s.created_at).toLocaleString()}, Assessments=${assessmentTypes || '(none)'}`);
        });
        console.log();
      }
    });

    console.log(`\n📊 SUMMARY: ${duplicateCount} students have duplicate names\n`);

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

debugDuplicates();
