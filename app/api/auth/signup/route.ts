import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// POST /api/auth/signup - Create new quick login user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password, role, province, subject, pilot_school_id, holding_classes, district } = body;

    // Validation
    if (!username || !password || !role) {
      return NextResponse.json(
        { error: "សូមបំពេញព័ត៌មានចាំបាច់ទាំងអស់" },
        { status: 400 }
      );
    }

    // Check if username already exists
    const existingUser = await prisma.quickLoginUser.findUnique({
      where: { username }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "ឈ្មោះអ្នកប្រើប្រាស់នេះត្រូវបានប្រើរួចហើយ" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Convert holding_classes array to comma-separated string
    const holdingClassesString = Array.isArray(holding_classes)
      ? holding_classes.join(', ')
      : holding_classes;

    // Create new user
    const newUser = await prisma.quickLoginUser.create({
      data: {
        username,
        password: hashedPassword,
        role: role || "teacher",
        province,
        subject,
        pilot_school_id,
        holding_classes: holdingClassesString,
        district,
        is_active: true,
        show_onboarding: true
      },
      select: {
        id: true,
        username: true,
        role: true,
        province: true,
        subject: true,
        created_at: true
      }
    });

    return NextResponse.json({
      success: true,
      user: newUser,
      message: "ការចុះឈ្មោះបានជោគជ័យ! សូមចូលប្រើប្រាស់។"
    });

  } catch (error: any) {
    console.error("Signup error:", error);

    return NextResponse.json(
      {
        error: "កំហុសបានកើតឡើងក្នុងការចុះឈ្មោះ",
        message: error.message
      },
      { status: 500 }
    );
  }
}
