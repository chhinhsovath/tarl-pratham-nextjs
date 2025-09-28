import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const createResourceSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  resource_type: z.enum(["file", "youtube"]),
  youtube_url: z.string().url().optional(),
  is_public: z.boolean().default(true),
});

const youtubeUrlRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/i;

function getFileType(mimeType: string): string {
  if (mimeType.includes('video/')) return 'video';
  if (mimeType === 'application/pdf') return 'pdf';
  if (['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(mimeType)) return 'word';
  if (['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'].includes(mimeType)) return 'excel';
  if (['application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'].includes(mimeType)) return 'powerpoint';
  return 'other';
}

// GET /api/resources
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only admins can access all resources
    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    const [resources, totalCount] = await Promise.all([
      prisma.resource.findMany({
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
        },
        orderBy: { created_at: 'desc' },
        skip: offset,
        take: limit
      }),
      prisma.resource.count()
    ]);

    // Transform resources to include view count
    const transformedResources = resources.map(resource => ({
      ...resource,
      view_count: resource._count.resource_views
    }));

    return NextResponse.json({
      resources: transformedResources,
      pagination: {
        current: page,
        pageSize: limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      }
    });

  } catch (error) {
    console.error("Error fetching resources:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/resources
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only admins can create resources
    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const formData = await request.formData();
    
    const data = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      resource_type: formData.get('resource_type') as string,
      youtube_url: formData.get('youtube_url') as string,
      is_public: formData.get('is_public') === 'true',
    };

    const validatedData = createResourceSchema.parse(data);

    if (validatedData.resource_type === 'youtube') {
      // YouTube resource
      if (!validatedData.youtube_url) {
        return NextResponse.json({ error: "YouTube URL is required" }, { status: 400 });
      }

      if (!youtubeUrlRegex.test(validatedData.youtube_url)) {
        return NextResponse.json({ error: "Please enter a valid YouTube URL" }, { status: 400 });
      }

      const resource = await prisma.resource.create({
        data: {
          title: validatedData.title,
          description: validatedData.description,
          youtube_url: validatedData.youtube_url,
          is_youtube: true,
          file_type: 'youtube',
          file_name: 'YouTube Video',
          file_path: '',
          mime_type: 'video/youtube',
          file_size: 0,
          is_public: validatedData.is_public,
          uploaded_by: parseInt(session.user.id),
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
        message: "YouTube resource created successfully",
        resource
      }, { status: 201 });

    } else {
      // File upload resource
      const file = formData.get('file') as File;
      
      if (!file) {
        return NextResponse.json({ error: "File is required" }, { status: 400 });
      }

      // Check file size (100MB limit)
      if (file.size > 100 * 1024 * 1024) {
        return NextResponse.json({ error: "File size exceeds 100MB limit" }, { status: 400 });
      }

      // Create uploads directory if it doesn't exist
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'resources');
      await mkdir(uploadsDir, { recursive: true });

      // Generate unique filename
      const timestamp = Date.now();
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const fileName = `${timestamp}_${sanitizedName}`;
      const filePath = path.join(uploadsDir, fileName);

      // Write file to disk
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(filePath, buffer);

      const fileType = getFileType(file.type);
      const relativeFilePath = `uploads/resources/${fileName}`;

      const resource = await prisma.resource.create({
        data: {
          title: validatedData.title,
          description: validatedData.description,
          file_name: file.name,
          file_path: relativeFilePath,
          file_type: fileType,
          mime_type: file.type,
          file_size: file.size,
          is_public: validatedData.is_public,
          uploaded_by: parseInt(session.user.id),
          is_youtube: false,
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
        message: "File resource uploaded successfully",
        resource
      }, { status: 201 });
    }

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    
    console.error("Error creating resource:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}