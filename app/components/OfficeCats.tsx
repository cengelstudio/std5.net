"use client";

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

interface Cat {
  id: string;
  name: string;
  role: string | { [key: string]: string };
  about: string | { [key: string]: string };
  image: string;
  order?: number;
}

interface CatModalProps {
  cat: Cat;
  onClose: () => void;
}

interface OfficeCatsProps {
  cats: Cat[];
}

const CatModal = ({ cat, onClose }: CatModalProps) => {
  const { locale } = useTranslation();

  // Get the localized text based on current locale
  const getLocalizedText = (text: string | { [key: string]: string }) => {
    if (typeof text === 'string') return text;
    return text[locale] || text['en'] || text['tr'] || 'Text not found';
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
          <div className="relative w-32 h-32 mb-6">
            <Image
              src={cat.image || '/og-image.png'}
              alt={cat.name}
              fill
              className="object-cover rounded-full"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/og-image.png';
              }}
            />
          </div>

          <h3 className="text-2xl font-bold text-white mb-2">{cat.name}</h3>
          <p className="text-std5-accent text-lg mb-4">{getLocalizedText(cat.role)}</p>
          <p className="text-gray-300 text-center">{getLocalizedText(cat.about)}</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function OfficeCats({ cats }: OfficeCatsProps) {
  const [selectedCat, setSelectedCat] = useState<Cat | null>(null);

  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="flex flex-wrap md:flex-nowrap gap-4 md:gap-6 justify-center items-center max-w-7xl mx-auto px-4"
      >
        {cats.sort((a, b) => (a.order || 0) - (b.order || 0)).map((cat: Cat, index: number) => (
          <motion.button
            key={cat.name}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
            onClick={() => setSelectedCat(cat)}
            className="w-[calc(33.333%-1rem)] md:w-32 aspect-square relative overflow-hidden rounded-full border-2 border-white/10 hover:border-std5-accent/50 transition-colors flex-shrink-0"
          >
            <Image
              src={cat.image || '/og-image.png'}
              alt="Office Cat"
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/og-image.png';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.button>
        ))}
      </motion.div>

      <AnimatePresence>
        {selectedCat && (
          <CatModal cat={selectedCat} onClose={() => setSelectedCat(null)} />
        )}
      </AnimatePresence>
    </div>
  )
}
