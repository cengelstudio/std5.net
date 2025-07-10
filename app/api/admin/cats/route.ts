import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '@/config/auth';

const CATS_FILE_PATH = path.join(process.cwd(), 'data', 'cats.json');

// Helper function to verify auth token
async function verifyAuth(request: NextRequest) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');
  if (!token) return false;

  try {
    jwt.verify(token, JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}

// Helper function to read cats data
async function readCatsData() {
  try {
    const data = await fs.readFile(CATS_FILE_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist, return empty cats array
    return { cats: [] };
  }
}

// Helper function to write cats data
async function writeCatsData(data: any) {
  await fs.writeFile(CATS_FILE_PATH, JSON.stringify(data, null, 2));
}

// GET /api/admin/cats
export async function GET(request: NextRequest) {
  try {
    const isAuthenticated = await verifyAuth(request);
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await readCatsData();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch cats' }, { status: 500 });
  }
}

// POST /api/admin/cats
export async function POST(request: NextRequest) {
  try {
    const isAuthenticated = await verifyAuth(request);
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await readCatsData();
    const newCat = await request.json();

    data.cats.push(newCat);
    await writeCatsData(data);

    return NextResponse.json(newCat, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create cat' }, { status: 500 });
  }
}

// PUT /api/admin/cats
export async function PUT(request: NextRequest) {
  try {
    const isAuthenticated = await verifyAuth(request);
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const updatedCat = await request.json();
    const data = await readCatsData();

    const index = data.cats.findIndex((cat: any) => cat.name === updatedCat.name);
    if (index === -1) {
      return NextResponse.json({ error: 'Cat not found' }, { status: 404 });
    }

    data.cats[index] = updatedCat;
    await writeCatsData(data);

    return NextResponse.json(updatedCat);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update cat' }, { status: 500 });
  }
}

// DELETE /api/admin/cats
export async function DELETE(request: NextRequest) {
  try {
    const isAuthenticated = await verifyAuth(request);
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name } = await request.json();
    const data = await readCatsData();

    const index = data.cats.findIndex((cat: any) => cat.name === name);
    if (index === -1) {
      return NextResponse.json({ error: 'Cat not found' }, { status: 404 });
    }

    data.cats.splice(index, 1);
    await writeCatsData(data);

    return NextResponse.json({ message: 'Cat deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete cat' }, { status: 500 });
  }
}
