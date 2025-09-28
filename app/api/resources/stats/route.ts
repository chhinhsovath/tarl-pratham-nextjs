import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/resources/stats
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only admins can access resource statistics
    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const [
      totalResources,
      publicResources,
      privateResources,
      youtubeVideos,
      totalFileSize,
      totalViews
    ] = await Promise.all([
      prisma.resource.count(),
      prisma.resource.count({ where: { is_public: true } }),
      prisma.resource.count({ where: { is_public: false } }),
      prisma.resource.count({ where: { is_youtube: true } }),
      prisma.resource.aggregate({
        _sum: {
          file_size: true
        }
      }),
      prisma.resourceView.count()
    ]);

    const stats = {
      total_resources: totalResources,
      public_resources: publicResources,
      private_resources: privateResources,
      youtube_videos: youtubeVideos,
      total_file_size: totalFileSize._sum.file_size || 0,
      total_views: totalViews
    };

    return NextResponse.json(stats);

  } catch (error) {
    console.error("Error fetching resource statistics:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}