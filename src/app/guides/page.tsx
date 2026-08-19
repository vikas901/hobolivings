import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { GUIDES_DATA } from '@/lib/guides-data';
import { buildBreadcrumbSchema, buildArticleSchema } from '@/lib/seo/schema-builder';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Sparkles, ArrowRight, ShieldCheck, CheckCircle2, ChevronRight } from 'lucide-react';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.hoboliving.in';

export const metadata: Metadata = {
  title: 'Student Living & Housing Guides (2026 Edition) | Hobo Livings',
  description: 'Expert student guides for Greater Noida & Noida. Comprehensive cost breakdowns, hostel mess reviews, Aqua Line commute guides, and student tenant rights.',
  alternates: {
    canonical: `${SITE_URL}/guides`,
  },
  openGraph: {
    title: 'Student Living & Housing Guides | Hobo Livings',
    description: 'Expert research, rent breakdowns, and hostel guides for college students in Greater Noida & Noida.',
    url: `${SITE_URL}/guides`,
    images: ['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=1200'],
  },
};

export default function GuidesIndexPage() {
  const guidesList = Object.values(GUIDES_DATA);
  const pillarGuide = GUIDES_DATA['student-housing-guide'];
  const clusterGuides = guidesList.filter((g) => !g.isPillar);

  const breadcrumbJsonLd = buildBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Student Living Guides', url: '/guides' },
  ]);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Header />

      {/* Breadcrumb Navigation */}
      <nav className="bg-secondary/30 border-b py-2.5 px-4 text-xs font-medium text-muted-foreground" aria-label="Breadcrumb">
        <div className="container max-w-6xl mx-auto flex items-center gap-1.5 flex-wrap">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground font-semibold">Student Guides</span>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-secondary/40 via-background to-background py-14 px-4 border-b">
        <div className="container max-w-6xl mx-auto text-center space-y-4">
          <Badge className="bg-primary/10 text-primary border-primary/30 font-bold text-xs uppercase px-3 py-1">
            📚 Student Housing Knowledge Hub (2026)
          </Badge>
          <h1 className="font-headline text-3xl sm:text-5xl font-black text-foreground tracking-tight max-w-3xl mx-auto">
            Everything You Need to Know About Student Living in NCR
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Data-backed research, cost breakdowns, mess food hygiene standards, and tenant legal protections published by the Hobo Livings research team.
          </p>
        </div>
      </section>

      {/* Featured Pillar Guide Banner */}
      {pillarGuide && (
        <section className="py-10 px-4 container max-w-6xl mx-auto">
          <div className="rounded-3xl border-2 border-primary/30 bg-gradient-to-br from-primary/5 via-card to-orange-500/5 p-6 sm:p-8 shadow-md">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center gap-2">
                  <Badge className="bg-primary text-primary-foreground font-bold text-xs">
                    ⭐ Core Pillar Guide
                  </Badge>
                  <span className="text-xs text-muted-foreground font-medium">
                    {pillarGuide.readTime} • Updated {pillarGuide.updatedDate}
                  </span>
                </div>

                <h2 className="font-headline text-2xl sm:text-4xl font-extrabold text-foreground leading-tight">
                  <Link href={`/guides/${pillarGuide.slug}`} className="hover:text-primary transition-colors">
                    {pillarGuide.title}
                  </Link>
                </h2>

                <p className="text-sm text-muted-foreground leading-relaxed">
                  {pillarGuide.metaDescription}
                </p>

                <div className="flex flex-wrap gap-2 pt-2">
                  {pillarGuide.keyTakeaways.slice(0, 2).map((takeaway, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-xs text-foreground/80 bg-background/80 px-3 py-1.5 rounded-full border">
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span>{takeaway}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-3">
                  <Button asChild className="font-bold shadow-md">
                    <Link href={`/guides/${pillarGuide.slug}`}>
                      Read Complete Pillar Guide <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="lg:col-span-5 relative h-64 sm:h-72 w-full rounded-2xl overflow-hidden shadow-inner border">
                <Image
                  src={pillarGuide.heroImage}
                  alt={pillarGuide.title}
                  fill
                  className="object-cover"
                />
              </div>

            </div>
          </div>
        </section>
      )}

      {/* Cluster Subtopic Guides Grid */}
      <section className="py-12 px-4 container max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-4">
          <div>
            <h2 className="font-headline text-2xl sm:text-3xl font-extrabold text-foreground">
              Deep-Dive Topic Guides
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Explore specialized guides across food, transit, legal rights, and budgeting.
            </p>
          </div>
          <Badge variant="outline" className="text-xs font-semibold text-primary w-fit">
            5 In-Depth Subtopics
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clusterGuides.map((guide) => (
            <Card key={guide.slug} className="overflow-hidden border bg-card hover:border-primary/50 transition-all shadow-xs hover:shadow-md group flex flex-col justify-between">
              
              <div className="relative h-44 w-full bg-muted overflow-hidden">
                <Image
                  src={guide.heroImage}
                  alt={guide.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3">
                  <Badge className="bg-background/90 text-foreground backdrop-blur text-[10px] font-bold">
                    {guide.category}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="text-[11px] text-muted-foreground font-medium">
                    ⏱️ {guide.readTime} • Updated {guide.updatedDate}
                  </div>
                  <h3 className="font-headline font-bold text-base text-foreground group-hover:text-primary transition-colors leading-snug">
                    <Link href={`/guides/${guide.slug}`}>
                      {guide.title}
                    </Link>
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                    {guide.metaDescription}
                  </p>
                </div>

                <div className="pt-2 border-t flex items-center justify-between">
                  <span className="text-xs font-bold text-primary group-hover:underline inline-flex items-center gap-1">
                    Read Guide <ArrowRight className="h-3 w-3" />
                  </span>
                  <span title="Verified Article">
                    <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  </span>
                </div>
              </CardContent>

            </Card>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
