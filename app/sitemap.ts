import { MetadataRoute } from 'next'
import fs from 'fs'
import path from 'path'
import { createSlug } from './utils'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://std5.net'

  // Read works data
  let works: any[] = []
  try {
    const filePath = path.join(process.cwd(), 'data', 'works.json')
    const fileContents = fs.readFileSync(filePath, 'utf8')
    works = JSON.parse(fileContents)
  } catch (error) {
    console.error('Error reading works.json:', error)
  }

  // Generate work URLs
  const workUrls = works.map((work) => ({
    url: `${baseUrl}/work/${createSlug(work.title)}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/portfolio`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/studios`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    // Add all work URLs
    ...workUrls,
  ]
}
