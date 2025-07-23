import { NextRequest, NextResponse } from 'next/server';

const locales = ['tr', 'en', 'fr', 'es', 'ar', 'ru'];
const defaultLocale = 'tr';

// Get the preferred locale from request headers
function getLocale(request: NextRequest): string {
  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage) {
    const preferredLocale = acceptLanguage
      .split(',')
      .map(lang => lang.split(';')[0].trim())
      .find(lang => {
        const shortLocale = lang.substring(0, 2).toLowerCase();
        return locales.includes(shortLocale);
      });

    if (preferredLocale) {
      const shortLocale = preferredLocale.substring(0, 2).toLowerCase();
          if (shortLocale === 'en') return 'en';
    if (shortLocale === 'fr') return 'fr';
    if (shortLocale === 'es') return 'es';
    if (shortLocale === 'ar') return 'ar';
    if (shortLocale === 'ru') return 'ru';
    if (shortLocale === 'tr') return 'tr';
    }
  }

  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check if the pathname already has a locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return;

  // Redirect if there is no locale
  const locale = getLocale(request);
  const newUrl = new URL(`/${locale}${pathname}`, request.url);

  // Preserve search params
  newUrl.search = request.nextUrl.search;

  return NextResponse.redirect(newUrl);
}

export const config = {
  matcher: [
    // Skip all internal paths (_next), api, admin, and static files
    '/((?!_next|api|admin|favicon.ico|.*\\.).*)',
  ],
};
