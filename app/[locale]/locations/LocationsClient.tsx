"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, MapPin, Camera, Mic, Monitor, Volume2, Palette } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';

const locations = [
  {
    id: 1,
    name: "Esentepe",
    icon: <Monitor className="w-8 h-8" />,
    images: ["/studios/1-1.jpg", "/studios/1-2.jpg", "/studios/1-3.jpg", "/studios/1-4.jpg", "/studios/1-5.jpg", "/studios/1-6.jpg"],
    mapsUrl: "https://maps.google.com/?q=STD5+Esentepe+Dergiler+Sokak+No:5+Şişli+İstanbul"
  },
  {
    id: 2,
    name: "Fulyalı",
    icon: <Camera className="w-8 h-8" />,
    images: ["/studios/2-1.jpg", "/studios/2-2.jpg", "/studios/2-3.jpg", "/studios/2-4.jpg", "/studios/2-5.jpg", "/studios/2-6.jpg"],
    mapsUrl: "https://maps.google.com/?q=STD5+Fulyalı+Sokak+No:28+Beşiktaş+İstanbul"
  },
  {
    id: 3,
    name: "Figen",
    icon: <Mic className="w-8 h-8" />,
    images: ["/studios/3-1.jpg", "/studios/3-2.jpg", "/studios/3-3.jpg", "/studios/3-4.jpg", "/studios/3-5.jpg", "/studios/3-6.jpg"],
    mapsUrl: "https://maps.google.com/?q=STD5+Figen+Sokak+No:2+Beşiktaş+İstanbul"
  }
];

export default function LocationsClient() {
  const { t } = useTranslation();
  const [currentSlides, setCurrentSlides] = useState<{ [key: number]: number }>({});
  const [touchStart, setTouchStart] = useState<{ [key: number]: number }>({});
  const [touchEnd, setTouchEnd] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    // Initialize current slide for each studio
    const initialSlides = locations.reduce((acc, location) => {
      acc[location.id] = 0;
      return acc;
    }, {} as { [key: number]: number });
    setCurrentSlides(initialSlides);
  }, []);

  const nextSlide = (locationId: number) => {
    setCurrentSlides(prev => ({
      ...prev,
      [locationId]: (prev[locationId] + 1) % locations.find(s => s.id === locationId)!.images.length
    }));
  };

  const prevSlide = (locationId: number) => {
    setCurrentSlides(prev => ({
      ...prev,
      [locationId]: (prev[locationId] - 1 + locations.find(s => s.id === locationId)!.images.length) % locations.find(s => s.id === locationId)!.images.length
    }));
  };

  // Touch handlers for swipe functionality
  const handleTouchStart = (locationId: number, e: React.TouchEvent) => {
    setTouchStart(prev => ({
      ...prev,
      [locationId]: e.targetTouches[0].clientX
    }));
  };

  const handleTouchMove = (locationId: number, e: React.TouchEvent) => {
    setTouchEnd(prev => ({
      ...prev,
      [locationId]: e.targetTouches[0].clientX
    }));
  };

  const handleTouchEnd = (locationId: number) => {
    if (!touchStart[locationId] || !touchEnd[locationId]) return;
    
    const distance = touchStart[locationId] - touchEnd[locationId];
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide(locationId);
    }
    if (isRightSwipe) {
      prevSlide(locationId);
    }

    // Reset touch states
    setTouchStart(prev => ({ ...prev, [locationId]: 0 }));
    setTouchEnd(prev => ({ ...prev, [locationId]: 0 }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-std5-darker via-std5-dark to-std5-darker">
      {/* Hero Section */}
      <section className="relative pt-20 md:pt-24 pb-4 md:pb-7 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-std5-dark/20 to-std5-darker"></div>

        <div className="relative max-w-7xl mx-auto text-center">
                      <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8 md:mb-12"
            >
            <div className="relative mb-6 md:mb-8">
              <motion.h1
                className="text-[28px] md:text-[52px] font-bold text-white mb-4 md:mb-6"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                {t('locations.title')}
              </motion.h1>
              <motion.div
                className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-std5-primary to-std5-accent rounded-full"
                initial={{ width: 0 }}
                animate={{ width: 80 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              />
            </div>
            <p className="text-[20px] md:text-[26px] text-gray-300 max-w-5xl mx-auto mb-8 md:mb-12">
              {t('locations.description')}
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="grid grid-cols-2 md:flex md:flex-wrap justify-center gap-3 md:gap-8"
            >
              <div className="flex items-center gap-2 md:gap-3 px-3 md:px-6 py-2 md:py-3 rounded-full bg-white/10 backdrop-blur-md">
                <MapPin className="w-4 h-4 md:w-6 md:h-6 text-std5-accent flex-shrink-0" />
                <span className="text-sm md:text-xl font-medium text-white truncate">{t('locations.threeLocations')}</span>
              </div>
              <div className="flex items-center gap-2 md:gap-3 px-3 md:px-6 py-2 md:py-3 rounded-full bg-white/10 backdrop-blur-md">
                <Monitor className="w-4 h-4 md:w-6 md:h-6 text-std5-accent flex-shrink-0" />
                <span className="text-sm md:text-xl font-medium text-white truncate">{t('locations.premiumEquipment')}</span>
              </div>
              <div className="flex items-center gap-2 md:gap-3 px-3 md:px-6 py-2 md:py-3 rounded-full bg-white/10 backdrop-blur-md">
                <Palette className="w-4 h-4 md:w-6 md:h-6 text-std5-accent flex-shrink-0" />
                <span className="text-sm md:text-xl font-medium text-white truncate">{t('locations.hdrColor')}</span>
              </div>
              <div className="flex items-center gap-2 md:gap-3 px-3 md:px-6 py-2 md:py-3 rounded-full bg-white/10 backdrop-blur-md">
                <Volume2 className="w-4 h-4 md:w-6 md:h-6 text-std5-accent flex-shrink-0" />
                <span className="text-sm md:text-xl font-medium text-white truncate">{t('locations.dolbyAtmos')}</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Studios Grid */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-8 md:space-y-20">
            {locations.map((location, index) => (
              <motion.div
                key={location.id}
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.3 }}
                className="group"
              >
                <div className="glass rounded-2xl md:rounded-3xl overflow-hidden transform transition-all duration-700 hover:scale-[1.01] hover:shadow-2xl">
                  {/* Image Slider */}
                  <div 
                    className="relative aspect-[16/9] md:aspect-[21/9] overflow-hidden touch-pan-y"
                    onTouchStart={(e) => handleTouchStart(location.id, e)}
                    onTouchMove={(e) => handleTouchMove(location.id, e)}
                    onTouchEnd={() => handleTouchEnd(location.id)}
                  >
                    {/* Clickable area for Google Maps */}
                    <div
                      onClick={() => window.open(location.mapsUrl, '_blank', 'noopener,noreferrer')}
                      className="absolute inset-0 z-10 cursor-pointer"
                    />

                    {location.images.map((image, imageIndex) => (
                      <div
                        key={image}
                        className={`absolute inset-0 transition-all duration-1000 ${
                          currentSlides[location.id] === imageIndex
                            ? 'opacity-100 scale-100'
                            : 'opacity-0 scale-105'
                        }`}
                      >
                        <Image
                          src={image}
                          alt={`${location.name} - ${imageIndex + 1}`}
                          fill
                          className="object-cover transition-transform duration-1000 group-hover:scale-110"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = `data:image/svg+xml,${encodeURIComponent(
                              `<svg viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg">
                                <rect width="1920" height="1080" fill="#430086"/>
                                <text x="960" y="540" text-anchor="middle" fill="white" font-size="48">${location.name}</text>
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
                    <div className="absolute inset-0 flex items-center justify-between p-4 md:p-8 z-20 pointer-events-none">
                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation();
                          prevSlide(location.id);
                        }}
                        className="pointer-events-auto w-10 h-10 md:w-16 md:h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 opacity-100 md:opacity-0 md:group-hover:opacity-100"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <ChevronLeft className="w-5 h-5 md:w-7 md:h-7" />
                      </motion.button>
                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation();
                          nextSlide(location.id);
                        }}
                        className="pointer-events-auto w-10 h-10 md:w-16 md:h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 opacity-100 md:opacity-0 md:group-hover:opacity-100"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <ChevronRight className="w-5 h-5 md:w-7 md:h-7" />
                      </motion.button>
                    </div>

                    {/* Slide Indicators */}
                    <div className="absolute bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 md:gap-4 z-20 pointer-events-none">
                      {location.images.map((_, imageIndex) => (
                        <button
                          key={imageIndex}
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrentSlides(prev => ({ ...prev, [location.id]: imageIndex }));
                          }}
                          className={`pointer-events-auto w-3 h-3 md:w-4 md:h-4 rounded-full transition-all duration-300 ${
                            currentSlides[location.id] === imageIndex
                              ? 'bg-std5-accent scale-125 shadow-lg'
                              : 'bg-white/50 hover:bg-white/75'
                          }`}
                        />
                      ))}
                    </div>

                    {/* Studio Info Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 z-10">
                      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 md:gap-6">
                        <div>
                          <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-7xl font-bold text-white mb-2 md:mb-3 leading-tight">
                            {location.name}
                          </h2>
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
