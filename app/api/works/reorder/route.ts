import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// TypeScript interfaces
interface WorkDescription {
  tr: string;
  en: string;
  es: string;
  fr: string;
  ru: string;
  ar: string;
}

interface Work {
  id: string;
  title: string;
  description: WorkDescription;
  prod_year: number;
  genre: string;
  platform: string;
  trailer_embed_url: string;
  gallery: string[];
  image: string;
  order: number;
}

const worksFilePath = path.join(process.cwd(), 'data', 'works.json');

export async function POST(request: NextRequest) {
  try {
    const { id, direction } = await request.json();

    // Works verilerini oku
    const worksData = await fs.readFile(worksFilePath, 'utf8');
    const works: Work[] = JSON.parse(worksData);

    // Mevcut projeyi bul
    const currentIndex = works.findIndex((work: Work) => work.id === id);
    if (currentIndex === -1) {
      return NextResponse.json({ error: 'Proje bulunamadı' }, { status: 404 });
    }

    // Yeni pozisyonu hesapla
    let newIndex: number;
    if (direction === 'up') {
      newIndex = Math.max(0, currentIndex - 1);
    } else if (direction === 'down') {
      newIndex = Math.min(works.length - 1, currentIndex + 1);
    } else {
      return NextResponse.json({ error: 'Geçersiz yön' }, { status: 400 });
    }

    // Aynı pozisyondaysa değişiklik yapma
    if (currentIndex === newIndex) {
      return NextResponse.json({ message: 'Pozisyon değişmedi' });
    }

    // Projeleri değiştir
    const [movedWork] = works.splice(currentIndex, 1);
    works.splice(newIndex, 0, movedWork);

    // Order değerlerini güncelle
    works.forEach((work: Work, index: number) => {
      work.order = index + 1;
    });

    // Dosyaya kaydet
    await fs.writeFile(worksFilePath, JSON.stringify(works, null, 2));

    return NextResponse.json({
      message: 'Sıralama güncellendi',
      newOrder: works.map((work: Work) => ({ id: work.id, order: work.order }))
    });

  } catch (error) {
    console.error('Works reorder error:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
