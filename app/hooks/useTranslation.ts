'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

// Import translation files
import trTranslations from '../../translations/tr.json';
import enTranslations from '../../translations/en.json';
import frTranslations from '../../translations/fr.json';
import esTranslations from '../../translations/es.json';

const translations = {
  tr: trTranslations,
  en: enTranslations,
  fr: frTranslations,
  es: esTranslations,
};

export type Locale = 'tr' | 'en' | 'fr' | 'es';

export function useTranslation() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Extract locale from pathname
  const locale = useMemo(() => {
    const pathSegments = pathname.split('/').filter(Boolean);
    const firstSegment = pathSegments[0];

    if (['tr', 'en', 'fr', 'es'].includes(firstSegment)) {
      return firstSegment as Locale;
    }

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

  const changeLanguage = (newLocale: Locale) => {
    console.log('changeLanguage debug:', {
      pathname,
      newLocale
    });

    let newPath: string;

    // Handle root path specially
    if (pathname === '/') {
      newPath = newLocale === 'tr' ? '/' : `/${newLocale}`;
    } else {
      // Split path and remove empty segments
      const segments = pathname.split('/').filter(Boolean);

      // Check if first segment is a locale
      const isFirstSegmentLocale = ['tr', 'en', 'fr', 'es'].includes(segments[0]);

      if (isFirstSegmentLocale) {
        // Current path has a locale prefix, replace it
        const remainingSegments = segments.slice(1);
        if (newLocale === 'tr') {
          // For Turkish, don't add locale prefix
          newPath = remainingSegments.length > 0 ? `/${remainingSegments.join('/')}` : '/';
        } else {
          // For other locales, add locale prefix
          newPath = `/${newLocale}${remainingSegments.length > 0 ? '/' + remainingSegments.join('/') : ''}`;
        }
      } else {
        // Current path has no locale prefix, add it
        if (newLocale === 'tr') {
          // For Turkish, don't add locale prefix
          newPath = segments.length > 0 ? `/${segments.join('/')}` : '/';
        } else {
          // For other locales, add locale prefix
          newPath = `/${newLocale}${segments.length > 0 ? '/' + segments.join('/') : ''}`;
        }
      }
    }

    // Preserve search params
    const searchString = searchParams.toString();
    if (searchString) {
      newPath += '?' + searchString;
    }

    console.log('Final newPath:', newPath);
    window.location.href = newPath;
  };

  // Create localized path that preserves current locale
  const createLocalizedPath = (path: string) => {
    // Remove leading slash if present
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;

    // For Turkish (default), don't add locale prefix
    if (locale === 'tr') {
      return `/${cleanPath}`;
    }

    // For other locales, add locale prefix
    return `/${locale}/${cleanPath}`;
  };

  const currentLocale = locale as Locale;

  return {
    t,
    locale: currentLocale,
    changeLanguage,
    createLocalizedPath,
    locales: ['tr', 'en', 'fr', 'es'] as const,
  };
}
