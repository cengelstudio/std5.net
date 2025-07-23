import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const CATS_FILE_PATH = path.join(process.cwd(), 'data', 'cats.json');

export async function GET() {
  try {
    const data = await fs.readFile(CATS_FILE_PATH, 'utf-8');
    const cats = JSON.parse(data);
    
    return NextResponse.json(cats);
  } catch (error) {
    console.error('Cats data fetch error:', error);
    return NextResponse.json(
      { cats: [] }, 
      { status: 200 }
    );
  }
} 