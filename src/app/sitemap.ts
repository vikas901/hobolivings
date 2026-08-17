import { MetadataRoute } from 'next';
import { CAMPUS_HUBS } from '@/lib/campus-data';
import { GUIDES_DATA } from '@/lib/guides-data';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hoboliving.vercel.app';
  const currentDate = new Date();

  const campusEntries: MetadataRoute.Sitemap = Object.keys(CAMPUS_HUBS).map((slug) => ({
    url: `${baseUrl}/campuses/${slug}`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: 0.95,
  }));

  const guideEntries: MetadataRoute.Sitemap = Object.keys(GUIDES_DATA).map((slug) => ({
    url: `${baseUrl}/guides/${slug}`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: GUIDES_DATA[slug].isPillar ? 0.98 : 0.9,
  }));

  return [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    ...campusEntries,
    {
      url: `${baseUrl}/guides`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    ...guideEntries,
    {
      url: `${baseUrl}/how-it-works`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/faqs`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/become-landlord`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/list-your-property`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/careers`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];
}
