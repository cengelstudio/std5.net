"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Play, Share2, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Work } from '../../../types';
import { createSlug } from '../../utils';

export default function WorkDetail() {
  const router = useRouter();
  const params = useParams();
  const [work, setWork] = useState<Work | null>(null);
  const [relatedWorks, setRelatedWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    const fetchWork = async () => {
      if (!params.slug) return;

      try {
        const response = await fetch(`/api/works/${params.slug}`);
        if (!response.ok) {
          throw new Error('Work not found');
        }
        const data = await response.json();
        setWork(data.work);
        setRelatedWorks(data.related || []);
      } catch (error) {
        console.error('Error fetching work:', error);
        // Work not found, but user can still navigate using the UI
      } finally {
        setLoading(false);
      }
    };

    fetchWork();
  }, [params.slug, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-std5-darker flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-std5-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!work) {
    return (
      <div className="min-h-screen bg-std5-darker flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">İçerik bulunamadı</h1>
          <Link
            href="/portfolio"
            className="inline-block px-6 py-3 bg-std5-accent hover:bg-std5-accent/90 text-white rounded-xl transition-colors duration-300"
          >
            Portfolyoya Dön
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
          <span className="text-white font-medium">Panoya kopyalandı</span>
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
              href="/portfolio"
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-300"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="font-medium">Portfolyoya Dön</span>
            </Link>
          </motion.div>
        </div>
      </header>

      {/* Main Content */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

            {/* Left Side - Poster */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative aspect-[2/3] max-w-lg mx-auto lg:mx-0">
                <Image
                  src={work.image}
                  alt={work.title}
                  fill
                  className="object-cover rounded-xl"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `data:image/svg+xml,${encodeURIComponent(
                      `<svg viewBox="0 0 300 450" xmlns="http://www.w3.org/2000/svg">
                        <rect width="300" height="450" fill="#430086"/>
                        <text x="150" y="225" text-anchor="middle" fill="white" font-size="14">${work.title}</text>
                      </svg>`
                    )}`;
                  }}
                />
              </div>
            </motion.div>

            {/* Right Side - Content & Project Details */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-8"
            >
              {/* Title and Description */}
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  {work.title}
                </h1>
                <p className="text-lg text-gray-300 leading-relaxed mb-8">
                  {work.description}
                </p>
              </div>

              {/* Project Details */}
              <div className="glass rounded-xl p-6">
                <h2 className="text-xl font-bold text-white mb-6">Proje Detayları</h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Yapım Yılı</span>
                    <span className="text-white font-medium">{work.prod_year}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Kategori</span>
                    <span className="text-white font-medium">{work.genre}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Platform</span>
                    <span className="text-std5-accent font-medium">{work.platform}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Trailer Button */}
                {work.trailer_embed_url && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowTrailer(true)}
                    className="flex items-center gap-3 px-6 py-3 bg-std5-accent hover:bg-std5-accent/90 text-white rounded-xl font-medium transition-colors duration-300"
                  >
                    <Play className="w-4 h-4" />
                    Fragmanı İzle
                  </motion.button>
                )}

                {/* Share Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={copyToClipboard}
                  className="flex items-center gap-3 px-6 py-3 glass border border-white/20 text-white rounded-xl font-medium hover:bg-white/10 transition-colors duration-300"
                >
                  <Share2 className="w-4 h-4" />
                  Paylaş
                </motion.button>
              </div>
            </motion.div>
          </div>

          {/* Gallery */}
          {work.gallery && work.gallery.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-20 pt-12 border-t border-white/10"
            >
              <h2 className="text-2xl font-bold text-white mb-8">Galeri</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {work.gallery.map((image, index) => (
                  <div key={index} className="relative aspect-video">
                    <Image
                      src={image}
                      alt={`${work.title} - ${index + 1}`}
                      fill
                      className="object-cover rounded-lg hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Trailer Modal */}
      {showTrailer && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowTrailer(false)}
        >
          <div
            className="relative w-full max-w-4xl aspect-video bg-black rounded-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowTrailer(false)}
              className="absolute top-4 right-4 z-10 w-8 h-8 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white text-lg"
            >
              ×
            </button>
            <iframe
              src={work.trailer_embed_url}
              title={`${work.title} Trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </div>
      )}

      {/* Related Works */}
      {relatedWorks.length > 0 && (
        <section className="pb-20 px-4 sm:px-6 lg:px-8 border-t border-white/10">
          <div className="max-w-6xl mx-auto pt-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl font-bold text-white mb-12">Aynı Türde</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {relatedWorks.map((relatedWork, index) => (
                  <motion.div
                    key={relatedWork.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="group"
                  >
                    <Link href={`/work/${createSlug(relatedWork.title)}`} className="block cursor-pointer">
                      <div className="relative aspect-[2/3] overflow-hidden rounded-xl mb-3">
                        <Image
                          src={relatedWork.image}
                          alt={relatedWork.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = `data:image/svg+xml,${encodeURIComponent(
                              `<svg viewBox="0 0 300 450" xmlns="http://www.w3.org/2000/svg">
                                <rect width="300" height="450" fill="#430086"/>
                                <text x="150" y="225" text-anchor="middle" fill="white" font-size="14">${relatedWork.title}</text>
                              </svg>`
                            )}`;
                          }}
                        />

                        {/* Simple overlay */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <div className="w-12 h-12 bg-std5-accent rounded-full flex items-center justify-center">
                            <Play className="w-4 h-4 text-white ml-0.5" />
                          </div>
                        </div>
                      </div>

                      <h3 className="text-white font-medium group-hover:text-std5-accent transition-colors duration-300 line-clamp-2">
                        {relatedWork.title}
                      </h3>
                      <p className="text-gray-400 text-sm mt-1">
                        {relatedWork.prod_year} • {relatedWork.genre}
                      </p>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}
    </div>
  );
}
