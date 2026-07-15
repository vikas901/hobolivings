'use client';

import { useState } from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare } from 'lucide-react';

export default function ContactPage() {
  const { toast } = useToast();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast({ variant: 'destructive', title: 'Required Fields', description: 'Please fill in name, email, and message.' });
      return;
    }
    setFormSubmitted(true);
    toast({ title: 'Message Dispatched! 📬', description: 'Our support desk has received your ticket details.' });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />
      
      {/* Page Header */}
      <section className="bg-secondary/20 py-16 px-4 text-center border-b relative">
        <div className="absolute inset-0 bg-gradient-to-r from-rose-500/5 via-primary/5 to-pink-500/5"></div>
        <div className="relative z-10 max-w-2xl mx-auto space-y-4">
          <Badge className="bg-primary text-primary-foreground font-bold text-xs uppercase tracking-wider px-3 py-1">Contact Us</Badge>
          <h1 className="font-headline text-3xl md:text-5xl font-extrabold tracking-tight">Get in touch</h1>
          <p className="text-muted-foreground text-xs md:text-sm">
            Have questions about bookings, KYC, or operations? Reach out below.
          </p>
        </div>
      </section>

      {/* Split form and contacts */}
      <section className="container py-16 px-4 max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Contact Info */}
        <div className="space-y-8 justify-center flex flex-col">
          <div className="space-y-3">
            <h2 className="font-headline text-2xl font-bold">We would love to hear from you</h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Our support executives operate from Noida to resolve tenant inquiries and coordinate landlord onboarding.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 bg-primary/10 border border-primary/20 text-primary flex items-center justify-center rounded-lg shrink-0">
                <MapPin className="h-5 w-5" />
              </div>
              <div className="space-y-0.5">
                <h4 className="font-semibold text-sm">Headquarters Address</h4>
                <p className="text-xs text-muted-foreground">Knowledge Park, Greater Noida, Uttar Pradesh, India</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="h-10 w-10 bg-primary/10 border border-primary/20 text-primary flex items-center justify-center rounded-lg shrink-0">
                <Mail className="h-5 w-5" />
              </div>
              <div className="space-y-0.5">
                <h4 className="font-semibold text-sm">Support Email</h4>
                <a href="mailto:support@hobolivings.com" className="text-xs text-primary hover:underline">support@hobolivings.com</a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="h-10 w-10 bg-primary/10 border border-primary/20 text-primary flex items-center justify-center rounded-lg shrink-0">
                <Phone className="h-5 w-5" />
              </div>
              <div className="space-y-0.5">
                <h4 className="font-semibold text-sm">Telephone Hotline</h4>
                <a href="tel:+919999999999" className="text-xs text-muted-foreground hover:text-primary transition-colors">+91 99999 99999</a>
              </div>
            </div>
          </div>
        </div>

        {/* Contact form */}
        <div>
          {!formSubmitted ? (
            <Card className="border shadow-md">
              <CardHeader>
                <CardTitle className="text-lg font-headline font-bold">Write support ticket</CardTitle>
                <CardDescription>
                  Send us an instant message.
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="contact-name" className="text-xs font-semibold">Your Name *</Label>
                      <Input 
                        id="contact-name" 
                        placeholder="John Doe" 
                        value={formData.name}
                        onChange={e=>setFormData({...formData, name: e.target.value})}
                        required 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="contact-email" className="text-xs font-semibold">Email Address *</Label>
                      <Input 
                        id="contact-email" 
                        type="email" 
                        placeholder="john@example.com" 
                        value={formData.email}
                        onChange={e=>setFormData({...formData, email: e.target.value})}
                        required 
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="contact-subj" className="text-xs font-semibold">Topic / Subject</Label>
                    <Input 
                      id="contact-subj" 
                      placeholder="e.g. Booking inquiry, KYC verification help" 
                      value={formData.subject}
                      onChange={e=>setFormData({...formData, subject: e.target.value})}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="contact-msg" className="text-xs font-semibold">Message Description *</Label>
                    <Textarea 
                      id="contact-msg" 
                      placeholder="Tell us what you need help with..." 
                      rows={4}
                      value={formData.message}
                      onChange={e=>setFormData({...formData, message: e.target.value})}
                      required 
                    />
                  </div>
                </CardContent>
                <CardFooter className="border-t p-4 flex justify-end">
                  <Button type="submit" className="w-full sm:w-auto flex items-center justify-center gap-1.5 font-semibold text-xs py-5">
                    <Send className="h-4.5 w-4.5" /> Send Message
                  </Button>
                </CardFooter>
              </form>
            </Card>
          ) : (
            <Card className="border border-green-200 bg-green-50/50 shadow-md p-6 text-center space-y-4">
              <div className="mx-auto h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-headline font-bold text-green-900">Message Dispatched!</h3>
                <p className="text-xs text-green-700 leading-relaxed max-w-md mx-auto">
                  Thank you, {formData.name}. Our Noida operations executive desk will review your submission and email you back shortly.
                </p>
              </div>
              <Button variant="outline" className="text-xs" onClick={() => setFormSubmitted(false)}>
                Send New Message
              </Button>
            </Card>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
