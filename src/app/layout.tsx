import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/context/auth-context';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://hobolivings.vercel.app';

export const viewport: Viewport = {
  themeColor: '#E63946',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Hobo Livings | Premium Hostels, PGs & Co-Living in Delhi NCR',
    template: '%s | Hobo Livings',
  },
  description: 'Find top-rated, verified hostels, student PGs, rooms, and co-living accommodations in Noida, Greater Noida, and Delhi NCR with zero brokerage and transparent terms.',
  keywords: [
    'hostel',
    'PG near me',
    'student PG Noida',
    'co-living Delhi NCR',
    'rooms for rent',
    'flat for rent Noida',
    'working professional PG',
    'Hobo Livings',
    'Greater Noida hostels',
    'zero brokerage PG',
  ],
  authors: [{ name: 'Hobo Livings' }],
  creator: 'Hobo Livings',
  publisher: 'Hobo Livings',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'Hobo Livings | Premium Hostels, PGs & Co-Living Spaces',
    description: 'Discover safe, affordable, fully-equipped hostels and PGs in Noida & Greater Noida for students and working professionals.',
    url: SITE_URL,
    siteName: 'Hobo Livings',
    images: [
      {
        url: 'https://res.cloudinary.com/dbf1vsz6g/image/upload/v1754110825/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Hobo Livings - Student & Co-Living Accommodations',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hobo Livings | Premium Hostels & PGs in Delhi NCR',
    description: 'Find verified, zero-brokerage hostels and PGs for students and professionals in Delhi NCR.',
    images: ['https://res.cloudinary.com/dbf1vsz6g/image/upload/v1754110825/og-image.png'],
  },
};

const jsonLdOrganization = {
  '@context': 'https://schema.org',
  '@type': 'RealEstateAgent',
  name: 'Hobo Livings',
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  image: 'https://res.cloudinary.com/dbf1vsz6g/image/upload/v1754110825/og-image.png',
  description: 'Verified student hostels, PGs, and co-living accommodations with transparent pricing and zero brokerage.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Greater Noida',
    addressRegion: 'Uttar Pradesh',
    addressCountry: 'IN',
  },
  priceRange: '₹3000 - ₹25000',
};

const jsonLdWebsite = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Hobo Livings',
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrganization) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebsite) }}
        />
      </head>
      <body className="font-body antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster />
        <Script
          src="https://upload-widget.cloudinary.com/global/all.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}

