const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('Testing connection to new server (157.10.73.82)...\n');

    // Test user count
    const userCount = await prisma.user.count();
    console.log(`✓ Users: ${userCount}`);

    // Test pilot_schools count
    const schoolCount = await prisma.pilotSchool.count();
    console.log(`✓ Pilot Schools: ${schoolCount}`);

    // Test students count
    const studentCount = await prisma.student.count();
    console.log(`✓ Students: ${studentCount}`);

    // Test assessments count
    const assessmentCount = await prisma.assessment.count();
    console.log(`✓ Assessments: ${assessmentCount}`);

    console.log('\n========================================');
    console.log('SUCCESS! Application connected to new server!');
    console.log('========================================');

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
