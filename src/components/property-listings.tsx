'use client';

import { useState, useEffect } from 'react';
import type { Property } from '@/lib/types';
import { PropertyFilters } from './property-filters';
import Image from 'next/image';
import heroImage from '@/assets/hero-image.png';
import { Input } from '@/components/ui/input';
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
        const q = query(collection(db, 'properties'), where('status', '==', 'approved'));
        const querySnapshot = await getDocs(q);
        const fetchedProperties = querySnapshot.docs.map(doc => {
          const data = doc.data();
          
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
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center text-center">
        <Image
          src={heroImage}
          alt="Comfortable and modern co-living space"
          fill
          className="absolute inset-0 z-0 object-cover"
          placeholder="blur"
          priority
        />
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 container text-white px-4">
          <h1 className="font-headline text-4xl md:text-6xl font-bold">Your Perfect Space in Delhi NCR</h1>
          <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto">Discover premium hostels, PGs, and co-living spaces. Fully-equipped for students and working professionals alike.</p>
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
        <PropertyFilters properties={properties} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      )}
    </>
  );
}
