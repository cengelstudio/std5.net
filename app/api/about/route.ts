import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const foundersFilePath = path.join(process.cwd(), 'data', 'founders.json');
const crewFilePath = path.join(process.cwd(), 'data', 'crew.json');

export async function GET() {
  try {
    // Kurucular ve ekip verilerini paralel olarak oku
    const [foundersData, crewData] = await Promise.all([
      fs.readFile(foundersFilePath, 'utf8'),
      fs.readFile(crewFilePath, 'utf8')
    ]);

    const founders = JSON.parse(foundersData);
    const crew = JSON.parse(crewData);

    return NextResponse.json({
      founders,
      crew
    });
  } catch (error) {
    console.error('About data fetch error:', error);
    return NextResponse.json(
      { message: 'Veri okuma hatası' }, 
      { status: 500 }
    );
  }
} 