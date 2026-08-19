'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { CityPillarData, CITY_PILLARS } from '@/lib/city-data';
import type { Property } from '@/lib/types';
import PropertyCard from '@/components/property-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  MapPin, 
  Train, 
  ShieldCheck, 
  CheckCircle2, 
  Search, 
  ArrowRight, 
  ChevronRight, 
  Sparkles,
  HelpCircle,
  Building2,
  BookOpen,
  Wifi,
  Utensils,
  Zap
} from 'lucide-react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { properties as defaultProperties } from '@/lib/dummy-data';
import DpiitCertificateModal from '@/components/dpiit-certificate-modal';
import { PropertyDetailModal } from '@/components/property-detail-modal';

interface CityContentProps {
  city: CityPillarData;
}

export default function CityContent({ city }: CityContentProps) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<'All' | 'Boys' | 'Girls' | 'Co-ed'>('All');

  useEffect(() => {
    const fetchCityProperties = async () => {
      try {
        const q = query(
          collection(db, 'properties'),
          where('status', '==', 'approved')
        );
        const snapshot = await getDocs(q);
        
        const allFetched: Property[] = snapshot.docs.map(doc => {
          const data = doc.data();
          const imageUrl = (data.images && data.images.length > 0 && typeof data.images[0] === 'string' && !data.images[0].includes('placehold.co')) 
            ? data.images[0] 
            : (data.image && !data.image.includes('placehold.co') ? data.image : 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800');

          return {
            id: doc.id,
            title: data.title,
            image: imageUrl,
            images: data.images || [imageUrl],
            price: data.price,
            location: data.location,
            city: data.city,
            rating: data.rating || 4.8,
            reviews: data.reviews || 14,
            type: data.type || 'Hostel',
            category: data.category || 'Co-ed',
            amenities: data.amenities || ['Wi-Fi', 'Daily Meals', 'AC', 'Housekeeping', 'Power Backup'],
            description: data.description || '',
            roomOptions: data.roomOptions || [],
            status: data.status,
            ownerId: data.ownerId,
            createdAt: Date.now(),
          } as Property;
        });

        const sourcePool = allFetched.length > 0 ? allFetched : defaultProperties;
        
        // Filter properties belonging to this city
        const matched = sourcePool.filter(p => {
          const propertyCity = (p.city || '').toLowerCase();
          const cityName = city.name.toLowerCase();
          const citySlug = city.slug.toLowerCase();
          
          if (citySlug === 'greater-noida') {
            return propertyCity.includes('greater noida') || (p.location || '').toLowerCase().includes('knowledge park') || (p.location || '').toLowerCase().includes('pari chowk');
          }
          if (citySlug === 'noida') {
            return (propertyCity === 'noida' || propertyCity.includes('noida')) && !propertyCity.includes('greater');
          }
          if (citySlug === 'bangalore') {
            return propertyCity.includes('bangalore') || propertyCity.includes('bengaluru');
          }
          return propertyCity.includes(cityName);
        });

        setProperties(matched.length > 0 ? matched : sourcePool.slice(0, 6));
      } catch (err) {
        console.error('Error fetching city properties:', err);
        setProperties(defaultProperties.slice(0, 6));
      } finally {
        setLoading(false);
      }
    };

    fetchCityProperties();
  }, [city]);

  const filteredProperties = properties.filter(p => {
    if (typeFilter === 'All') return true;
    return p.category?.toLowerCase() === typeFilter.toLowerCase() || p.type?.toLowerCase() === typeFilter.toLowerCase();
  });

  const otherCities = Object.values(CITY_PILLARS).filter(c => c.slug !== city.slug);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-grow">
        {/* Breadcrumb Navigation Bar */}
        <div className="bg-muted/40 border-b py-2.5">
          <div className="container px-4 max-w-6xl mx-auto flex items-center text-xs text-muted-foreground gap-1.5 overflow-x-auto whitespace-nowrap">
            <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
              Home
            </Link>
            <ChevronRight className="h-3 w-3 shrink-0" />
            <Link href="/coliving" className="hover:text-primary transition-colors">
              Co-Living
            </Link>
            <ChevronRight className="h-3 w-3 shrink-0" />
            <span className="font-semibold text-foreground">{city.name}</span>
          </div>
        </div>

        {/* Hero Section */}
        <section className="relative h-[480px] md:h-[520px] flex items-center justify-center text-center overflow-hidden">
          <Image
            src={city.heroImage}
            alt={`${city.name} Co-Living and Student Hostels`}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/85" />
          
          <div className="relative z-10 container text-white px-4 max-w-4xl space-y-6">
            <div className="flex justify-center pb-1">
              <DpiitCertificateModal variant="badge" />
            </div>

            <h1 className="font-headline text-3xl md:text-6xl font-extrabold tracking-tight drop-shadow-md">
              {city.name} <br className="hidden md:inline" />
              <span className="bg-gradient-to-r from-rose-400 via-pink-400 to-primary bg-clip-text text-transparent">
                Co-Living & Hostels
              </span>
            </h1>

            <p className="text-base md:text-xl text-white/90 max-w-2xl mx-auto font-medium leading-relaxed">
              {city.tagline}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
              <Badge className="bg-white/15 backdrop-blur-md text-white border-white/20 px-3.5 py-1 text-xs">
                🏷️ Starts at {city.startingRent}
              </Badge>
              <Badge className="bg-emerald-500/20 backdrop-blur-md text-emerald-300 border-emerald-500/30 px-3.5 py-1 text-xs">
                ✓ 100% Zero Brokerage
              </Badge>
              <Badge className="bg-blue-500/20 backdrop-blur-md text-blue-300 border-blue-500/30 px-3.5 py-1 text-xs">
                🗓️ 48h Zero-Cost Bed Hold
              </Badge>
            </div>
          </div>
        </section>

        {/* Answer-First Zero Click Summary Box (For Google AI Overviews) */}
        <section className="container px-4 max-w-6xl mx-auto -mt-8 relative z-20">
          <Card className="bg-background shadow-xl border-primary/20 p-6 md:p-8 rounded-2xl">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-1">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h2 className="font-headline text-lg md:text-xl font-bold text-foreground">
                    Quick Overview: Co-Living in {city.name} (2026 Edition)
                  </h2>
                  <Badge variant="secondary" className="text-[10px] uppercase font-bold text-primary">
                    Verified
                  </Badge>
                </div>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  {city.zeroClickSummary}
                </p>
              </div>
            </div>
          </Card>
        </section>

        {/* Top Campus Clusters & Localities */}
        {city.topCampusesAndHubs && city.topCampusesAndHubs.length > 0 && (
          <section className="py-12 container px-4 max-w-6xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h2 className="font-headline text-2xl md:text-3xl font-bold">Top Campus & Locality Clusters</h2>
                <p className="text-sm text-muted-foreground">Select your college or office hub for walking-distance accommodations.</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {city.topCampusesAndHubs.map((hub) => (
                hub.slug ? (
                  <Link key={hub.name} href={`/campuses/${hub.slug}`}>
                    <Card className="p-4 hover:border-primary transition-all hover:shadow-md cursor-pointer group bg-muted/30">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                          <Building2 className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-xs md:text-sm text-foreground truncate group-hover:text-primary transition-colors">
                            {hub.name}
                          </p>
                          <p className="text-[11px] text-muted-foreground truncate">{hub.distanceOrLocality}</p>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ) : (
                  <Card key={hub.name} className="p-4 bg-muted/30">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <Building2 className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-xs md:text-sm text-foreground truncate">
                          {hub.name}
                        </p>
                        <p className="text-[11px] text-muted-foreground truncate">{hub.distanceOrLocality}</p>
                      </div>
                    </div>
                  </Card>
                )
              ))}
            </div>
          </section>
        )}

        {/* Locality & Cost Comparison Matrix */}
        <section className="py-12 bg-muted/30 border-y">
          <div className="container px-4 max-w-6xl mx-auto space-y-8">
            <div className="text-center space-y-2">
              <h2 className="font-headline text-2xl md:text-3xl font-bold">
                {city.name} Neighborhood & Rent Comparison Matrix
              </h2>
              <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
                Compare average monthly rents, safety ratings, and metro connectivity across top student & professional hubs.
              </p>
            </div>

            <div className="overflow-x-auto rounded-xl border bg-background shadow-xs">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/80 text-foreground font-semibold border-b">
                  <tr>
                    <th className="p-4">Locality / Sector</th>
                    <th className="p-4">Hub Type</th>
                    <th className="p-4">Avg Monthly Rent (Food + AC)</th>
                    <th className="p-4">Metro Connectivity</th>
                    <th className="p-4">Safety & Security</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {city.localities.map((loc, idx) => (
                    <tr key={idx} className="hover:bg-muted/30 transition-colors">
                      <td className="p-4 font-semibold text-foreground">
                        {loc.name}
                      </td>
                      <td className="p-4">
                        <Badge variant="outline" className="text-xs">
                          {loc.type}
                        </Badge>
                      </td>
                      <td className="p-4 font-mono font-bold text-primary">
                        {loc.avgRent}
                      </td>
                      <td className="p-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Train className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                          <span>{loc.metroConnectivity}</span>
                        </div>
                      </td>
                      <td className="p-4 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                        <div className="flex items-center gap-1.5">
                          <ShieldCheck className="h-4 w-4 shrink-0" />
                          <span>{loc.safetyRating}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Live Property Listings in this City */}
        <section id="city-listings" className="py-16 container px-4 max-w-6xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b pb-4">
            <div>
              <h2 className="font-headline text-3xl font-bold">
                Verified Accommodations in {city.name}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Showing {filteredProperties.length} verified zero-brokerage hostels and co-living rooms.
              </p>
            </div>

            {/* Quick Filter Tabs */}
            <div className="flex items-center gap-2">
              {(['All', 'Boys', 'Girls', 'Co-ed'] as const).map((type) => (
                <Button
                  key={type}
                  variant={typeFilter === type ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTypeFilter(type)}
                  className="rounded-full text-xs font-semibold"
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>

          {filteredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onCardClick={(p) => setSelectedProperty(p)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-muted/20 rounded-2xl border border-dashed p-8">
              <p className="text-muted-foreground mb-4">No {typeFilter} accommodations found matching current filter.</p>
              <Button variant="outline" onClick={() => setTypeFilter('All')}>Reset Filters</Button>
            </div>
          )}
        </section>

        {/* Transit & Commute Guide */}
        <section className="py-12 bg-muted/40 border-y">
          <div className="container px-4 max-w-6xl mx-auto space-y-8">
            <div className="space-y-2">
              <h2 className="font-headline text-2xl md:text-3xl font-bold">
                Transit & Commute Guide: {city.name}
              </h2>
              <p className="text-sm text-muted-foreground">
                How students and professionals commute seamlessly across the city.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {city.transitGuide.map((transit, idx) => (
                <Card key={idx} className="p-6 bg-background shadow-xs space-y-3">
                  <div className="h-10 w-10 rounded-full bg-blue-500/10 text-blue-600 flex items-center justify-center">
                    <Train className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-base text-foreground">{transit.mode}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{transit.details}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* City-Specific Hyperlocal FAQs */}
        <section className="py-16 container px-4 max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="font-headline text-3xl font-bold">Frequently Asked Questions</h2>
            <p className="text-sm text-muted-foreground">Common queries regarding co-living and student housing in {city.name}.</p>
          </div>

          <div className="space-y-4">
            {city.faqs.map((faq, index) => (
              <Card key={index} className="p-6 shadow-xs bg-background">
                <h3 className="font-semibold text-base mb-2 text-foreground flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-primary shrink-0" />
                  {faq.question}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed pl-6">{faq.answer}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Explore Other Cities */}
        <section className="py-12 bg-secondary/30 border-t">
          <div className="container px-4 max-w-6xl mx-auto space-y-6">
            <h3 className="font-headline text-xl font-bold text-center">Explore Co-Living in Other Cities</h3>
            <div className="flex flex-wrap justify-center gap-4">
              {otherCities.map((c) => (
                <Link key={c.slug} href={`/coliving/${c.slug}`}>
                  <Button variant="outline" className="gap-2 font-semibold">
                    <MapPin className="h-4 w-4 text-primary" />
                    {c.name}
                  </Button>
                </Link>
              ))}
              <Link href="/guides/student-housing-guide">
                <Button variant="secondary" className="gap-2 font-semibold">
                  <BookOpen className="h-4 w-4 text-primary" />
                  2026 Student Housing Guide
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Property Details & Booking Modal */}
      {selectedProperty && (
        <PropertyDetailModal
          property={selectedProperty}
          isOpen={!!selectedProperty}
          onClose={() => setSelectedProperty(null)}
        />
      )}
    </div>
  );
}
