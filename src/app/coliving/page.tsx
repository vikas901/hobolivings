import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { CITY_PILLARS, getAllCityPillarSlugs } from '@/lib/city-data';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Building2, 
  MapPin, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Home, 
  Users, 
  Wifi, 
  Utensils, 
  Zap 
} from 'lucide-react';
import { buildBreadcrumbSchema, buildFAQSchema } from '@/lib/seo/schema-builder';
import Header from '@/components/header';
import Footer from '@/components/footer';
import DpiitCertificateModal from '@/components/dpiit-certificate-modal';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.hoboliving.in';

export const metadata: Metadata = {
  title: 'Co-Living Spaces & Verified Student Hostels Across India (₹0 Brokerage) | Hobo Livings',
  description: 'Explore verified co-living spaces, student hostels, and premium PGs in Greater Noida, Noida, and Bangalore. AC rooms, 3 fresh meals, high-speed Wi-Fi, and 100% zero brokerage.',
  alternates: {
    canonical: `${SITE_URL}/coliving`,
  },
  openGraph: {
    title: 'Co-Living Spaces & Student Hostels Across India | Hobo Livings',
    description: 'Find verified, zero-brokerage student housing and co-living spaces near major universities and IT corridors in Greater Noida, Noida, and Bangalore.',
    url: `${SITE_URL}/coliving`,
    siteName: 'Hobo Livings',
    type: 'website',
  },
};

const colivingFaqs = [
  {
    question: 'What is included in a Hobo Livings co-living accommodation?',
    answer: 'Most co-living spaces include fully furnished rooms (AC/Non-AC), high-speed Wi-Fi, 3 fresh hygienic meals daily, laundry services, professional housekeeping, and 24/7 biometric security with generator power backup.'
  },
  {
    question: 'Does Hobo Livings charge any brokerage or agent commission?',
    answer: 'No. Hobo Livings operates on a strict 100% zero brokerage policy for all tenants and students. Scheduling physical site visits and 48-hour bed holds are completely free.'
  },
  {
    question: 'Which cities are currently available on Hobo Livings?',
    answer: 'Hobo Livings currently offers verified accommodations in Greater Noida (Knowledge Park & Pari Chowk), Noida (Sector 62 & Sector 125 Amity), and Bangalore (HSR Layout, Koramangala, Whitefield).'
  }
];

export default function ColivingIndexPage() {
  const cities = Object.values(CITY_PILLARS);

  const breadcrumbJsonLd = buildBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Co-Living Cities', url: '/coliving' },
  ]);

  const faqJsonLd = buildFAQSchema(colivingFaqs);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-primary/10 via-background to-background py-16 md:py-24 border-b">
          <div className="container px-4 max-w-6xl mx-auto text-center space-y-6">
            <div className="flex justify-center pb-2">
              <DpiitCertificateModal variant="badge" />
            </div>

            <h1 className="font-headline text-4xl md:text-6xl font-extrabold tracking-tight">
              Find Verified PGs & Hostels <br />
              <span className="bg-gradient-to-r from-rose-500 via-primary to-pink-600 bg-clip-text text-transparent">
                by City (₹0 Brokerage)
              </span>
            </h1>

            <p className="text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
              Browse physically verified student hostels, luxury PGs, and executive co-living spaces with transparent pricing, walking distances to college gates, and instant visit passes.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Badge variant="outline" className="px-4 py-1.5 text-sm bg-background/80 shadow-xs border-primary/20">
                ✓ 100% Zero Brokerage
              </Badge>
              <Badge variant="outline" className="px-4 py-1.5 text-sm bg-background/80 shadow-xs border-primary/20">
                ✓ 48-Hour Zero-Cost Bed Hold
              </Badge>
              <Badge variant="outline" className="px-4 py-1.5 text-sm bg-background/80 shadow-xs border-primary/20">
                ✓ Free Guided Physical Visits
              </Badge>
            </div>

            {/* Contextual cross-link to Student Advice */}
            <div className="pt-2">
              <Link 
                href="/guides" 
                className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold text-primary bg-primary/10 hover:bg-primary/20 border border-primary/30 px-4 py-2 rounded-full transition-all"
              >
                <span>💡 Looking for cost breakdowns & mess reviews? Read Student Living Guides →</span>
              </Link>
            </div>
          </div>
        </section>

        {/* City Pillars Grid */}
        <section className="py-16 container px-4 max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="font-headline text-3xl font-bold">Select Your City to Explore Rooms</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Choose your city to view neighborhood rent comparison tables, walking distance campus clusters, and available verified listings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {cities.map((city) => (
              <Card key={city.slug} className="group overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col border-muted hover:border-primary/40">
                <div className="relative h-56 w-full overflow-hidden bg-muted">
                  <Image
                    src={city.heroImage}
                    alt={`${city.name} Co-Living & Student Hostels`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <Badge className="mb-2 bg-primary text-white border-none font-semibold">
                      {city.totalProperties}
                    </Badge>
                    <h3 className="font-headline text-2xl font-bold leading-tight drop-shadow-md">
                      {city.name}
                    </h3>
                    <p className="text-xs text-white/90 font-medium">Starts from {city.startingRent}</p>
                  </div>
                </div>

                <CardContent className="p-6 flex-grow flex flex-col justify-between space-y-6">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {city.zeroClickSummary}
                  </p>

                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-foreground uppercase tracking-wider">Top Localities & Hubs:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {city.localities.slice(0, 3).map((loc) => (
                        <span key={loc.name} className="text-[11px] bg-secondary px-2.5 py-1 rounded-full text-secondary-foreground font-medium">
                          {loc.name.split('(')[0]}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Link href={`/coliving/${city.slug}`} className="w-full">
                    <Button className="w-full font-semibold group-hover:gap-3 transition-all">
                      Explore {city.name} <ArrowRight className="h-4 w-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Why Co-Living Section */}
        <section className="py-16 bg-muted/40 border-y">
          <div className="container px-4 max-w-6xl mx-auto space-y-12">
            <div className="text-center space-y-3">
              <h2 className="font-headline text-3xl font-bold">Why Choose Hobo Livings Co-Living?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Built specifically to solve the biggest challenges in student and young professional housing.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="p-6 text-center space-y-3 bg-background border shadow-xs">
                <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-base">₹0 Brokerage Guarantee</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Never pay 1 month of hard-earned rent to brokers. All properties on Hobo Livings are direct and commission-free.
                </p>
              </Card>

              <Card className="p-6 text-center space-y-3 bg-background border shadow-xs">
                <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
                  <Utensils className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-base">3 Nutritious Meals</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Fresh, hygienic, home-style meals with breakfast, lunch, and dinner prepared daily by professional kitchen staff.
                </p>
              </Card>

              <Card className="p-6 text-center space-y-3 bg-background border shadow-xs">
                <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
                  <Wifi className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-base">High-Speed Fiber</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Dual-band commercial Wi-Fi with 24/7 power backup generator, built for coding, studying, and remote work.
                </p>
              </Card>

              <Card className="p-6 text-center space-y-3 bg-background border shadow-xs">
                <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-base">Instant Visit Pass</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Schedule physical visits online and get instant caretaker contact and Google Maps directions on your phone.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-16 container px-4 max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <h2 className="font-headline text-3xl font-bold">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">Everything you need to know about co-living on Hobo Livings.</p>
          </div>

          <div className="space-y-4">
            {colivingFaqs.map((faq, index) => (
              <Card key={index} className="p-6 shadow-xs">
                <h3 className="font-semibold text-base mb-2 text-foreground">{faq.question}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
