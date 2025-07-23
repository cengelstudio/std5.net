"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from 'next/image';
import { Film, FileText, Info, X } from 'lucide-react';
import OfficeCats from '../../components/OfficeCats';
import { useTranslation } from '../../hooks/useTranslation';

interface Member {
  id: string;
  name: string;
  title: string | { [key: string]: string };
  about?: string | { [key: string]: string };
  image: string;
  imdb?: string;
  cv?: string | { [key: string]: string };
  linkedin?: string;
  department?: string | { [key: string]: string };
}

interface Cat {
  id: string;
  name: string;
  role: string;
  about: string | { [key: string]: string };
  image: string;
}

interface AboutClientProps {
  founders: Member[];
  crew: Member[];
  cats: Cat[];
  locale: string;
}

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

export default function AboutClient({ founders, crew, cats, locale: propLocale }: AboutClientProps) {
  const { t } = useTranslation();
  const locale = propLocale;
  const [selectedFounder, setSelectedFounder] = useState<Member | null>(null);

  // Helper fonksiyonlar
  const getLocalizedValue = (value: string | { [key: string]: string } | undefined, fallback = ''): string => {
    if (!value) return fallback;
    if (typeof value === 'string') return value;
    return value[locale] || value.tr || fallback;
  };

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
                {t('about.title')}
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
                className="text-[18px] md:text-[22px] text-gray-200 leading-relaxed font-light"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                {t('about.description')}
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
              {t('about.managementTeam')}
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-std5-primary to-std5-accent mx-auto rounded-full mb-8" />
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-2 gap-4 md:gap-7 max-w-3xl mx-auto"
          >
              {founders.map((member) => (
                <motion.div
                  key={member.name}
                variants={itemVariants}
                className="group relative"
              >
                <div className="glass rounded-xl p-4 md:p-7 text-center hover:bg-white/10 transition-all duration-300 bg-white/5 border border-white/10 hover:border-std5-accent/30 hover:shadow-xl hover:shadow-std5-accent/10 h-full">
                  {/* Profile image ~10% larger */}
                  <div className="relative w-20 h-20 md:w-28 md:h-28 mx-auto mb-3 md:mb-5 rounded-full overflow-hidden border-2 border-white/20 group-hover:border-std5-accent/50 transition-all duration-300">
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
                  <h3 className="text-base md:text-xl font-bold text-white mb-1 md:mb-2 group-hover:text-std5-accent transition-colors duration-300">
                    {member.name}
                  </h3>
                  <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300 mb-3 md:mb-5 text-sm md:text-lg">
                    {getLocalizedValue(member.title) === 'Kurucu' ? t('about.founder') : getLocalizedValue(member.title)}
                  </p>
                  {/* Social links ~10% larger */}
                  <div className="flex items-center justify-center gap-2 md:gap-3">
                    <a
                      href={member.imdb}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 md:p-2.5 rounded-lg bg-white/5 hover:bg-std5-primary/20 text-gray-400 hover:text-std5-accent transition-all duration-300 hover:scale-110 hover:shadow-lg"
                      title={t('about.imdbProfile')}
                    >
                      <Film className="w-4 h-4 md:w-5 md:h-5" />
                    </a>
                    {member.about && (
                      <button
                        onClick={() => setSelectedFounder(member)}
                        className="p-2 md:p-2.5 rounded-lg bg-white/5 hover:bg-std5-primary/20 text-gray-400 hover:text-std5-accent transition-all duration-300 hover:scale-110 hover:shadow-lg"
                        title={t('about.moreInfo')}
                      >
                        <Info className="w-4 h-4 md:w-5 md:h-5" />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Office Cats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <OfficeCats cats={cats} />
        </div>
      </section>

      {/* Team Members with department organization */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent to-std5-darker/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              {t('about.team')}
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-std5-primary to-std5-accent mx-auto rounded-full mb-8" />
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
          >
            {crew.map((member) => (
              <motion.div
                key={member.name}
                variants={itemVariants}
                className="group"
              >
                <div className="glass rounded-xl p-4 md:p-6 text-center hover:bg-white/10 transition-all duration-300 bg-white/5 border border-white/10 hover:border-std5-accent/30 hover:shadow-xl hover:shadow-std5-accent/10 h-full">
                  {/* Profile image */}
                  <div className="relative w-16 h-16 md:w-20 md:h-20 mx-auto mb-3 md:mb-4 rounded-full overflow-hidden border-2 border-white/20 group-hover:border-std5-accent/50 transition-all duration-300">
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
                  <h3 className="text-sm md:text-lg font-semibold text-white mb-1 group-hover:text-std5-accent transition-colors duration-300">
                    {member.name}
                  </h3>
                  <p className="text-gray-500 text-xs mb-3 md:mb-4">
                    <span className="inline-block px-2 py-1 bg-std5-primary/20 rounded-full text-std5-accent font-medium">
                      {getLocalizedValue(member.department)}
                    </span>
                  </p>

                  {/* Social links */}
                  <div className="flex items-center justify-center gap-2">
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-std5-accent transition-all duration-300 hover:scale-110"
                      title={t('about.imdbProfile')}
                    >
                      <Film className="w-4 h-4" />
                    </a>
                    <a
                      href={getLocalizedValue(member.cv, '#')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-std5-accent transition-all duration-300 hover:scale-110"
                      title={t('about.downloadCV')}
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

      <AnimatePresence>
        {selectedFounder && (
          <FounderModal founder={selectedFounder} onClose={() => setSelectedFounder(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

interface FounderModalProps {
  founder: Member;
  onClose: () => void;
}

const FounderModal = ({ founder, onClose }: FounderModalProps) => {
  const locale = useTranslation().locale;

  const getLocalizedValue = (value: string | { [key: string]: string } | undefined, fallback = ''): string => {
    if (!value) return fallback;
    if (typeof value === 'string') return value;
    return value[locale] || value['en'] || value['tr'] || fallback;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-std5-darker border border-white/10 rounded-2xl p-6 max-w-md w-full relative"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        <div className="flex flex-col items-center">
          <div className="relative h-128 w-128 mb-6">
            <Image
              src={founder.image}
              alt={founder.name}
              width={128}
              height={128}
              className="object-cover h-128 w-128 rounded-full filter grayscale"
            />
          </div>

          <h3 className="text-2xl font-bold text-white mb-2">{founder.name}</h3>
          <p className="text-std5-accent text-lg mb-4">{getLocalizedValue(founder.title)}</p>
          {founder.about && (
            <p className="text-gray-300 text-center leading-relaxed">{getLocalizedValue(founder.about)}</p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};
