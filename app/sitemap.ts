import { MetadataRoute } from 'next'
import fs from 'fs'
import path from 'path'
import { createSlug } from './utils'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://std5.net'
  const locales = ['tr', 'en', 'fr', 'es', 'ar', 'ru']

  // Read works data
  let works: Array<{ title: string; prod_year: number; genre: string; platform: string }> = []
  try {
    const filePath = path.join(process.cwd(), 'data', 'works.json')
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const worksData = JSON.parse(fileContents)
    works = worksData
  } catch (error) {
    console.error('Error reading works.json:', error)
  }

  const sitemap: MetadataRoute.Sitemap = []

  // Generate URLs for each locale
  locales.forEach(locale => {
    const localePrefix = locale === 'tr' ? '' : `/${locale}`

    // Home page
    sitemap.push({
      url: `${baseUrl}${localePrefix}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
      alternates: {
        languages: {
          'tr': `${baseUrl}`,
          'en': `${baseUrl}/en`,
          'fr': `${baseUrl}/fr`,
          'es': `${baseUrl}/es`,
          'ar': `${baseUrl}/ar`,
          'ru': `${baseUrl}/ru`,
        },
      },
    })

    // About page
    sitemap.push({
      url: `${baseUrl}${localePrefix}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
      alternates: {
        languages: {
          'tr': `${baseUrl}/about`,
          'en': `${baseUrl}/en/about`,
          'fr': `${baseUrl}/fr/about`,
          'es': `${baseUrl}/es/about`,
          'ar': `${baseUrl}/ar/about`,
          'ru': `${baseUrl}/ru/about`,
        },
      },
    })

    // Projects page
    sitemap.push({
      url: `${baseUrl}${localePrefix}/projects`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
      alternates: {
        languages: {
          'tr': `${baseUrl}/projects`,
          'en': `${baseUrl}/en/projects`,
          'fr': `${baseUrl}/fr/projects`,
          'es': `${baseUrl}/es/projects`,
          'ar': `${baseUrl}/ar/projects`,
          'ru': `${baseUrl}/ru/projects`,
        },
      },
    })

    // Locations page
    sitemap.push({
      url: `${baseUrl}${localePrefix}/locations`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
      alternates: {
        languages: {
          'tr': `${baseUrl}/locations`,
          'en': `${baseUrl}/en/locations`,
          'fr': `${baseUrl}/fr/locations`,
          'es': `${baseUrl}/es/locations`,
          'ar': `${baseUrl}/ar/locations`,
          'ru': `${baseUrl}/ru/locations`,
        },
      },
    })

    // Contact page
    sitemap.push({
      url: `${baseUrl}${localePrefix}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
      alternates: {
        languages: {
          'tr': `${baseUrl}/contact`,
          'en': `${baseUrl}/en/contact`,
          'fr': `${baseUrl}/fr/contact`,
          'es': `${baseUrl}/es/contact`,
          'ar': `${baseUrl}/ar/contact`,
          'ru': `${baseUrl}/ru/contact`,
        },
      },
    })

    // Work URLs for each locale
    works.forEach((work) => {
      sitemap.push({
        url: `${baseUrl}${localePrefix}/work/${createSlug(work.title)}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
        alternates: {
          languages: {
            'tr': `${baseUrl}/work/${createSlug(work.title)}`,
            'en': `${baseUrl}/en/work/${createSlug(work.title)}`,
            'fr': `${baseUrl}/fr/work/${createSlug(work.title)}`,
            'es': `${baseUrl}/es/work/${createSlug(work.title)}`,
            'ar': `${baseUrl}/ar/work/${createSlug(work.title)}`,
            'ru': `${baseUrl}/ru/work/${createSlug(work.title)}`,
          },
        },
      })
    })
  })

  return sitemap
}
