"use client";

import { motion } from "framer-motion";
import { Play, ArrowRight, Mail, Palette, Sparkles, Film, Layers, Music, Monitor, PenTool, Star } from "lucide-react";
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();

  const services = [
    {
      icon: Palette,
      title: 'Renk Düzenleme',
      description: 'Profesyonel color grading ile projelerinize sinematik bir dokunuş katıyoruz.',
      color: '#430086'
    },
    {
      icon: Sparkles,
      title: 'VFX & CGI',
      description: 'Görsel efekt ve CGI ile hayal gücünüzü gerçeğe dönüştürüyoruz.',
      color: '#8b5cf6'
    },
    {
      icon: Film,
      title: 'Kurgu & Montaj',
      description: 'Yaratıcı kurgu ve montaj hizmetleriyle hikayenizi en iyi şekilde anlatın.',
      color: '#430086'
    },
    {
      icon: Layers,
      title: 'Animasyon',
      description: '2D/3D animasyonlarla projelerinize hareket katıyoruz.',
      color: '#8b5cf6'
    },
    {
      icon: Music,
      title: 'Ses Tasarımı',
      description: 'Duyguyu güçlendiren profesyonel ses tasarımı ve miksaj.',
      color: '#430086'
    },
    {
      icon: Monitor,
      title: 'Video Mapping',
      description: 'Etkinlikleriniz için etkileyici video mapping çözümleri.',
      color: '#8b5cf6'
    },
    {
      icon: Play,
      title: 'Title Sequence',
      description: 'Dikkat çekici açılış ve jenerik tasarımları.',
      color: '#430086'
    },
    {
      icon: PenTool,
      title: 'İnfografik',
      description: 'Bilgiyi görselleştiren yaratıcı infografik animasyonlar.',
      color: '#8b5cf6'
    }
  ];

  const stats = [
    { number: "200+", label: 'Tamamlanan Proje' },
    { number: "50+", label: 'Mutlu Müşteri' },
    { number: "10+", label: 'Yıllık Deneyim' },
    { number: "4", label: 'Stüdyo Lokasyonu' }
  ];

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
                transform: 'rotateX(25deg) rotateY(10deg) rotateZ(-10deg) scale(1.4) translate(120px, 0px)',
                transformOrigin: 'center center',
                transformStyle: 'preserve-3d'
              }}
            >
              <Image
                src="/api/mosaic-bg"
                alt="STD5 Works Mosaic"
                fill
                className="object-cover opacity-90"
                priority
                sizes="100vw"
                unoptimized
              />
            </div>
          </div>
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
              Sınırsız yaratıcılık,<br />
              <span className="text-std5-accent">post prodüksiyon</span><br />
              ve çok daha fazlası
            </h1>

            <p className="text-base md:text-lg text-gray-300 mb-6 max-w-2xl mx-auto">
              İstanbul'un lider post prodüksiyon stüdyosunda projelerinizi hayata geçirin. Her türlü prodüksiyon ihtiyacınız için buradayız.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/portfolio')}
                className="px-6 py-3 bg-std5-accent hover:bg-std5-accent/90 text-white rounded-md font-semibold text-base flex items-center gap-2 transition-colors duration-300 w-full sm:w-auto justify-center"
              >
                <Play className="w-4 h-4" />
                Portfolyoyu İncele
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/contact')}
                className="px-6 py-3 bg-transparent border border-white/40 hover:border-white text-white rounded-md font-semibold text-base flex items-center gap-2 transition-colors duration-300 w-full sm:w-auto justify-center backdrop-blur-sm"
              >
                <Mail className="w-4 h-4" />
                İletişime Geç
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
              Hizmetlerimiz
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Post prodüksiyonun tüm alanlarında yaratıcı ve yenilikçi çözümler sunuyoruz.
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
              Projenizi Hayata Geçirmeye Hazır mısınız?
            </h2>
            <p className="text-base text-white/90 mb-6 max-w-2xl mx-auto">
              İstanbul'un en deneyimli post prodüksiyon ekibiyle çalışın. Size özel çözümler sunuyoruz.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/contact')}
              className="px-6 py-3 bg-white text-std5-primary hover:bg-gray-100 rounded-lg font-semibold text-base flex items-center gap-2 mx-auto transition-colors duration-300"
            >
              Hemen Başlayın
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
