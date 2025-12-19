import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/pilot-schools/[id] - Get single pilot school by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "សូមចូលប្រើប្រាស់ប្រព័ន្ធជាមុនសិន" },
        { status: 401 }
      );
    }

    const schoolId = parseInt(params.id);

    if (isNaN(schoolId)) {
      return NextResponse.json(
        { error: "លេខសម្គាល់សាលារៀនមិនត្រឹមត្រូវ" },
        { status: 400 }
      );
    }

    const school = await prisma.pilot_schools.findUnique({
      where: { id: schoolId },
      select: {
        id: true,
        province: true,
        district: true,
        cluster: true,
        school_name: true,
        school_code: true,
        baseline_start_date: true,
        baseline_end_date: true,
        midline_start_date: true,
        midline_end_date: true,
        endline_start_date: true,
        endline_end_date: true,
        is_locked: true,
        created_at: true,
        updated_at: true,
      },
    });

    if (!school) {
      return NextResponse.json(
        { error: "រកមិនឃើញសាលារៀន" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: school });
  } catch (error) {
    console.error("Error fetching pilot school:", error);
    return NextResponse.json(
      {
        error: "មានបញ្ហាក្នុងការទាញយកទិន្នន័យសាលារៀន",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// PUT /api/pilot-schools/[id] - Update pilot school
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "សូមចូលប្រើប្រាស់ប្រព័ន្ធជាមុនសិន" },
        { status: 401 }
      );
    }

    // Only admin and coordinator can update schools
    if (session.user.role !== "admin" && session.user.role !== "coordinator") {
      return NextResponse.json(
        { error: "អ្នកមិនមានសិទ្ធិកែប្រែសាលារៀន" },
        { status: 403 }
      );
    }

    const schoolId = parseInt(params.id);

    if (isNaN(schoolId)) {
      return NextResponse.json(
        { error: "លេខសម្គាល់សាលារៀនមិនត្រឹមត្រូវ" },
        { status: 400 }
      );
    }

    const body = await request.json();

    // Validate required fields - ONLY name and province can be edited by users
    if (!body.school_name || body.school_name.trim() === "") {
      return NextResponse.json(
        { error: "សូមបញ្ចូលឈ្មោះសាលារៀន" },
        { status: 400 }
      );
    }

    if (!body.province || body.province.trim() === "") {
      return NextResponse.json(
        { error: "សូមជ្រើសរើសខេត្ត" },
        { status: 400 }
      );
    }

    // Update the school - ONLY allow editing name and province
    // school_code, district, cluster are auto-managed and should not be changed
    const updatedSchool = await prisma.pilot_schools.update({
      where: { id: schoolId },
      data: {
        school_name: body.school_name.trim(),
        province: body.province.trim(),
        // Do NOT update: school_code, district, cluster, assessment dates
      },
    });

    return NextResponse.json({
      message: "បានកែប្រែសាលារៀនដោយជោគជ័យ",
      data: updatedSchool,
    });
  } catch (error) {
    console.error("Error updating pilot school:", error);
    return NextResponse.json(
      {
        error: "មានបញ្ហាក្នុងការកែប្រែសាលារៀន",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// DELETE /api/pilot-schools/[id] - Delete pilot school
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "សូមចូលប្រើប្រាស់ប្រព័ន្ធជាមុនសិន" },
        { status: 401 }
      );
    }

    // Only admin can delete schools
    if (session.user.role !== "admin") {
      return NextResponse.json(
        { error: "អ្នកមិនមានសិទ្ធិលុបសាលារៀន" },
        { status: 403 }
      );
    }

    const schoolId = parseInt(params.id);

    if (isNaN(schoolId)) {
      return NextResponse.json(
        { error: "លេខសម្គាល់សាលារៀនមិនត្រឹមត្រូវ" },
        { status: 400 }
      );
    }

    await prisma.pilot_schools.delete({
      where: { id: schoolId },
    });

    return NextResponse.json({
      message: "បានលុបសាលារៀនដោយជោគជ័យ",
    });
  } catch (error) {
    console.error("Error deleting pilot school:", error);
    return NextResponse.json(
      {
        error: "មានបញ្ហាក្នុងការលុបសាលារៀន",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
