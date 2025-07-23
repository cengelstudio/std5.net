import { NextRequest, NextResponse } from 'next/server';
import { join } from 'path';
import { promises as fs } from 'fs';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) return new NextResponse('No file specified', { status: 400 });

  const filePath = join(process.cwd(), 'uploads', id);

  try {
    const file = await fs.readFile(filePath);
    const ext = id.split('.').pop()?.toLowerCase();
    let contentType = 'application/octet-stream';
    if (ext === 'png') contentType = 'image/png';
    else if (ext === 'jpg' || ext === 'jpeg') contentType = 'image/jpeg';
    else if (ext === 'webp') contentType = 'image/webp';
    else if (ext === 'gif') contentType = 'image/gif';
    else if (ext === 'svg') contentType = 'image/svg+xml';

    return new NextResponse(file, {
      status: 200,
      headers: { 'Content-Type': contentType },
    });
  } catch {
    return new NextResponse('File not found', { status: 404 });
  }
}
