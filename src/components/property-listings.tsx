'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
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
import DpiitCertificateModal from './dpiit-certificate-modal';
import { properties as defaultProperties } from '@/lib/dummy-data';

// Module-level in-memory cache for fast sub-50ms instant renders across route transitions
let propertiesCache: Property[] | null = null;
let lastCacheTime = 0;
const CACHE_TTL_MS = 3 * 60 * 1000; // 3 minutes

export default function PropertyListings() {
  const [properties, setProperties] = useState<Property[]>(propertiesCache || []);
  const [loading, setLoading] = useState(!propertiesCache);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchProperties = async () => {
      const now = Date.now();
      // If we have fresh cached properties, use them immediately
      if (propertiesCache && (now - lastCacheTime < CACHE_TTL_MS)) {
        setProperties(propertiesCache);
        setLoading(false);
        return;
      }

      try {
        // High-performance single-collection indexed query
        const q = query(
          collection(db, 'properties'), 
          where('status', '==', 'approved')
        );
        const querySnapshot = await getDocs(q);

        const fetchedProperties = querySnapshot.docs.map(doc => {
          const data = doc.data();
          
          // Exclude suspended properties
          if (data.isSuspended === true || data.status !== 'approved') {
            return null;
          }
          
          const imageUrl = (data.images && data.images.length > 0 && typeof data.images[0] === 'string' && !data.images[0].includes('placehold.co')) 
            ? data.images[0] 
            : (data.image && !data.image.includes('placehold.co') ? data.image : 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800');

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
              images: (data.images && data.images.length > 0) ? data.images.map((img: string) => img.includes('placehold.co') ? imageUrl : img) : [imageUrl],
              dataAiHint: data.dataAiHint || 'property exterior',
              price: data.price,
              location: data.location,
              city: data.city,
              rating: data.rating || 4.8,
              reviews: data.reviews || 12,
              type: data.type || 'Hostel',
              category: data.category || 'Co-ed',
              amenities: data.amenities || ['Wi-Fi', 'Daily Meals', 'AC', 'Housekeeping', 'Power Backup'],
              description: data.description || '',
              roomOptions: data.roomOptions || [],
              media: data.media || [],
              map: data.map,
              status: data.status,
              ownerId: data.ownerId,
              createdAt: createdAt,
            } as Property;
        }).filter((p): p is Property => p !== null);

        const finalProperties = fetchedProperties.length > 0 ? fetchedProperties : defaultProperties;
        
        // Update in-memory cache
        propertiesCache = finalProperties;
        lastCacheTime = Date.now();

        setProperties(finalProperties);
      } catch (error) {
        console.error("Error fetching properties, using fallback listings:", error);
        setProperties(defaultProperties);
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
          <div className="flex justify-center pb-2">
            <DpiitCertificateModal variant="badge" />
          </div>

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

      {/* Strategy 1 & 9: Time-to-Value (TTV) & Quick Takeaways Bar for Students & AI Search Engines */}
      <section className="bg-secondary/30 border-b py-6 px-4">
        <div className="container max-w-6xl mx-auto space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
                ⚡
              </span>
              <div>
                <h2 className="text-xs sm:text-sm font-bold text-foreground font-headline">
                  Quick Student Housing Guide • Greater Noida & Noida
                </h2>
                <p className="text-[11px] text-muted-foreground">
                  Key facts to help you find verified PGs and hostels in under 2 minutes:
                </p>
              </div>
            </div>

            {/* Direct 1-Click Campus Topic Cluster Hubs */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-[11px] font-semibold text-muted-foreground">Campus Hubs:</span>
              <Link 
                href="/campuses/gl-bajaj-greater-noida" 
                className="px-2.5 py-1 rounded-full bg-background border hover:border-primary/60 text-foreground font-semibold text-[11px] transition-colors shadow-xs"
              >
                🎓 GL Bajaj
              </Link>
              <Link 
                href="/campuses/galgotias-university-greater-noida" 
                className="px-2.5 py-1 rounded-full bg-background border hover:border-primary/60 text-foreground font-semibold text-[11px] transition-colors shadow-xs"
              >
                🎓 Galgotias
              </Link>
              <Link 
                href="/campuses/sharda-university-greater-noida" 
                className="px-2.5 py-1 rounded-full bg-background border hover:border-primary/60 text-foreground font-semibold text-[11px] transition-colors shadow-xs"
              >
                🎓 Sharda Univ
              </Link>
              <Link 
                href="/campuses/amity-university-noida" 
                className="px-2.5 py-1 rounded-full bg-background border hover:border-primary/60 text-foreground font-semibold text-[11px] transition-colors shadow-xs"
              >
                🎓 Amity Noida
              </Link>
            </div>
          </div>

          {/* 4 Citable Key Takeaway Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
            <div className="p-3 rounded-xl bg-card border shadow-xs text-xs space-y-0.5">
              <div className="text-muted-foreground text-[10px] font-semibold uppercase">Average Budget</div>
              <div className="font-headline font-bold text-foreground">₹7,500 – ₹13,500/mo</div>
              <p className="text-[10px] text-muted-foreground truncate">Double & Triple sharing with meals</p>
            </div>

            <div className="p-3 rounded-xl bg-card border shadow-xs text-xs space-y-0.5">
              <div className="text-muted-foreground text-[10px] font-semibold uppercase">Hygienic Meals</div>
              <div className="font-headline font-bold text-foreground">3 Meals + Evening Tea</div>
              <p className="text-[10px] text-muted-foreground truncate">Daily menu with North & South food</p>
            </div>

            <div className="p-3 rounded-xl bg-card border shadow-xs text-xs space-y-0.5">
              <div className="text-muted-foreground text-[10px] font-semibold uppercase">Brokerage Fee</div>
              <div className="font-headline font-bold text-emerald-600">100% Free (₹0 Commission)</div>
              <p className="text-[10px] text-muted-foreground truncate">Direct landlord pricing, zero middleman</p>
            </div>

            <div className="p-3 rounded-xl bg-card border shadow-xs text-xs space-y-0.5">
              <div className="text-muted-foreground text-[10px] font-semibold uppercase">Free Bed Hold</div>
              <div className="font-headline font-bold text-primary">48 Hours Free (₹0 Deposit)</div>
              <p className="text-[10px] text-muted-foreground truncate">Lock price & room while traveling</p>
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
