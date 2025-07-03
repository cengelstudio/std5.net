import { headers } from 'next/headers';
import { Metadata } from 'next';
import LocationsClient from './LocationsClient';

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const host = headersList.get('host') || 'localhost:3003';
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${protocol}://${host}`;

  return {
    title: "Yerleşkeler | STD5",
    description: "İstanbul’da 3 lokasyonda, özenle tasarlanmış stüdyolarımız ve en iyi donanım-yazılımlarla post prodüksiyonun her aşamasında yanınızdayız.",
    keywords: [
      "STD5 yerleşkeler",
      "STD5 stüdyo lokasyonları",
      "İstanbul post prodüksiyon stüdyoları",
      "Şişli post prodüksiyon",
      "Beşiktaş post prodüksiyon",
      "video kurgu stüdyosu lokasyonları",
      "ses tasarımı stüdyosu",
      "renk düzenleme stüdyosu",
      "düblaj stüdyosu lokasyonları",
      "görsel efektler VFX stüdyosu",
      "video mapping stüdyosu",
      "title sequence stüdyosu",
      "infografik tasarım stüdyosu",
      "post prodüksiyon şirketi lokasyonları",
      "Türkiye post prodüksiyon stüdyoları",
      "profesyonel video kurgu stüdyosu",
      "sinema post prodüksiyon stüdyosu",
      "reklam post prodüksiyon stüdyosu",
      "dizi post prodüksiyon stüdyosu",
      "belgesel post prodüksiyon stüdyosu",
      "müzik videosu kurgu stüdyosu",
      "ses düzenleme stüdyosu",
      "color grading stüdyosu",
      "STD5 Şişli stüdyo",
      "STD5 Beşiktaş stüdyo",
      "İstanbul medya sektörü stüdyoları",
      "profesyonel stüdyo lokasyonları",
      "yaratıcı post prodüksiyon stüdyosu",
      "endüstri standartları stüdyo",
      "yüksek kalite video stüdyosu",
      "STD5 adres bilgileri",
      "STD5 iletişim lokasyonları",
      "post prodüksiyon teklif lokasyonları",
      "video kurgu fiyat lokasyonları",
      "ses tasarımı fiyat lokasyonları",
      "renk düzenleme fiyat lokasyonları",
      "STD5 stüdyo haritası",
      "İstanbul post prodüksiyon merkezleri",
      "profesyonel medya stüdyoları",
      "yaratıcı içerik üretim stüdyoları"
    ].join(", "),
    openGraph: {
      title: "Yerleşkeler | STD5",
      description: "İstanbul’da 3 lokasyonda, özenle tasarlanmış stüdyolarımız ve en iyi donanım-yazılımlarla post prodüksiyonun her aşamasında yanınızdayız.",
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
      title: "Yerleşkeler | STD5",
      description: "İstanbul’da 3 lokasyonda, özenle tasarlanmış stüdyolarımız ve en iyi donanım-yazılımlarla post prodüksiyonun her aşamasında yanınızdayız.",
      images: [`${baseUrl}/og-image.png`],
    },
  };
}

export default function Locations() {
  return <LocationsClient />;
}
