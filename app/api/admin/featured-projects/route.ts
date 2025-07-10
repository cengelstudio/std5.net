import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '@/config/auth';

const FEATURED_PROJECTS_FILE = path.join(process.cwd(), 'data', 'featured-projects.json');

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

export async function GET() {
  try {
    if (!fs.existsSync(FEATURED_PROJECTS_FILE)) {
      // Create default file if it doesn't exist
      fs.writeFileSync(FEATURED_PROJECTS_FILE, JSON.stringify({ featuredProjectIds: [] }, null, 2));
    }

    const data = fs.readFileSync(FEATURED_PROJECTS_FILE, 'utf8');
    const featuredProjects = JSON.parse(data);

    return NextResponse.json(featuredProjects);
  } catch (error) {
    console.error('Error reading featured projects:', error);
    return NextResponse.json(
      { error: 'Failed to read featured projects' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const isAuthenticated = await verifyAuth(request);
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { featuredProjectIds } = body;

    // Validate that we have an array of IDs and it's not more than 6
    if (!Array.isArray(featuredProjectIds)) {
      return NextResponse.json(
        { error: 'featuredProjectIds must be an array' },
        { status: 400 }
      );
    }

    if (featuredProjectIds.length > 6) {
      return NextResponse.json(
        { error: 'Maximum 6 featured projects allowed' },
        { status: 400 }
      );
    }

    // Validate that all IDs are unique
    const uniqueIds = [...new Set(featuredProjectIds)];
    if (uniqueIds.length !== featuredProjectIds.length) {
      return NextResponse.json(
        { error: 'Duplicate project IDs are not allowed' },
        { status: 400 }
      );
    }

    // Save the updated featured projects
    const data = { featuredProjectIds };
    fs.writeFileSync(FEATURED_PROJECTS_FILE, JSON.stringify(data, null, 2));

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating featured projects:', error);
    return NextResponse.json(
      { error: 'Failed to update featured projects' },
      { status: 500 }
    );
  }
}
