'use client';

import { useState } from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, HelpCircle } from 'lucide-react';

export interface FaqItem {
  q: string;
  a: string;
}

export default function FaqsContent({ faqsList }: { faqsList: FaqItem[] }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFaqs = faqsList.filter(faq => 
    faq.q.toLowerCase().includes(searchTerm.toLowerCase()) || 
    faq.a.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />
      
      {/* Search Header */}
      <section className="bg-secondary/20 py-16 px-4 text-center border-b relative">
        <div className="absolute inset-0 bg-gradient-to-r from-rose-500/5 via-primary/5 to-pink-500/5"></div>
        <div className="relative z-10 max-w-2xl mx-auto space-y-4">
          <Badge className="bg-primary text-primary-foreground font-bold text-xs uppercase tracking-wider px-3 py-1">FAQ Portal</Badge>
          <h1 className="font-headline text-3xl md:text-5xl font-extrabold tracking-tight">How can we help you?</h1>
          <div className="relative w-full max-w-md mx-auto mt-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted-foreground" />
            <Input 
              placeholder="Search questions or keywords..." 
              value={searchTerm}
              onChange={e=>setSearchTerm(e.target.value)}
              className="pl-9 bg-background shadow-sm h-11"
            />
          </div>
        </div>
      </section>

      {/* FAQ content */}
      <section className="container py-16 px-4 max-w-3xl space-y-6">
        {filteredFaqs.map((faq, idx) => (
          <Card key={idx} className="border shadow-sm">
            <CardHeader className="p-5 pb-2 flex flex-row items-start gap-3 space-y-0">
              <HelpCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <CardTitle className="text-base font-headline font-bold leading-snug">{faq.q}</CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0 pl-13">
              <p className="text-xs text-muted-foreground leading-relaxed">{faq.a}</p>
            </CardContent>
          </Card>
        ))}

        {filteredFaqs.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No FAQs matching "{searchTerm}" found. Try another term or write to livingshobo@gmail.com.
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
