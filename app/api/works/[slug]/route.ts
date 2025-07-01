import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Work } from '../../../../types';
import { createSlug } from '../../../utils';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
      try {
    const { slug } = await params;





    // Read the works.json file
    const filePath = path.join(process.cwd(), 'data', 'works.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const works: Work[] = JSON.parse(fileContents);

    // Find work by title (case insensitive)
    const work = works.find((w: Work) => {
      const workSlug = createSlug(w.title);
      return workSlug === slug;
    });

    if (!work) {
      return NextResponse.json(
        { error: 'Work not found' },
        { status: 404 }
      );
    }

    // Get related works (same genre, excluding current work)
    const relatedWorks = works
      .filter((w: Work) => w.genre === work.genre && w.id !== work.id)
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
