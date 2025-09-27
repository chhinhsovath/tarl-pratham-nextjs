import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/provinces - List all provinces for dropdowns
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const provinces = await prisma.province.findMany({
      select: {
        id: true,
        name_english: true,
        name_khmer: true,
        code: true
      },
      orderBy: { name_english: "asc" }
    });

    return NextResponse.json({
      data: provinces
    });

  } catch (error) {
    console.error("Error fetching provinces:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}