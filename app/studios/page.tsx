"use client";

import { motion } from "framer-motion";
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import tr from '../../locales/tr.json';
import en from '../../locales/en.json';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Translations } from '../../types/translations';

const locales = { tr, en } as { [key: string]: Translations };

const studios = [
  {
    id: 1,
    name: "Studio A",
    description: {
      tr: "Renk düzenleme ve ses miksaj stüdyosu",
      en: "Color grading and sound mixing studio"
    },
    images: ["/studios/studio-a-1.jpg", "/studios/studio-a-2.jpg", "/studios/studio-a-3.jpg"]
  },
  {
    id: 2,
    name: "Studio B",
    description: {
      tr: "Video kurgu ve animasyon stüdyosu",
      en: "Video editing and animation studio"
    },
    images: ["/studios/studio-b-1.jpg", "/studios/studio-b-2.jpg", "/studios/studio-b-3.jpg"]
  },
  {
    id: 3,
    name: "Studio C",
    description: {
      tr: "Dublaj ve ses kayıt stüdyosu",
      en: "Dubbing and voice recording studio"
    },
    images: ["/studios/studio-c-1.jpg", "/studios/studio-c-2.jpg", "/studios/studio-c-3.jpg"]
  }
];

export default function Studios() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [locale, setLocale] = useState('tr');
  const [translations, setTranslations] = useState<Translations>(tr);
  const [currentSlides, setCurrentSlides] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    const langParam = searchParams.get('lang');
    const validLang = langParam === 'en' ? 'en' : 'tr';
    setLocale(validLang);
    setTranslations(locales[validLang as keyof typeof locales]);

    // Initialize current slide for each studio
    const initialSlides = studios.reduce((acc, studio) => {
      acc[studio.id] = 0;
      return acc;
    }, {} as { [key: number]: number });
    setCurrentSlides(initialSlides);
  }, [searchParams]);

  const t = (key: string) => {
    const keys = key.split('.');
    let value: any = translations;
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  };

  const switchLanguage = (newLocale: string) => {
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set('lang', newLocale);
    router.push(currentUrl.pathname + currentUrl.search);
  };

  const nextSlide = (studioId: number) => {
    setCurrentSlides(prev => ({
      ...prev,
      [studioId]: (prev[studioId] + 1) % studios.find(s => s.id === studioId)!.images.length
    }));
  };

  const prevSlide = (studioId: number) => {
    setCurrentSlides(prev => ({
      ...prev,
      [studioId]: (prev[studioId] - 1 + studios.find(s => s.id === studioId)!.images.length) % studios.find(s => s.id === studioId)!.images.length
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-std5-darker via-std5-dark to-std5-darker">
      {/* Studios Content */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-8">
              {locale === 'tr' ? 'Stüdyolarımız' : 'Our Studios'}
            </h1>
          </motion.div>

          <div className="space-y-16">
            {studios.map((studio, index) => (
              <motion.div
                key={studio.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="glass rounded-2xl overflow-hidden"
              >
                <div className="relative aspect-video">
                  {studio.images.map((image, imageIndex) => (
                    <div
                      key={image}
                      className={`absolute inset-0 transition-opacity duration-500 ${
                        currentSlides[studio.id] === imageIndex ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${studio.name} - ${imageIndex + 1}`}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `data:image/svg+xml,${encodeURIComponent(
                            `<svg viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg">
                              <rect width="1920" height="1080" fill="#430086"/>
                              <text x="960" y="540" text-anchor="middle" fill="white" font-size="48">${studio.name}</text>
                            </svg>`
                          )}`;
                        }}
                      />
                    </div>
                  ))}

                  {/* Slider Controls */}
                  <div className="absolute inset-0 flex items-center justify-between p-4">
                    <button
                      onClick={() => prevSlide(studio.id)}
                      className="w-12 h-12 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors duration-300"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={() => nextSlide(studio.id)}
                      className="w-12 h-12 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors duration-300"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </div>

                  {/* Slide Indicators */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                    {studio.images.map((_, imageIndex) => (
                      <button
                        key={imageIndex}
                        onClick={() => setCurrentSlides(prev => ({ ...prev, [studio.id]: imageIndex }))}
                        className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                          currentSlides[studio.id] === imageIndex ? 'bg-white' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="p-8">
                  <h2 className="text-3xl font-bold text-white mb-4">
                    {studio.name}
                  </h2>
                  <p className="text-gray-300 text-lg">
                    {studio.description[locale as keyof typeof studio.description]}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
