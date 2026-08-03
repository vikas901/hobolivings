import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hobolivings.vercel.app';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/owner/dashboard', '/owner/edit-property/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
