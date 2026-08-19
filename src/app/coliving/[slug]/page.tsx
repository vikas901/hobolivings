import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CITY_PILLARS, getAllCityPillarSlugs, getCityPillarBySlug } from '@/lib/city-data';
import {
  buildBreadcrumbSchema,
  buildFAQSchema,
} from '@/lib/seo/schema-builder';
import CityContent from './city-content';

interface CityPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return getAllCityPillarSlugs().map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: CityPageProps): Promise<Metadata> {
  const { slug } = await params;
  const city = getCityPillarBySlug(slug);

  if (!city) {
    return {
      title: 'Co-Living Spaces | Hobo Livings',
      description: 'Explore verified co-living spaces and student hostels across India with zero brokerage.',
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.hoboliving.in';
  const url = `${baseUrl}/coliving/${city.slug}`;

  return {
    title: city.title,
    description: city.metaDescription,
    keywords: [
      `coliving in ${city.name.toLowerCase()}`,
      `co living spaces ${city.name.toLowerCase()}`,
      `student hostels in ${city.name.toLowerCase()}`,
      `pg in ${city.name.toLowerCase()}`,
      `zero brokerage pg ${city.name.toLowerCase()}`,
      `best coliving ${city.name.toLowerCase()}`,
      'hobo livings'
    ],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: city.title,
      description: city.metaDescription,
      url,
      siteName: 'Hobo Livings',
      images: [
        {
          url: city.heroImage,
          width: 1200,
          height: 630,
          alt: `${city.name} Co-Living Spaces - Hobo Livings`,
        },
      ],
      type: 'website',
    },
  };
}

export default async function CityPillarPage({ params }: CityPageProps) {
  const { slug } = await params;
  const city = getCityPillarBySlug(slug);

  if (!city) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.hoboliving.in';

  // Schema 1: BreadcrumbList Schema for Google SERP
  const breadcrumbJsonLd = buildBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Co-Living', url: '/coliving' },
    { name: city.name, url: `/coliving/${city.slug}` },
  ]);

  // Schema 2: FAQPage Schema for Google AI Overviews
  const faqJsonLd = buildFAQSchema(city.faqs);

  // Schema 3: Organization / LodgingBusiness Schema for City
  const cityBusinessJsonLd = {
    '@context': 'https://schema.org',
    '@type': ['RealEstateAgent', 'LodgingBusiness'],
    '@id': `${baseUrl}/coliving/${city.slug}#business`,
    name: `Hobo Livings - ${city.name}`,
    url: `${baseUrl}/coliving/${city.slug}`,
    description: city.metaDescription,
    priceRange: '₹7500 - ₹25000',
    address: {
      '@type': 'PostalAddress',
      addressLocality: city.name,
      addressRegion: city.state,
      addressCountry: 'IN',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(cityBusinessJsonLd) }}
      />
      <CityContent city={city} />
    </>
  );
}
