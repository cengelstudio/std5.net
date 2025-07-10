import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
  const worksDir = path.join(process.cwd(), 'public', 'works');
  let files: string[] = [];
  try {
    files = await fs.readdir(worksDir);
    // Sadece resim dosyalarını filtrele
    files = files.filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file));
  } catch (e) {
    return NextResponse.json({ images: [] }, { status: 500 });
  }
  return NextResponse.json({ images: files });
}
