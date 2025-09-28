import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { readFile } from "fs/promises";
import path from "path";

// GET /api/resources/[id]/download
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

    // YouTube resources cannot be downloaded
    if (resource.is_youtube) {
      return NextResponse.json({ error: "YouTube resources cannot be downloaded" }, { status: 400 });
    }

    try {
      const filePath = path.join(process.cwd(), 'public', resource.file_path);
      const fileBuffer = await readFile(filePath);

      const response = new NextResponse(fileBuffer);
      
      // Set appropriate headers
      response.headers.set('Content-Type', resource.mime_type || 'application/octet-stream');
      response.headers.set('Content-Disposition', `attachment; filename="${resource.file_name}"`);
      response.headers.set('Content-Length', resource.file_size.toString());

      // Track download as a view
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
              completion_percentage: 100, // Download counts as 100% view
            }
          });
        } catch (viewError) {
          console.warn("Could not track download view:", viewError);
          // Continue with download even if view tracking fails
        }
      }

      return response;

    } catch (fileError) {
      console.error("Error reading file:", fileError);
      return NextResponse.json(
        { error: "File not found or cannot be read" },
        { status: 404 }
      );
    }

  } catch (error) {
    console.error("Error downloading resource:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}