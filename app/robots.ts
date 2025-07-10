import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/', '/admin/', '/private/'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/', '/_next/', '/admin/'],
      },
    ],
    sitemap: [
      'https://std5.net/sitemap.xml',
      'https://std5.net/tr/sitemap.xml',
      'https://std5.net/en/sitemap.xml',
      'https://std5.net/fr/sitemap.xml',
      'https://std5.net/es/sitemap.xml',
    ],
    host: 'https://std5.net',
  }
}
