import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// TypeScript interfaces
interface CrewTitle {
  tr: string;
  en: string;
  es: string;
  fr: string;
  ru: string;
  ar: string;
}

interface CrewDepartment {
  tr: string;
  en: string;
  es: string;
  fr: string;
  ru: string;
  ar: string;
}

interface CrewCV {
  tr: string;
  en: string;
  es: string;
  fr: string;
  ru: string;
  ar: string;
}

interface CrewMember {
  order: number;
  name: string;
  title: CrewTitle;
  department: CrewDepartment;
  image: string;
  linkedin: string;
  cv: CrewCV;
  id: string;
}

const crewFilePath = path.join(process.cwd(), 'data', 'crew.json');

export async function POST(request: NextRequest) {
  try {
    const { id, direction } = await request.json();

    // Crew verilerini oku
    const crewData = await fs.readFile(crewFilePath, 'utf8');
    const crew: CrewMember[] = JSON.parse(crewData);

    // Mevcut üyeyi bul
    const currentIndex = crew.findIndex((member: CrewMember) => member.id === id);
    if (currentIndex === -1) {
      return NextResponse.json({ error: 'Üye bulunamadı' }, { status: 404 });
    }

    // Yeni pozisyonu hesapla
    let newIndex: number;
    if (direction === 'up') {
      newIndex = Math.max(0, currentIndex - 1);
    } else if (direction === 'down') {
      newIndex = Math.min(crew.length - 1, currentIndex + 1);
    } else {
      return NextResponse.json({ error: 'Geçersiz yön' }, { status: 400 });
    }

    // Aynı pozisyondaysa değişiklik yapma
    if (currentIndex === newIndex) {
      return NextResponse.json({ message: 'Pozisyon değişmedi' });
    }

    // Üyeleri değiştir
    const [movedMember] = crew.splice(currentIndex, 1);
    crew.splice(newIndex, 0, movedMember);

    // Order değerlerini güncelle
    crew.forEach((member: CrewMember, index: number) => {
      member.order = index + 1;
    });

    // Dosyaya kaydet
    await fs.writeFile(crewFilePath, JSON.stringify(crew, null, 2));

    return NextResponse.json({
      message: 'Sıralama güncellendi',
      newOrder: crew.map((member: CrewMember) => ({ id: member.id, order: member.order }))
    });

  } catch (error) {
    console.error('Crew reorder error:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
