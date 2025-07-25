"use client";

import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, easeInOut } from "framer-motion";
import { Play, Volume2, Palette } from "lucide-react";
import Link from 'next/link';
import { useMemo } from 'react';
import MosaicBackground from './components/MosaicBackground';
import { STATS } from './constants';
import Image from 'next/image';
import { Work } from '../types';
import { useTranslation } from './hooks/useTranslation';
import ServiceCard from './components/ServiceCard';
import { createSlug } from './utils';

export default function ClientHome() {
  const { t, createLocalizedPath } = useTranslation();
  const [featuredWorks, setFeaturedWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);

  // Smooth scroll function
  const scrollToProjects = () => {
    const element = document.getElementById('featured-projects');
    if (element) {
      const headerHeight = 80; // Header yüksekliği
      const elementPosition = element.offsetTop - headerHeight;

      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  };

  // Generate a random number for mosaic background - memoized for performance
  const randomSeed = useMemo(() => Math.floor(Math.random() * 1000000), []);

  // Scroll animation setup with smoother transitions
  const { scrollY } = useScroll();

  // Calculate 6% of viewport height for scroll threshold
  const scrollThreshold = typeof window !== 'undefined' ? window.innerHeight * 0.06 : 0;
  const animationLength = 400;

  const titleScale = useTransform(
    scrollY,
    [scrollThreshold, scrollThreshold + animationLength],
    [1, 0.7],
    { ease: easeInOut }
  );

  const titleY = useTransform(
    scrollY,
    [scrollThreshold, scrollThreshold + animationLength],
    [0, 100],
    { ease: easeInOut }
  );

  const titleOpacity = useTransform(
    scrollY,
    [scrollThreshold, scrollThreshold + animationLength],
    [1, 0],
    { ease: easeInOut }
  );

  // Fetch featured projects
  useEffect(() => {
    const fetchFeaturedWorks = async () => {
      try {
        const response = await fetch('/api/featured-projects');
        const data = await response.json();
        setFeaturedWorks(data.works || []);
      } catch (error) {
        console.error('Error fetching featured works:', error);
        setFeaturedWorks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedWorks();
  }, []);

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Netflix-style Hero Section with Background Mosaic */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-black">
        {/* Background Image Mosaic */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <div
            className="absolute inset-0 w-full h-full"
            style={{
              perspective: '1000px',
              perspectiveOrigin: 'center center'
            }}
          >
            <div
              className="w-full h-full"
              style={{
                transform: 'rotateX(25deg) rotateY(10deg) rotateZ(-10deg) scale(2) translate(70px, 10px)',
                transformOrigin: 'center center',
                transformStyle: 'preserve-3d'
              }}
            >
              <MosaicBackground seed={randomSeed} />
            </div>
          </div>
        </div>

        {/* Dark Overlay with gradient */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.9) 100%)',
        }} />
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.2) 100%)',
        }} />

        {/* Content */}
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto flex items-center justify-center h-full">
          <motion.div
            style={{
              scale: titleScale,
              y: titleY,
              opacity: titleOpacity
            }}
            className="flex flex-col items-center"
          >
                        <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="relative flex flex-col items-center gap-12 md:gap-16"
            >
              {/* Başlık */}
              <div className="relative text-center max-w-4xl">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
                  {t('home.hero.title')}
                  <br />
                  <span className="text-std5-accent">
                    {t('home.hero.titleAccent')}
                  </span>
                </h1>
              </div>

              {/* İstatistikler ve Badges */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="flex flex-col items-center gap-8 md:gap-10"
              >
                {/* İstatistikler */}
                <div className="grid grid-cols-3 gap-3 md:gap-8 justify-items-center w-full max-w-xl md:max-w-2xl">
                  {STATS.slice(0, 3).map((stat, index) => {
                    // Yönlendirme mantığı - daha net ve güvenilir
                    let href = '/';
                    if (stat.number === '250+') {
                      href = createLocalizedPath('/projects');
                    } else if (stat.number === '45+' || stat.number === '3') {
                      href = createLocalizedPath('/locations');
                    }

                    return (
                      <Link key={`${stat.label}-${stat.number}`} href={href}>
                        <motion.div
                          className="text-center cursor-pointer group"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <div className="relative">
                            <div className="text-xl md:text-3xl lg:text-4xl font-bold text-white mb-1 md:mb-2 group-hover:text-std5-accent transition-all duration-300">
                              {stat.number}
                            </div>
                            <div className="text-xs md:text-sm text-gray-300 group-hover:text-white transition-colors duration-300 font-medium">
                              {t(stat.label)}
                            </div>
                            {/* Hover effect line */}
                            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-std5-primary to-std5-accent group-hover:w-full transition-all duration-300"></div>
                          </div>
                        </motion.div>
                      </Link>
                    );
                  })}
                </div>

                {/* Dolby Atmos ve HDR Color badges */}
                <div className="flex justify-center items-center gap-3 md:gap-6">
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    className="flex items-center gap-2 md:gap-3 px-4 md:px-8 py-2.5 md:py-4 rounded-full bg-gradient-to-r from-std5-primary/20 to-std5-accent/20 backdrop-blur-md border border-white/10 hover:border-std5-accent/30 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <div className="p-1.5 md:p-2 rounded-full bg-std5-accent/20">
                      <Volume2 className="w-4 h-4 md:w-6 md:h-6 text-std5-accent" />
                    </div>
                    <span className="text-xs md:text-base font-semibold text-white">
                      Dolby Atmos
                    </span>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    className="flex items-center gap-2 md:gap-3 px-4 md:px-8 py-2.5 md:py-4 rounded-full bg-gradient-to-r from-std5-primary/20 to-std5-accent/20 backdrop-blur-md border border-white/10 hover:border-std5-accent/30 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <div className="p-1.5 md:p-2 rounded-full bg-std5-accent/20">
                      <Palette className="w-4 h-4 md:w-6 md:h-6 text-std5-accent" />
                    </div>
                    <span className="text-xs md:text-base font-semibold text-white">
                      HDR Color
                    </span>
                  </motion.div>
                </div>
              </motion.div>

              {/* Buton */}
              <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="flex justify-center"
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative"
                  >
                    <button
                      onClick={scrollToProjects}
                      className="flex items-center gap-2 md:gap-3 px-8 md:px-12 py-3 md:py-3.5 bg-std5-accent rounded-lg min-w-[200px] md:min-w-[250px] justify-center shadow-lg shadow-[#8b5cf6]/30 hover:shadow-xl hover:shadow-[#8b5cf6]/40 transition-shadow duration-300"
                    >
                      <Play className="w-4 h-4 md:w-5 md:h-5 text-white" />
                      <span className="text-base md:text-lg font-medium text-white">
                        {t('home.hero.viewProjects')}
                      </span>
                    </button>
                  </motion.div>
                </motion.div>
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* Öne Çıkan İşlerimiz */}
      <section id="featured-projects" className="relative z-20 bg-std5-darker py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="w-full text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t('home.featuredProjects.title')}</h2>
          </motion.div>
          <br />
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-std5-accent"></div>
            </div>
          ) : (
            <div className="flex flex-row gap-4 w-full overflow-x-auto pb-2 scrollbar-hide sm:grid sm:grid-cols-3 md:grid-cols-6 sm:gap-4 sm:overflow-x-visible">
              {featuredWorks.sort((a, b) => (a.order || 0) - (b.order || 0)).map((work: Work) => (
                <a
                  key={work.id}
                  href={createLocalizedPath(`/work/${createSlug(work.title)}`)}
                  className="relative min-w-[140px] sm:min-w-0 aspect-[2/3] w-[140px] sm:w-full h-auto block group rounded-xl overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300"
                  title={work.title}
                >
                  <Image
                    src={work.image}
                    alt={work.title}
                    fill
                    className="object-cover rounded-xl group-hover:opacity-90 transition-opacity duration-300"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 16vw"
                    priority
                  />
                </a>
              ))}
            </div>
          )}
        </div>
      </section>



      {/* Services Section */}
      <section id="services" className="py-7 px-4 sm:px-6 lg:px-8 bg-std5-darker">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {t('home.services.title')}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {[
              { title: t('home.services.editing.title'), description: t('home.services.editing.description'), color: '#430086' },
              { title: t('home.services.soundDesign.title'), description: t('home.services.soundDesign.description'), color: '#430086' },
              { title: t('home.services.colorGrading.title'), description: t('home.services.colorGrading.description'), color: '#430086' },
              { title: t('home.services.vfx.title'), description: t('home.services.vfx.description'), color: '#8b5cf6' },
              { title: t('home.services.postProduction.title'), description: t('home.services.postProduction.description'), color: '#8b5cf6' },
              { title: t('home.services.cafe.title'), description: t('home.services.cafe.description'), color: '#8b5cf6' }
            ].map((service, index) => (
              <ServiceCard key={service.title} service={service} index={index} />
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
