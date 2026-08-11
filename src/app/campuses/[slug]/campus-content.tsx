'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { CampusHub, CAMPUS_HUBS } from '@/lib/campus-data';
import type { Property } from '@/lib/types';
import PropertyCard from '@/components/property-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  MapPin, 
  Train, 
  Footprints, 
  ShieldCheck, 
  CheckCircle2, 
  Search, 
  ArrowRight, 
  ChevronRight, 
  Sparkles,
  HelpCircle,
  Building2,
  PhoneCall,
  Flame
} from 'lucide-react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { properties as defaultProperties } from '@/lib/dummy-data';
import DpiitCertificateModal from '@/components/dpiit-certificate-modal';
import { PropertyDetailModal } from '@/components/property-detail-modal';

interface CampusContentProps {
  campus: CampusHub;
}

export default function CampusContent({ campus }: CampusContentProps) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampusProperties = async () => {
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

        // Filter for this campus
        const sourcePool = allFetched.length > 0 ? allFetched : defaultProperties;
        const matched = sourcePool.filter(p => {
          const text = `${p.title} ${p.location} ${p.city} ${p.description || ''}`.toLowerCase();
          return campus.filterKeywords.some(k => text.includes(k.toLowerCase())) || 
                 p.city?.toLowerCase() === campus.city.toLowerCase();
        });

        setProperties(matched.length > 0 ? matched : sourcePool.slice(0, 6));
      } catch (err) {
        console.error('Error fetching campus properties:', err);
        setProperties(defaultProperties.slice(0, 6));
      } finally {
        setLoading(false);
      }
    };

    fetchCampusProperties();
  }, [campus]);

  const otherCampuses = Object.values(CAMPUS_HUBS).filter(c => c.slug !== campus.slug);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />

      {/* Breadcrumb Navigation */}
      <nav className="bg-secondary/30 border-b py-2.5 px-4 text-xs font-medium text-muted-foreground" aria-label="Breadcrumb">
        <div className="container max-w-6xl mx-auto flex items-center gap-1.5 flex-wrap">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href={`/?city=${encodeURIComponent(campus.city)}`} className="hover:text-foreground transition-colors">
            {campus.city}
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground font-semibold truncate">{campus.shortName}</span>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-secondary/40 via-background to-background py-14 px-4 border-b">
        <div className="container max-w-6xl mx-auto space-y-6">
          
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Badge className="bg-primary/10 text-primary border-primary/30 font-bold text-xs uppercase px-3 py-1">
              🎓 Verified Student Hub • {campus.locality}
            </Badge>
            <DpiitCertificateModal variant="badge" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-4">
              <h1 className="font-headline text-3xl sm:text-5xl font-black tracking-tight text-foreground leading-tight">
                {campus.title}
              </h1>

              <p className="text-base text-muted-foreground leading-relaxed">
                {campus.description}
              </p>

              {/* Transit & Walking Badge Pills */}
              <div className="flex flex-wrap gap-2.5 pt-2">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary border text-xs font-semibold text-foreground">
                  <Footprints className="h-4 w-4 text-primary" />
                  <span>{campus.walkingDistance}</span>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary border text-xs font-semibold text-foreground">
                  <Train className="h-4 w-4 text-emerald-600" />
                  <span>{campus.metro}</span>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span>100% Zero Brokerage</span>
                </div>
              </div>
            </div>

            {/* Right: Instant Time-to-Value (TTV) Quick Summary Card */}
            <div className="lg:col-span-5">
              <Card className="shadow-xl border-primary/20 bg-card/95 backdrop-blur">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between border-b pb-3">
                    <span className="font-headline font-bold text-sm text-foreground flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4 text-primary" />
                      {campus.shortName} Quick Guide
                    </span>
                    <Badge variant="outline" className="text-[10px] font-extrabold text-emerald-600 border-emerald-500/40">
                      Live Availability
                    </Badge>
                  </div>

                  <div className="space-y-2.5 text-xs text-muted-foreground">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-foreground">Monthly Rent Range:</span>
                      <strong className="text-primary font-mono text-xs">{campus.avgRent}</strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-foreground">Meals Included:</span>
                      <span className="text-foreground font-semibold">3 Fresh Meals + Snacks</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-foreground">Bed Hold:</span>
                      <span className="text-emerald-600 font-bold">48 Hours Free (₹0)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-foreground">Assisted Visits:</span>
                      <span className="text-foreground font-semibold">Digital WhatsApp Pass</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button asChild className="w-full font-bold shadow-md">
                      <a href="#properties-list">
                        <Search className="mr-2 h-4 w-4" /> View {campus.shortName} Listings
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

          </div>

        </div>
      </section>

      {/* Property Listings Section */}
      <section id="properties-list" className="py-14 px-4 container max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
          <div>
            <h2 className="font-headline text-2xl sm:text-3xl font-extrabold text-foreground flex items-center gap-2">
              <Building2 className="h-6 w-6 text-primary" />
              Verified Accommodations Near {campus.shortName}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Showing {properties.length} verified hostels, PGs, and single rooms with zero brokerage.
            </p>
          </div>

          <Button asChild variant="outline" size="sm" className="font-semibold">
            <Link href="/">
              Explore All Cities <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <PropertyCard 
              key={property.id} 
              property={property} 
              onCardClick={(prop) => setSelectedProperty(prop)}
            />
          ))}
        </div>
      </section>

      {/* Property Detail & Booking Pass Modal */}
      {selectedProperty && (
        <PropertyDetailModal
          property={selectedProperty}
          isOpen={true}
          onClose={() => setSelectedProperty(null)}
        />
      )}

      {/* Key Highlights & Amenities Section */}
      <section className="bg-secondary/20 py-14 px-4 border-y">
        <div className="container max-w-6xl mx-auto space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <Badge variant="outline" className="text-xs uppercase tracking-wider text-primary border-primary/30">
              Campus Amenities & Safety
            </Badge>
            <h3 className="font-headline text-2xl sm:text-3xl font-extrabold text-foreground">
              What to Expect in {campus.shortName} Hostels
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {campus.keyHighlights.map((highlight, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-card border shadow-sm flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm font-semibold text-foreground leading-snug">
                  {highlight}
                </p>
              </div>
            ))}
          </div>

          {/* Landmarks Box */}
          <div className="p-6 rounded-2xl bg-card border shadow-sm space-y-3">
            <h4 className="font-headline font-bold text-sm text-foreground flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" /> Key Landmarks & Walking Routes Around {campus.shortName}:
            </h4>
            <div className="flex flex-wrap gap-2">
              {campus.landmarks.map((landmark, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs font-medium py-1 px-3">
                  📍 {landmark}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Campus Specific FAQs Section */}
      <section className="py-14 px-4 container max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <Badge className="bg-primary/10 text-primary border-primary/30 font-bold text-xs uppercase px-3 py-1">
            Frequently Asked Questions
          </Badge>
          <h3 className="font-headline text-2xl sm:text-3xl font-extrabold text-foreground">
            Student FAQs for {campus.shortName} Accommodations
          </h3>
        </div>

        <div className="space-y-4">
          {campus.faqs.map((faq, idx) => (
            <Card key={idx} className="border bg-card">
              <CardContent className="p-5 space-y-2">
                <h4 className="font-headline font-bold text-sm sm:text-base text-foreground flex items-start gap-2">
                  <HelpCircle className="h-4 w-4 text-primary shrink-0 mt-1" />
                  <span>{faq.question}</span>
                </h4>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed pl-6">
                  {faq.answer}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Cross-Link Other Campus Topic Clusters (Low Crawl Depth) */}
      <section className="bg-secondary/30 py-12 px-4 border-t">
        <div className="container max-w-6xl mx-auto space-y-6">
          <h4 className="font-headline font-bold text-base text-foreground">
            Explore Other College Campus Hubs in Delhi NCR:
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {otherCampuses.map((other) => (
              <Link 
                key={other.slug}
                href={`/campuses/${other.slug}`}
                className="p-4 rounded-2xl bg-card border hover:border-primary/50 transition-all shadow-sm hover:shadow-md group flex flex-col justify-between space-y-2"
              >
                <div>
                  <div className="font-headline font-bold text-sm text-foreground group-hover:text-primary transition-colors flex items-center justify-between">
                    <span>{other.shortName}</span>
                    <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1 truncate">
                    {other.locality}
                  </p>
                </div>
                <div className="text-[10px] font-mono text-primary font-bold">
                  {other.avgRent.split(' ')[0]} /mo
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
