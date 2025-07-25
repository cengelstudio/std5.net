import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../../../config/auth';

const crewFilePath = path.join(process.cwd(), 'data', 'crew.json');

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
    const data = await fs.readFile(crewFilePath, 'utf8');
    const crew = JSON.parse(data);
    return NextResponse.json(crew);
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
    const newMember = await request.json();
    const data = await fs.readFile(crewFilePath, 'utf8');
    const crew = JSON.parse(data);

    newMember.id = crypto.randomUUID();
    // Yeni üye için order değeri ata (en son sıraya ekle)
    newMember.order = crew.length + 1;
    crew.push(newMember);

    await fs.writeFile(crewFilePath, JSON.stringify(crew, null, 2));
    return NextResponse.json(newMember);
  } catch {
    return NextResponse.json({ message: 'Veri kaydetme hatası' }, { status: 500 });
  }
}
