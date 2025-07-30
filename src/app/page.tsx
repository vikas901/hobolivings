'use client';

import Header from '@/components/header';
import Footer from '@/components/footer';
import PropertyListings from '@/components/property-listings';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <PropertyListings />
      </main>
      <Footer />
    </div>
  );
}

    