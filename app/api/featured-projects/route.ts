import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Work } from '../../../types';

const FEATURED_PROJECTS_FILE = path.join(process.cwd(), 'data', 'featured-projects.json');
const WORKS_FILE = path.join(process.cwd(), 'data', 'works.json');

export async function GET() {
  try {
    // Read featured projects configuration
    if (!fs.existsSync(FEATURED_PROJECTS_FILE)) {
          // If no featured projects file exists, return first 6 works
    const worksData = fs.readFileSync(WORKS_FILE, 'utf8');
    const works: Work[] = JSON.parse(worksData);

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

    return NextResponse.json({ works: works.slice(0, 6) });
    }

    const featuredData = fs.readFileSync(FEATURED_PROJECTS_FILE, 'utf8');
    const { featuredProjectIds } = JSON.parse(featuredData);

    // If no featured projects are set, return first 6 works
    if (!featuredProjectIds || featuredProjectIds.length === 0) {
      const worksData = fs.readFileSync(WORKS_FILE, 'utf8');
      const works: Work[] = JSON.parse(worksData);

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

      return NextResponse.json({ works: works.slice(0, 6) });
    }

    // Read all works and filter by featured IDs
    const worksData = fs.readFileSync(WORKS_FILE, 'utf8');
    const allWorks: Work[] = JSON.parse(worksData);

    // Create a map for faster lookup
    const worksMap = new Map(allWorks.map(work => [work.id, work]));

    // Get featured works in the order they were selected
    const featuredWorks = featuredProjectIds
      .map((id: string) => worksMap.get(id))
      .filter((work: Work | undefined) => work !== undefined) as Work[];

    // Sort by order first, then by production year (newest first)
    featuredWorks.sort((a: Work, b: Work) => {
      // First sort by order
      const orderA = a.order || 0;
      const orderB = b.order || 0;
      if (orderA !== orderB) {
        return orderA - orderB;
      }
      // If order is the same, sort by production year (newest first)
      return b.prod_year - a.prod_year;
    });

    return NextResponse.json({ works: featuredWorks });
  } catch (error) {
    console.error('Error fetching featured projects:', error);
    // Fallback to first 6 works
    try {
      const worksData = fs.readFileSync(WORKS_FILE, 'utf8');
      const works: Work[] = JSON.parse(worksData);

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

      return NextResponse.json({ works: works.slice(0, 6) });
    } catch {
      return NextResponse.json(
        { error: 'Failed to fetch featured projects' },
        { status: 500 }
      );
    }
  }
}
