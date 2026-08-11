import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CAMPUS_HUBS } from '@/lib/campus-data';
import CampusContent from './campus-content';

interface CampusPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return Object.keys(CAMPUS_HUBS).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: CampusPageProps): Promise<Metadata> {
  const { slug } = await params;
  const campus = CAMPUS_HUBS[slug];

  if (!campus) {
    return {
      title: 'Campus Hostels & PGs | Hobo Livings',
      description: 'Find verified student hostels and PGs near major colleges in Greater Noida & Noida.',
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hoboliving.vercel.app';
  const url = `${baseUrl}/campuses/${campus.slug}`;

  return {
    title: campus.title,
    description: campus.metaDescription,
    keywords: [
      `hostels near ${campus.shortName.toLowerCase()}`,
      `pg near ${campus.shortName.toLowerCase()}`,
      `student accommodation ${campus.locality.toLowerCase()}`,
      `boys hostel ${campus.shortName.toLowerCase()}`,
      `girls pg ${campus.shortName.toLowerCase()}`,
      'zero brokerage pg greater noida',
      'hobo livings'
    ],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: campus.title,
      description: campus.metaDescription,
      url,
      images: [
        {
          url: campus.heroImage,
          width: 1200,
          height: 630,
          alt: campus.title,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: campus.title,
      description: campus.metaDescription,
      images: [campus.heroImage],
    },
  };
}

export default async function CampusPage({ params }: CampusPageProps) {
  const { slug } = await params;
  const campus = CAMPUS_HUBS[slug];

  if (!campus) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hoboliving.vercel.app';

  // Schema 1: BreadcrumbList Schema for Google SERP
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: baseUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: `${campus.city} Hostels`,
        item: `${baseUrl}/?city=${encodeURIComponent(campus.city)}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: campus.name,
        item: `${baseUrl}/campuses/${campus.slug}`,
      },
    ],
  };

  // Schema 2: FAQPage Schema for Rich Snippets
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: campus.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
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
      <CampusContent campus={campus} />
    </>
  );
}
