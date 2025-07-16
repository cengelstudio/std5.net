import ContactClient from './ContactClient';
import { Metadata } from 'next';

interface ContactPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: ContactPageProps): Promise<Metadata> {
  const { locale } = await params;

  const titles = {
    tr: 'İletişim | STD5',
    en: 'Contact | STD5',
    fr: 'Contact | STD5',
    es: 'Contacto | STD5'
  };

  const descriptions = {
    tr: 'STD5 ile iletişime geçin. Kurgu, ses, renk, dublaj ve VFX hizmetlerimiz için bize ulaşın. İstanbul\'da 3 lokasyonda hizmetinizdeyiz.',
    en: 'Contact STD5. Reach out to us for our editing, sound, color, dubbing and VFX services. We serve you in 3 Istanbul locations.',
    fr: 'Contactez STD5. Contactez-nous pour nos services de montage, son, couleur, doublage et VFX. Nous vous servons dans 3 emplacements d\'Istanbul.',
    es: 'Contacta a STD5. Acércate a nosotros para nuestros servicios de edición, sonido, color, doblaje y VFX. Te servimos en 3 ubicaciones de Estambul.'
  };

  const currentTitle = titles[locale as keyof typeof titles] || titles.tr;
  const currentDescription = descriptions[locale as keyof typeof descriptions] || descriptions.tr;
  const currentUrl = locale === 'tr' ? 'https://std5.net/contact' : `https://std5.net/${locale}/contact`;

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
    },
    twitter: {
      title: currentTitle,
      description: currentDescription,
    },
  };
}

export default function Contact() {
  return <ContactClient />;
}
