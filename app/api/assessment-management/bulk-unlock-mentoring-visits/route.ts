import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const bulkUnlockSchema = z.object({
  mentoring_visit_ids: z.array(z.number()).min(1, "At least one mentoring visit ID is required")
});

// POST /api/assessment-management/bulk-unlock-mentoring-visits
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only admins and coordinators can unlock mentoring visits
    if (session.user.role !== "admin" && session.user.role !== "coordinator") {
      return NextResponse.json({ error: "Forbidden - Admin or Coordinator only" }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = bulkUnlockSchema.parse(body);

    // Update mentoring visits to unlocked status
    const result = await prisma.mentoring_visits.updateMany({
      where: {
        id: { in: validatedData.mentoring_visit_ids },
        is_locked: true // Only unlock locked visits
      },
      data: {
        is_locked: false,
        locked_by: null,
        locked_at: null
      }
    });

    return NextResponse.json({ 
      message: `${result.count} mentoring visits unlocked successfully`,
      unlocked_count: result.count
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    
    console.error("Error bulk unlocking mentoring visits:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}