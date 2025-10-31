import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAllPilotSchools } from "@/lib/schools";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { getMentorSchoolIds } from "@/lib/mentorAssignments";

// Validation schema
const pilotSchoolSchema = z.object({
  province: z.string().min(1, "Province is required"),
  district: z.string().min(1, "District is required"),
  cluster: z.string().min(1, "Cluster is required"),
  school_name: z.string().min(1, "School name is required"),
  school_code: z.string().min(1, "School code is required"),
  cluster_id: z.number().optional().nullable(),
  baseline_start_date: z.string().optional().nullable(),
  baseline_end_date: z.string().optional().nullable(),
  midline_start_date: z.string().optional().nullable(),
  midline_end_date: z.string().optional().nullable(),
  endline_start_date: z.string().optional().nullable(),
  endline_end_date: z.string().optional().nullable(),
  is_locked: z.boolean().optional(),
});

// Helper function to check permissions
function hasPermission(userRole: string, action: string): boolean {
  const permissions = {
    admin: ["view", "create", "update", "delete"],
    coordinator: ["view", "create", "update", "delete"],
    mentor: ["view"],
    teacher: ["view"],
    viewer: ["view"]
  };

  return permissions[userRole as keyof typeof permissions]?.includes(action) || false;
}

// GET /api/pilot-schools - List pilot schools for dropdowns and management
export async function GET(request: NextRequest) {
  try {
    // Allow unauthenticated access to schools list for profile setup
    const session = await getServerSession(authOptions);

    // Use standardized pilot schools function
    let schools = await getAllPilotSchools();

    // Filter schools for mentors - they should only see their assigned schools
    if (session?.user?.role === "mentor" && session?.user?.id) {
      const mentorSchoolIds = await getMentorSchoolIds(parseInt(session.user.id));
      if (mentorSchoolIds.length > 0) {
        schools = schools.filter(school => mentorSchoolIds.includes(school.id));
      }
    }

    // Cache this response - schools list changes infrequently
    const response = NextResponse.json({
      data: schools
    });

    // Set cache headers for frequently-accessed dropdown data
    // For mentors, cache shorter since it's personalized
    // For others, cache longer
    const cacheControl = session?.user?.role === "mentor"
      ? 'private, s-maxage=300, stale-while-revalidate=600'  // 5 min cache for mentors
      : 'public, s-maxage=3600, stale-while-revalidate=86400';  // 1 hour for others

    response.headers.set('Cache-Control', cacheControl);

    return response;

  } catch (error) {
    console.error("Error fetching pilot schools:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/pilot-schools - Create new pilot school
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "សូមចូលប្រើប្រាស់ប្រព័ន្ធជាមុនសិន" },
        { status: 401 }
      );
    }

    if (!hasPermission(session.user.role, "create")) {
      return NextResponse.json(
        { error: "អ្នកមិនមានសិទ្ធិបង្កើតសាលារៀនថ្មី" },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Validate input
    const validatedData = pilotSchoolSchema.parse(body);

    // Check if school code already exists
    const existingSchool = await prisma.pilotSchool.findUnique({
      where: { school_code: validatedData.school_code }
    });

    if (existingSchool) {
      return NextResponse.json(
        { error: "លេខកូដសាលារៀននេះមានរួចហើយ" },
        { status: 400 }
      );
    }

    // Create pilot school
    const school = await prisma.pilotSchool.create({
      data: {
        province: validatedData.province,
        district: validatedData.district,
        cluster: validatedData.cluster,
        school_name: validatedData.school_name,
        school_code: validatedData.school_code,
        cluster_id: validatedData.cluster_id,
        baseline_start_date: validatedData.baseline_start_date ? new Date(validatedData.baseline_start_date) : null,
        baseline_end_date: validatedData.baseline_end_date ? new Date(validatedData.baseline_end_date) : null,
        midline_start_date: validatedData.midline_start_date ? new Date(validatedData.midline_start_date) : null,
        midline_end_date: validatedData.midline_end_date ? new Date(validatedData.midline_end_date) : null,
        endline_start_date: validatedData.endline_start_date ? new Date(validatedData.endline_start_date) : null,
        endline_end_date: validatedData.endline_end_date ? new Date(validatedData.endline_end_date) : null,
        is_locked: validatedData.is_locked ?? false,
      }
    });

    return NextResponse.json(
      {
        data: school,
        message: "បានបង្កើតសាលារៀនដោយជោគជ័យ",
        success: true
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("Error creating pilot school:", error);

    if (error.name === "ZodError") {
      return NextResponse.json(
        {
          error: "ទិន្នន័យមិនត្រឹមត្រូវ",
          message: "Validation failed",
          details: error.errors
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: "មានបញ្ហាក្នុងការបង្កើតសាលារៀន",
        message: error.message || "Failed to create pilot school",
        details: error.meta || error.code
      },
      { status: 500 }
    );
  }
}

// PUT /api/pilot-schools - Update pilot school
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "សូមចូលប្រើប្រាស់ប្រព័ន្ធជាមុនសិន" },
        { status: 401 }
      );
    }

    if (!hasPermission(session.user.role, "update")) {
      return NextResponse.json(
        { error: "អ្នកមិនមានសិទ្ធិកែប្រែសាលារៀន" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: "ID ត្រូវការ" },
        { status: 400 }
      );
    }

    // Check if school exists
    const existingSchool = await prisma.pilotSchool.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingSchool) {
      return NextResponse.json(
        { error: "រកមិនឃើញសាលារៀន" },
        { status: 404 }
      );
    }

    // If school_code is being updated, check for duplicates
    if (updateData.school_code && updateData.school_code !== existingSchool.school_code) {
      const duplicate = await prisma.pilotSchool.findUnique({
        where: { school_code: updateData.school_code }
      });

      if (duplicate) {
        return NextResponse.json(
          { error: "លេខកូដសាលារៀននេះមានរួចហើយ" },
          { status: 400 }
        );
      }
    }

    // Prepare update data with date conversion
    const dataToUpdate: any = {};

    if (updateData.province !== undefined) dataToUpdate.province = updateData.province;
    if (updateData.district !== undefined) dataToUpdate.district = updateData.district;
    if (updateData.cluster !== undefined) dataToUpdate.cluster = updateData.cluster;
    if (updateData.school_name !== undefined) dataToUpdate.school_name = updateData.school_name;
    if (updateData.school_code !== undefined) dataToUpdate.school_code = updateData.school_code;
    if (updateData.cluster_id !== undefined) dataToUpdate.cluster_id = updateData.cluster_id;
    if (updateData.is_locked !== undefined) dataToUpdate.is_locked = updateData.is_locked;

    // Handle date fields
    if (updateData.baseline_start_date !== undefined) {
      dataToUpdate.baseline_start_date = updateData.baseline_start_date ? new Date(updateData.baseline_start_date) : null;
    }
    if (updateData.baseline_end_date !== undefined) {
      dataToUpdate.baseline_end_date = updateData.baseline_end_date ? new Date(updateData.baseline_end_date) : null;
    }
    if (updateData.midline_start_date !== undefined) {
      dataToUpdate.midline_start_date = updateData.midline_start_date ? new Date(updateData.midline_start_date) : null;
    }
    if (updateData.midline_end_date !== undefined) {
      dataToUpdate.midline_end_date = updateData.midline_end_date ? new Date(updateData.midline_end_date) : null;
    }
    if (updateData.endline_start_date !== undefined) {
      dataToUpdate.endline_start_date = updateData.endline_start_date ? new Date(updateData.endline_start_date) : null;
    }
    if (updateData.endline_end_date !== undefined) {
      dataToUpdate.endline_end_date = updateData.endline_end_date ? new Date(updateData.endline_end_date) : null;
    }

    // Update pilot school
    const updatedSchool = await prisma.pilotSchool.update({
      where: { id: parseInt(id) },
      data: dataToUpdate
    });

    return NextResponse.json({
      data: updatedSchool,
      message: "បានកែប្រែសាលារៀនដោយជោគជ័យ",
      success: true
    });

  } catch (error: any) {
    console.error("Error updating pilot school:", error);

    return NextResponse.json(
      {
        error: "មានបញ្ហាក្នុងការកែប្រែសាលារៀន",
        message: error.message || "Failed to update pilot school",
        details: error.meta || error.code
      },
      { status: 500 }
    );
  }
}

// DELETE /api/pilot-schools - Delete pilot school
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "សូមចូលប្រើប្រាស់ប្រព័ន្ធជាមុនសិន" },
        { status: 401 }
      );
    }

    if (!hasPermission(session.user.role, "delete")) {
      return NextResponse.json(
        { error: "អ្នកមិនមានសិទ្ធិលុបសាលារៀន" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID ត្រូវការ" },
        { status: 400 }
      );
    }

    // Check if school exists
    const existingSchool = await prisma.pilotSchool.findUnique({
      where: { id: parseInt(id) },
      include: {
        students: { take: 1 },
        assessments: { take: 1 },
        users: { take: 1 },
        mentor_assignments: { take: 1 },
        teacher_assignments: { take: 1 }
      }
    });

    if (!existingSchool) {
      return NextResponse.json(
        { error: "រកមិនឃើញសាលារៀន" },
        { status: 404 }
      );
    }

    // Check for related records
    if (
      existingSchool.students.length > 0 ||
      existingSchool.assessments.length > 0 ||
      existingSchool.users.length > 0 ||
      existingSchool.mentor_assignments.length > 0 ||
      existingSchool.teacher_assignments.length > 0
    ) {
      return NextResponse.json(
        {
          error: "មិនអាចលុបសាលារៀននេះបានទេ ព្រោះមានទិន្នន័យពាក់ព័ន្ធ",
          message: "Cannot delete school with related data (students, assessments, users, or assignments)"
        },
        { status: 400 }
      );
    }

    // Delete pilot school
    await prisma.pilotSchool.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({
      message: "បានលុបសាលារៀនដោយជោគជ័យ",
      success: true
    });

  } catch (error: any) {
    console.error("Error deleting pilot school:", error);

    return NextResponse.json(
      {
        error: "មានបញ្ហាក្នុងការលុបសាលារៀន",
        message: error.message || "Failed to delete pilot school",
        details: error.meta || error.code
      },
      { status: 500 }
    );
  }
}