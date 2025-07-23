import AboutClient from './AboutClient';
import { Metadata } from 'next';

interface AboutPageProps {
  params: Promise<{
    locale: string;
  }>;
}

// Veri çekme fonksiyonu - doğrudan dosya sisteminden okuma
async function getAboutData() {
  try {
    const { promises: fs } = await import('fs');
    const path = await import('path');
    
    const foundersFilePath = path.join(process.cwd(), 'data', 'founders.json');
    const crewFilePath = path.join(process.cwd(), 'data', 'crew.json');
    
    const [foundersData, crewData] = await Promise.all([
      fs.readFile(foundersFilePath, 'utf8'),
      fs.readFile(crewFilePath, 'utf8')
    ]);
    
    return {
      founders: JSON.parse(foundersData),
      crew: JSON.parse(crewData)
    };
  } catch (error) {
    console.error('Error reading about data:', error);
    return { founders: [], crew: [] };
  }
}

export async function generateMetadata({ params }: AboutPageProps): Promise<Metadata> {
  const { locale } = await params;

  const titles = {
    tr: 'Hakkımızda | STD5',
    en: 'About Us | STD5',
    fr: 'À Propos | STD5',
    es: 'Acerca de | STD5',
    ru: 'О нас | STD5'
  };

  const descriptions = {
    tr: '2017\'de İstanbul\'da kurulan STD5, 3 lokasyonda post prodüksiyon hizmetleri sunar. Deneyimli ekibimiz ve teknolojik imkanlarımızla 250+ projeye imza attık.',
    en: 'Founded in 2017 in Istanbul, STD5 offers post-production services in 3 locations. With our experienced team and technological facilities, we have completed 250+ projects.',
    fr: 'Fondée en 2017 à Istanbul, STD5 propose des services de post-production dans 3 emplacements. Avec notre équipe expérimentée et nos installations technologiques, nous avons réalisé plus de 250 projets.',
    es: 'Fundada en 2017 en Estambul, STD5 ofrece servicios de post-producción en 3 ubicaciones. Con nuestro equipo experimentado e instalaciones tecnológicas, hemos completado más de 250 proyectos.',
    ru: 'Основанная в 2017 году в Стамбуле, STD5 предлагает услуги постпродакшна в 3 локациях. С нашей опытной командой и технологическими возможностями мы завершили более 250 проектов.'
  };

  const currentTitle = titles[locale as keyof typeof titles] || titles.tr;
  const currentDescription = descriptions[locale as keyof typeof descriptions] || descriptions.tr;
  const currentUrl = locale === 'tr' ? 'https://std5.net/about' : `https://std5.net/${locale}/about`;

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

export default async function About({ params }: AboutPageProps) {
  const { locale } = await params;
  const aboutData = await getAboutData();
  
  return <AboutClient founders={aboutData.founders} crew={aboutData.crew} locale={locale} />;
}

// Cache'i devre dışı bırak - her zaman güncel veri
export const dynamic = 'force-dynamic';
export const revalidate = 0;
