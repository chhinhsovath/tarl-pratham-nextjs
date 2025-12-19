import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/school-classes - List school classes for dropdowns
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const school_id = searchParams.get("school_id");

    const where: any = {};
    
    if (school_id) {
      where.school_id = parseInt(school_id);
    }

    const schoolClasses = await prisma.school_classes.findMany({
      where,
      include: {
        school: {
          select: {
            id: true,
            name: true,
            code: true,
            province: {
              select: {
                name_english: true
              }
            }
          }
        },
        students: {
          where: { is_active: true },
          select: { id: true }
        }
      },
      orderBy: [
        { school: { name: "asc" } },
        { grade: "asc" },
        { name: "asc" }
      ]
    });

    const data = schoolClasses.map(cls => ({
      id: cls.id,
      name: cls.name,
      grade: cls.grade,
      teacher_name: cls.teacher_name,
      student_count: cls.students.length,
      school: cls.school,
      full_name: `${cls.school.name} - Grade ${cls.grade} - ${cls.name}`
    }));

    return NextResponse.json({
      data: data
    });

  } catch (error) {
    console.error("Error fetching school classes:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}