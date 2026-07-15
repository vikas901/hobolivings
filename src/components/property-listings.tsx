'use client';

import { useState, useEffect } from 'react';
import type { Property } from '@/lib/types';
import { PropertyFilters } from './property-filters';
import Image from 'next/image';
import heroImage from '@/assets/hero-image.png';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { collection, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Skeleton } from './ui/skeleton';

export default function PropertyListings() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        // Fetch approved properties
        const q = query(collection(db, 'properties'), where('status', '==', 'approved'));
        const querySnapshot = await getDocs(q);

        // Fetch owners to check verification/suspension status
        const ownersSnapshot = await getDocs(collection(db, 'users'));
        const ownersMap = new Map<string, any>();
        ownersSnapshot.docs.forEach(doc => {
          ownersMap.set(doc.id, doc.data());
        });
        
        const fetchedProperties = querySnapshot.docs.map(doc => {
          const data = doc.data();
          
          // Verify owner status
          const owner = ownersMap.get(data.ownerId);
          // Fallback to true/false for dummy properties where owner doc does not exist
          const isOwnerVerified = owner ? owner.landlordKycStatus === 'verified' : true;
          const isOwnerSuspended = owner ? owner.isSuspended === true : false;

          // Exclude properties of unverified or suspended owners
          if (!isOwnerVerified || isOwnerSuspended) {
            return null;
          }
          
          const imageUrl = (data.images && data.images.length > 0 && typeof data.images[0] === 'string' && data.images[0].startsWith('https://res.cloudinary.com')) 
            ? data.images[0] 
            : 'https://placehold.co/600x400.png';

          let createdAt: number;
          if (data.createdAt && data.createdAt instanceof Timestamp) {
              createdAt = data.createdAt.toMillis();
          } else if (typeof data.createdAt === 'number') {
              createdAt = data.createdAt;
          } else {
              createdAt = Date.now();
          }

          return {
              id: doc.id,
              title: data.title,
              image: imageUrl,
              images: data.images || [imageUrl],
              dataAiHint: data.dataAiHint || 'property exterior',
              price: data.price,
              location: data.location,
              city: data.city,
              rating: data.rating,
              reviews: data.reviews,
              type: data.type,
              category: data.category,
              amenities: data.amenities,
              description: data.description,
              roomOptions: data.roomOptions,
              media: data.media,
              map: data.map,
              status: data.status,
              ownerId: data.ownerId,
              createdAt: createdAt,
            } as Property;
        }).filter((p): p is Property => p !== null);

        setProperties(fetchedProperties);
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);
  
  return (
    <>
      <section className="relative h-[65vh] min-h-[500px] flex items-center justify-center text-center">
        <Image
          src={heroImage}
          alt="Comfortable and modern co-living space"
          fill
          className="absolute inset-0 z-0 object-cover"
          placeholder="blur"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/45 to-black/70"></div>
        <div className="relative z-10 container text-white px-4 max-w-4xl space-y-6">
          <h1 className="font-headline text-4xl md:text-7xl font-extrabold tracking-tight drop-shadow-md">
            Affordable Living.<br className="md:hidden" />
            <span className="bg-gradient-to-r from-rose-400 via-pink-500 to-primary bg-clip-text text-transparent ml-2 drop-shadow-none">
              Better Experiences.
            </span>
          </h1>
          
          <p className="mt-4 text-base md:text-xl max-w-2xl mx-auto text-white/95 leading-relaxed font-medium">
            Hobo Livings helps students and working professionals find safe, verified, and affordable PGs, hostels, rooms, and co-living spaces across India.
          </p>

          <div className="relative w-full max-w-xl mx-auto mt-8 space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by city, location, or landmark..."
                className="w-full h-14 pl-12 pr-28 text-base rounded-full shadow-2xl text-foreground bg-background border-none focus-visible:ring-2 focus-visible:ring-primary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    document.getElementById('explore-spaces')?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              />
              <Button 
                onClick={() => document.getElementById('explore-spaces')?.scrollIntoView({ behavior: 'smooth' })}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-10 px-6 rounded-full font-semibold shadow-md"
              >
                Search
              </Button>
            </div>

            {/* Popular City Shortcuts */}
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs pt-1">
              <span className="text-white/80 font-medium">Popular:</span>
              {['Noida', 'Delhi', 'Gurgaon', 'Greater Noida'].map((city) => (
                <button
                  key={city}
                  onClick={() => {
                    setSearchTerm(city);
                    setTimeout(() => {
                      document.getElementById('explore-spaces')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  className="bg-white/10 hover:bg-white/20 text-white font-semibold px-3 py-1 rounded-full border border-white/25 transition-all shadow-sm"
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {loading ? (
        <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <aside className="hidden lg:block lg:col-span-1">
                    <div className="sticky top-24 space-y-4">
                        <Skeleton className="h-8 w-1/3" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-24 w-full" />
                    </div>
                </aside>
                <div className="lg:col-span-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        <Skeleton className="h-96 w-full" />
                        <Skeleton className="h-96 w-full" />
                        <Skeleton className="h-96 w-full" />
                    </div>
                </div>
            </div>
        </div>
      ) : (
        <div id="explore-spaces" className="scroll-mt-20">
          <PropertyFilters properties={properties} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </div>
      )}
    </>
  );
}
