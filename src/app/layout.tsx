import type { Metadata, Viewport } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/context/auth-context';
import {
  buildOrganizationSchema,
  buildWebsiteSchema,
  buildFAQSchema,
  buildHowToVisitSchema,
} from '@/lib/seo/schema-builder';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-headline',
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://hoboliving.vercel.app';

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
  applicationName: 'Hobo Livings',
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
  manifest: '/site.webmanifest',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
    shortcut: '/favicon-48x48.png',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hobo Livings | Student Hostels & PGs in Greater Noida',
    description: 'Verified student accommodations near GL Bajaj, Galgotias & Amity with free site visits and 0 brokerage.',
    images: ['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=1200'],
  },
};

const homeFaqs = [
  {
    question: 'Does Hobo Livings charge any brokerage or commission from students?',
    answer: 'No, Hobo Livings offers a 100% zero brokerage guarantee for students and tenants. Free assisted visits and room scheduling are completely free of cost.'
  },
  {
    question: 'Which college campuses are covered by Hobo Livings in Greater Noida & Noida?',
    answer: 'Hobo Livings covers hostels and PGs near GL Bajaj Institute, Galgotias University, Sharda University, NIET, Lloyd, Amity University Noida (Sector 125), and JSS Academy (Sector 62).'
  },
  {
    question: 'What amenities are included in student hostels and PGs on Hobo Livings?',
    answer: 'Most accommodations include 3 hygienic meals daily, high-speed Wi-Fi, air conditioning (AC), biometric security with CCTV, daily housekeeping, laundry service, and 24/7 power backup.'
  },
  {
    question: 'How can I schedule a free physical visit to a hostel or PG?',
    answer: 'Simply log in to your account, click "Schedule Free Visit" on any property, select your preferred date and time slot, and get your Instant Digital Visit Pass with Google Maps directions and caretaker phone number.'
  }
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLdOrganization = buildOrganizationSchema();
  const jsonLdWebsite = buildWebsiteSchema();
  const jsonLdFaq = buildFAQSchema(homeFaqs);
  const jsonLdHowTo = buildHowToVisitSchema();

  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png" />
        <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/favicon-192x192.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdHowTo) }}
        />
      </head>
      <body className="font-body antialiased bg-background text-foreground">
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

