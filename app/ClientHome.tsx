"use client";

import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, easeInOut } from "framer-motion";
import { Play, Mail } from "lucide-react";
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
                transform: 'rotateX(25deg) rotateY(10deg) rotateZ(-10deg) scale(2) translate(100px, 10px)',
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
            <h1
              className="text-4xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight"
              style={{ fontSize: 'clamp(2.2rem, 7vw, 2.8rem)' }} // mobile için büyüt
            >
              {t('home.hero.title')}<br />
              <span className="text-std5-accent">{t('home.hero.titleAccent')}</span>
            </h1>

            <p className="text-base md:text-lg text-gray-300 mb-6 max-w-2xl mx-auto">
              {t('home.hero.subtitle')}
            </p>

            {/* Butonlar: mobilde de yanyana ve spacing optimize */}
            <div className="flex flex-row gap-2 sm:gap-3 justify-center items-center mb-8 w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl mx-auto">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 sm:flex-none min-w-0"
              >
                <Link
                  href={createLocalizedPath('/projects')}
                  className="flex flex-row items-center justify-center gap-2 px-3 py-3 sm:px-8 sm:py-4 h-12 bg-std5-accent hover:bg-std5-accent/90 text-white rounded-md font-semibold text-sm sm:text-base transition-colors duration-300 w-full sm:w-auto min-w-0 whitespace-nowrap sm:whitespace-normal"
                  style={{ minHeight: 48 }}
                >
                  <Play className="w-4 h-4" />
                  {t('home.hero.viewProjects')}
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 sm:flex-none min-w-0"
              >
                <Link
                  href={createLocalizedPath('/contact')}
                  className="flex flex-row items-center justify-center gap-2 px-3 py-3 sm:px-8 sm:py-4 h-12 bg-transparent border border-white/40 hover:border-white text-white rounded-md font-semibold text-sm sm:text-base transition-colors duration-300 w-full sm:w-auto min-w-0 backdrop-blur-sm whitespace-nowrap sm:whitespace-normal"
                  style={{ minHeight: 48 }}
                >
                  <Mail className="w-4 h-4" />
                  {t('home.hero.contactUs')}
                </Link>
              </motion.div>
            </div>

            {/* Stats: mobilde daha aşağıda ve spacing daha fazla */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-xl mx-auto mt-8 sm:mt-0"
            >
              {STATS.map((stat) => {
                const href = stat.label === t('home.stats.completedProjects') ? createLocalizedPath('/projects') :
                           stat.label === t('home.stats.locations') || stat.label === t('home.stats.studios') ? createLocalizedPath('/locations') :
                           stat.label === t('home.stats.yearsExperience') ? createLocalizedPath('/about') : createLocalizedPath('/');

                return (
                  <Link key={`${stat.label}-${stat.number}`} href={href}>
                    <motion.div
                      className="text-center cursor-pointer group"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="text-xl md:text-2xl font-bold text-white mb-1 group-hover:text-std5-accent transition-colors duration-300">
                        {stat.number}
                      </div>
                      <div className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                        {t(stat.label)}
                      </div>
                    </motion.div>
                  </Link>
                );
              })}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Öne Çıkan İşlerimiz */}
      <section className="relative z-20 bg-std5-darker py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 text-center">{t('home.featuredProjects.title')}</h2>
          <br />
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-std5-accent"></div>
            </div>
          ) : (
            <div className="flex flex-row gap-4 w-full overflow-x-auto pb-2 scrollbar-hide sm:grid sm:grid-cols-3 md:grid-cols-6 sm:gap-4 sm:overflow-x-visible">
              {featuredWorks.map((work: Work) => (
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
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              {t('home.services.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
