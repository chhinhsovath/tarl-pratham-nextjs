import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const subjectParam = searchParams.get("subject") || "khmer";

    // Map frontend subject parameter to database subject value
    // Frontend uses "khmer" but database uses "language"
    const subject = subjectParam === "khmer" ? "language" : subjectParam;

    // Define levels based on subject parameter (khmer or math)
    // These match the exact level values in the database
    let levels: string[];
    let levelLabels: string[];

    if (subjectParam === "khmer") {
      // Database levels: beginner, letter, word, paragraph, story, comprehension1, comprehension2
      levels = ["beginner", "letter", "word", "paragraph", "story", "comprehension1", "comprehension2"];
      levelLabels = ["ចាប់ផ្តើម", "អក្សរ", "ពាក្យ", "កថាខណ្ឌ", "រឿង", "យល់ដឹង ១", "យល់ដឹង ២"];
    } else {
      // Database levels: number_2digit, subtraction, division, word_problems
      levels = ["number_2digit", "subtraction", "division", "word_problems"];
      levelLabels = ["លេខ២ខ្ទង់", "ដក", "ចែក", "ល្បាយពាក្យ"];
    }

    // Get assessment counts by level - OPTIMIZED: Single groupBy query instead of parallel map
    const levelCounts = await prisma.assessment.groupBy({
      by: ['level'],
      where: { subject: subject },
      _count: { level: true }
    });

    // Convert grouped results to array matching levels order
    const assessmentCounts = levels.map(level => {
      const found = levelCounts.find(lc => lc.level === level);
      return found?._count.level || 0;
    });

    // BATCH: Cycle counts + total students (4 queries)
    const [baseline, midline, endline, totalStudents] = await Promise.all([
      prisma.assessment.count({
        where: {
          subject: subject,
          assessment_type: "baseline"
        }
      }),
      prisma.assessment.count({
        where: {
          subject: subject,
          assessment_type: "midline"
        }
      }),
      prisma.assessment.count({
        where: {
          subject: subject,
          assessment_type: "endline"
        }
      }),
      // Get total unique students assessed
      prisma.assessment.findMany({
        where: {
          subject: subject
        },
        distinct: ['student_id'],
        select: {
          student_id: true
        }
      })
    ]);

    // Prepare chart data
    const chartData = {
      labels: levelLabels,
      datasets: [{
        label: 'Students',
        data: assessmentCounts,
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1
      }]
    };

    // Prepare cycle data
    const cycleData = {
      baseline: baseline || 0,
      midline: midline || 0,
      endline: endline || 0,
      total: totalStudents.length
    };

    return NextResponse.json({
      chartData,
      cycleData
    });

  } catch (error) {
    console.error("Error fetching assessment data:", error);

    // Return default data structure on error with Khmer labels
    const subjectParam = request.nextUrl.searchParams.get("subject") || "khmer";
    const defaultLevelLabels = subjectParam === "math"
      ? ["លេខ២ខ្ទង់", "ដក", "ចែក", "ល្បាយពាក្យ"]
      : ["ចាប់ផ្តើម", "អក្សរ", "ពាក្យ", "កថាខណ្ឌ", "រឿង", "យល់ដឹង ១", "យល់ដឹង ២"];

    return NextResponse.json({
      chartData: {
        labels: defaultLevelLabels,
        datasets: [{
          label: 'Students',
          data: new Array(defaultLevelLabels.length).fill(0),
          backgroundColor: 'rgba(59, 130, 246, 0.8)',
          borderColor: 'rgb(59, 130, 246)',
          borderWidth: 1
        }]
      },
      cycleData: {
        baseline: 0,
        midline: 0,
        endline: 0,
        total: 0
      }
    });
  }
}