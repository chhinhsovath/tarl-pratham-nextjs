import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/mentoring/debug - Debug endpoint to check actual database values
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== "admin") {
      return NextResponse.json({ error: "Admin only" }, { status: 403 });
    }

    // Get recent 5 visits with the specific fields
    const visits = await prisma.mentoring_visits.findMany({
      take: 5,
      orderBy: { id: 'desc' },
      select: {
        id: true,
        visit_date: true,
        class_started_on_time: true,
        late_start_reason: true,
        teaching_materials: true,
        students_grouped_by_level: true,
        students_active_participation: true,
        children_grouped_appropriately: true,
      }
    });

    // Return raw values with type info
    const debugData = visits.map(v => ({
      id: v.id,
      visit_date: v.visit_date,
      fields: {
        class_started_on_time: { value: v.class_started_on_time, type: typeof v.class_started_on_time, isNull: v.class_started_on_time === null },
        students_grouped_by_level: { value: v.students_grouped_by_level, type: typeof v.students_grouped_by_level, isNull: v.students_grouped_by_level === null },
        students_active_participation: { value: v.students_active_participation, type: typeof v.students_active_participation, isNull: v.students_active_participation === null },
        children_grouped_appropriately: { value: v.children_grouped_appropriately, type: typeof v.children_grouped_appropriately, isNull: v.children_grouped_appropriately === null },
        teaching_materials: { value: v.teaching_materials, type: typeof v.teaching_materials, isNull: v.teaching_materials === null },
      }
    }));

    return NextResponse.json({
      message: "Debug data - raw database values",
      total_checked: visits.length,
      data: debugData
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
