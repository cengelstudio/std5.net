import { headers } from 'next/headers';
import { Metadata } from 'next';
import ProjectsClient from './ProjectsClient';

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const host = headersList.get('host') || 'localhost:3003';
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${protocol}://${host}`;

  return {
    title: "Projeler | STD5 - Post Prodüksiyon",
    description: "Color grading, VFX, kurgu, animasyon, video mapping, ses tasarımı, infografik ve daha fazlasıyla buradayız. Portföyümüz her gün büyüyor.",
    keywords: "post prodüksiyon, video düzenleme, sinema, dizi, reklam, belgesel, kurgu, renk düzenleme, ses düzenleme, görsel efektler, motion graphics, animasyon, İstanbul, Türkiye, prodüksiyon şirketi, film prodüksiyon, video prodüksiyon, dijital içerik, streaming platformları, Netflix, Disney+, TRT, Show TV, Kanal D",
    openGraph: {
      title: "Projeler | STD5 - Post Prodüksiyon",
      description: "Color grading, VFX, kurgu, animasyon, video mapping, ses tasarımı, infografik ve daha fazlasıyla buradayız. Portföyümüz her gün büyüyor.",
      images: [
        {
          url: `${baseUrl}/og-image.png`,
          width: 1200,
          height: 1200,
          alt: "STD5 - Post Prodüksiyon",
        },
      ],
    },
    twitter: {
      card: "summary",
      title: "Projeler | STD5 - Post Prodüksiyon",
      description: "Color grading, VFX, kurgu, animasyon, video mapping, ses tasarımı, infografik ve daha fazlasıyla buradayız. Portföyümüz her gün büyüyor.",
      images: [`${baseUrl}/og-image.png`],
    },
  };
}

export default function Projects() {
  return <ProjectsClient />;
}
