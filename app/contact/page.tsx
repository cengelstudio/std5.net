import { headers } from 'next/headers';
import { Metadata } from 'next';
import ContactClient from './ContactClient';

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const host = headersList.get('host') || 'localhost:3003';
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${protocol}://${host}`;

  return {
    title: "İletişim | STD5 - Post Prodüksiyon",
    description: "Her zaman yoğunuz ama misafirlerimiz baş tacı. Renk, kurgu, animasyon, ses miksajı, teknik destek ve Türk kahvesiyle sizi bekliyoruz.",
    keywords: [
      "STD5 iletişim",
      "İstanbul post prodüksiyon iletişim",
      "video kurgu stüdyosu iletişim",
      "ses tasarımı iletişim",
      "renk düzenleme iletişim",
      "düblaj hizmetleri iletişim",
      "görsel efektler VFX iletişim",
      "video mapping iletişim",
      "title sequence iletişim",
      "infografik tasarım iletişim",
      "post prodüksiyon şirketi iletişim",
      "Türkiye post prodüksiyon iletişim",
      "profesyonel video kurgu iletişim",
      "sinema post prodüksiyon iletişim",
      "reklam post prodüksiyon iletişim",
      "dizi post prodüksiyon iletişim",
      "belgesel post prodüksiyon iletişim",
      "müzik videosu kurgu iletişim",
      "ses düzenleme iletişim",
      "color grading iletişim",
      "STD5 telefon",
      "STD5 email",
      "STD5 adres",
      "STD5 lokasyon",
      "İstanbul medya sektörü iletişim",
      "profesyonel stüdyo iletişim",
      "yaratıcı post prodüksiyon iletişim",
      "endüstri standartları iletişim",
      "yüksek kalite video iletişim",
      "STD5 iletişim formu",
      "post prodüksiyon teklif",
      "video kurgu fiyat",
      "ses tasarımı fiyat",
      "renk düzenleme fiyat"
    ].join(", "),
    openGraph: {
      title: "İletişim | STD5 - Post Prodüksiyon",
      description: "Her zaman yoğunuz ama misafirlerimiz baş tacı. Renk, kurgu, animasyon, ses miksajı, teknik destek ve Türk kahvesiyle sizi bekliyoruz.",
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
      title: "İletişim | STD5 - Post Prodüksiyon",
      description: "Her zaman yoğunuz ama misafirlerimiz baş tacı. Renk, kurgu, animasyon, ses miksajı, teknik destek ve Türk kahvesiyle sizi bekliyoruz.",
      images: [`${baseUrl}/og-image.png`],
    },
  };
}

export default function Contact() {
  return <ContactClient />;
}
