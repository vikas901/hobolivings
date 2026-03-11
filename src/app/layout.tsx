import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/context/auth-context';

export const metadata: Metadata = {
  title: 'Hobo Livings | Premium Hostels, PGs & Co-Living in Delhi NCR',
  description: 'Find the best hostels, PGs, and co-living spaces in Noida & Greater Noida. Safe, affordable, and fully-equipped for students and working professionals.',
  keywords: ['hostel', 'PG', 'co-living', 'rooms for rent', 'student accommodation', 'working professional accommodation', 'Hobo Livings', 'Noida', 'Greater Noida'],
  openGraph: {
    title: 'Hobo Livings | Premium Hostels, PGs & Co-Living Spaces',
    description: 'The best living spaces for students and professionals in Delhi NCR. Safe, affordable, and fully-equipped.',
    url: 'https://hobo-livings.firebaseapp.com', // Replace with your actual domain
    siteName: 'Hobo Livings',
    images: [
      {
        url: 'https://res.cloudinary.com/dbf1vsz6g/image/upload/v1754110825/og-image.png', // A representative image URL
        width: 1200,
        height: 630,
        alt: 'Hobo Livings - Your Perfect Space'
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hobo Livings | Premium Hostels, PGs & Co-Living Spaces',
    description: 'Find the best living spaces for students and professionals in Delhi NCR. Safe, affordable, and fully-equipped.',
    images: ['https://res.cloudinary.com/dbf1vsz6g/image/upload/v1754110825/og-image.png'], // A representative image URL
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
