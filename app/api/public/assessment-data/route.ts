import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const subject = searchParams.get("subject") || "khmer";

    // Define levels based on subject
    let levels: string[];
    let levelLabels: string[];
    
    if (subject === "khmer") {
      levels = ["Beginner", "Letter", "Word", "Paragraph", "Story", "Comp. 1", "Comp. 2"];
      levelLabels = ["Beginner / ចាប់ផ្តើម", "Letter / អក្សរ", "Word / ពាក្យ", 
                     "Paragraph / កថាខណ្ឌ", "Story / រឿង", "Comp. 1 / យល់ដឹង 1", "Comp. 2 / យល់ដឹង 2"];
    } else {
      levels = ["Beginner", "1-Digit", "2-Digit", "Subtraction", "Division", "Word Problem"];
      levelLabels = ["Beginner / ចាប់ផ្តើម", "1-Digit / លេខ១ខ្ទង់", "2-Digit / លេខ២ខ្ទង់", 
                     "Subtraction / ដក", "Division / ចែក", "Word Problem / ល្បាយពាក្យ"];
    }

    // Get assessment counts by level
    const assessmentCounts = await Promise.all(
      levels.map(async (level) => {
        const count = await prisma.assessment.count({
          where: {
            subject: subject,
            level: level.toLowerCase().replace(/\s+/g, "_").replace(/\./g, "")
          }
        });
        return count;
      })
    );

    // Get cycle counts (baseline, midline, endline)
    const [baseline, midline, endline] = await Promise.all([
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
      })
    ]);

    // Get total unique students assessed
    const totalStudents = await prisma.assessment.findMany({
      where: {
        subject: subject
      },
      distinct: ['student_id'],
      select: {
        student_id: true
      }
    });

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
    
    // Return default data structure on error
    const defaultLevels = request.nextUrl.searchParams.get("subject") === "math"
      ? ["Beginner", "1-Digit", "2-Digit", "Subtraction", "Division", "Word Problem"]
      : ["Beginner", "Letter", "Word", "Paragraph", "Story", "Comp. 1", "Comp. 2"];
    
    return NextResponse.json({
      chartData: {
        labels: defaultLevels,
        datasets: [{
          label: 'Students',
          data: new Array(defaultLevels.length).fill(0),
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