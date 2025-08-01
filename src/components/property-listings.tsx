'use client';

import type { Property } from '@/lib/types';
import { PropertyFilters } from './property-filters';
import Image from 'next/image';
import heroImage from '@/assets/hero-image.png';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useState } from 'react';

interface PropertyListingsProps {
  properties: Property[];
}

export default function PropertyListings({ properties }: PropertyListingsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  
  return (
    <>
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center text-center">
        <Image
          src={heroImage}
          alt="Comfortable and modern student accommodation living area"
          layout="fill"
          objectFit="cover"
          className="absolute inset-0 z-0"
          placeholder="blur"
          priority
        />
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 container text-white px-4">
          <h1 className="font-headline text-4xl md:text-6xl font-bold">Find Your Student Haven in Delhi NCR</h1>
          <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto">The best student hostels, PGs, and rooms in Noida & Greater Noida. Your search ends here.</p>
           <div className="relative w-full max-w-sm mx-auto mt-8">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by city, location, or landmark..."
                className="w-full h-11 pl-10 pr-4 text-base rounded-full shadow-lg text-foreground"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
        </div>
      </section>
      
      <PropertyFilters properties={properties} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
    </>
  );
};
