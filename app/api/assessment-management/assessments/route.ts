import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/assessment-management/assessments - Get assessments for management
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only admins can access assessment management
    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const province = searchParams.get("province") || "";
    const pilot_school_id = searchParams.get("pilot_school_id") || "";
    const teacher_id = searchParams.get("teacher_id") || "";
    const cycle = searchParams.get("cycle") || "";
    const subject = searchParams.get("subject") || "";
    const lock_status = searchParams.get("lock_status") || "";
    
    // Build where clause
    const where: any = {};
    
    if (cycle) {
      where.cycle = cycle;
    }
    
    if (subject) {
      where.subject = subject;
    }
    
    if (lock_status) {
      where.is_locked = lock_status === 'locked';
    }

    // Student filters
    const studentWhere: any = {};
    
    if (pilot_school_id) {
      studentWhere.pilot_school_id = parseInt(pilot_school_id);
    }
    
    if (teacher_id) {
      studentWhere.teacher_id = parseInt(teacher_id);
    }

    // Add student filters if any exist
    if (Object.keys(studentWhere).length > 0) {
      where.student = studentWhere;
    }

    // Pilot school filters
    const pilotSchoolWhere: any = {};
    
    if (province) {
      pilotSchoolWhere.province = {
        name_english: province
      };
    }

    // If we have pilot school filters, we need to include them in the student relationship
    if (Object.keys(pilotSchoolWhere).length > 0) {
      where.student = {
        ...where.student,
        pilot_school: pilotSchoolWhere
      };
    }

    const assessments = await prisma.assessments.findMany({
      where,
      include: {
        students: {
          include: {
            pilot_schools: {
              include: {
                province: {
                  select: {
                    name_english: true,
                    name_khmer: true
                  }
                }
              }
            },
            teacher: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      },
      orderBy: { created_at: 'desc' }
    });

    return NextResponse.json({ data: assessments });

  } catch (error) {
    console.error("Error fetching assessments for management:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}