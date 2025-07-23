'use client';

import { useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { Globe, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const languageNames = {
  tr: 'Türkçe',
  en: 'English',
  fr: 'Français',
  es: 'Español',
  ar: 'العربية',
  ru: 'Русский',
};

const languageFlags = {
  tr: '🇹🇷',
  en: '🇺🇸',
  fr: '🇫🇷',
  es: '🇪🇸',
  ar: '🇸🇦',
  ru: '🇷🇺',
};

export default function LanguageSwitcher() {
  const { locale, changeLanguage, locales } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = (newLocale: string) => {
    changeLanguage(newLocale as 'tr' | 'en' | 'fr' | 'es' | 'ar' | 'ru');
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full bg-white/5 hover:bg-white/10 transition-all duration-300 group border border-white/10"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Globe className="w-4 h-4 text-white/70 group-hover:text-white transition-colors duration-300" />
        <span className="text-white/70 group-hover:text-white transition-colors duration-300">
          {languageFlags[locale]} {languageNames[locale]}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4 text-white/70 group-hover:text-white transition-colors duration-300" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute left-0 md:right-0 top-full mt-2 w-48 bg-black/90 backdrop-blur-xl rounded-xl shadow-2xl border border-white/10 overflow-hidden z-50"
            >
              {locales.map((lang, index) => (
                <motion.button
                  key={lang}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleLanguageChange(lang)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-all duration-300 relative group
                    ${locale === lang
                      ? 'text-white bg-white/10'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                    }`}
                >
                  <span className="text-lg">{languageFlags[lang]}</span>
                  <span>{languageNames[lang]}</span>
                  {locale === lang && (
                    <motion.div
                      layoutId="activeLang"
                      className="absolute left-0 top-0 bottom-0 w-0.5 bg-std5-accent"
                    />
                  )}
                </motion.button>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
