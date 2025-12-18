import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
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

    // CRITICAL: ZERO JOINS - Only simple count queries with safe fallbacks
    // Each count is independent and very efficient
    let teacherCount = 0;
    let mentorCount = 0;
    let schoolCount = 0;
    let assessmentCount = 0;

    try {
      teacherCount = await prisma.user.count({
        where: { role: 'teacher', is_active: true }
      });
    } catch (e) {
      console.error('Error counting teachers:', e);
    }

    try {
      mentorCount = await prisma.user.count({
        where: { role: 'mentor', is_active: true }
      });
    } catch (e) {
      console.error('Error counting mentors:', e);
    }

    try {
      // PilotSchool is the correct model name (PascalCase in schema = camelCase instance)
      schoolCount = await prisma.pilotSchool.count();
    } catch (e) {
      console.error('Error counting schools:', e);
      // Fallback: try School model if PilotSchool doesn't exist
      try {
        schoolCount = await prisma.school.count();
      } catch (e2) {
        console.error('Error counting schools (fallback):', e2);
      }
    }

    try {
      assessmentCount = await prisma.assessments.count();
    } catch (e) {
      console.error('Error counting assessments:', e);
    }

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
