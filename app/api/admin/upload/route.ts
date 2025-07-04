import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../../../config/auth';

// Middleware to verify JWT token
function verifyToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export async function POST(request: NextRequest) {
  const user = verifyToken(request);
  if (!user) {
    return NextResponse.json({ message: 'Yetkisiz erişim' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string; // 'work' or 'team' or 'team-cv'

    if (!file) {
      return NextResponse.json({ message: 'Dosya bulunamadı' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create filename with timestamp to avoid conflicts
    const timestamp = Date.now();
    const extension = path.extname(file.name);
    const filename = `${timestamp}${extension}`;

    const uploadDir = type === 'work' ? 'works' : (type === 'team-cv' ? 'team' : 'team');
    if (type === 'team-cv' && extension.toLowerCase() !== '.pdf') {
      return NextResponse.json({ message: 'Sadece PDF dosyası yükleyebilirsiniz.' }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), 'public', uploadDir, filename);

    // Create directory if it doesn't exist
    const dir = path.dirname(filePath);
    await fs.mkdir(dir, { recursive: true });

    // Write file
    await fs.writeFile(filePath, buffer);

    // Return the URL path
    const url = `/${uploadDir}/${filename}`;
    return NextResponse.json({ url });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ message: 'Dosya yükleme hatası' }, { status: 500 });
  }
}
