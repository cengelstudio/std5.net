import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../../../config/auth';

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

export async function GET() {
  try {
    const data = await fs.readFile(foundersFilePath, 'utf8');
    const founders = JSON.parse(data);
    return NextResponse.json(founders);
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
    const newFounder = await request.json();
    const data = await fs.readFile(foundersFilePath, 'utf8');
    const founders = JSON.parse(data);

    newFounder.id = crypto.randomUUID();
    founders.push(newFounder);

    await fs.writeFile(foundersFilePath, JSON.stringify(founders, null, 2));
    return NextResponse.json(newFounder);
  } catch {
    return NextResponse.json({ message: 'Veri kaydetme hatası' }, { status: 500 });
  }
} 