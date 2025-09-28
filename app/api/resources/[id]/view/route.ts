import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/resources/[id]/view
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const resourceId = parseInt(params.id);

    if (isNaN(resourceId)) {
      return NextResponse.json({ error: "Invalid resource ID" }, { status: 400 });
    }

    const resource = await prisma.resource.findUnique({
      where: { id: resourceId }
    });

    if (!resource) {
      return NextResponse.json({ error: "Resource not found" }, { status: 404 });
    }

    // Check access permissions for private resources
    if (!resource.is_public) {
      const session = await getServerSession(authOptions);
      if (!session?.user?.id) {
        return NextResponse.json({ error: "Authentication required" }, { status: 401 });
      }
    }

    // Track view
    const session = await getServerSession(authOptions);
    if (session?.user?.id) {
      try {
        await prisma.resourceView.create({
          data: {
            resource_id: resource.id,
            user_id: parseInt(session.user.id),
            ip_address: request.ip || 'unknown',
            watch_duration: 0,
            total_duration: 0,
            completion_percentage: 50, // View counts as 50% view
          }
        });
      } catch (viewError) {
        console.warn("Could not track view:", viewError);
        // Continue with view even if tracking fails
      }
    }

    // For YouTube resources, redirect to YouTube
    if (resource.is_youtube && resource.youtube_url) {
      return NextResponse.redirect(resource.youtube_url);
    }

    // For file resources, redirect to the Vercel Blob URL
    return NextResponse.redirect(resource.file_path);

  } catch (error) {
    console.error("Error viewing resource:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}