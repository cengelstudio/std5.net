import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../../../../config/auth';

const foundersFilePath = path.join(process.cwd(), 'data', 'founders.json');

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

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = verifyToken(request);
  if (!user) {
    return NextResponse.json({ message: 'Yetkisiz erişim' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const updatedFounder = await request.json();
    const data = await fs.readFile(foundersFilePath, 'utf8');
    const founders = JSON.parse(data);

    const index = founders.findIndex((founder: { id: string }) => founder.id === id);
    if (index === -1) {
      return NextResponse.json({ message: 'Kurucu bulunamadı' }, { status: 404 });
    }

    founders[index] = { ...founders[index], ...updatedFounder };
    await fs.writeFile(foundersFilePath, JSON.stringify(founders, null, 2));

    return NextResponse.json(founders[index]);
  } catch {
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
    const data = await fs.readFile(foundersFilePath, 'utf8');
    const founders = JSON.parse(data);

    const filteredFounders = founders.filter((founder: { id: string }) => founder.id !== id);
    if (filteredFounders.length === founders.length) {
      return NextResponse.json({ message: 'Kurucu bulunamadı' }, { status: 404 });
    }

    await fs.writeFile(foundersFilePath, JSON.stringify(filteredFounders, null, 2));
    return NextResponse.json({ message: 'Kurucu silindi' });
  } catch {
    return NextResponse.json({ message: 'Veri silme hatası' }, { status: 500 });
  }
} 