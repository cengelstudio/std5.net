import WorkDetailClient from './WorkDetailClient';
import { Metadata } from 'next';
import fs from 'fs';
import path from 'path';
import { createSlug } from '../../../utils';

interface WorkPageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

export async function generateMetadata({ params }: WorkPageProps): Promise<Metadata> {
  const { locale, slug } = await params;

  // Read works data to find the work
  let works: Array<{ title: string; description: string; prod_year: number; genre: string; platform: string; image: string }> = [];
  try {
    const filePath = path.join(process.cwd(), 'data', 'works.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const worksData = JSON.parse(fileContents);
    works = worksData;
  } catch (error) {
    console.error('Error reading works.json:', error);
  }

  // Find the work by slug
  const work = works.find(w => createSlug(w.title) === slug);

  if (!work) {
    return {
      title: 'Proje Bulunamadı | STD5',
      description: 'Aradığınız proje bulunamadı.',
    };
  }

  const titles = {
    tr: `${work.title} | STD5`,
    en: `${work.title} | STD5`,
    fr: `${work.title} | STD5`,
    es: `${work.title} | STD5`
  };

  const descriptions = {
    tr: `${work.title} - ${work.description.substring(0, 150)}... ${work.prod_year} yapımı ${work.genre} türünde ${work.platform} platformu için hazırlanmış proje.`,
    en: `${work.title} - ${work.description.substring(0, 150)}... ${work.genre} project for ${work.platform} platform, produced in ${work.prod_year}.`,
    fr: `${work.title} - ${work.description.substring(0, 150)}... Projet ${work.genre} pour la plateforme ${work.platform}, produit en ${work.prod_year}.`,
    es: `${work.title} - ${work.description.substring(0, 150)}... Proyecto ${work.genre} para la plataforma ${work.platform}, producido en ${work.prod_year}.`
  };

    const currentTitle = titles[locale as keyof typeof titles] || titles.tr;
  const currentDescription = descriptions[locale as keyof typeof descriptions] || descriptions.tr;
  const currentUrl = locale === 'tr'
    ? `https://std5.net/work/${slug}`
    : `https://std5.net/${locale}/work/${slug}`;

  return {
    title: currentTitle,
    description: currentDescription,
    alternates: {
      canonical: currentUrl,
    },
          openGraph: {
        title: currentTitle,
        description: currentDescription,
        url: currentUrl,
        type: 'article',
        images: [
          {
            url: work.image.startsWith('http') ? work.image : `https://std5.net${work.image}`,
            width: 1200,
            height: 630,
            alt: work.title,
          },
        ],
      },
    twitter: {
      card: "summary_large_image",
      title: currentTitle,
      description: currentDescription,
      images: [work.image.startsWith('http') ? work.image : `https://std5.net${work.image}`],
    },
  };
}

export default async function WorkDetail({ params }: WorkPageProps) {
  const { slug } = await params;

  // Read works data to find the work
  let works: Array<{ id: string; title: string; description: string; prod_year: number; genre: string; platform: string; trailer_embed_url: string; gallery: string[]; image: string; client?: string }> = [];
  try {
    const filePath = path.join(process.cwd(), 'data', 'works.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const worksData = JSON.parse(fileContents);
    works = worksData;
  } catch (error) {
    console.error('Error reading works.json:', error);
  }

  // Find the work by slug
  const work = works.find(w => createSlug(w.title) === slug) || null;

  return <WorkDetailClient work={work} />;
}
