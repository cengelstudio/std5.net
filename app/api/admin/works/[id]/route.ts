import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../../../../config/auth';

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
    const updatedWork = await request.json();
    const data = await fs.readFile(worksFilePath, 'utf8');
    const works = JSON.parse(data);

    const index = works.findIndex((work: any) => work.id === id);
    if (index === -1) {
      return NextResponse.json({ message: 'Proje bulunamadı' }, { status: 404 });
    }

    works[index] = { ...works[index], ...updatedWork };
    await fs.writeFile(worksFilePath, JSON.stringify(works, null, 2));

    return NextResponse.json(works[index]);
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
    const data = await fs.readFile(worksFilePath, 'utf8');
    const works = JSON.parse(data);

    const filteredWorks = works.filter((work: any) => work.id !== id);
    if (filteredWorks.length === works.length) {
      return NextResponse.json({ message: 'Proje bulunamadı' }, { status: 404 });
    }

    await fs.writeFile(worksFilePath, JSON.stringify(filteredWorks, null, 2));
    return NextResponse.json({ message: 'Proje silindi' });
  } catch (error) {
    return NextResponse.json({ message: 'Veri silme hatası' }, { status: 500 });
  }
}
