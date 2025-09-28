import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { unlink } from "fs/promises";
import path from "path";

const updateResourceSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  is_public: z.boolean().default(true),
});

// GET /api/resources/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resourceId = parseInt(params.id);
    
    if (isNaN(resourceId)) {
      return NextResponse.json({ error: "Invalid resource ID" }, { status: 400 });
    }

    const resource = await prisma.resource.findUnique({
      where: { id: resourceId },
      include: {
        uploader: {
          select: {
            id: true,
            name: true
          }
        },
        _count: {
          select: {
            resource_views: true
          }
        }
      }
    });

    if (!resource) {
      return NextResponse.json({ error: "Resource not found" }, { status: 404 });
    }

    // Check access permissions
    if (!resource.is_public && session.user.role !== "admin") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const transformedResource = {
      ...resource,
      view_count: resource._count.resource_views
    };

    return NextResponse.json({ resource: transformedResource });

  } catch (error) {
    console.error("Error fetching resource:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/resources/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only admins can update resources
    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const resourceId = parseInt(params.id);
    
    if (isNaN(resourceId)) {
      return NextResponse.json({ error: "Invalid resource ID" }, { status: 400 });
    }

    const body = await request.json();
    const validatedData = updateResourceSchema.parse(body);

    const resource = await prisma.resource.findUnique({
      where: { id: resourceId }
    });

    if (!resource) {
      return NextResponse.json({ error: "Resource not found" }, { status: 404 });
    }

    const updatedResource = await prisma.resource.update({
      where: { id: resourceId },
      data: {
        title: validatedData.title,
        description: validatedData.description,
        is_public: validatedData.is_public,
      },
      include: {
        uploader: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    return NextResponse.json({
      message: "Resource updated successfully",
      resource: updatedResource
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    
    console.error("Error updating resource:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/resources/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only admins can delete resources
    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

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

    // Delete file from filesystem if it's not a YouTube resource
    if (!resource.is_youtube && resource.file_path) {
      try {
        const filePath = path.join(process.cwd(), 'public', resource.file_path);
        await unlink(filePath);
      } catch (fileError) {
        console.warn("Could not delete file:", fileError);
        // Continue with database deletion even if file deletion fails
      }
    }

    // Delete resource from database
    await prisma.resource.delete({
      where: { id: resourceId }
    });

    return NextResponse.json({
      message: "Resource deleted successfully"
    });

  } catch (error) {
    console.error("Error deleting resource:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}