import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/pilot-schools - List pilot schools for dropdowns and management
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const province_id = searchParams.get("province_id");
    const with_stats = searchParams.get("with_stats") === "true";

    const where: any = { is_active: true };
    
    if (province_id) {
      where.province_id = parseInt(province_id);
    }

    // For mentors and teachers, limit to their assigned pilot school
    if ((session.user.role === "mentor" || session.user.role === "teacher") && session.user.pilot_school_id) {
      where.id = session.user.pilot_school_id;
    }

    const pilotSchools = await prisma.pilotSchool.findMany({
      where,
      include: {
        province: {
          select: {
            id: true,
            name_english: true,
            name_khmer: true,
            code: true
          }
        },
        ...(with_stats && {
          users: {
            where: { role: "mentor" },
            select: { id: true, name: true }
          },
          students: {
            where: { is_active: true },
            select: { id: true }
          },
          mentoring_visits: {
            select: { 
              id: true, 
              status: true,
              visit_date: true 
            }
          }
        })
      },
      orderBy: { name: "asc" }
    });

    // Calculate statistics if requested
    const data = with_stats ? pilotSchools.map(school => ({
      ...school,
      mentor_count: school.users?.length || 0,
      student_count: school.students?.length || 0,
      visit_count: school.mentoring_visits?.length || 0,
      completed_visits: school.mentoring_visits?.filter(v => v.status === "completed").length || 0,
      recent_visit: school.mentoring_visits?.reduce((latest, visit) => 
        !latest || new Date(visit.visit_date) > new Date(latest.visit_date) ? visit : latest, 
        null as any
      )
    })) : pilotSchools;

    return NextResponse.json({
      data: data
    });

  } catch (error) {
    console.error("Error fetching pilot schools:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}