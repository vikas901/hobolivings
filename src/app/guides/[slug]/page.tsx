import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { GUIDES_DATA } from '@/lib/guides-data';
import { buildBreadcrumbSchema, buildArticleSchema, buildFAQSchema } from '@/lib/seo/schema-builder';
import GuideContent from './guide-content';

interface GuidePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return Object.keys(GUIDES_DATA).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = GUIDES_DATA[slug];

  if (!guide) {
    return {
      title: 'Student Guide | Hobo Livings',
      description: 'Expert guides for student living and hostels in Greater Noida & Noida.',
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.hoboliving.com';
  const url = `${baseUrl}/guides/${guide.slug}`;

  return {
    title: `${guide.title} | Hobo Livings`,
    description: guide.metaDescription,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: guide.title,
      description: guide.metaDescription,
      url,
      images: [
        {
          url: guide.heroImage,
          width: 1200,
          height: 630,
          alt: guide.title,
        },
      ],
      type: 'article',
      publishedTime: guide.publishedDate,
      modifiedTime: guide.updatedDate,
      authors: [guide.author.name],
    },
    twitter: {
      card: 'summary_large_image',
      title: guide.title,
      description: guide.metaDescription,
      images: [guide.heroImage],
    },
  };
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { slug } = await params;
  const guide = GUIDES_DATA[slug];

  if (!guide) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.hoboliving.com';

  // Schema 1: BreadcrumbList Schema
  const breadcrumbJsonLd = buildBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Guides', url: '/guides' },
    { name: guide.title, url: `/guides/${guide.slug}` },
  ]);

  // Schema 2: Article Schema with Speakable Specification for Voice & SGE
  const articleJsonLd = buildArticleSchema({
    title: guide.title,
    description: guide.metaDescription,
    url: `${baseUrl}/guides/${guide.slug}`,
    image: guide.heroImage,
    datePublished: guide.publishedDate,
    dateModified: guide.updatedDate,
    authorName: guide.author.name,
    authorUrl: `${baseUrl}/about`,
  });

  // Schema 3: FAQPage Schema
  const faqJsonLd = buildFAQSchema(guide.faqs);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <GuideContent guide={guide} />
    </>
  );
}
