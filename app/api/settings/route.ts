import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";

const updateSettingsSchema = z.object({
  app_name: z.string().min(1, "Application name is required").max(255),
  app_timezone: z.string().min(1, "Timezone is required"),
  app_locale: z.enum(["en", "km"], { errorMap: () => ({ message: "Locale must be either 'en' or 'km'" }) }),
  mail_from_address: z.string().email("Invalid email address").optional().or(z.literal("")),
  mail_from_name: z.string().max(255).optional().or(z.literal("")),
});

// In-memory settings storage (in a real app, you'd use a database or persistent storage)
let cachedSettings = {
  app_name: "TaRL Pratham System",
  app_timezone: "Asia/Phnom_Penh",
  app_locale: "km",
  mail_from_address: "noreply@tarlpratham.com",
  mail_from_name: "TaRL Pratham System",
};

// GET /api/settings
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only admins can access settings
    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden. Admin privileges required." }, { status: 403 });
    }

    // Return current settings from cache or default values
    const settings = {
      app_name: cachedSettings.app_name || "TaRL Pratham System",
      app_timezone: cachedSettings.app_timezone || "Asia/Phnom_Penh",
      app_locale: cachedSettings.app_locale || "km",
      mail_from_address: cachedSettings.mail_from_address || "",
      mail_from_name: cachedSettings.mail_from_name || "",
    };

    return NextResponse.json({ settings });

  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/settings
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only admins can update settings
    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden. Admin privileges required." }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = updateSettingsSchema.parse(body);

    // Update cached settings
    cachedSettings = {
      app_name: validatedData.app_name,
      app_timezone: validatedData.app_timezone,
      app_locale: validatedData.app_locale,
      mail_from_address: validatedData.mail_from_address || "",
      mail_from_name: validatedData.mail_from_name || "",
    };

    // In a real application, you would:
    // 1. Save to database
    // 2. Update environment variables
    // 3. Clear relevant caches
    // 4. Notify other services of config changes

    return NextResponse.json({
      message: "Settings updated successfully",
      settings: cachedSettings
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET current settings for public use (non-sensitive data only)
export async function POST(request: NextRequest) {
  try {
    // Public endpoint for getting basic app info
    const publicSettings = {
      app_name: cachedSettings.app_name || "TaRL Pratham System",
      app_locale: cachedSettings.app_locale || "km",
      app_timezone: cachedSettings.app_timezone || "Asia/Phnom_Penh",
    };

    return NextResponse.json({ settings: publicSettings });

  } catch (error) {
    console.error("Error fetching public settings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}