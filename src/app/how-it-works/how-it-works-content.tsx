'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Search, 
  MapPin, 
  ShieldCheck, 
  CalendarDays, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  Building2, 
  Users, 
  KeyRound, 
  CreditCard, 
  PhoneCall, 
  ArrowRight, 
  Clock, 
  FileCheck2, 
  SlidersHorizontal,
  Home,
  MessageSquare
} from 'lucide-react';
import DpiitCertificateModal from '@/components/dpiit-certificate-modal';

export default function HowItWorksContent() {
  const [activePersona, setActivePersona] = useState<'students' | 'landlords'>('students');

  // Student 5-step journey
  const studentSteps = [
    {
      step: '01',
      tag: 'Discovery & Filters',
      title: 'Search Verified Properties Near Your Campus',
      desc: 'Filter by city (Greater Noida, Noida, Delhi), exact college landmarks (GL Bajaj, Galgotias, Sharda, Amity), sharing preference (Single, Double, Triple), and monthly budget.',
      highlights: ['100% Real Photos & Video Walkthroughs', 'Exact Walking Distance from Campus Gates', 'Curfew & Food Menu Details'],
      image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800',
      badge: 'Step 1: Explore'
    },
    {
      step: '02',
      tag: 'Lock Rent Price',
      title: 'Hold Your Bed for 48 Hours with ₹0 Deposit',
      desc: 'Found a room you love? Lock the monthly rent and room availability for 48 hours completely free of cost while you travel to the city or discuss with your family.',
      highlights: ['Zero Advance Commitment', 'Guaranteed Price Freeze', 'Cancel Anytime with 1 Click'],
      image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&q=80&w=800',
      badge: 'Step 2: 48h Bed Hold'
    },
    {
      step: '03',
      tag: 'Assisted Site Tour',
      title: 'Schedule a Free Physical Visit & Get Your Pass',
      desc: 'Pick your preferred date and time slot (Morning, Afternoon, or Evening). Instantly receive your Digital Hobo Visit Pass with caretaker phone and Google Maps directions.',
      highlights: ['Instant WhatsApp Confirmation Pass', 'Direct Caretaker & Owner Handshake', 'Assisted On-Ground Concierge Support'],
      image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=800',
      badge: 'Step 3: Free Visit Pass'
    },
    {
      step: '04',
      tag: 'Digital Security',
      title: 'Instant Online Verification & Tenant KYC',
      desc: 'Complete digital identification safely through our secure portal. No physical paperwork or broker middlemen involved.',
      highlights: ['Secure Aadhaar / Govt ID Verification', 'Parent Safety Notification Support', 'Legally Binding Digital Agreements'],
      image: 'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&q=80&w=800',
      badge: 'Step 4: Digital Verification'
    },
    {
      step: '05',
      tag: 'Move-in Day',
      title: 'Move In with 100% Zero Brokerage',
      desc: 'Arrive at your accommodation, inspect your room, collect your keys, and pay the landlord directly. Enjoy 3 freshly cooked meals, high-speed Wi-Fi, and 24/7 power backup.',
      highlights: ['₹0 Platform Fee / Zero Brokerage', 'Move-in Room Quality Checklist', 'Dedicated Hobo Tenant Support Desk'],
      image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=800',
      badge: 'Step 5: Move In'
    }
  ];

  // Landlord 5-step journey
  const landlordSteps = [
    {
      step: '01',
      tag: 'Zero Listing Fee',
      title: 'Register & List Your Property in 2 Minutes',
      desc: 'Create your owner account, add your hostel or PG location, specify target gender (Boys, Girls, or Co-ed), and upload room photos directly from your phone.',
      highlights: ['100% Free Forever Listing', 'DPIIT Verified Partner Network', 'Zero Setup or Registration Charges'],
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800',
      badge: 'Step 1: Free Listing'
    },
    {
      step: '02',
      tag: 'Inventory Setup',
      title: 'Configure Room Sharing Tiers & Pricing',
      desc: 'Easily set your occupancy types (Single, Double, Triple sharing) with custom monthly rents, security deposits, and amenities like AC, Food, Wi-Fi, and Laundry.',
      highlights: ['Flexible Pricing Controls', 'Transparent Deposit Terms', 'Dynamic Availability Status'],
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800',
      badge: 'Step 2: Pricing Setup'
    },
    {
      step: '03',
      tag: 'Direct Leads',
      title: 'Receive Scheduled Student Site Visits',
      desc: 'Say goodbye to random broker phone spam. Receive verified, high-intent students from top colleges who have already scheduled their visit date and time slot.',
      highlights: ['Pre-Screened Verified Students', 'Automated WhatsApp Visit Alerts', 'Zero Broker Middlemen Calling'],
      image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800',
      badge: 'Step 3: Direct Visits'
    },
    {
      step: '04',
      tag: 'Hassle-Free KYC',
      title: 'Streamlined Digital Onboarding & KYC',
      desc: 'Onboard tenants digitally with built-in identity verification, parent contact logging, and room inventory sign-off.',
      highlights: ['Digital Tenant Record Management', 'Automated Police/Identity Verification', 'No Physical Paperwork Hassle'],
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=800',
      badge: 'Step 4: Smart Onboarding'
    },
    {
      step: '05',
      tag: '100% Occupancy',
      title: 'Fill Your Beds Fast & Collect Rent Directly',
      desc: 'Maintain 100% occupancy throughout the academic year. Collect monthly rent directly into your bank account with zero platform commission deductions.',
      highlights: ['Direct Landlord Payouts', 'High Retention from College Freshers', 'Dedicated Partner Operations Manager'],
      image: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=800',
      badge: 'Step 5: 100% Occupancy'
    }
  ];

  const currentSteps = activePersona === 'students' ? studentSteps : landlordSteps;

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b bg-gradient-to-b from-secondary/40 via-background to-background py-20 px-4">
        <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
        <div className="container max-w-4xl mx-auto text-center space-y-6 relative z-10">
          
          <div className="flex justify-center pb-2">
            <DpiitCertificateModal variant="badge" />
          </div>

          <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/30 font-bold text-xs uppercase tracking-wider px-3.5 py-1">
            ✨ Complete Transparency & Zero Brokerage
          </Badge>

          <h1 className="font-headline text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground">
            A Seamless Living Experience, <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-rose-500 via-pink-600 to-primary bg-clip-text text-transparent">
              From Search to Move-In.
            </span>
          </h1>

          <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Whether you are a student looking for a safe, verified hostel or a landlord seeking 100% occupancy, our digital platform makes accommodation effortless.
          </p>

          {/* Interactive Persona Switcher */}
          <div className="inline-flex p-1.5 rounded-full bg-secondary border shadow-inner max-w-md mx-auto">
            <button
              onClick={() => setActivePersona('students')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all ${
                activePersona === 'students'
                  ? 'bg-primary text-white shadow-md'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Users className="h-4 w-4" />
              <span>For Students & Tenants</span>
            </button>

            <button
              onClick={() => setActivePersona('landlords')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all ${
                activePersona === 'landlords'
                  ? 'bg-primary text-white shadow-md'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Building2 className="h-4 w-4" />
              <span>For Property Owners</span>
            </button>
          </div>

        </div>
      </section>

      {/* Trust Highlights Bar */}
      <section className="border-b bg-secondary/20 py-8 px-4">
        <div className="container max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-black font-headline text-primary">₹0</div>
            <p className="text-xs text-muted-foreground font-semibold">Brokerage & Platform Fee</p>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-black font-headline text-foreground">50+</div>
            <p className="text-xs text-muted-foreground font-semibold">Verified Student Hostels</p>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-black font-headline text-foreground">48 Hours</div>
            <p className="text-xs text-muted-foreground font-semibold">Zero-Cost Bed Hold</p>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-black font-headline text-emerald-600">DIPP104245</div>
            <p className="text-xs text-muted-foreground font-semibold">#startupindia Accredited</p>
          </div>
        </div>
      </section>

      {/* Step-by-Step Interactive Process Section */}
      <section className="py-20 px-4 container max-w-5xl mx-auto space-y-16">
        
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <Badge variant="outline" className="text-xs uppercase tracking-wider text-primary border-primary/30">
            {activePersona === 'students' ? 'Student Booking Journey' : 'Landlord Partnership Flow'}
          </Badge>
          <h2 className="font-headline text-3xl sm:text-4xl font-extrabold tracking-tight">
            How It Works in 5 Simple Steps
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {activePersona === 'students'
              ? 'No random broker calls, no fake photos, and zero advance charges. Follow our simple digital process.'
              : 'Ditch the paper registers and broker commissions. Onboard verified student tenants in 5 streamlined steps.'}
          </p>
        </div>

        {/* Step Cards with Visual App Mockups */}
        <div className="space-y-16">
          {currentSteps.map((item, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <div 
                key={idx} 
                className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-8 lg:gap-12 bg-secondary/15 border border-border/80 rounded-3xl p-6 sm:p-8 hover:border-primary/40 transition-all shadow-sm hover:shadow-xl`}
              >
                {/* Text Content */}
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="h-10 w-10 rounded-2xl bg-primary text-white font-black font-headline text-base flex items-center justify-center shadow-md shadow-primary/20">
                      {item.step}
                    </span>
                    <Badge variant="secondary" className="text-xs font-bold text-primary bg-primary/10">
                      {item.tag}
                    </Badge>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-headline font-extrabold tracking-tight text-foreground">
                    {item.title}
                  </h3>

                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>

                  {/* Feature Checklist */}
                  <div className="space-y-2 pt-2">
                    {item.highlights.map((hl, hIdx) => (
                      <div key={hIdx} className="flex items-center gap-2.5 text-xs sm:text-sm font-medium text-foreground">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                        <span>{hl}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Visual Showcase Card */}
                <div className="w-full lg:w-1/2 relative">
                  <div className="relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden shadow-2xl border border-border/80 group">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      unoptimized
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    {/* Floating Step Badge on Card */}
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-slate-950/90 text-white border border-slate-700 text-xs font-bold shadow-lg">
                        {item.badge}
                      </Badge>
                    </div>

                    {/* Interactive Callout Pill */}
                    <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-slate-950/90 border border-slate-800 text-white flex items-center justify-between text-xs backdrop-blur-md">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                        <span className="font-semibold text-slate-200">
                          {activePersona === 'students' ? 'Verified Pass Generated' : 'Listing Live on Hobo'}
                        </span>
                      </div>
                      <span className="text-primary font-bold">✓ Active</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </section>

      {/* Comparison Matrix: Hobo Livings vs Others */}
      <section className="bg-secondary/30 py-20 px-4 border-y">
        <div className="container max-w-4xl mx-auto space-y-12">
          
          <div className="text-center space-y-2">
            <Badge className="bg-primary text-white font-bold text-xs uppercase tracking-wider px-3 py-1">
              Why We Are Different
            </Badge>
            <h2 className="font-headline text-3xl sm:text-4xl font-extrabold">
              Hobo Livings vs Traditional Platforms
            </h2>
            <p className="text-sm text-muted-foreground">
              See why thousands of students and landlords choose Hobo Livings.
            </p>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[600px] border rounded-2xl bg-card shadow-lg overflow-hidden">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-secondary/60 border-b text-foreground font-headline font-bold">
                  <tr>
                    <th className="p-4">Feature / Benefit</th>
                    <th className="p-4 bg-primary/10 text-primary font-black">Hobo Livings</th>
                    <th className="p-4">Traditional Brokers</th>
                    <th className="p-4">Generic Portals (MagicBricks/OLX)</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-muted-foreground font-medium">
                  <tr>
                    <td className="p-4 font-semibold text-foreground">Brokerage / Commission</td>
                    <td className="p-4 bg-primary/5 text-emerald-600 font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4" /> 100% Zero Brokerage
                    </td>
                    <td className="p-4 text-rose-500">15 to 30 Days Rent</td>
                    <td className="p-4 text-amber-600">Hidden Broker Fees</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-foreground">48-Hour Zero-Cost Bed Hold</td>
                    <td className="p-4 bg-primary/5 text-emerald-600 font-bold">
                      <CheckCircle2 className="h-4 w-4 inline mr-1" /> Yes (Free)
                    </td>
                    <td className="p-4 text-rose-500">
                      <XCircle className="h-4 w-4 inline mr-1" /> No (Demands Cash)
                    </td>
                    <td className="p-4 text-rose-500">
                      <XCircle className="h-4 w-4 inline mr-1" /> Not Available
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-foreground">Phone Spam Protection</td>
                    <td className="p-4 bg-primary/5 text-emerald-600 font-bold">
                      <CheckCircle2 className="h-4 w-4 inline mr-1" /> 100% Zero Spam
                    </td>
                    <td className="p-4 text-rose-500">Aggressive Calling</td>
                    <td className="p-4 text-rose-500">10+ Broker Calls/Day</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-foreground">Assisted Site Visit Pass</td>
                    <td className="p-4 bg-primary/5 text-emerald-600 font-bold">
                      <CheckCircle2 className="h-4 w-4 inline mr-1" /> Digital Pass + Directions
                    </td>
                    <td className="p-4 text-rose-500">Manual Pressure</td>
                    <td className="p-4 text-rose-500">No Support</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-foreground">DPIIT Startup India Recognition</td>
                    <td className="p-4 bg-primary/5 text-emerald-600 font-bold">
                      <CheckCircle2 className="h-4 w-4 inline mr-1" /> Govt Accredited (DIPP104245)
                    </td>
                    <td className="p-4 text-rose-500">Unregistered</td>
                    <td className="p-4 text-rose-500">Ad Aggregator</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-20 px-4 container max-w-4xl mx-auto">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-primary via-rose-600 to-amber-600 text-white text-center space-y-6 shadow-2xl">
          <h2 className="font-headline text-3xl sm:text-5xl font-black tracking-tight">
            Ready to Find Your Ideal Space?
          </h2>
          <p className="text-white/90 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Browse 50+ verified student hostels and PGs across Knowledge Park, Sector 62, and Delhi NCR with zero brokerage.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-2">
            <Button asChild size="lg" className="w-full sm:w-auto h-12 px-8 bg-white text-primary hover:bg-slate-100 font-bold text-sm shadow-xl">
              <Link href="/">
                <Search className="mr-2 h-4 w-4" /> Explore Properties
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto h-12 px-8 border-white/40 text-white bg-white/10 hover:bg-white/20 font-bold text-sm">
              <Link href="/become-landlord">
                <Building2 className="mr-2 h-4 w-4" /> List Your Property Free
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
