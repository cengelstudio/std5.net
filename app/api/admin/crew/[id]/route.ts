import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../../../../config/auth';

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
  } catch (error) {
    return null;
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = verifyToken(request);
  if (!user) {
    return NextResponse.json({ message: 'Yetkisiz erişim' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const updatedMember = await request.json();
    const data = await fs.readFile(crewFilePath, 'utf8');
    const crew = JSON.parse(data);

    const index = crew.findIndex((member: any) => member.id === id);
    if (index === -1) {
      return NextResponse.json({ message: 'Ekip üyesi bulunamadı' }, { status: 404 });
    }

    crew[index] = { ...crew[index], ...updatedMember };
    await fs.writeFile(crewFilePath, JSON.stringify(crew, null, 2));

    return NextResponse.json(crew[index]);
  } catch (error) {
    return NextResponse.json({ message: 'Veri güncelleme hatası' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = verifyToken(request);
  if (!user) {
    return NextResponse.json({ message: 'Yetkisiz erişim' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const data = await fs.readFile(crewFilePath, 'utf8');
    const crew = JSON.parse(data);

    const filteredCrew = crew.filter((member: any) => member.id !== id);
    if (filteredCrew.length === crew.length) {
      return NextResponse.json({ message: 'Ekip üyesi bulunamadı' }, { status: 404 });
    }

    await fs.writeFile(crewFilePath, JSON.stringify(filteredCrew, null, 2));
    return NextResponse.json({ message: 'Ekip üyesi silindi' });
  } catch (error) {
    return NextResponse.json({ message: 'Veri silme hatası' }, { status: 500 });
  }
}
