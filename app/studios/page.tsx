"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, MapPin, Camera, Mic, Monitor } from 'lucide-react';

const studios = [
  {
    id: 1,
    name: "Esentepe",
    description: "Renk düzenleme ve ses miksaj stüdyosu",
    icon: <Monitor className="w-8 h-8" />,
    images: ["/studios/1-1.jpg", "/studios/1-2.jpg", "/studios/1-3.jpg", "/studios/1-4.jpg", "/studios/1-5.jpg", "/studios/1-6.jpg"]
  },
  {
    id: 2,
    name: "Fulyalı",
    description: "Video kurgu ve animasyon stüdyosu",
    icon: <Camera className="w-8 h-8" />,
    images: ["/studios/2-1.jpg", "/studios/2-2.jpg", "/studios/2-3.jpg", "/studios/2-4.jpg", "/studios/2-5.jpg", "/studios/2-6.jpg"]
  },
  {
    id: 3,
    name: "Figen 2",
    description: "Dublaj ve ses kayıt stüdyosu",
    icon: <Mic className="w-8 h-8" />,
    images: ["/studios/3-1.jpg", "/studios/3-2.jpg", "/studios/3-3.jpg", "/studios/3-4.jpg", "/studios/3-5.jpg", "/studios/3-6.jpg"]
  }
];

export default function Studios() {
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
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-std5-dark/20 to-std5-darker"></div>

        <div className="relative max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-20"
          >
            <h1 className="text-6xl md:text-8xl font-bold text-white mb-12 leading-tight">
              <span className="bg-gradient-to-r from-std5-primary to-std5-accent bg-clip-text text-transparent">
                Stüdyolarımız
              </span>
            </h1>

            <div className="max-w-5xl mx-auto">
              <p className="text-2xl md:text-3xl text-gray-300 leading-relaxed font-light">
                İstanbul içi 3 farklı lokasyonda, post prodüksiyon için gereken tüm altyapıyı incelikle tasarladığımız,
                alanındaki en iyi donanımları ve yazılımları içeren stüdyolarımızda, misafirlerimiz için buradayız.
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-wrap justify-center gap-8 mt-16"
            >
              <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-white/10 backdrop-blur-md">
                <MapPin className="w-6 h-6 text-std5-accent" />
                <span className="text-xl font-medium text-white">3 Lokasyon</span>
              </div>
              <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-white/10 backdrop-blur-md">
                <Monitor className="w-6 h-6 text-std5-accent" />
                <span className="text-xl font-medium text-white">Premium Donanım</span>
              </div>
              <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-white/10 backdrop-blur-md">
                <Camera className="w-6 h-6 text-std5-accent" />
                <span className="text-xl font-medium text-white">Post Prodüksiyon</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Studios Grid */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-20">
            {studios.map((studio, index) => (
              <motion.div
                key={studio.id}
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.3 }}
                className="group"
              >
                <div className="glass rounded-3xl overflow-hidden transform transition-all duration-700 hover:scale-[1.01] hover:shadow-2xl">
                  {/* Image Slider */}
                  <div className="relative aspect-[21/9] overflow-hidden">
                    {studio.images.map((image, imageIndex) => (
                      <div
                        key={image}
                        className={`absolute inset-0 transition-all duration-1000 ${
                          currentSlides[studio.id] === imageIndex
                            ? 'opacity-100 scale-100'
                            : 'opacity-0 scale-105'
                        }`}
                      >
                        <Image
                          src={image}
                          alt={`${studio.name} - ${imageIndex + 1}`}
                          fill
                          className="object-cover transition-transform duration-1000 group-hover:scale-110"
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

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20"></div>

                    {/* Slider Controls */}
                    <div className="absolute inset-0 flex items-center justify-between p-8">
                      <motion.button
                        onClick={() => prevSlide(studio.id)}
                        className="w-16 h-16 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/25 transition-all duration-300 opacity-0 group-hover:opacity-100"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <ChevronLeft className="w-7 h-7" />
                      </motion.button>
                      <motion.button
                        onClick={() => nextSlide(studio.id)}
                        className="w-16 h-16 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/25 transition-all duration-300 opacity-0 group-hover:opacity-100"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <ChevronRight className="w-7 h-7" />
                      </motion.button>
                    </div>

                    {/* Slide Indicators */}
                    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4">
                      {studio.images.map((_, imageIndex) => (
                        <button
                          key={imageIndex}
                          onClick={() => setCurrentSlides(prev => ({ ...prev, [studio.id]: imageIndex }))}
                          className={`w-4 h-4 rounded-full transition-all duration-300 ${
                            currentSlides[studio.id] === imageIndex
                              ? 'bg-std5-accent scale-125 shadow-lg'
                              : 'bg-white/50 hover:bg-white/75'
                          }`}
                        />
                      ))}
                    </div>

                    {/* Studio Icon */}
                    <div className="absolute top-8 left-8">
                      <div className="w-20 h-20 rounded-3xl bg-std5-primary/30 backdrop-blur-md flex items-center justify-center text-std5-accent border border-white/20">
                        {studio.icon}
                      </div>
                    </div>

                    {/* Studio Info Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                        <div>
                          <h2 className="text-5xl md:text-7xl font-bold text-white mb-3 leading-tight">
                            {studio.name}
                          </h2>
                          <p className="text-xl md:text-2xl text-gray-200 leading-relaxed max-w-2xl">
                            {studio.description}
                          </p>
                        </div>

                        <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-white/20 backdrop-blur-md">
                          <MapPin className="w-5 h-5 text-std5-accent" />
                          <span className="text-lg font-medium text-white">İstanbul</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
