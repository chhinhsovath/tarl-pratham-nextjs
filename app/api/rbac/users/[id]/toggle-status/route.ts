import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST /api/rbac/users/[id]/toggle-status
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only admins can toggle user status
    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const userId = parseInt(params.id);
    
    if (isNaN(userId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    // Get current user
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Prevent deactivating the last admin
    if (user.role === 'admin' && user.is_active) {
      const adminCount = await prisma.user.count({
        where: { role: 'admin', is_active: true }
      });
      
      if (adminCount <= 1) {
        return NextResponse.json(
          { error: "Cannot deactivate the last admin user" },
          { status: 400 }
        );
      }
    }

    // Toggle user status
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { is_active: !user.is_active },
      include: {
        pilot_school: {
          select: {
            id: true,
            school_name: true
          }
        }
      }
    });

    const status = updatedUser.is_active ? 'activated' : 'deactivated';

    return NextResponse.json({
      message: `User ${status} successfully`,
      user: updatedUser
    });

  } catch (error) {
    console.error("Error toggling user status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}