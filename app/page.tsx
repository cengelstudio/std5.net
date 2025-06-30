"use client";

import { motion } from "framer-motion";
import {
  Play,
  ArrowRight,
  Mail,
  Palette,
  Sparkles,
  Film,
  Layers,
  Music,
  Monitor,
  PenTool,
  Star
} from "lucide-react";
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import tr from '../locales/tr.json';
import en from '../locales/en.json';
import Image from 'next/image';

const locales = { tr, en };



export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [locale, setLocale] = useState('tr');
  const [translations, setTranslations] = useState(tr);

  useEffect(() => {
    const langParam = searchParams.get('lang');
    const validLang = langParam === 'en' ? 'en' : 'tr';
    setLocale(validLang);
    setTranslations(locales[validLang as keyof typeof locales]);
  }, [searchParams]);

  const t = (key: string) => {
    const keys = key.split('.');
    let value: any = translations;
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  };

  const services = [
    {
      icon: Palette,
      title: t('services.colorGrading.title'),
      description: t('services.colorGrading.description'),
      color: '#430086'
    },
    {
      icon: Sparkles,
      title: t('services.vfx.title'),
      description: t('services.vfx.description'),
      color: '#8b5cf6'
    },
    {
      icon: Film,
      title: t('services.editing.title'),
      description: t('services.editing.description'),
      color: '#430086'
    },
    {
      icon: Layers,
      title: t('services.animation.title'),
      description: t('services.animation.description'),
      color: '#8b5cf6'
    },
    {
      icon: Music,
      title: t('services.audioDesign.title'),
      description: t('services.audioDesign.description'),
      color: '#430086'
    },
    {
      icon: Monitor,
      title: t('services.videoMapping.title'),
      description: t('services.videoMapping.description'),
      color: '#8b5cf6'
    },
    {
      icon: Play,
      title: t('services.titleSequence.title'),
      description: t('services.titleSequence.description'),
      color: '#430086'
    },
    {
      icon: PenTool,
      title: t('services.infographics.title'),
      description: t('services.infographics.description'),
      color: '#8b5cf6'
    }
  ];

  const stats = [
    { number: "200+", label: t('stats.projects') },
    { number: "50+", label: t('stats.clients') },
    { number: "10+", label: t('stats.experience') },
    { number: "4", label: t('stats.studios') }
  ];

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Netflix-style Hero Section with Background Mosaic */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-black">
        {/* Background Image Mosaic */}
        <div className="absolute inset-0 w-full h-full">
          <Image
            src="/api/mosaic-bg"
            alt="STD5 Works Mosaic"
            fill
            className="object-cover opacity-90"
            priority
            sizes="100vw"
          />
        </div>

        {/* Dark Overlay with gradient */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.9) 100%)',
        }} />
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.7) 100%)',
        }} />

        {/* Content */}
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto pt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              {locale === 'tr' ? (
                <>
                  Sınırsız yaratıcılık,<br />
                  <span className="text-std5-accent">post prodüksiyon</span><br />
                  ve çok daha fazlası
                </>
              ) : (
                <>
                  Unlimited creativity,<br />
                  <span className="text-std5-accent">post production</span><br />
                  and much more
                </>
              )}
            </h1>

            <p className="text-base md:text-lg text-gray-300 mb-6 max-w-2xl mx-auto">
              {locale === 'tr'
                ? "İstanbul'un lider post prodüksiyon stüdyosunda projelerinizi hayata geçirin. Her türlü prodüksiyon ihtiyacınız için buradayız."
                : "Bring your projects to life at Istanbul's leading post-production studio. We're here for all your production needs."
              }
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push(locale === 'en' ? '/portfolio?lang=en' : '/portfolio')}
                className="px-6 py-3 bg-std5-accent hover:bg-std5-accent/90 text-white rounded-md font-semibold text-base flex items-center gap-2 transition-colors duration-300 w-full sm:w-auto justify-center"
              >
                <Play className="w-4 h-4" />
                {locale === 'tr' ? 'Portfolyoyu İncele' : 'Explore Portfolio'}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push(locale === 'en' ? '/contact?lang=en' : '/contact')}
                className="px-6 py-3 bg-transparent border border-white/40 hover:border-white text-white rounded-md font-semibold text-base flex items-center gap-2 transition-colors duration-300 w-full sm:w-auto justify-center backdrop-blur-sm"
              >
                <Mail className="w-4 h-4" />
                {locale === 'tr' ? 'İletişime Geç' : 'Get in Touch'}
              </motion.button>
            </div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-xl mx-auto"
            >
              {stats.map((stat, index) => (
                <div key={stat.label} className="text-center">
                  <div className="text-xl md:text-2xl font-bold text-white mb-1">
                    {stat.number}
                  </div>
                  <div className="text-xs text-gray-400">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
          className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-white/50"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-5 h-8 border-2 border-white/30 rounded-full flex justify-center"
          >
            <div className="w-0.5 h-2 bg-white/50 rounded-full mt-1.5" />
          </motion.div>
        </motion.div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 px-4 sm:px-6 lg:px-8 bg-std5-darker">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {t('services.title')}
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              {t('services.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass rounded-2xl p-6 group hover:bg-white/5 transition-all duration-300 cursor-pointer"
                whileHover={{ y: -5 }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300"
                  style={{ backgroundColor: service.color }}
                >
                  <service.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-std5-accent transition-colors duration-300">
                  {service.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-std5-primary to-std5-accent">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              {locale === 'tr'
                ? 'Projenizi Hayata Geçirmeye Hazır mısınız?'
                : 'Ready to Bring Your Project to Life?'
              }
            </h2>
            <p className="text-base text-white/90 mb-6 max-w-2xl mx-auto">
              {locale === 'tr'
                ? 'İstanbul\'un en deneyimli post prodüksiyon ekibiyle çalışın. Size özel çözümler sunuyoruz.'
                : 'Work with Istanbul\'s most experienced post-production team. We offer custom solutions for you.'
              }
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push(locale === 'en' ? '/contact?lang=en' : '/contact')}
              className="px-6 py-3 bg-white text-std5-primary hover:bg-gray-100 rounded-lg font-semibold text-base flex items-center gap-2 mx-auto transition-colors duration-300"
            >
              {locale === 'tr' ? 'Hemen Başlayın' : 'Get Started Now'}
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
