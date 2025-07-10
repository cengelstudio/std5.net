"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Play, Share2, Check, Calendar, Monitor, Tag, Building2, X } from "lucide-react";
import { useState } from "react";
import Link from 'next/link';
import Image from 'next/image';
import { Work } from '../../../../types';
import { createSlug } from '../../../utils';
import { useTranslation } from '../../../hooks/useTranslation';

interface WorkDetailClientProps {
  work: Work | null;
}

export default function WorkDetailClient({ work }: WorkDetailClientProps) {
  const { t, createLocalizedPath } = useTranslation();
  const [showTrailer, setShowTrailer] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const copyToClipboard = async () => {
    try {
      const url = window.location.href;
      await navigator.clipboard.writeText(url);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  if (work === null) {
    return (
      <div className="min-h-screen bg-std5-darker flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">{t('work.contentNotFound')}</h1>
          <Link
            href={createLocalizedPath('/projects')}
            className="inline-block px-6 py-3 bg-std5-accent hover:bg-std5-accent/90 text-white rounded-xl transition-colors duration-300"
          >
            {t('work.backToProjects')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-std5-darker">
      {/* Copy Success Toast */}
      {copySuccess && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-24 right-8 z-50 glass rounded-xl p-4 flex items-center gap-3"
        >
          <Check className="w-5 h-5 text-green-400" />
          <span className="text-white font-medium">{t('work.copiedToClipboard')}</span>
        </motion.div>
      )}

      {/* Header with Back Button */}
      <header className="pt-32 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link
              href={createLocalizedPath('/projects')}
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-300"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="font-medium">{t('work.backToProjects')}</span>
            </Link>
          </motion.div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-6xl mx-auto">
          {/* Work Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Main Image */}
              <div className="lg:w-1/2">
                <div className="relative aspect-[2/3] rounded-2xl overflow-hidden glass">
                  <Image
                    src={work.image}
                    alt={work.title}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
                    priority
                  />
                  {work.trailer_embed_url && (
                    <button
                      onClick={() => setShowTrailer(true)}
                      className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity duration-300"
                    >
                      <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full">
                        <Play className="w-8 h-8 text-white" />
                      </div>
                    </button>
                  )}
                </div>
              </div>

              {/* Work Info */}
              <div className="lg:w-1/2 space-y-8">
                <div className="glass rounded-2xl p-6">
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
                    {work.title}
                  </h1>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    {work.description}
                  </p>
                </div>

                <div className="glass rounded-2xl p-6 space-y-4">
                  <h2 className="text-xl font-semibold text-white mb-4">{t('work.details')}</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-gray-300">
                        <Calendar className="w-5 h-5 text-std5-accent" />
                        <div>
                          <p className="text-sm text-gray-400">{t('work.year')}</p>
                          <p className="font-medium">{work.prod_year}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-gray-300">
                        <Monitor className="w-5 h-5 text-std5-accent" />
                        <div>
                          <p className="text-sm text-gray-400">{t('work.platform')}</p>
                          <p className="font-medium">{work.platform}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-gray-300">
                        <Tag className="w-5 h-5 text-std5-accent" />
                        <div>
                          <p className="text-sm text-gray-400">{t('work.genre')}</p>
                          <p className="font-medium">{work.genre}</p>
                        </div>
                      </div>
                      {work.client && (
                        <div className="flex items-center gap-3 text-gray-300">
                          <Building2 className="w-5 h-5 text-std5-accent" />
                          <div>
                            <p className="text-sm text-gray-400">{t('work.client')}</p>
                            <p className="font-medium">{work.client}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  {work.trailer_embed_url && (
                    <button
                      onClick={() => setShowTrailer(true)}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-std5-accent hover:bg-std5-accent/90 text-white rounded-xl transition-all duration-300 hover:scale-105"
                    >
                      <Play className="w-5 h-5" />
                      <span className="font-medium">{t('work.watchTrailer')}</span>
                    </button>
                  )}
                  <button
                    onClick={copyToClipboard}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-4 glass hover:bg-white/20 text-white rounded-xl transition-all duration-300 hover:scale-105"
                  >
                    <Share2 className="w-5 h-5" />
                    <span className="font-medium">{t('work.share')}</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Gallery */}
          {work.gallery && work.gallery.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-12"
            >
              <div className="glass rounded-2xl p-6 mb-8">
                <h2 className="text-2xl font-bold text-white">{t('work.gallery')}</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {work.gallery.map((image, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="group cursor-pointer"
                    onClick={() => {
                      // Galeri görüntüleyici eklenecek
                    }}
                  >
                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden glass">
                      <Image
                        src={image}
                        alt={`${work.title} - ${index + 1}`}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Trailer Modal */}
          {showTrailer && work.trailer_embed_url && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
              onClick={() => setShowTrailer(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative w-full max-w-4xl aspect-video glass rounded-2xl overflow-hidden"
                onClick={e => e.stopPropagation()}
              >
                <button
                  onClick={() => setShowTrailer(false)}
                  className="absolute top-4 right-4 z-10 bg-black/50 p-2 rounded-full hover:bg-black/70 transition-colors duration-300"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
                <iframe
                  src={work.trailer_embed_url}
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </motion.div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}

