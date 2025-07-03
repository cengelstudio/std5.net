import { headers } from 'next/headers';
import { Metadata } from 'next';
import AboutClient from './AboutClient';

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const host = headersList.get('host') || 'localhost:3003';
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${protocol}://${host}`;

  return {
    title: "Hakkında | STD5 - Post Prodüksiyon",
    description: "İstanbul merkezli STD5, 3 lokasyonda kurgu, ses, renk, dublaj ve VFX hizmetleri sunar; 250'den fazla projeye imza atmıştır.",
    keywords: [
      "STD5 hakkında",
      "İstanbul post prodüksiyon",
      "video kurgu stüdyosu",
      "ses tasarımı hizmetleri",
      "renk düzenleme stüdyosu",
      "düblaj hizmetleri",
      "görsel efektler VFX",
      "video mapping",
      "title sequence",
      "infografik tasarım",
      "post prodüksiyon şirketi",
      "Türkiye post prodüksiyon",
      "profesyonel video kurgu",
      "sinema post prodüksiyon",
      "reklam post prodüksiyon",
      "dizi post prodüksiyon",
      "belgesel post prodüksiyon",
      "müzik videosu kurgu",
      "ses düzenleme",
      "color grading",
      "2017 kuruluş",
      "3 lokasyon",
      "250+ proje",
      "post prodüksiyon deneyimi",
      "İstanbul medya sektörü",
      "profesyonel stüdyo",
      "yaratıcı post prodüksiyon",
      "endüstri standartları",
      "yüksek kalite video"
    ].join(", "),
    openGraph: {
      title: "Hakkında | STD5 - Post Prodüksiyon",
      description: "İstanbul merkezli STD5, 3 lokasyonda kurgu, ses, renk, dublaj ve VFX hizmetleri sunar; 250'den fazla projeye imza atmıştır.",
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
      title: "Hakkında | STD5 - Post Prodüksiyon",
      description: "İstanbul merkezli STD5, 3 lokasyonda kurgu, ses, renk, dublaj ve VFX hizmetleri sunar; 250'den fazla projeye imza atmıştır.",
      images: [`${baseUrl}/og-image.png`],
    },
  };
}

export default function About() {
  return <AboutClient />;
}
