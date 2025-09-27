import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/pilot-schools - List pilot schools for dropdowns and management
export async function GET(request: NextRequest) {
  try {
    // Allow unauthenticated access to schools list for profile setup
    const session = await getServerSession(authOptions);

    const pilotSchools = await prisma.school.findMany({
      orderBy: { name: "asc" }
    });

    // Transform to match expected interface
    const transformedData = pilotSchools.map(school => ({
      id: school.id,
      school_name: school.name,
      province: school.district || "N/A",
      district: school.commune || "N/A"
    }));

    return NextResponse.json({
      data: transformedData
    });

  } catch (error) {
    console.error("Error fetching pilot schools:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}