import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// TypeScript interfaces
interface CatRole {
  tr: string;
  en: string;
  es: string;
  fr: string;
  ru: string;
  ar: string;
}

interface CatAbout {
  tr: string;
  en: string;
  es: string;
  fr: string;
  ru: string;
  ar: string;
}

interface Cat {
  order: number;
  id: string;
  name: string;
  role: CatRole;
  about: CatAbout;
  image: string;
}

interface CatsData {
  cats: Cat[];
}

const catsFilePath = path.join(process.cwd(), 'data', 'cats.json');

export async function POST(request: NextRequest) {
  try {
    const { id, direction } = await request.json();

    // Cats verilerini oku
    const catsData = await fs.readFile(catsFilePath, 'utf8');
    const catsDataObj: CatsData = JSON.parse(catsData);
    const cats = catsDataObj.cats;

    // Mevcut kediyi bul
    const currentIndex = cats.findIndex((cat: Cat) => cat.id === id);
    if (currentIndex === -1) {
      return NextResponse.json({ error: 'Kedi bulunamadı' }, { status: 404 });
    }

    // Yeni pozisyonu hesapla
    let newIndex: number;
    if (direction === 'up') {
      newIndex = Math.max(0, currentIndex - 1);
    } else if (direction === 'down') {
      newIndex = Math.min(cats.length - 1, currentIndex + 1);
    } else {
      return NextResponse.json({ error: 'Geçersiz yön' }, { status: 400 });
    }

    // Aynı pozisyondaysa değişiklik yapma
    if (currentIndex === newIndex) {
      return NextResponse.json({ message: 'Pozisyon değişmedi' });
    }

    // Kedileri değiştir
    const [movedCat] = cats.splice(currentIndex, 1);
    cats.splice(newIndex, 0, movedCat);

    // Order değerlerini güncelle
    cats.forEach((cat: Cat, index: number) => {
      cat.order = index + 1;
    });

    // Dosyaya kaydet
    await fs.writeFile(catsFilePath, JSON.stringify(catsDataObj, null, 2));

    return NextResponse.json({
      message: 'Sıralama güncellendi',
      newOrder: cats.map((cat: Cat) => ({ id: cat.id, order: cat.order }))
    });

  } catch (error) {
    console.error('Cats reorder error:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
