import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface Work {
  id: string;
  title: string;
  description: string;
  prod_year: number;
  genre: string;
  platform: string;
  trailer_embed_url: string;
  gallery: string[];
  image: string;
}

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
      const workSlug = w.title
        .toLowerCase()
        .replace(/ğ/g, 'g')
        .replace(/ü/g, 'u')
        .replace(/ş/g, 's')
        .replace(/ı/g, 'i')
        .replace(/ö/g, 'o')
        .replace(/ç/g, 'c')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();

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
