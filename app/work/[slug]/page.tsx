import WorkDetailClient from './WorkDetailClient';
import { Work } from '../../../types';
import { Metadata } from 'next';
import { headers } from 'next/headers';

async function getWork(slug: string): Promise<Work | null> {
  try {
    const headersList = await headers();
    const host = headersList.get('host') || 'localhost:3003';
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${protocol}://${host}`;
    const res = await fetch(`${baseUrl}/api/works/${slug}`, { cache: 'no-store' });
    if (!res.ok) {
      return null;
    }
    const data = await res.json();
    return data.work as Work;
  } catch (e) {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const work = await getWork(slug);

  const headersList = await headers();
  const host = headersList.get('host') || 'localhost:3003';
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${protocol}://${host}`;

  if (!work) {
    return {
      title: 'Proje Bulunamadı | STD5',
      description: 'Aradığınız proje bulunamadı.'
    };
  }
  return {
    title: `${work.title} (${work.prod_year}) | STD5`,
    description: `${work.description} - ${work.platform}`,
    openGraph: {
      title: `${work.title} (${work.prod_year}) | STD5`,
      description: `${work.description} - ${work.platform}`,
      images: [
        {
          url: work.image,
          width: 1200,
          height: 630,
          alt: work.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${work.title} (${work.prod_year}) | STD5`,
      description: `${work.description} - ${work.platform}`,
      images: [work.image],
    },
  };
}

export default async function WorkDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const work = await getWork(slug);
  return <WorkDetailClient work={work} />;
}
