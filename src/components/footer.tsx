'use client';

import Link from 'next/link';
import { Home, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { useState, useEffect } from 'react';
import DpiitCertificateModal from './dpiit-certificate-modal';

export default function Footer() {
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="bg-secondary text-secondary-foreground border-t">
      <div className="container py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: Brand & Contacts */}
          <div className="space-y-4">
            <div className="flex items-center">
              <Home className="h-6 w-6 mr-2 text-primary" />
              <span className="font-bold text-lg font-headline text-primary">Hobo Livings</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Hobo Livings Private Limited was incorporated in December 2021 to offer safe, verified, and affordable rental accommodation solutions across India.
            </p>
            
            {/* DPIIT Recognition Footer Trigger */}
            <div className="pt-1">
              <DpiitCertificateModal variant="footer" />
            </div>

            <div className="space-y-2 text-xs text-muted-foreground pt-2">
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>Knowledge Park, Greater Noida, UP, India</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-primary shrink-0" />
                <a href="mailto:livingshobo@gmail.com" className="hover:underline">livingshobo@gmail.com</a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-primary shrink-0" />
                <a href="tel:+918920642742" className="hover:underline">+91 89206 42742</a>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-600 px-1.5 py-0.5 rounded font-semibold">WhatsApp</span>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h3 className="font-headline font-bold text-sm text-foreground">Company</h3>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link href="/how-it-works" className="hover:text-primary transition-colors text-primary font-semibold">How It Works</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-primary transition-colors">About Us</Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-primary transition-colors flex items-center gap-1.5">
                  Careers 
                  <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded text-[9px] font-bold">Hiring</span>
                </Link>
              </li>
              <li>
                <Link href="/faqs" className="hover:text-primary transition-colors">FAQs</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Services */}
          <div className="space-y-3">
            <h3 className="font-headline font-bold text-sm text-foreground">Services</h3>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">Explore Properties</Link>
              </li>
              <li>
                <Link href="/list-your-property" className="hover:text-primary transition-colors">List Your Property</Link>
              </li>
              <li>
                <Link href="/become-landlord" className="hover:text-primary transition-colors">Become a Host</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition-colors">Corporate Solutions</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal & Social */}
          <div className="space-y-4">
            <div className="space-y-3">
              <h3 className="font-headline font-bold text-sm text-foreground">Legal & Policies</h3>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li>
                  <Link href="/faqs" className="hover:text-primary transition-colors">Booking & Visit Policy</Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-primary transition-colors">Zero Brokerage Terms</Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-primary transition-colors">Student Safety & Privacy</Link>
                </li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-headline font-bold text-xs text-foreground">Follow Us</h4>
              <div className="flex space-x-3 pt-1">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <Facebook className="h-4.5 w-4.5 text-muted-foreground hover:text-primary transition-colors" />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                  <Twitter className="h-4.5 w-4.5 text-muted-foreground hover:text-primary transition-colors" />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <Instagram className="h-4.5 w-4.5 text-muted-foreground hover:text-primary transition-colors" />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <Linkedin className="h-4.5 w-4.5 text-muted-foreground hover:text-primary transition-colors" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Top Campus Hubs & Locality Keyword Links for Google SEO */}
        <div className="mt-8 pt-6 border-t border-border/40 space-y-3">
          <p className="text-[11px] font-bold uppercase tracking-wider text-foreground">
            Popular Student & Campus Housing Hubs
          </p>
          <div className="flex flex-wrap gap-2 text-[11px] text-muted-foreground">
            <Link href="/?city=Greater+Noida" className="hover:text-primary transition-colors bg-background px-2 py-1 rounded border border-border/60">
              Hostels in Knowledge Park 2
            </Link>
            <Link href="/?city=Greater+Noida" className="hover:text-primary transition-colors bg-background px-2 py-1 rounded border border-border/60">
              PG near GL Bajaj Institute
            </Link>
            <Link href="/?city=Greater+Noida" className="hover:text-primary transition-colors bg-background px-2 py-1 rounded border border-border/60">
              Hostels near Galgotias University
            </Link>
            <Link href="/?city=Greater+Noida" className="hover:text-primary transition-colors bg-background px-2 py-1 rounded border border-border/60">
              Student Accommodation near Sharda University
            </Link>
            <Link href="/?city=Greater+Noida" className="hover:text-primary transition-colors bg-background px-2 py-1 rounded border border-border/60">
              PG near NIET & Lloyd College
            </Link>
            <Link href="/?city=Greater+Noida" className="hover:text-primary transition-colors bg-background px-2 py-1 rounded border border-border/60">
              Accommodations in Pari Chowk & Alpha 1
            </Link>
            <Link href="/?city=Noida" className="hover:text-primary transition-colors bg-background px-2 py-1 rounded border border-border/60">
              Girls PG near Amity University Sector 125
            </Link>
            <Link href="/?city=Noida" className="hover:text-primary transition-colors bg-background px-2 py-1 rounded border border-border/60">
              Boys PG in Sector 62 Noida near JSS
            </Link>
            <Link href="/?category=Hostel" className="hover:text-primary transition-colors bg-background px-2 py-1 rounded border border-border/60">
              Zero Brokerage Hostels Greater Noida
            </Link>
            <Link href="/?category=PG" className="hover:text-primary transition-colors bg-background px-2 py-1 rounded border border-border/60">
              Single & Double Room PGs Delhi NCR
            </Link>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-6 pt-6 border-t border-border/40 text-center text-[11px] text-muted-foreground flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>&copy; {year} Hobo Livings Private Limited. All rights reserved.</p>
          <p className="text-[10px]">CIN: U70109UP2021PTC156942 | Knowledge Park, Greater Noida</p>
        </div>
      </div>
    </footer>
  );
}
