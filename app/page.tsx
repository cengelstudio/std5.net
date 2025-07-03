import { headers } from 'next/headers';
import { Metadata } from 'next';
import ClientHome from './ClientHome';

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const host = headersList.get('host') || 'localhost:3003';
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${protocol}://${host}`;

  return {
    title: "STD5 - Post Prodüksiyon",
    description: "Ekranların arkasındaki yaratıcı güç",
    keywords: [
      "post prodüksiyon",
      "video kurgu",
      "ses tasarımı",
      "renk düzenleme",
      "görsel efektler",
      "düblaj",
      "video mapping",
      "title sequence",
      "infografik",
      "İstanbul post prodüksiyon",
      "Türkiye post prodüksiyon",
      "profesyonel video kurgu",
      "sinema post prodüksiyon",
      "reklam post prodüksiyon",
      "dizi post prodüksiyon",
      "belgesel post prodüksiyon",
      "müzik videosu kurgu",
      "VFX hizmetleri",
      "ses düzenleme",
      "color grading"
    ].join(", "),
    openGraph: {
      title: "STD5 - Post Prodüksiyon",
      description: "Ekranların arkasındaki yaratıcı güç",
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
      title: "STD5 - Post Prodüksiyon",
      description: "Ekranların arkasındaki yaratıcı güç",
      images: [`${baseUrl}/og-image.png`],
    },
  };
}

export default function Home() {
  return <ClientHome />;
}
