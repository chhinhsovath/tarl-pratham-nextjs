const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testCounts() {
  try {
    // Count teacher assessments (baseline, midline, endline)
    const teacherCount = await prisma.assessment.count({
      where: {
        assessment_type: {
          in: ['baseline', 'midline', 'endline']
        }
      }
    });
    
    // Count verification assessments
    const verificationCount = await prisma.assessment.count({
      where: {
        assessment_type: {
          in: ['baseline_verification', 'midline_verification', 'endline_verification']
        }
      }
    });
    
    console.log('Teacher assessments:', teacherCount);
    console.log('Verification assessments:', verificationCount);
    
    // Test fetching without limit
    console.log('\nFetching teacher assessments with findMany...');
    const teacherAssessments = await prisma.assessment.findMany({
      where: {
        assessment_type: {
          in: ['baseline', 'midline', 'endline']
        }
      }
    });
    
    console.log('Actually fetched:', teacherAssessments.length);
    
    // Check if there's a pattern in IDs
    if (teacherAssessments.length > 0) {
      const ids = teacherAssessments.map(a => a.id).sort((a, b) => a - b);
      console.log('First ID:', ids[0]);
      console.log('Last ID:', ids[ids.length - 1]);
      console.log('Sample of first 5 IDs:', ids.slice(0, 5));
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testCounts();