import LocationsClient from './LocationsClient';
import { Metadata } from 'next';

interface LocationsPageProps {
  params: {
    locale: string;
  };
}

export async function generateMetadata({ params }: LocationsPageProps): Promise<Metadata> {
  const { locale } = await params;

  const titles = {
    tr: 'Yerleşkeler | STD5',
    en: 'Locations | STD5',
    fr: 'Emplacements | STD5',
    es: 'Ubicaciones | STD5'
  };

  const descriptions = {
    tr: 'İstanbul\'da 3 lokasyonda, en iyi donanım ve yazılımla donatılmış stüdyolarımızda post prodüksiyonun her aşaması için altyapı sunuyoruz.',
    en: 'In 3 Istanbul locations, we offer infrastructure for every stage of post-production in our studios equipped with the best hardware and software.',
    fr: 'Dans 3 emplacements d\'Istanbul, nous offrons une infrastructure pour chaque étape de la post-production dans nos studios équipés des meilleurs matériels et logiciels.',
    es: 'En 3 ubicaciones de Estambul, ofrecemos infraestructura para cada etapa de post-producción en nuestros estudios equipados con el mejor hardware y software.'
  };

  const currentTitle = titles[locale as keyof typeof titles] || titles.tr;
  const currentDescription = descriptions[locale as keyof typeof descriptions] || descriptions.tr;
  const currentUrl = locale === 'tr' ? 'https://std5.net/locations' : `https://std5.net/${locale}/locations`;

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

export default function Locations() {
  return <LocationsClient />;
}
