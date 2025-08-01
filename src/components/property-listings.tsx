import type { Property } from '@/lib/types';
import { PropertyFilters } from './property-filters';

interface PropertyListingsProps {
  properties: Property[];
}

export default function PropertyListings({ properties }: PropertyListingsProps) {
  const heroImageUrl = 'https://placehold.co/1600x600.png';

  return (
    <>
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center text-center bg-cover bg-center">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${heroImageUrl}')` }} data-ai-hint="student campus banner" />
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 container text-white px-4">
          <h1 className="font-headline text-4xl md:text-6xl font-bold">Find Your Student Haven</h1>
          <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto">The best student hostels, PGs, and rooms in Delhi NCR. Your search ends here.</p>
        </div>
      </section>
      
      <PropertyFilters properties={properties} />
    </>
  );
};