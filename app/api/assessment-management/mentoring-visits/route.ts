import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/assessment-management/mentoring-visits - Get mentoring visits for management
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
    const mentor_id = searchParams.get("mentor_id") || "";
    const teacher_id = searchParams.get("teacher_id") || "";
    const lock_status = searchParams.get("lock_status") || "";
    
    // Build where clause
    const where: any = {};
    
    if (pilot_school_id) {
      where.pilot_school_id = parseInt(pilot_school_id);
    }
    
    if (mentor_id) {
      where.mentor_id = parseInt(mentor_id);
    }
    
    if (teacher_id) {
      where.teacher_id = parseInt(teacher_id);
    }
    
    if (lock_status) {
      where.is_locked = lock_status === 'locked';
    }

    // Pilot school filters  
    if (province) {
      where.pilot_school = {
        province: {
          name_english: province
        }
      };
    }

    const mentoringVisits = await prisma.mentoringVisit.findMany({
      where,
      include: {
        mentor: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        },
        teacher: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        },
        pilot_schools: {
          select: {
            id: true,
            name: true,
            code: true,
            province: {
              select: {
                name_english: true,
                name_khmer: true
              }
            }
          }
        },
        locked_by_user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: { visit_date: 'desc' }
    });

    return NextResponse.json({ data: mentoringVisits });

  } catch (error) {
    console.error("Error fetching mentoring visits for management:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}