'use client';

import { usePathname } from 'next/navigation';
import { useMemo, useCallback } from 'react';

// Import translation files
import trTranslations from '../../translations/tr.json';
import enTranslations from '../../translations/en.json';
import frTranslations from '../../translations/fr.json';
import esTranslations from '../../translations/es.json';
import arTranslations from '../../translations/ar.json';
import ruTranslations from '../../translations/ru.json';

const translations = {
  tr: trTranslations,
  en: enTranslations,
  fr: frTranslations,
  es: esTranslations,
  ar: arTranslations,
  ru: ruTranslations,
};

export type Locale = 'tr' | 'en' | 'fr' | 'es' | 'ar' | 'ru';

export function useTranslation() {
  const pathname = usePathname();

  // Extract locale from pathname
  const locale = useMemo(() => {
    const pathSegments = pathname.split('/').filter(Boolean);
    const firstSegment = pathSegments[0];

    if (['tr', 'en', 'fr', 'es', 'ar', 'ru'].includes(firstSegment)) {
      return firstSegment as Locale;
    }

    // If no locale in path, default to Turkish
    return 'tr' as Locale;
  }, [pathname]);

  const t = useMemo(() => {
    return (key: string, params?: Record<string, string | number>) => {
      const keys = key.split('.');
      let value: unknown = translations[locale as Locale] || translations.tr;

      for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
          value = (value as Record<string, unknown>)[k];
        } else {
          // Fallback to Turkish if key not found
          value = translations.tr;
          for (const fallbackKey of keys) {
            if (value && typeof value === 'object' && fallbackKey in value) {
              value = (value as Record<string, unknown>)[fallbackKey];
            } else {
              return key; // Return key if not found even in fallback
            }
          }
          break;
        }
      }

      if (typeof value !== 'string') {
        return key;
      }

      // Replace parameters if provided
      if (params) {
        return Object.entries(params).reduce((str, [key, val]) => {
          return str.replace(new RegExp(`{{${key}}}`, 'g'), String(val));
        }, value);
      }

      return value;
    };
  }, [locale]);

  const changeLanguage = useCallback((newLocale: Locale) => {
    let newPath: string;

    // Handle root path specially
    if (pathname === '/' || pathname === '') {
      newPath = `/${newLocale}`;
    } else {
      // Split path and remove empty segments
      const segments = pathname.split('/').filter(Boolean);

      // Check if first segment is a locale
      const isFirstSegmentLocale = ['tr', 'en', 'fr', 'es', 'ar', 'ru'].includes(segments[0]);

      if (isFirstSegmentLocale) {
        // Current path has a locale prefix, replace it
        const remainingSegments = segments.slice(1);
        newPath = `/${newLocale}${remainingSegments.length > 0 ? '/' + remainingSegments.join('/') : ''}`;
      } else {
        // Current path has no locale prefix, add it
        newPath = `/${newLocale}${segments.length > 0 ? '/' + segments.join('/') : ''}`;
      }
    }

    // Preserve search params using window.location
    if (typeof window !== 'undefined') {
      const searchString = window.location.search;
      if (searchString) {
        newPath += searchString;
      }

      // Use window.location for navigation instead of router
      window.location.href = newPath;
    }
  }, [pathname]);

  // Create localized path that preserves current locale
  const createLocalizedPath = useCallback((path: string) => {
    // Remove leading slash if present
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;

    // Always add locale prefix
    return `/${locale}/${cleanPath}`;
  }, [locale]);

  const currentLocale = locale as Locale;

  return {
    t,
    locale: currentLocale,
    changeLanguage,
    createLocalizedPath,
    locales: ['tr', 'en', 'fr', 'es', 'ar', 'ru'] as const,
  };
}
