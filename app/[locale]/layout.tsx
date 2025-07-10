import "../globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Metadata } from "next";
import type { Viewport } from 'next';
import { ReactNode } from 'react';

export const viewport: Viewport = {
  themeColor: "#430086",
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

interface LocaleLayoutProps {
  children: ReactNode;
  params: {
    locale: string;
  };
}

export async function generateMetadata({ params }: LocaleLayoutProps): Promise<Metadata> {
  const { locale } = await params;

  const titles = {
    tr: 'STD5',
    en: 'STD5',
    fr: 'STD5',
    es: 'STD5'
  };

  const descriptions = {
    tr: 'İstanbul merkezli post prodüksiyon şirketi. Kurgu, ses tasarımı, renk düzenleme, dublaj ve VFX hizmetleri. 250+ proje deneyimi.',
    en: 'Istanbul-based post-production company. Editing, sound design, color grading, dubbing and VFX services. 250+ project experience.',
    fr: 'Société de post-production basée à Istanbul. Services de montage, conception sonore, étalonnage couleur, doublage et VFX. Plus de 250 projets d\'expérience.',
    es: 'Empresa de post-producción con sede en Estambul. Servicios de edición, diseño de sonido, gradación de color, doblaje y VFX. Más de 250 proyectos de experiencia.'
  };

  const keywords = {
    tr: 'post prodüksiyon, kurgu, ses tasarımı, renk düzenleme, VFX, dublaj, İstanbul, film, dizi, reklam',
    en: 'post production, editing, sound design, color grading, VFX, dubbing, Istanbul, film, series, commercial',
    fr: 'post-production, montage, conception sonore, étalonnage couleur, VFX, doublage, Istanbul, film, série, publicité',
    es: 'post-producción, edición, diseño de sonido, gradación de color, VFX, doblaje, Estambul, película, serie, comercial'
  };

  const currentTitle = titles[locale as keyof typeof titles] || titles.tr;
  const currentDescription = descriptions[locale as keyof typeof descriptions] || descriptions.tr;
  const currentKeywords = keywords[locale as keyof typeof keywords] || keywords.tr;

  return {
    title: currentTitle,
    description: currentDescription,
    keywords: currentKeywords,
    authors: [{ name: 'STD5' }],
    creator: 'STD5',
    publisher: 'STD5',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      languages: {
        'tr': 'https://std5.net',
        'en': 'https://std5.net/en',
        'fr': 'https://std5.net/fr',
        'es': 'https://std5.net/es',
      },
    },
    icons: {
      icon: [
        { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
        { url: '/favicon.png', sizes: '16x16', type: 'image/png' },
      ],
      apple: [
        { url: '/favicon.png', sizes: '180x180', type: 'image/png' },
      ],
    },
    manifest: '/manifest.json',
    openGraph: {
      type: 'website',
      locale: locale,
      url: locale === 'tr' ? 'https://std5.net' : `https://std5.net/${locale}`,
      title: currentTitle,
      description: currentDescription,
      siteName: 'STD5',
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: currentTitle,
          type: 'image/png',
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: currentTitle,
      description: currentDescription,
      images: ["/og-image.png"],
      creator: '@std5',
      site: '@std5',
    },
    other: {
      'geo.region': 'TR-34',
      'geo.placename': 'Istanbul',
      'geo.position': '41.0082;28.9784',
      'ICBM': '41.0082, 28.9784',
    },
  };
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  // Validate locale
  const validLocales = ['tr', 'en', 'fr', 'es'];
  if (!validLocales.includes(locale)) {
    return <div>Invalid locale</div>;
  }

  return (
    <html lang={locale} dir="ltr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="theme-color" content="#430086" />
        <meta name="msapplication-TileColor" content="#430086" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
