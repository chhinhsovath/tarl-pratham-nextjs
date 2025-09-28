import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string || 'general';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type - expanded to include common document types
    const allowedTypes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain',
      'text/csv'
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only images, PDFs, Office documents, and text files are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (10MB max for documents, 5MB for images)
    const isImage = file.type.startsWith('image/');
    const maxSize = isImage ? 5 * 1024 * 1024 : 10 * 1024 * 1024; // 5MB for images, 10MB for documents
    if (file.size > maxSize) {
      const maxSizeMB = isImage ? '5MB' : '10MB';
      return NextResponse.json(
        { error: `File size must be less than ${maxSizeMB}.` },
        { status: 400 }
      );
    }

    // Generate unique filename with type prefix
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2);
    const fileExtension = path.extname(file.name);
    const fileName = `${type}/${timestamp}_${randomSuffix}${fileExtension}`;

    // Upload to Vercel Blob storage
    const blob = await put(fileName, file, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    return NextResponse.json({
      success: true,
      message: 'File uploaded successfully',
      url: blob.url,
      filename: fileName,
      size: file.size,
      type: file.type,
      downloadUrl: blob.downloadUrl
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}