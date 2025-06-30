import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Read the works.json file
    const filePath = path.join(process.cwd(), 'data', 'works.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const works = JSON.parse(fileContents);

    // Find the work by ID
    const work = works.find((w: any) => w.id === id);

    if (!work) {
      return NextResponse.json(
        { error: 'Work not found' },
        { status: 404 }
      );
    }

    // Get related works (same genre, excluding current work)
    const relatedWorks = works
      .filter((w: any) => w.genre === work.genre && w.id !== id)
      .slice(0, 4);

    return NextResponse.json({
      work,
      related: relatedWorks
    });
  } catch (error) {
    console.error('Error fetching work:', error);
    return NextResponse.json(
      { error: 'Failed to fetch work' },
      { status: 500 }
    );
  }
}
