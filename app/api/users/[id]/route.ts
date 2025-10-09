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
        role: true,
        province: true,
        subject: true,
        phone: true,
        pilot_school_id: true,
        teacher_profile_setup: true,
        mentor_profile_complete: true,
        created_at: true,
        updated_at: true,
        pilot_school: {
          select: {
            id: true,
            school_name: true,
            school_code: true,
            province: true // province is a string, not a relation
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
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}