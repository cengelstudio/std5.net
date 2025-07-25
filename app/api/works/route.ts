import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Work } from '../../../types';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    // const lang = searchParams.get('lang') || 'tr'; // Reserved for future use
    const genre = searchParams.get('genre');
    const platform = searchParams.get('platform');
    const year = searchParams.get('year');

    // Read the works.json file
    const filePath = path.join(process.cwd(), 'data', 'works.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    let works: Work[] = JSON.parse(fileContents);

    // Apply filters
    if (genre) {
      works = works.filter((work: Work) =>
        work.genre.toLowerCase() === genre.toLowerCase()
      );
    }

    if (platform) {
      works = works.filter((work: Work) =>
        work.platform.toLowerCase().includes(platform.toLowerCase())
      );
    }

    if (year) {
      works = works.filter((work: Work) =>
        work.prod_year.toString() === year
      );
    }

    // Sort by order first, then by production year (newest first)
    works.sort((a: Work, b: Work) => {
      // First sort by order
      const orderA = a.order || 0;
      const orderB = b.order || 0;
      if (orderA !== orderB) {
        return orderA - orderB;
      }
      // If order is the same, sort by production year (newest first)
      return b.prod_year - a.prod_year;
    });

    // Get unique values for filters
    const allWorks: Work[] = JSON.parse(fileContents);
    const genres = [...new Set(allWorks.map((work: Work) => work.genre))];
    const platforms = [...new Set(allWorks.map((work: Work) => work.platform))];
    const years = [...new Set(allWorks.map((work: Work) => work.prod_year))].sort((a: number, b: number) => b - a);

    return NextResponse.json({
      works: works,
      filters: {
        genres,
        platforms,
        years
      }
    });
  } catch (error) {
    console.error('Error fetching works:', error);
    return NextResponse.json(
      { error: 'Failed to fetch works' },
      { status: 500 }
    );
  }
}
