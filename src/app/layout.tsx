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
    default: 'Hobo Livings | Verified Student Hostels & PGs in Greater Noida & Noida (₹0 Brokerage)',
    template: '%s | Hobo Livings',
  },
  description: 'Find verified hostels and PGs near GL Bajaj, Galgotias, Sharda University, Amity Noida & Sector 62. Free assisted site visits, 48h zero-cost bed holds, and 100% zero brokerage.',
  keywords: [
    'hostels in greater noida',
    'pg near gl bajaj',
    'pg near galgotias',
    'hostel near sharda university',
    'girls pg in greater noida',
    'boys hostel knowledge park 2',
    'student accommodation greater noida',
    'pg near amity university noida',
    'boys pg sector 62 noida',
    'co-living spaces noida',
    'zero brokerage pg greater noida',
    'single room pg knowledge park',
    'double sharing hostel greater noida',
    'hobo livings',
    'hobo living hostels'
  ],
  authors: [{ name: 'Hobo Livings', url: SITE_URL }],
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
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || 'googleb1e7941b332ec6fa',
  },
  openGraph: {
    title: 'Hobo Livings | Verified Student Hostels & PGs in Greater Noida & Noida',
    description: 'Browse top-rated hostels & PGs near GL Bajaj, Galgotias, Sharda, Amity & Knowledge Park with free assisted visits and zero brokerage.',
    url: SITE_URL,
    siteName: 'Hobo Livings',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=1200',
        width: 1200,
        height: 630,
        alt: 'Hobo Livings - Student Hostels & Co-Living Spaces',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  icons: {
    icon: [
      { url: '/logo.png', sizes: 'any' },
      { url: '/favicon.ico' }
    ],
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hobo Livings | Student Hostels & PGs in Greater Noida',
    description: 'Verified student accommodations near GL Bajaj, Galgotias & Amity with free site visits and 0 brokerage.',
    images: ['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=1200'],
  },
};

// Rich Schema 1: Local Real Estate & Lodging Business
const jsonLdOrganization = {
  '@context': 'https://schema.org',
  '@type': ['RealEstateAgent', 'LodgingBusiness'],
  name: 'Hobo Livings',
  alternateName: 'Hobo Living Accommodations',
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=1200',
  description: 'Verified student hostels, PGs, and co-living accommodations in Greater Noida, Noida, and Delhi NCR with zero brokerage and assisted site visits.',
  telephone: '+91 89206 42742',
  email: 'livingshobo@gmail.com',
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
  priceRange: '₹7500 - ₹25000',
};

// Rich Schema 2: Search Action on WebSite
const jsonLdWebsite = {
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

// Rich Schema 3: FAQ Page Schema for Google Rich Snippets
const jsonLdFaq = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Does Hobo Livings charge any brokerage or commission from students?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No, Hobo Livings offers a 100% zero brokerage guarantee for students and tenants. Free assisted visits and room scheduling are completely free of cost.'
      }
    },
    {
      '@type': 'Question',
      name: 'Which college campuses are covered by Hobo Livings in Greater Noida & Noida?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Hobo Livings covers hostels and PGs near GL Bajaj Institute, Galgotias University, Sharda University, NIET, Lloyd, Amity University Noida (Sector 125), and JSS Academy (Sector 62).'
      }
    },
    {
      '@type': 'Question',
      name: 'What amenities are included in student hostels and PGs on Hobo Livings?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Most accommodations include 3 hygienic meals daily, high-speed Wi-Fi, air conditioning (AC), biometric security with CCTV, daily housekeeping, laundry service, and 24/7 power backup.'
      }
    },
    {
      '@type': 'Question',
      name: 'How can I schedule a free physical visit to a hostel or PG?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Simply log in to your account, click "Schedule Free Visit" on any property, select your preferred date and time slot, and get your Instant Digital Visit Pass with Google Maps directions and caretaker phone number.'
      }
    }
  ]
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
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

