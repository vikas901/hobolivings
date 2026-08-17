/**
 * Comprehensive, Type-Safe JSON-LD Schema Builder for 2026 SEO
 * Generates valid Structured Data for LodgingBusiness, RealEstateAgent,
 * FAQPage, BreadcrumbList, HowTo, Speakable, and Review schemas.
 */

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://hoboliving.vercel.app';

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ReviewItem {
  author: string;
  ratingValue: number;
  bestRating?: number;
  reviewBody: string;
  datePublished: string;
}

/**
 * 1. Organization / LodgingBusiness / RealEstateAgent Schema
 */
export function buildOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': ['RealEstateAgent', 'LodgingBusiness'],
    name: 'Hobo Livings',
    alternateName: ['Hobo Living Accommodations', 'HoboLivings'],
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=1200',
    description: 'Verified student hostels, PGs, and co-living accommodations in Greater Noida, Noida, and Delhi NCR with zero brokerage and assisted site visits.',
    telephone: '+91 89206 42742',
    email: 'livingshobo@gmail.com',
    priceRange: '₹7500 - ₹25000',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Knowledge Park II',
      addressLocality: 'Greater Noida',
      addressRegion: 'Uttar Pradesh',
      postalCode: '201310',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 28.4728,
      longitude: 77.4893,
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '08:00',
      closes: '21:00',
    },
    sameAs: [
      'https://www.instagram.com/hobolivings',
      'https://www.linkedin.com/company/hobo-livings',
    ],
  };
}

/**
 * 2. WebSite Schema with Sitelinks SearchBox
 */
export function buildWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Hobo Livings',
    alternateName: ['Hobo Livings', 'Hobo Living', 'HoboLivings', 'Hobo Livings Private Limited'],
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * 3. BreadcrumbList Schema
 */
export function buildBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url.startsWith('/') ? '' : '/'}${item.url}`,
    })),
  };
}

/**
 * 4. FAQPage Schema
 */
export function buildFAQSchema(faqs: FAQItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * 5. HowTo Schema for Booking & Free Site Visits
 */
export function buildHowToVisitSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to Schedule a Free Physical Hostel/PG Visit with Hobo Livings',
    description: 'A 3-step zero-cost process for college students to book assisted physical room visits in Greater Noida & Noida.',
    totalTime: 'PT2M',
    step: [
      {
        '@type': 'HowToStep',
        position: 1,
        name: 'Select Your Preferred Property',
        text: 'Browse verified student hostels & PGs filtered by campus, AC, food, and budget.',
        url: `${SITE_URL}/#listings`,
      },
      {
        '@type': 'HowToStep',
        position: 2,
        name: 'Choose Date & Time Slot',
        text: 'Click "Schedule Free Visit" and pick a convenient morning, afternoon, or evening slot.',
        url: `${SITE_URL}/how-it-works`,
      },
      {
        '@type': 'HowToStep',
        position: 3,
        name: 'Get Instant Digital Visit Pass',
        text: 'Receive a digital pass with exact Google Maps directions, caretaker phone number, and a 48-hour zero-cost bed hold.',
        url: `${SITE_URL}/how-it-works`,
      },
    ],
  };
}

/**
 * 6. Article / Guide Schema with Speakable Specification for Voice Search & AI Overviews
 */
export function buildArticleSchema({
  title,
  description,
  url,
  image,
  datePublished,
  dateModified,
  authorName = 'Hobo Livings Editorial Team',
  authorUrl = `${SITE_URL}/about`,
  speakableCssSelectors = ['#zero-click-summary', '#key-takeaways', 'h1', 'h2'],
}: {
  title: string;
  description: string;
  url: string;
  image: string;
  datePublished: string;
  dateModified: string;
  authorName?: string;
  authorUrl?: string;
  speakableCssSelectors?: string[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url: url.startsWith('http') ? url : `${SITE_URL}${url}`,
    image: [image],
    datePublished,
    dateModified,
    author: {
      '@type': 'Person',
      name: authorName,
      url: authorUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Hobo Livings',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url.startsWith('http') ? url : `${SITE_URL}${url}`,
    },
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: speakableCssSelectors,
    },
  };
}

/**
 * 7. AggregateRating & Local Business Schema for Locality Hubs
 */
export function buildLocalityHubSchema({
  name,
  locality,
  city,
  description,
  url,
  image,
  avgRating = 4.8,
  reviewCount = 142,
  priceRange = '₹8,000 - ₹14,000 / month',
}: {
  name: string;
  locality: string;
  city: string;
  description: string;
  url: string;
  image: string;
  avgRating?: number;
  reviewCount?: number;
  priceRange?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Place',
    name,
    description,
    url: url.startsWith('http') ? url : `${SITE_URL}${url}`,
    image,
    address: {
      '@type': 'PostalAddress',
      addressLocality: locality,
      addressRegion: city,
      addressCountry: 'IN',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: avgRating,
      reviewCount: reviewCount,
      bestRating: 5,
      worstRating: 1,
    },
    amenityFeature: [
      { '@type': 'LocationFeatureSpecification', name: 'Hygienic 3 Times Meals Daily', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'High-Speed Wi-Fi', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Biometric CCTV Security', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Zero Brokerage Guarantee', value: true },
    ],
  };
}
