
'use client';

import Link from 'next/link';
import { Home, Facebook, Twitter, Instagram } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Footer() {
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Home className="h-6 w-6 mr-2 text-primary" />
            <span className="font-bold text-lg font-headline text-primary">Hobo Livings</span>
          </div>
          <div className="flex space-x-4 mb-4 md:mb-0">
            <Link href="#" className="text-sm hover:text-primary transition-colors">About Us</Link>
            <Link href="#" className="text-sm hover:text-primary transition-colors">Contact</Link>
            <Link href="#" className="text-sm hover:text-primary transition-colors">Terms of Service</Link>
            <Link href="#" className="text-sm hover:text-primary transition-colors">Privacy Policy</Link>
          </div>
          <div className="flex space-x-4">
            <Link href="#" aria-label="Facebook"><Facebook className="h-5 w-5 hover:text-primary transition-colors" /></Link>
            <Link href="#" aria-label="Twitter"><Twitter className="h-5 w-5 hover:text-primary transition-colors" /></Link>
            <Link href="#" aria-label="Instagram"><Instagram className="h-5 w-5 hover:text-primary transition-colors" /></Link>
          </div>
        </div>
        <div className="mt-8 pt-4 border-t border-border/50 text-center text-sm text-muted-foreground">
          <p>&copy; {year} Hobo Livings. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
