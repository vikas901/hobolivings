import type { Property } from '@/lib/types';
import { PropertyFilters } from './property-filters';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface PropertyListingsProps {
  properties: Property[];
}

export default function PropertyListings({ properties }: PropertyListingsProps) {
  return (
    <>
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center text-center">
        <Image
          src="https://placehold.co/1200x500.png"
          alt="Students studying in a common area"
          layout="fill"
          objectFit="cover"
          className="absolute inset-0 z-0"
          data-ai-hint="student campus banner"
          priority
        />
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 container text-white px-4">
          <h1 className="font-headline text-4xl md:text-6xl font-bold">Find Your Student Haven</h1>
          <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto">The best student hostels, PGs, and rooms in Delhi NCR. Your search ends here.</p>
           <div className="mt-8 max-w-2xl mx-auto">
              <div className="relative">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                 <Input
                    type="search"
                    placeholder="Search by city, location, or landmark..."
                    className="w-full h-14 pl-12 pr-4 text-base rounded-full shadow-lg text-foreground"
                 />
              </div>
           </div>
        </div>
      </section>
      
      <PropertyFilters properties={properties} />
    </>
  );
};
