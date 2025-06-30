"use client";

import { motion } from "framer-motion";
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const studios = [
  {
    id: 1,
    name: "Studio A",
    description: "Renk düzenleme ve ses miksaj stüdyosu",
    images: ["/studios/1-1.jpg", "/studios/1-2.jpg", "/studios/1-3.jpg", "/studios/1-4.jpg", "/studios/1-5.jpg", "/studios/1-6.jpg"]
  },
  {
    id: 2,
    name: "Studio B",
    description: "Video kurgu ve animasyon stüdyosu",
    images: ["/studios/2-1.jpg", "/studios/2-2.jpg", "/studios/2-3.jpg", "/studios/2-4.jpg", "/studios/2-5.jpg", "/studios/2-6.jpg"]
  },
  {
    id: 3,
    name: "Studio C",
    description: "Dublaj ve ses kayıt stüdyosu",
    images: ["/studios/3-1.jpg", "/studios/3-2.jpg", "/studios/3-3.jpg", "/studios/3-4.jpg", "/studios/3-5.jpg", "/studios/3-6.jpg"]
  }
];

export default function Studios() {
  const router = useRouter();
  const [currentSlides, setCurrentSlides] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    // Initialize current slide for each studio
    const initialSlides = studios.reduce((acc, studio) => {
      acc[studio.id] = 0;
      return acc;
    }, {} as { [key: number]: number });
    setCurrentSlides(initialSlides);
  }, []);

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
              Stüdyolarımız
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
                    {studio.description}
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
