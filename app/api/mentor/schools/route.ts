import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getMentorAssignedSchools } from "@/lib/mentorAssignments";

/**
 * GET /api/mentor/schools
 * Get list of schools assigned to the authenticated mentor
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "សូមចូលប្រើប្រាស់ប្រព័ន្ធជាមុនសិន" },
        { status: 401 }
      );
    }

    if (session.user.role !== "mentor") {
      return NextResponse.json(
        { error: "តែគ្រូព្រឹក្សាគរុកោសល្យបានអាចចូលមើលទំព័រនេះ" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const subject = searchParams.get("subject");

    const mentorId = parseInt(session.user.id);

    // Get assigned schools
    const schools = await getMentorAssignedSchools(
      mentorId,
      subject || undefined
    );

    return NextResponse.json({
      schools: schools,
      count: schools.length,
    });
  } catch (error: any) {
    console.error("Error fetching mentor schools:", error);
    return NextResponse.json(
      {
        error: "មានបញ្ហាក្នុងការទាញយកទិន្នន័យ",
        message: error.message,
      },
      { status: 500 }
    );
  }
}
