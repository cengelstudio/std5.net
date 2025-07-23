import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../../../config/auth';

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
  } catch {
    // If file doesn't exist, return empty cats array
    return { cats: [] };
  }
}

// Helper function to write cats data
async function writeCatsData(data: { cats: Array<{ id: string; name: string; role: string; about: string | { [key: string]: string }; image: string }> }) {
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
  } catch {
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
  } catch {
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

    console.log('PUT /api/admin/cats - updatedCat:', updatedCat);
    console.log('PUT /api/admin/cats - current cats:', data.cats);
    console.log('PUT /api/admin/cats - looking for ID:', updatedCat.id);

    // Find cat by ID (convert both to string for comparison)
    const index = data.cats.findIndex((cat: { id: string }) => String(cat.id) === String(updatedCat.id));

    console.log('PUT /api/admin/cats - found index:', index);

    if (index === -1) {
      return NextResponse.json({
        error: `Kedi bulunamadı. ID: ${updatedCat.id}. Lütfen sayfayı yenileyip tekrar deneyin.`
      }, { status: 404 });
    }

    data.cats[index] = updatedCat;
    await writeCatsData(data);

    console.log('PUT /api/admin/cats - cat updated successfully');

    return NextResponse.json(updatedCat);
  } catch (error) {
    console.error('PUT /api/admin/cats error:', error);
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

    const { id } = await request.json();
    const data = await readCatsData();

    const index = data.cats.findIndex((cat: { id: string }) => String(cat.id) === String(id));
    if (index === -1) {
      return NextResponse.json({ error: 'Cat not found' }, { status: 404 });
    }

    data.cats.splice(index, 1);
    await writeCatsData(data);

    return NextResponse.json({ message: 'Cat deleted successfully' });
  } catch {
    return NextResponse.json({ error: 'Failed to delete cat' }, { status: 500 });
  }
}
