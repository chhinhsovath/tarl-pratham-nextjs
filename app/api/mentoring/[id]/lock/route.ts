import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST /api/mentoring/[id]/lock - Lock a mentoring visit
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only admins and coordinators can lock/unlock visits
    if (session.user.role !== "admin" && session.user.role !== "coordinator") {
      return NextResponse.json({ error: "Forbidden - Admin or Coordinator only" }, { status: 403 });
    }

    const visitId = parseInt(params.id);
    
    if (isNaN(visitId)) {
      return NextResponse.json({ error: "Invalid visit ID" }, { status: 400 });
    }

    // Check if visit exists
    const existingVisit = await prisma.mentoring_visits.findUnique({
      where: { id: visitId }
    });

    if (!existingVisit) {
      return NextResponse.json({ error: "Mentoring visit not found" }, { status: 404 });
    }

    if (existingVisit.is_locked) {
      return NextResponse.json({ error: "Visit is already locked" }, { status: 400 });
    }

    // Lock the visit
    const visit = await prisma.mentoring_visits.update({
      where: { id: visitId },
      data: {
        is_locked: true,
        locked_by: parseInt(session.user.id),
        locked_at: new Date()
      },
      include: {
        users: {
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
            school_name: true,
            school_code: true
          }
        }
      }
    });

    return NextResponse.json({ 
      message: "Mentoring visit locked successfully",
      data: visit 
    });

  } catch (error) {
    console.error("Error locking mentoring visit:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/mentoring/[id]/lock - Unlock a mentoring visit
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only admins and coordinators can lock/unlock visits
    if (session.user.role !== "admin" && session.user.role !== "coordinator") {
      return NextResponse.json({ error: "Forbidden - Admin or Coordinator only" }, { status: 403 });
    }

    const visitId = parseInt(params.id);
    
    if (isNaN(visitId)) {
      return NextResponse.json({ error: "Invalid visit ID" }, { status: 400 });
    }

    // Check if visit exists
    const existingVisit = await prisma.mentoring_visits.findUnique({
      where: { id: visitId }
    });

    if (!existingVisit) {
      return NextResponse.json({ error: "Mentoring visit not found" }, { status: 404 });
    }

    if (!existingVisit.is_locked) {
      return NextResponse.json({ error: "Visit is not locked" }, { status: 400 });
    }

    // Unlock the visit
    const visit = await prisma.mentoring_visits.update({
      where: { id: visitId },
      data: {
        is_locked: false,
        locked_by: null,
        locked_at: null
      },
      include: {
        users: {
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
            school_name: true,
            school_code: true
          }
        }
      }
    });

    return NextResponse.json({ 
      message: "Mentoring visit unlocked successfully",
      data: visit 
    });

  } catch (error) {
    console.error("Error unlocking mentoring visit:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}