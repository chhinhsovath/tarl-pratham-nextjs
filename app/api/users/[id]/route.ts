import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/users/[id] - Get single user
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt(params.id);

    // Validate user ID
    if (isNaN(userId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    // Check permissions - users can view their own data, admins/coordinators can view all
    const canView = session.user.role === "admin" ||
                   session.user.role === "coordinator" ||
                   session.user.id === params.id;

    if (!canView) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        role: true,
        province: true,
        district: true,
        commune: true,
        village: true,
        subject: true,
        phone: true,
        sex: true,
        holding_classes: true,
        assigned_subject: true,
        pilot_school_id: true,
        school_id: true,
        is_active: true,
        onboarding_completed: true,
        onboarding_completed_at: true,
        show_onboarding: true,
        created_at: true,
        updated_at: true,
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

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      data: user
    });

  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch user",
        message: error instanceof Error ? error.message : "Unknown error",
        code: (error as any)?.code || "UNKNOWN_ERROR",
        meta: (error as any)?.meta || {}
      },
      { status: 500 }
    );
  }
}