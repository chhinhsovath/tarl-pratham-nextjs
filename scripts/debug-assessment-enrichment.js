const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('=== TESTING ASSESSMENT ENRICHMENT LOGIC ===\n');

  // Get a sample of students with their database-stored levels
  const students = await prisma.students.findMany({
    where: {
      OR: [
        { id: 2762 },
        { baseline_math_level: { not: null } },
        { midline_math_level: { not: null } }
      ]
    },
    select: {
      id: true,
      name: true,
      baseline_khmer_level: true,
      baseline_math_level: true,
      midline_khmer_level: true,
      midline_math_level: true,
      endline_khmer_level: true,
      endline_math_level: true
    },
    take: 10
  });

  console.log('1. STUDENTS WITH STORED LEVELS (from students table):');
  students.forEach(s => {
    console.log(`\nStudent ${s.id}: ${s.name}`);
    console.log(`  Baseline: KH=${s.baseline_khmer_level || 'null'}, Math=${s.baseline_math_level || 'null'}`);
    console.log(`  Midline: KH=${s.midline_khmer_level || 'null'}, Math=${s.midline_math_level || 'null'}`);
    console.log(`  Endline: KH=${s.endline_khmer_level || 'null'}, Math=${s.endline_math_level || 'null'}`);
  });

  // Now get actual assessments for these students
  const studentIds = students.map(s => s.id);
  const assessments = await prisma.assessments.findMany({
    where: { student_id: { in: studentIds } },
    select: {
      id: true,
      student_id: true,
      assessment_type: true,
      subject: true,
      level: true,
      created_at: true
    },
    orderBy: { created_at: 'desc' }
  });

  console.log('\n\n2. ACTUAL ASSESSMENTS (from assessments table):');
  studentIds.forEach(studentId => {
    const studentAssessments = assessments.filter(a => a.student_id === studentId);
    const student = students.find(s => s.id === studentId);
    console.log(`\nStudent ${studentId}: ${student?.name}`);
    console.log('  Total assessments:', studentAssessments.length);
    studentAssessments.forEach(a => {
      console.log(`    - ${a.assessment_type} ${a.subject}: ${a.level} (ID: ${a.id})`);
    });
  });

  // Simulate the enrichment logic from students/page.tsx
  console.log('\n\n3. SIMULATING FRONTEND ENRICHMENT LOGIC:');
  const assessmentMap = new Map();

  assessments.forEach((assessment) => {
    const key = assessment.student_id;
    if (!assessmentMap.has(key)) {
      assessmentMap.set(key, {
        baseline_khmer_level: null,
        baseline_math_level: null,
        midline_khmer_level: null,
        midline_math_level: null,
        endline_khmer_level: null,
        endline_math_level: null
      });
    }

    const levels = assessmentMap.get(key);
    const subject = assessment.subject.toLowerCase().includes('khmer') || assessment.subject === 'language' ? 'khmer' : 'math';
    const levelKey = `${assessment.assessment_type.toLowerCase()}_${subject}_level`;

    console.log(`  Processing: student_id=${assessment.student_id}, type=${assessment.assessment_type}, subject=${assessment.subject} -> levelKey=${levelKey}, level=${assessment.level}`);

    if (assessment.level) {
      levels[levelKey] = assessment.level;
    }
  });

  console.log('\n4. ENRICHED RESULTS:');
  studentIds.forEach(studentId => {
    const enrichedLevels = assessmentMap.get(studentId) || {};
    const student = students.find(s => s.id === studentId);
    const dbLevels = students.find(s => s.id === studentId);

    console.log(`\nStudent ${studentId}: ${student?.name}`);
    console.log('  DATABASE (students table):');
    console.log(`    Baseline: KH=${dbLevels.baseline_khmer_level || 'null'}, Math=${dbLevels.baseline_math_level || 'null'}`);
    console.log(`    Midline: KH=${dbLevels.midline_khmer_level || 'null'}, Math=${dbLevels.midline_math_level || 'null'}`);
    console.log(`    Endline: KH=${dbLevels.endline_khmer_level || 'null'}, Math=${dbLevels.endline_math_level || 'null'}`);
    console.log('  ENRICHED (from assessments):');
    console.log(`    Baseline: KH=${enrichedLevels.baseline_khmer_level || 'null'}, Math=${enrichedLevels.baseline_math_level || 'null'}`);
    console.log(`    Midline: KH=${enrichedLevels.midline_khmer_level || 'null'}, Math=${enrichedLevels.midline_math_level || 'null'}`);
    console.log(`    Endline: KH=${enrichedLevels.endline_khmer_level || 'null'}, Math=${enrichedLevels.endline_math_level || 'null'}`);

    // Check for mismatches
    const mismatches = [];
    if (dbLevels.baseline_math_level !== enrichedLevels.baseline_math_level) {
      mismatches.push(`baseline_math: DB=${dbLevels.baseline_math_level} vs Enriched=${enrichedLevels.baseline_math_level}`);
    }
    if (dbLevels.midline_math_level !== enrichedLevels.midline_math_level) {
      mismatches.push(`midline_math: DB=${dbLevels.midline_math_level} vs Enriched=${enrichedLevels.midline_math_level}`);
    }
    if (mismatches.length > 0) {
      console.log('  ⚠️  MISMATCHES FOUND:', mismatches.join(', '));
    }
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());
