import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const bulkLockSchema = z.object({
  mentoring_visit_ids: z.array(z.number()).min(1, "At least one mentoring visit ID is required")
});

// POST /api/assessment-management/bulk-lock-mentoring-visits
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only admins and coordinators can lock mentoring visits
    if (session.user.role !== "admin" && session.user.role !== "coordinator") {
      return NextResponse.json({ error: "Forbidden - Admin or Coordinator only" }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = bulkLockSchema.parse(body);

    // Update mentoring visits to locked status
    const result = await prisma.mentoring_visits.updateMany({
      where: {
        id: { in: validatedData.mentoring_visit_ids },
        is_locked: false // Only lock unlocked visits
      },
      data: {
        is_locked: true,
        locked_by: parseInt(session.user.id),
        locked_at: new Date()
      }
    });

    return NextResponse.json({ 
      message: `${result.count} mentoring visits locked successfully`,
      locked_count: result.count
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    
    console.error("Error bulk locking mentoring visits:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}