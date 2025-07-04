import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';
import crew from '../../../../data/crew.json';

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[çÇ]/g, 'c')
    .replace(/[ğĞ]/g, 'g')
    .replace(/[ıİ]/g, 'i')
    .replace(/[öÖ]/g, 'o')
    .replace(/[şŞ]/g, 's')
    .replace(/[üÜ]/g, 'u')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-');
}

export async function GET(
  req: NextRequest,
  { params }: { params: { name: string } }
) {
  const { name } = params;
  // Aynı isimli birden fazla kişi varsa -2, -3 gibi id eklenmiş olabilir
  const match = name.match(/^(.*?)(-(\d+))?$/);
  const baseSlug = match ? match[1] : name;
  const index = match && match[3] ? parseInt(match[3], 10) - 1 : 0;

  // Ekip üyelerini slug'a çevirip sırayla bul
  const matches = crew.filter((member: any) => slugify(member.name) === baseSlug);
  const member = matches[index];

  if (!member || !member.cv || member.cv === '#') {
    return NextResponse.json({ message: 'CV bulunamadı' }, { status: 404 });
  }

  // Dosya yolu
  const filePath = path.join(process.cwd(), 'public', 'team', path.basename(member.cv));
  try {
    const fileBuffer = await fs.readFile(filePath);
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${path.basename(member.cv)}"`
      }
    });
  } catch (e) {
    return NextResponse.json({ message: 'CV dosyası bulunamadı' }, { status: 404 });
  }
}
