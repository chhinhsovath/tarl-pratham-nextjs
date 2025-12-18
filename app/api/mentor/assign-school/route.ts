import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

/**
 * POST /api/mentor/assign-school
 * Allow mentor to self-assign to a pilot school
 */

const assignSchoolSchema = z.object({
  pilot_school_id: z.number().min(1, "Pilot school ID is required"),
  subject: z.enum(["Language", "Math"], {
    errorMap: () => ({ message: "Subject must be Language or Math" })
  }).optional()
});

export async function POST(request: NextRequest) {
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
        { error: "តែអ្នកណែនាំប៉ុណ្ណោះអាចប្រើមុខងារនេះ" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validatedData = assignSchoolSchema.parse(body);
    const mentorId = parseInt(session.user.id);

    // Verify pilot school exists
    const pilotSchool = await prisma.pilotSchool.findUnique({
      where: { id: validatedData.pilot_school_id }
    });

    if (!pilotSchool) {
      return NextResponse.json(
        {
          error: "រកមិនឃើញសាលារៀន",
          message: "Pilot school not found",
          code: "SCHOOL_NOT_FOUND"
        },
        { status: 404 }
      );
    }

    // Update user's pilot_school_id
    const updatedUser = await prisma.user.update({
      where: { id: mentorId },
      data: {
        pilot_school_id: validatedData.pilot_school_id,
        province: pilotSchool.province,
        district: pilotSchool.district
      },
      select: {
        id: true,
        name: true,
        email: true,
        pilot_school_id: true,
        province: true,
        district: true
      }
    });

    // Create a mentor assignment record if subject is provided
    if (validatedData.subject) {
      // Check if assignment already exists
      const existingAssignment = await prisma.mentorSchoolAssignment.findFirst({
        where: {
          mentor_id: mentorId,
          pilot_school_id: validatedData.pilot_school_id,
          subject: validatedData.subject
        }
      });

      if (!existingAssignment) {
        await prisma.mentorSchoolAssignment.create({
          data: {
            mentor_id: mentorId,
            pilot_school_id: validatedData.pilot_school_id,
            subject: validatedData.subject,
            assigned_by_id: mentorId, // Self-assigned
            is_active: true,
            notes: "Self-assigned by mentor"
          }
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: "បានជ្រើសរើសសាលារៀនដោយជោគជ័យ",
      data: {
        user: updatedUser,
        school: {
          id: pilotSchool.id,
          name: pilotSchool.school_name,
          code: pilotSchool.school_code,
          province: pilotSchool.province,
          district: pilotSchool.district
        }
      }
    });
  } catch (error: any) {
    console.error("Error assigning mentor to school:", error);

    if (error.name === "ZodError") {
      return NextResponse.json(
        {
          error: "ទិន្នន័យមិនត្រឹមត្រូវ",
          message: "Invalid data provided",
          details: error.errors
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: "មានបញ្ហាក្នុងការកំណត់សាលារៀន",
        message: error.message,
        code: error.code
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/mentor/assign-school
 * Get current mentor's school assignment status
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
        { error: "តែអ្នកណែនាំប៉ុណ្ណោះអាចប្រើមុខងារនេះ" },
        { status: 403 }
      );
    }

    const mentorId = parseInt(session.user.id);

    // Get user with school info
    const user = await prisma.user.findUnique({
      where: { id: mentorId },
      select: {
        id: true,
        name: true,
        email: true,
        pilot_school_id: true,
        province: true,
        district: true,
        pilot_schools: {
          select: {
            id: true,
            school_name: true,
            school_code: true,
            province: true,
            district: true,
            cluster: true
          }
        }
      }
    });

    // Get mentor assignments
    const assignments = await prisma.mentorSchoolAssignment.findMany({
      where: {
        mentor_id: mentorId,
        is_active: true
      },
      include: {
        pilot_schools: {
          select: {
            id: true,
            school_name: true,
            school_code: true,
            province: true,
            district: true,
            cluster: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: user?.id,
          name: user?.name,
          email: user?.email,
          pilot_school_id: user?.pilot_school_id,
          pilot_school: user?.pilot_school
        },
        assignments: assignments,
        has_school: !!user?.pilot_school_id
      }
    });
  } catch (error: any) {
    console.error("Error fetching mentor school status:", error);
    return NextResponse.json(
      {
        error: "មានបញ្ហាក្នុងការទាញយកទិន្នន័យ",
        message: error.message
      },
      { status: 500 }
    );
  }
}
