import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAllPilotSchools } from "@/lib/schools";

// GET /api/pilot-schools - List pilot schools for dropdowns and management
export async function GET(request: NextRequest) {
  try {
    // Allow unauthenticated access to schools list for profile setup
    const session = await getServerSession(authOptions);

    // Use standardized pilot schools function
    const schools = await getAllPilotSchools();

    return NextResponse.json({
      data: schools
    });

  } catch (error) {
    console.error("Error fetching pilot schools:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}