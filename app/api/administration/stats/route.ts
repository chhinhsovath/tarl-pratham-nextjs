import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/administration/stats
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only admins can access administration statistics
    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get comprehensive system statistics
    const [
      totalUsers,
      activeUsers,
      totalSchools,
      totalStudents,
      totalAssessments,
      totalMentoringVisits
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { is_active: true } }),
      prisma.pilotSchool.count(),
      prisma.student.count(),
      prisma.assessments.count(),
      prisma.mentoringVisit.count()
    ]);

    const stats = {
      total_users: totalUsers,
      active_users: activeUsers,
      total_schools: totalSchools,
      total_students: totalStudents,
      total_assessments: totalAssessments,
      total_mentoring_visits: totalMentoringVisits
    };

    return NextResponse.json(stats);

  } catch (error) {
    console.error("Error fetching administration statistics:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}