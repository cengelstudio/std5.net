import { NextRequest, NextResponse } from 'next/server';
import { join } from 'path';
import { promises as fs } from 'fs';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) return new NextResponse('No file specified', { status: 400 });

  // Dosyayı farklı dizinlerde ara
  const possiblePaths = [
    join(process.cwd(), 'uploads', 'projects', id),
    join(process.cwd(), 'uploads', 'team', id),
    join(process.cwd(), 'uploads', 'cv', id),
    join(process.cwd(), 'uploads', 'cats', id),
    join(process.cwd(), 'uploads', id)
  ];

  let filePath: string | null = null;
  let file: Buffer | null = null;

  // Dosyayı bul
  for (const path of possiblePaths) {
    try {
      file = await fs.readFile(path);
      filePath = path;
      break;
    } catch {
      continue;
    }
  }

  if (!file || !filePath) {
    return new NextResponse('File not found', { status: 404 });
  }

  const ext = id.split('.').pop()?.toLowerCase();
  let contentType = 'application/octet-stream';
  if (ext === 'png') contentType = 'image/png';
  else if (ext === 'jpg' || ext === 'jpeg') contentType = 'image/jpeg';
  else if (ext === 'webp') contentType = 'image/webp';
  else if (ext === 'gif') contentType = 'image/gif';
  else if (ext === 'svg') contentType = 'image/svg+xml';
  else if (ext === 'pdf') contentType = 'application/pdf';

  return new NextResponse(file, {
    status: 200,
    headers: { 'Content-Type': contentType },
  });
}
