import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/stats/summary
 *
 * Returns count statistics for teachers, mentors, schools, and assessments
 * ZERO JOINS - Only simple count queries to prevent connection exhaustion
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // CRITICAL: ZERO JOINS - Only simple count queries
    // Each count is independent and very efficient
    const [teacherCount, mentorCount, schoolCount, assessmentCount] = await Promise.all([
      // Count teachers
      prisma.user.count({
        where: { role: 'teacher', is_active: true }
      }),

      // Count mentors
      prisma.user.count({
        where: { role: 'mentor', is_active: true }
      }),

      // Count schools
      prisma.pilot_school.count(),

      // Count assessments
      prisma.assessment.count()
    ]);

    return NextResponse.json({
      data: {
        teachers: teacherCount,
        mentors: mentorCount,
        schools: schoolCount,
        assessments: assessmentCount
      }
    });

  } catch (error: any) {
    console.error("Stats summary error:", error);
    return NextResponse.json(
      {
        error: "មានបញ្ហាក្នុងការទាញយកទិន្នន័យស្ថិតិ",
        message: error.message
      },
      { status: 500 }
    );
  }
}
