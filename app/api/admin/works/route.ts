import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../../../config/auth';

const worksFilePath = path.join(process.cwd(), 'data', 'works.json');

// Middleware to verify JWT token
function verifyToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

export async function GET() {
  try {
    const data = await fs.readFile(worksFilePath, 'utf8');
    const works = JSON.parse(data);
    return NextResponse.json(works);
  } catch {
    return NextResponse.json({ message: 'Veri okuma hatası' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const user = verifyToken(request);
  if (!user) {
    return NextResponse.json({ message: 'Yetkisiz erişim' }, { status: 401 });
  }

  try {
    const newWork = await request.json();
    const data = await fs.readFile(worksFilePath, 'utf8');
    const works = JSON.parse(data);

    newWork.id = crypto.randomUUID();
    // Yeni proje için order değeri ata (en son sıraya ekle)
    newWork.order = works.length + 1;
    works.push(newWork);

    await fs.writeFile(worksFilePath, JSON.stringify(works, null, 2));
    return NextResponse.json(newWork);
  } catch {
    return NextResponse.json({ message: 'Veri kaydetme hatası' }, { status: 500 });
  }
}
