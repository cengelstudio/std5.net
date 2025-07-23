import ClientHome from '../ClientHome';
import { Metadata } from 'next';

interface HomePageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { locale } = await params;

  const titles = {
    tr: 'Ana Sayfa | STD5',
    en: 'Home | STD5',
    fr: 'Accueil | STD5',
    es: 'Inicio | STD5',
    ar: 'الرئيسية | STD5',
    ru: 'Главная | STD5'
  };

  const descriptions = {
    tr: 'STD5, İstanbul\'da 3 lokasyonda post prodüksiyon, kurgu, ses, renk ve VFX hizmetleri sunar. 250+ proje deneyimi ile sektörün önde gelen şirketi.',
    en: 'STD5 offers post-production, editing, sound, color and VFX services in 3 Istanbul locations. Leading company in the sector with 250+ project experience.',
    fr: 'STD5 propose des services de post-production, montage, son, couleur et VFX dans 3 emplacements d\'Istanbul. Société leader du secteur avec plus de 250 projets d\'expérience.',
    es: 'STD5 ofrece servicios de post-producción, edición, sonido, color y VFX en 3 ubicaciones de Estambul. Empresa líder en el sector con más de 250 proyectos de experiencia.',
    ar: 'STD5 تقدم خدمات ما بعد الإنتاج والتحرير والصوت والألوان والمؤثرات البصرية في 3 مواقع في إسطنبول. شركة رائدة في القطاع مع خبرة في أكثر من 250 مشروع.',
    ru: 'STD5 предлагает услуги постпродакшна, монтажа, звука, цвета и VFX в 3 локациях Стамбула. Ведущая компания в секторе с опытом более 250 проектов.'
  };

  const currentTitle = titles[locale as keyof typeof titles] || titles.tr;
  const currentDescription = descriptions[locale as keyof typeof descriptions] || descriptions.tr;

  const currentUrl = `https://std5.net/${locale}`;

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

export default function Home() {
  return <ClientHome />;
}
