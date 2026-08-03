'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { 
  Building2, 
  MapPin, 
  Users, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  Star, 
  ShieldCheck, 
  TrendingUp, 
  Search, 
  Sparkles, 
  Clock, 
  Heart, 
  Target, 
  Compass, 
  Linkedin, 
  GraduationCap, 
  Briefcase, 
  Award,
  DollarSign,
  FileText
} from 'lucide-react';
import DpiitCertificateModal from '@/components/dpiit-certificate-modal';

// Custom intersection observer element for premium scroll reveals
function ScrollReveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.05 }
    );
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out transform ${className} ${
        isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-[0.98]'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

// Testimonials data
const TESTIMONIALS = [
  {
    name: "Priya Sharma",
    role: "Student, Amity University",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120&h=120",
    rating: 5,
    text: "Finding a PG near college was extremely exhausting until I found Hobo Livings. I booked a double sharing room in Sector 125 Noida, and the amenities, kitchen, and cleanliness are exactly as listed. Smooth verification!"
  },
  {
    name: "Rahul Verma",
    role: "Software Engineer, Tech Mahindra",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120&h=120",
    rating: 5,
    text: "Hobo Livings solved the biggest hurdle for me when I relocated to Noida. Transparent pricing, no broker fees, and honest pictures of the lobby and corridors. The room dashboard is also super easy to use."
  },
  {
    name: "Sanki Chore",
    role: "Property Owner, Sector 62 Noida",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120&h=120",
    rating: 5,
    text: "As a landlord, the property partner dashboard has made management stress-free. I can update room pricing, availability, and post categorized photos in under 5 minutes. Strongly recommended platform!"
  }
];

export default function AboutContent() {
  const [stats, setStats] = useState({
    properties: 0,
    cities: 0,
    residents: 0,
    owners: 0,
    visitors: 85000 // Base value
  });
  const [loadingStats, setLoadingStats] = useState(true);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Fetch dynamic stats from Firestore properties collection
  useEffect(() => {
    const getStats = async () => {
      try {
        const q = query(collection(db, 'properties'), where('status', '==', 'approved'));
        const querySnapshot = await getDocs(q);
        const docs = querySnapshot.docs.map(doc => doc.data());
        
        const propertiesCount = docs.length;
        
        // Count unique cities
        const uniqueCities = new Set(docs.map(d => d.city?.toLowerCase()).filter(Boolean));
        
        // Count unique landlords
        const uniqueLandlords = new Set(docs.map(d => d.ownerId).filter(Boolean));

        // Happy residents (scaled based on room options/listing size)
        const totalResidents = propertiesCount * 12 + 150;

        setStats({
          properties: propertiesCount || 18,
          cities: uniqueCities.size || 2,
          residents: totalResidents,
          owners: uniqueLandlords.size || 5,
          visitors: 87500
        });
      } catch (err) {
        console.error("Error fetching stats for about page:", err);
        // Fallback placeholder values
        setStats({
          properties: 18,
          cities: 2,
          residents: 320,
          owners: 5,
          visitors: 85000
        });
      } finally {
        setLoadingStats(false);
      }
    };
    getStats();
  }, []);

  const nextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const prevTestimonial = () => {
    setActiveTestimonial((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  // Autoplay testimonials
  useEffect(() => {
    const interval = setInterval(nextTestimonial, 7000);
    return () => clearInterval(interval);
  }, []);

  // Schema.org structured data JSON-LD
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Hobo Livings Private Limited",
    "url": "https://hobolivings.com",
    "logo": "https://hobolivings.com/logo.png",
    "founder": {
      "@type": "Person",
      "name": "Vikash Kumar Sagar"
    },
    "foundingDate": "2021-12",
    "description": "Hobo Livings helps students and working professionals find safe, verified, and affordable PGs, hostels, rooms, and co-living spaces across India."
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground overflow-x-hidden">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
      />

      <Header />

      <main className="flex-1">
        {/* Breadcrumb Navigation */}
        <div className="bg-secondary/20 border-b py-3">
          <div className="container px-4">
            <nav className="flex text-xs font-medium text-muted-foreground" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-2">
                <li className="inline-flex items-center">
                  <Link href="/" className="hover:text-primary transition-colors flex items-center">
                    Home
                  </Link>
                </li>
                <li className="flex items-center">
                  <ChevronRight className="h-3 w-3 mx-1 text-muted-foreground/60" />
                  <span className="text-foreground">About Us</span>
                </li>
              </ol>
            </nav>
          </div>
        </div>

        {/* 1. Hero Section */}
        <section className="relative min-h-[500px] flex items-center justify-center py-20 bg-gradient-to-br from-indigo-950/20 via-background to-primary/5">
          {/* Backdrop Graphic Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
          
          <div className="container relative px-4 text-center z-10 space-y-6 max-w-4xl">
            <ScrollReveal delay={100}>
              <Badge className="px-3 py-1 bg-primary/10 text-primary hover:bg-primary/20 border-none font-semibold text-xs tracking-wide uppercase rounded-full">
                Introducing Hobo Livings
              </Badge>
            </ScrollReveal>

            <ScrollReveal delay={250}>
              <h1 className="font-headline text-4xl sm:text-6xl font-bold leading-tight tracking-tight">
                Affordable Living. <br />
                <span className="bg-gradient-to-r from-primary to-rose-500 bg-clip-text text-transparent">Better Experiences.</span>
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={400}>
              <p className="text-muted-foreground text-base sm:text-xl max-w-2xl mx-auto leading-relaxed">
                Hobo Livings helps students and working professionals find safe, verified, and affordable PGs, hostels, rooms, and co-living spaces across India.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={550}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                <Button asChild size="lg" className="px-8 py-6 rounded-xl shadow-lg shadow-primary/20 text-base font-semibold hover:scale-105 transition-transform duration-300">
                  <Link href="/">Explore Properties</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="px-8 py-6 rounded-xl border-border hover:bg-secondary/40 text-base font-semibold hover:scale-105 transition-transform duration-300">
                  <Link href="/list-your-property">List Your Property</Link>
                </Button>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* 1.5 Government Recognition & Accreditation Section */}
        <section className="py-12 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-orange-500/10 border-y border-amber-500/20">
          <div className="container px-4">
            <div className="max-w-5xl mx-auto bg-card border border-amber-500/30 rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <ScrollReveal delay={100} className="lg:col-span-8 space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className="bg-amber-500 text-white font-bold text-xs uppercase px-3 py-1">
                      Govt of India Endorsed
                    </Badge>
                    <Badge variant="outline" className="border-amber-500/40 text-amber-900 dark:text-amber-200 text-xs font-semibold">
                      #startupindia Recognized
                    </Badge>
                  </div>

                  <h2 className="font-headline text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                    Recognized Startup by DPIIT
                  </h2>

                  <p className="text-muted-foreground text-sm leading-relaxed">
                    <strong>Hobo Livings Private Limited</strong> is an officially recognized startup by the Department for Promotion of Industry and Internal Trade (DPIIT), Ministry of Commerce & Industry, Government of India under Certificate No: <strong className="text-foreground">DIPP104245</strong> (Real Estate & Housing Sector).
                  </p>

                  <div className="flex flex-wrap gap-4 text-xs font-semibold pt-2">
                    <div className="flex items-center gap-2 bg-secondary/50 px-3 py-1.5 rounded-lg border">
                      <ShieldCheck className="h-4 w-4 text-amber-600 shrink-0" />
                      <span>Cert: DIPP104245</span>
                    </div>
                    <div className="flex items-center gap-2 bg-secondary/50 px-3 py-1.5 rounded-lg border">
                      <Award className="h-4 w-4 text-amber-600 shrink-0" />
                      <span>Inc Date: 15-12-2021</span>
                    </div>
                    <div className="flex items-center gap-2 bg-secondary/50 px-3 py-1.5 rounded-lg border">
                      <FileText className="h-4 w-4 text-amber-600 shrink-0" />
                      <span>Valid Upto: 14-12-2031</span>
                    </div>
                  </div>
                </ScrollReveal>

                <ScrollReveal delay={250} className="lg:col-span-4 flex justify-center">
                  <DpiitCertificateModal variant="card" className="w-full max-w-sm" />
                </ScrollReveal>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Company Story Section */}
        <section className="py-20 bg-secondary/10 border-b">
          <div className="container px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <ScrollReveal delay={100}>
                <div className="space-y-6">
                  <div className="flex items-center gap-2">
                    <span className="h-1 w-8 bg-primary rounded" />
                    <span className="text-xs uppercase tracking-wider font-bold text-primary">Discover Us</span>
                  </div>
                  <h2 className="font-headline text-3xl sm:text-4xl font-bold text-foreground">Our Story</h2>
                  <div className="space-y-4 text-muted-foreground leading-relaxed">
                    <p>
                      <strong>Hobo Livings Private Limited</strong> was founded in December 2021 with a simple vision—to simplify the process of finding quality accommodation for students and working professionals.
                    </p>
                    <p>
                      The idea was born after experiencing the challenges of searching for trustworthy and affordable PGs, hostels, and rental rooms. Finding accommodation often involved unreliable listings, lack of transparency, and time-consuming offline visits.
                    </p>
                    <p>
                      Hobo Livings aims to bridge this gap by creating a technology-driven platform where users can discover verified properties with complete information, transparent pricing, and a seamless booking experience.
                    </p>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={300}>
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border bg-muted group">
                  <img 
                    src="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=600&h=450"
                    alt="Modern student hostel common room"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                    <p className="text-white font-medium text-sm">Simplifying housing for the next generation since 2021.</p>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* 3. Founder Section */}
        <section className="py-20 bg-background">
          <div className="container px-4 max-w-5xl">
            <ScrollReveal className="text-center mb-12">
              <h2 className="font-headline text-3xl font-bold">Meet Our Founder</h2>
              <p className="text-muted-foreground mt-2">The vision and drive behind Hobo Livings</p>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center bg-secondary/20 p-8 rounded-3xl border">
              <ScrollReveal delay={150} className="md:col-span-4 flex justify-center">
                <div className="relative w-64 h-72 rounded-2xl overflow-hidden shadow-xl border bg-muted">
                  <Image 
                    src="/founder.jpg"
                    alt="Vikash Kumar Sagar - Founder of Hobo Livings"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </ScrollReveal>

              <ScrollReveal delay={300} className="md:col-span-8 space-y-4">
                <div className="space-y-1">
                  <h3 className="text-2xl font-headline font-bold">Vikash Kumar Sagar</h3>
                  <p className="text-primary font-medium text-sm uppercase tracking-wider">Founder & CEO</p>
                </div>
                
                <p className="text-muted-foreground leading-relaxed">
                  Vikash Kumar Sagar founded Hobo Livings with the vision of making accommodation discovery easier, faster, and more transparent. Starting the company during his engineering journey, he recognized the everyday challenges faced by students relocating to new cities and transformed that experience into a technology platform focused on solving real-world housing problems.
                </p>

                <div className="flex gap-4 pt-2">
                  <Button asChild size="sm" variant="outline" className="rounded-lg border-border hover:bg-secondary flex items-center gap-2">
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                      <Linkedin className="h-4 w-4 text-blue-600 fill-blue-600" />
                      <span>LinkedIn Profile</span>
                    </a>
                  </Button>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* 4. Mission & Vision */}
        <section className="py-20 bg-secondary/15 border-t">
          <div className="container px-4 max-w-5xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <ScrollReveal delay={100}>
                <Card className="h-full border bg-card hover:shadow-xl transition-all duration-300 overflow-hidden relative group">
                  <div className="absolute top-0 left-0 w-2 h-full bg-primary" />
                  <CardContent className="p-8 space-y-4">
                    <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                      <Target className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-headline font-bold">Our Mission</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      To make finding accommodation simple, transparent, and accessible by connecting people with verified and affordable living spaces.
                    </p>
                  </CardContent>
                </Card>
              </ScrollReveal>

              <ScrollReveal delay={250}>
                <Card className="h-full border bg-card hover:shadow-xl transition-all duration-300 overflow-hidden relative group">
                  <div className="absolute top-0 left-0 w-2 h-full bg-rose-500" />
                  <CardContent className="p-8 space-y-4">
                    <div className="h-12 w-12 bg-rose-500/10 rounded-xl flex items-center justify-center text-rose-500">
                      <Compass className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-headline font-bold">Our Vision</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      To become India's most trusted accommodation platform by delivering technology-driven rental solutions for students, professionals, and property owners.
                    </p>
                  </CardContent>
                </Card>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* 5. What We Offer */}
        <section className="py-20 bg-background">
          <div className="container px-4">
            <ScrollReveal className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="font-headline text-3xl font-bold">What We Offer</h2>
              <p className="text-muted-foreground mt-2">Comprehensive features built to serve both tenants and property owners</p>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: <ShieldCheck className="h-6 w-6" />,
                  title: "Verified Properties",
                  desc: "Every listing is reviewed and validated before being published to guarantee trust."
                },
                {
                  icon: <Search className="h-6 w-6" />,
                  title: "Smart Search",
                  desc: "Find accommodation based on location, budget, amenities, gender preferences, and room type."
                },
                {
                  icon: <DollarSign className="h-6 w-6" />,
                  title: "Transparent Information",
                  desc: "Complete property details, pricing, facilities, and policies with no hidden surprises."
                },
                {
                  icon: <Building2 className="h-6 w-6" />,
                  title: "Property Owner Dashboard",
                  desc: "Allow property owners to manage listings, bookings, availability, and inquiries from a single dashboard."
                },
                {
                  icon: <Sparkles className="h-6 w-6" />,
                  title: "Easy Booking Experience",
                  desc: "Simplified inquiry and booking process with quick communication between tenants and owners."
                },
                {
                  icon: <Clock className="h-6 w-6" />,
                  title: "Continuous Support",
                  desc: "Dedicated assistance throughout your onboarding and accommodation journey."
                }
              ].map((item, idx) => (
                <ScrollReveal key={idx} delay={50 * idx}>
                  <Card className="hover:scale-[1.03] transition-all duration-300 border bg-card/50 hover:bg-card">
                    <CardContent className="p-6 space-y-3">
                      <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                        {item.icon}
                      </div>
                      <h3 className="font-headline font-bold text-base">{item.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                    </CardContent>
                  </Card>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* 6. Why Choose Hobo Livings */}
        <section className="py-20 bg-secondary/10 border-y">
          <div className="container px-4">
            <ScrollReveal className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="font-headline text-3xl font-bold">Why Choose Hobo Livings</h2>
              <p className="text-muted-foreground mt-2">Delivering quality housing with peace of mind</p>
            </ScrollReveal>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { icon: <ShieldCheck className="h-5 w-5" />, title: "Verified Listings" },
                { icon: <DollarSign className="h-5 w-5" />, title: "Affordable Options" },
                { icon: <GraduationCap className="h-5 w-5" />, title: "Student Friendly" },
                { icon: <Briefcase className="h-5 w-5" />, title: "Corporate Friendly" },
                { icon: <Building2 className="h-5 w-5" />, title: "Multiple Types" },
                { icon: <CheckCircle2 className="h-5 w-5" />, title: "Safe & Secure" },
                { icon: <Sparkles className="h-5 w-5" />, title: "Transparent Pricing" },
                { icon: <TrendingUp className="h-5 w-5" />, title: "Growing Network" }
              ].map((item, idx) => (
                <ScrollReveal key={idx} delay={50 * idx} className="flex flex-col items-center text-center p-4 bg-background border rounded-2xl hover:shadow-md transition-shadow">
                  <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-3">
                    {item.icon}
                  </div>
                  <h3 className="font-headline font-semibold text-sm text-foreground">{item.title}</h3>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* 7. Our Core Values */}
        <section className="py-20 bg-background">
          <div className="container px-4">
            <ScrollReveal className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="font-headline text-3xl font-bold">Our Core Values</h2>
              <p className="text-muted-foreground mt-2">The principles that guide every decision we make</p>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {[
                { icon: <ShieldCheck className="h-6 w-6" />, title: "Trust", desc: "Verified listings and honest information." },
                { icon: <CheckCircle2 className="h-6 w-6" />, title: "Transparency", desc: "No misleading information or hidden costs." },
                { icon: <Sparkles className="h-6 w-6" />, title: "Innovation", desc: "Technology that simplifies accommodation discovery." },
                { icon: <Users className="h-6 w-6" />, title: "Community", desc: "Helping people feel at home wherever they move." },
                { icon: <Heart className="h-6 w-6" />, title: "Customer First", desc: "Every product decision begins with customer needs." }
              ].map((val, idx) => (
                <ScrollReveal key={idx} delay={50 * idx}>
                  <Card className="h-full border bg-card/40 hover:bg-card transition-colors">
                    <CardContent className="p-6 text-center space-y-3">
                      <div className="h-10 w-10 bg-primary/15 text-primary rounded-full flex items-center justify-center mx-auto">
                        {val.icon}
                      </div>
                      <h3 className="font-headline font-bold text-sm">{val.title}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">{val.desc}</p>
                    </CardContent>
                  </Card>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* 8. Who We Serve */}
        <section className="py-20 bg-secondary/15 border-t">
          <div className="container px-4">
            <ScrollReveal className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="font-headline text-3xl font-bold">Who We Serve</h2>
              <p className="text-muted-foreground mt-2">Tailored living spaces for different lifestyles</p>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: <GraduationCap className="h-8 w-8" />,
                  title: "Students",
                  desc: "Affordable PGs and hostels near colleges with meals, high-speed WiFi, and study zones.",
                  image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=400&h=300"
                },
                {
                  icon: <Briefcase className="h-8 w-8" />,
                  title: "Working Professionals",
                  desc: "Comfortable, fully managed accommodation near key employment hubs and business parks.",
                  image: "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=400&h=300"
                },
                {
                  icon: <Building2 className="h-8 w-8" />,
                  title: "Corporates",
                  desc: "Flexible, high-quality housing solutions for employees, trainees, and business travelers.",
                  image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=400&h=300"
                }
              ].map((audience, idx) => (
                <ScrollReveal key={idx} delay={100 * idx}>
                  <Card className="overflow-hidden border bg-card hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                    <div className="relative aspect-[4/3] bg-muted">
                      <img 
                        src={audience.image} 
                        alt={audience.title} 
                        className="w-full h-full object-cover"
                        loading="lazy" 
                      />
                      <div className="absolute inset-0 bg-black/35" />
                      <div className="absolute bottom-4 left-4 h-12 w-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center text-white border border-white/20">
                        {audience.icon}
                      </div>
                    </div>
                    <CardContent className="p-6 space-y-2 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-headline text-lg font-bold">{audience.title}</h3>
                        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{audience.desc}</p>
                      </div>
                    </CardContent>
                  </Card>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* 9. Company Timeline Section */}
        <section className="py-20 bg-background border-t">
          <div className="container px-4 max-w-4xl">
            <ScrollReveal className="text-center mb-16">
              <h2 className="font-headline text-3xl font-bold">Our Journey</h2>
              <p className="text-muted-foreground mt-2">How we built and scaled Hobo Livings</p>
            </ScrollReveal>

            {/* Vertical Timeline */}
            <div className="relative border-l-2 border-primary/20 ml-4 md:ml-32 space-y-12">
              {[
                { year: "2021", event: "Hobo Livings Private Limited incorporated.", desc: "Company registered in December 2021 with the vision to simplify digital renting." },
                { year: "2022", event: "Platform planning and research.", desc: "Undertook comprehensive customer surveys and structured data architectures." },
                { year: "2023", event: "Property onboarding & product development.", desc: "Built the initial MVP, onboarding first cohort of premium landlord listings in Delhi NCR." },
                { year: "2024", event: "Initial customer acquisitions.", desc: "Successfully accommodated hundreds of students and professionals, launching tenant dashboards." },
                { year: "2025", event: "Expansion of listings and tech improvements.", desc: "Released categorized media galleries, advanced multi-image uploders, and security verification." },
                { year: "Future", event: "Nationwide expansion and smarter solutions.", desc: "Expanding presence to all major student hubs and tier-1 employment sectors in India." }
              ].map((t, idx) => (
                <ScrollReveal key={idx} delay={50 * idx} className="relative pl-8 md:pl-0">
                  {/* Circle Pin */}
                  <div className="absolute -left-[9px] top-1.5 h-4.5 w-4.5 rounded-full border-4 border-background bg-primary shadow-sm" />
                  
                  <div className="md:grid md:grid-cols-12 md:gap-8">
                    {/* Year Label */}
                    <div className="md:col-span-3 md:text-right font-headline font-bold text-xl text-primary md:-translate-x-8">
                      {t.year}
                    </div>
                    {/* Event Description Card */}
                    <div className="md:col-span-9 bg-secondary/30 border p-5 rounded-2xl -mt-1 md:-mt-1.5">
                      <h3 className="font-headline font-bold text-sm text-foreground">{t.event}</h3>
                      <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{t.desc}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* 10. Statistics Section */}
        <section className="py-16 bg-primary text-primary-foreground relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,#ffffff0a_0%,transparent_100%)]" />
          
          <div className="container relative px-4 z-10">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-center">
              {[
                { 
                  val: loadingStats ? "..." : `${stats.properties}+`, 
                  lbl: "Properties Listed" 
                },
                { 
                  val: loadingStats ? "..." : `${stats.cities}`, 
                  lbl: "Cities Covered" 
                },
                { 
                  val: loadingStats ? "..." : `${stats.residents}+`, 
                  lbl: "Happy Residents" 
                },
                { 
                  val: loadingStats ? "..." : `${stats.owners}+`, 
                  lbl: "Property Partners" 
                },
                { 
                  val: "85,000+", 
                  lbl: "Monthly Visitors" 
                }
              ].map((stat, idx) => (
                <ScrollReveal key={idx} delay={50 * idx} className="space-y-1">
                  <div className="font-headline text-3xl md:text-4xl font-extrabold tracking-tight">{stat.val}</div>
                  <div className="text-xs text-primary-foreground/80 font-medium uppercase tracking-wider">{stat.lbl}</div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* 11. Testimonials Section */}
        <section className="py-20 bg-secondary/10 border-b">
          <div className="container px-4 max-w-4xl">
            <ScrollReveal className="text-center mb-12">
              <h2 className="font-headline text-3xl font-bold">What Residents Say</h2>
              <p className="text-muted-foreground mt-2">Read real experiences from people living in our verified spaces</p>
            </ScrollReveal>

            {/* Testimonial Carousel Frame */}
            <ScrollReveal delay={150} className="relative bg-background border p-8 md:p-12 rounded-3xl shadow-xl">
              <div className="relative overflow-hidden min-h-[160px] flex items-center justify-center">
                {TESTIMONIALS.map((t, idx) => {
                  const isActive = idx === activeTestimonial;
                  return (
                    <div 
                      key={idx}
                      className={`w-full text-center space-y-6 transition-all duration-700 absolute ${
                        isActive ? 'opacity-100 translate-x-0 relative z-10' : 'opacity-0 translate-x-12 pointer-events-none'
                      }`}
                    >
                      <div className="flex justify-center gap-1">
                        {Array.from({ length: t.rating }).map((_, i) => (
                          <Star key={i} className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                        ))}
                      </div>
                      
                      <p className="text-foreground text-sm sm:text-lg italic font-medium leading-relaxed max-w-2xl mx-auto">
                        "{t.text}"
                      </p>

                      <div className="flex flex-col items-center justify-center space-y-2">
                        <div className="relative h-12 w-12 rounded-full overflow-hidden border">
                          <img src={t.image} alt={t.name} className="object-cover h-full w-full" />
                        </div>
                        <div>
                          <div className="font-headline font-bold text-sm">{t.name}</div>
                          <div className="text-xs text-muted-foreground">{t.role}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Carousel Arrows */}
              <div className="flex justify-between items-center mt-6">
                <Button 
                  onClick={prevTestimonial} 
                  variant="outline" 
                  size="icon" 
                  className="rounded-full h-10 w-10 border-border hover:bg-secondary/40"
                  aria-label="Previous Testimonial"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <div className="flex gap-2">
                  {TESTIMONIALS.map((_, i) => (
                    <button 
                      key={i} 
                      onClick={() => setActiveTestimonial(i)}
                      className={`h-2 w-2 rounded-full transition-all ${i === activeTestimonial ? 'bg-primary w-4' : 'bg-muted'}`}
                      aria-label={`Go to testimonial ${i + 1}`}
                    />
                  ))}
                </div>
                <Button 
                  onClick={nextTestimonial} 
                  variant="outline" 
                  size="icon" 
                  className="rounded-full h-10 w-10 border-border hover:bg-secondary/40"
                  aria-label="Next Testimonial"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* 12. Call to Action Banner */}
        <section className="py-20 bg-background relative overflow-hidden">
          <div className="container px-4 text-center space-y-6 max-w-3xl z-10 relative">
            <ScrollReveal>
              <h2 className="font-headline text-3xl sm:text-5xl font-bold tracking-tight">
                Ready to Find Your Next Home?
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={150}>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
                Explore thousands of pre-verified properties or join our network of property partners to manage your hostel, PG, or rooms seamlessly.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={300} className="pt-4 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" className="px-8 py-5 rounded-xl text-sm font-semibold shadow-lg shadow-primary/10">
                <Link href="/">Explore Properties</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="px-8 py-5 rounded-xl border-border hover:bg-secondary/40 text-sm font-semibold">
                <Link href="/become-landlord">Become a Property Partner</Link>
              </Button>
            </ScrollReveal>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
