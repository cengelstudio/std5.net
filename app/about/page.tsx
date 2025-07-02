"use client";

import { motion } from "framer-motion";
import Image from 'next/image';
import { useCallback } from 'react';
import { Linkedin, Film, FileText } from 'lucide-react';
import founders from '../../data/founders.json';
import crew from '../../data/crew.json';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-std5-darker via-black to-std5-darker">
      {/* Hero Section with improved design */}
      <section className="relative pt-24 pb-7 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-std5-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-std5-accent/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-center mb-12"
          >
                        {/* Animated title */}
            <div className="relative mb-8">
              <motion.h1
                className="text-[28px] md:text-[52px] font-bold text-white mb-6"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Hakkımızda
              </motion.h1>
              <motion.div
                className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-std5-primary to-std5-accent rounded-full"
                initial={{ width: 0 }}
                animate={{ width: 80 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              />
            </div>

                        {/* Content with improved typography */}
            <div className="space-y-6 max-w-4xl mx-auto">
              <motion.p
                className="text-[20px] md:text-[26px] text-gray-200 leading-relaxed font-light"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                2017 yılında İstanbul'da kurulan STD5, günümüzde 3 farklı lokasyonda, en üst standartlarda post prodüksiyon hizmeti vermektedir.
              </motion.p>

              <motion.p
                className="text-[18px] md:text-[20px] text-gray-300 leading-relaxed"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Deneyimli kadrosu ve stüdyolarında barındırdığı teknolojik imkanlarla{' '}
                <span className="font-semibold text-white">kurgu</span>,{' '}
                <span className="font-semibold text-white">ses tasarımı</span>,{' '}
                <span className="font-semibold text-white">renk</span>,{' '}
                <span className="font-semibold text-white">dublaj</span> ve{' '}
                <span className="font-semibold text-white">görsel efektleri</span>{' '}
                yaratıcı bir şekilde yapar ve yayına hazır hale getirir. Kurulduğu günden beri{' '}
                <span className="text-std5-accent font-bold text-xl">250'den fazla projeye</span>{' '}
                imzasını atmıştır.
              </motion.p>
            </div>
          </motion.div>
        </div>
      </section>

             {/* Management Team with enhanced design */}
       <section className="py-0 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Yönetim Ekibi
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-std5-primary to-std5-accent mx-auto rounded-full mb-8" />
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-7 max-w-3xl mx-auto"
          >
              {founders.map((member, index) => (
                <motion.div
                  key={member.name}
                variants={itemVariants}
                className="group relative"
              >
                <div className="glass rounded-xl p-7 text-center hover:bg-white/10 transition-all duration-300 bg-white/5 border border-white/10 hover:border-std5-accent/30 hover:shadow-xl hover:shadow-std5-accent/10 h-full">
                  {/* Profile image ~10% larger */}
                  <div className="relative w-28 h-28 mx-auto mb-5 rounded-full overflow-hidden border-2 border-white/20 group-hover:border-std5-accent/50 transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-br from-std5-primary/30 to-std5-accent/30 rounded-full" />
                      <Image
                        src={member.image}
                        alt={member.name}
                      width={110}
                      height={110}
                      className="w-full h-full object-cover filter grayscale group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `data:image/svg+xml,${encodeURIComponent(
                          `<svg viewBox=\"0 0 110 110\" xmlns=\"http://www.w3.org/2000/svg\">\n                            <rect width=\"110\" height=\"110\" fill=\"#430086\"/>\n                            <text x=\"55\" y=\"55\" text-anchor=\"middle\" fill=\"white\" font-size=\"14\">${member.name}</text>\n                          </svg>`
                          )}`;
                        }}
                      />
                    </div>
                  {/* Content ~10% larger */}
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-std5-accent transition-colors duration-300">
                    {member.name}
                  </h3>
                  <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300 mb-5 text-lg">
                    {member.title}
                  </p>
                  {/* Social links ~10% larger */}
                  <div className="flex items-center justify-center gap-3">
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-lg bg-white/5 hover:bg-std5-primary/20 text-gray-400 hover:text-std5-accent transition-all duration-300 hover:scale-110 hover:shadow-lg"
                      title="LinkedIn Profili"
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                    <a
                      href={member.imdb}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-lg bg-white/5 hover:bg-std5-primary/20 text-gray-400 hover:text-std5-accent transition-all duration-300 hover:scale-110 hover:shadow-lg"
                      title="IMDB Profili"
                    >
                      <Film className="w-5 h-5" />
                    </a>
                    <a
                      href={member.cv}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-lg bg-white/5 hover:bg-std5-primary/20 text-gray-400 hover:text-std5-accent transition-all duration-300 hover:scale-110 hover:shadow-lg"
                      title="CV İndir"
                    >
                      <FileText className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team Members with department organization */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent to-std5-darker/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Ekibimiz
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-std5-primary to-std5-accent mx-auto rounded-full mb-8" />
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {crew.map((member, index) => (
              <motion.div
                key={member.name}
                variants={itemVariants}
                className="group"
              >
                <div className="glass rounded-xl p-6 text-center hover:bg-white/10 transition-all duration-300 bg-white/5 border border-white/10 hover:border-std5-accent/30 hover:shadow-xl hover:shadow-std5-accent/10 h-full">
                  {/* Profile image */}
                  <div className="relative w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden border-2 border-white/20 group-hover:border-std5-accent/50 transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-br from-black/30 to-black/30" />
                    <Image
                      src={member.image}
                      alt={member.name}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover filter grayscale contrast-125 group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-std5-accent transition-colors duration-300">
                    {member.name}
                  </h3>
                  <p className="text-gray-400 text-sm mb-2 group-hover:text-gray-300 transition-colors duration-300">
                    {member.title}
                  </p>
                  <p className="text-gray-500 text-xs mb-4">
                    <span className="inline-block px-2 py-1 bg-std5-primary/20 rounded-full text-std5-accent font-medium">
                      {member.department}
                    </span>
                  </p>

                  {/* Social links */}
                  <div className="flex items-center justify-center gap-2">
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-std5-accent transition-all duration-300 hover:scale-110"
                      title="LinkedIn Profili"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                    <a
                      href={member.cv}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-std5-accent transition-all duration-300 hover:scale-110"
                      title="CV İndir"
                    >
                      <FileText className="w-4 h-4" />
                    </a>
                  </div>
            </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
