import ProjectsClient from './ProjectsClient';
import { Metadata } from 'next';

interface ProjectsPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: ProjectsPageProps): Promise<Metadata> {
  const { locale } = await params;

  const titles = {
    tr: 'Projeler | STD5',
    en: 'Projects | STD5',
    fr: 'Projets | STD5',
    es: 'Proyectos | STD5'
  };

  const descriptions = {
    tr: 'STD5\'in 250+ proje portföyünü keşfedin. Film, dizi, reklam ve daha fazlası için kurgu, ses, renk ve VFX çalışmalarımız.',
    en: 'Explore STD5\'s portfolio of 250+ projects. Our editing, sound, color and VFX work for films, series, commercials and more.',
    fr: 'Découvrez le portfolio de STD5 avec plus de 250 projets. Nos travaux de montage, son, couleur et VFX pour films, séries, publicités et plus.',
    es: 'Explora el portafolio de STD5 con más de 250 proyectos. Nuestro trabajo de edición, sonido, color y VFX para películas, series, comerciales y más.'
  };

  const currentTitle = titles[locale as keyof typeof titles] || titles.tr;
  const currentDescription = descriptions[locale as keyof typeof descriptions] || descriptions.tr;
  const currentUrl = locale === 'tr' ? 'https://std5.net/projects' : `https://std5.net/${locale}/projects`;

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

export default function Projects() {
  return <ProjectsClient />;
}
