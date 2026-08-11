import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hoboliving.vercel.app';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/owner/dashboard', '/owner/edit-property/'],
      },
      // Allow AI Overview & LLM crawlers for Generative Engine Optimization (GEO)
      {
        userAgent: ['GPTBot', 'ChatGPT-User', 'PerplexityBot', 'Google-Extended', 'ClaudeBot', 'Applebot-Extended'],
        allow: '/',
        disallow: ['/admin', '/owner/dashboard', '/owner/edit-property/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
