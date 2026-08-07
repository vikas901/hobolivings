'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Property, CategorizedImage, PropertyMedia, RoomOption, Booking, VisitTimeSlot, MoveInTimeline } from '@/lib/types';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { doc, setDoc, arrayUnion, collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { formatIndianCurrency } from '@/components/ui/currency-input';
import { cn } from '@/lib/utils';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import {
  Star, MapPin, Wifi, Wind, UtensilsCrossed, ParkingCircle, WashingMachine, Bath, Sparkles, Camera, Heart, Share2,
  ArrowRight, Loader2, CheckCircle2, ShieldCheck, X, ChevronLeft, ChevronRight, Maximize2, Calendar, Clock,
  MessageCircle, Navigation, CheckSquare, Lock, QrCode, Copy, Check
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface PropertyDetailModalProps {
  property: Property;
  isOpen: boolean;
  onClose: () => void;
  autoTriggerCheckout?: boolean;
}

const amenityIcons: { [key: string]: React.ReactNode } = {
  WiFi: <Wifi className="h-5 w-5" />,
  AC: <Wind className="h-5 w-5" />,
  Food: <UtensilsCrossed className="h-5 w-5" />,
  Parking: <ParkingCircle className="h-5 w-5" />,
  Laundry: <WashingMachine className="h-5 w-5" />,
  Geyser: <Bath className="h-5 w-5" />,
  Housekeeping: <Sparkles className="h-5 w-5" />,
  CCTV: <Camera className="h-5 w-5" />,
};

const TIME_SLOTS: VisitTimeSlot[] = [
  'Morning (10:00 AM - 1:00 PM)',
  'Afternoon (2:00 PM - 5:00 PM)',
  'Evening (5:00 PM - 8:00 PM)'
];

const MOVE_IN_OPTIONS: MoveInTimeline[] = [
  'Immediate',
  'Within 7 Days',
  'Next 2 Weeks',
  'Next Month'
];

const getValidImageUrl = (image: any, images: any): string => {
  const fallback = 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800';
  if (typeof image === 'string' && image.trim().length > 0 && !image.includes('placehold.co')) {
    return image;
  }
  if (Array.isArray(images) && images.length > 0) {
    const first = images[0];
    if (typeof first === 'string' && first.trim().length > 0 && !first.includes('placehold.co')) {
      return first;
    }
    if (typeof first === 'object' && first && typeof first.url === 'string') {
      return first.url;
    }
  }
  if (typeof image === 'object' && image && typeof image.url === 'string') {
    return image.url;
  }
  return fallback;
};

export function PropertyDetailModal({ property, isOpen, onClose, autoTriggerCheckout = false }: PropertyDetailModalProps) {
  const { user, userProfile } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  // Booking / Visit Modal States
  const [bookingMode, setBookingMode] = useState<'none' | 'visit_schedule' | 'bed_hold' | 'visit_pass'>('none');
  const [visitStep, setVisitStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [copiedPass, setCopiedPass] = useState(false);

  // Form Fields
  const [visitDate, setVisitDate] = useState('');
  const [visitTimeSlot, setVisitTimeSlot] = useState<VisitTimeSlot>('Evening (5:00 PM - 8:00 PM)');
  const [selectedOccupancy, setSelectedOccupancy] = useState<RoomOption | null>(null);
  const [moveInTimeline, setMoveInTimeline] = useState<MoveInTimeline>('Within 7 Days');
  const [visitorName, setVisitorName] = useState('');
  const [visitorPhone, setVisitorPhone] = useState('');
  const [visitorCollege, setVisitorCollege] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [confirmedPass, setConfirmedPass] = useState<Booking | null>(null);

  // Gallery states
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Set initial dates and prefill user info
  useEffect(() => {
    if (isOpen) {
      // Set default visit date to tomorrow in YYYY-MM-DD
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const formattedDate = tomorrow.toISOString().split('T')[0];
      setVisitDate(formattedDate);

      if (property?.roomOptions && property.roomOptions.length > 0) {
        setSelectedOccupancy(property.roomOptions[0]);
      }

      if (userProfile) {
        setVisitorName(userProfile.name || '');
        setVisitorPhone(userProfile.phone || userProfile.landlordKycData?.phone || '');
      }

      if (autoTriggerCheckout && user) {
        setBookingMode('visit_schedule');
        setVisitStep(1);
      } else {
        setBookingMode('none');
      }
      setConfirmedPass(null);
    }
  }, [isOpen, property, autoTriggerCheckout, user, userProfile]);

  // Enforce authentication on booking & visit initiation
  const handleInitiateVisit = (mode: 'visit_schedule' | 'bed_hold') => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please login or create a free account to schedule your visit.',
        variant: 'destructive',
      });
      localStorage.setItem('hobo_login_intent', JSON.stringify({
        intent: 'SCHEDULE_VISIT',
        propertyId: property.id,
        occupancy: selectedOccupancy?.occupancy || 'Single',
      }));
      router.push('/login');
      return;
    }

    setBookingMode(mode);
    setVisitStep(1);
  };

  // Dynamic media synthesis
  const media = useMemo((): PropertyMedia => {
    if (!property) return {};
    if (property.media) return property.media;

    const coverUrl = property.image || (property.images && property.images[0]);
    const coverPhoto = coverUrl ? {
      id: 'cover-1',
      category: 'coverPhoto',
      url: coverUrl,
      displayOrder: 0,
      uploadedAt: Date.now(),
      uploadedBy: property.ownerId || '',
    } : null;

    const otherUrls = (property.images || []).filter(url => url !== coverUrl);
    const bedroomPhotos = otherUrls.map((url, i) => ({
      id: `bedroom-${i}`,
      category: 'bedroom',
      url,
      displayOrder: i,
      uploadedAt: Date.now(),
      uploadedBy: property.ownerId || '',
    }));

    return {
      coverPhoto,
      bedroom: bedroomPhotos,
    };
  }, [property]);

  // Flattened array of all images
  const allImages = useMemo(() => {
    const list: CategorizedImage[] = [];
    if (media.coverPhoto) list.push(media.coverPhoto);
    
    const categories: (keyof PropertyMedia)[] = [
      'bedroom', 'bathroom', 'buildingExterior', 'corridor', 
      'kitchen', 'dining', 'balcony', 'amenities', 'parking', 
      'laundry', 'nearby', 'floorPlan'
    ];

    categories.forEach(cat => {
      const arr = media[cat];
      if (Array.isArray(arr)) {
        list.push(...arr);
      }
    });

    return list;
  }, [media]);

  // Gallery tabs configuration
  const galleryCategories = useMemo(() => {
    const categories = [{ key: 'all', label: 'All Photos', count: allImages.length, images: allImages }];
    
    if (media.coverPhoto) {
      categories.push({ key: 'coverPhoto', label: 'Cover Photo', count: 1, images: [media.coverPhoto] });
    }

    const configKeys: { key: keyof PropertyMedia; label: string }[] = [
      { key: 'bedroom', label: 'Room / Bedroom' },
      { key: 'bathroom', label: 'Bathroom' },
      { key: 'buildingExterior', label: 'Building Exterior' },
      { key: 'corridor', label: 'Corridor / Common' },
      { key: 'kitchen', label: 'Kitchen' },
      { key: 'dining', label: 'Dining Area' },
      { key: 'balcony', label: 'Balcony' },
      { key: 'amenities', label: 'Amenities' },
      { key: 'parking', label: 'Parking' },
      { key: 'laundry', label: 'Laundry' },
      { key: 'nearby', label: 'Nearby Locality' },
      { key: 'floorPlan', label: 'Floor Plan' },
    ];

    configKeys.forEach(cfg => {
      const arr = media[cfg.key];
      if (Array.isArray(arr) && arr.length > 0) {
        categories.push({ key: cfg.key, label: cfg.label, count: arr.length, images: arr });
      }
    });

    return categories;
  }, [allImages, media]);

  const activeCategoryImages = useMemo(() => {
    return galleryCategories.find(c => c.key === activeTab)?.images || allImages;
  }, [galleryCategories, activeTab, allImages]);

  // Lightbox keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      if (e.key === 'ArrowRight') {
        setLightboxIndex(prev => (prev + 1) % activeCategoryImages.length);
      } else if (e.key === 'ArrowLeft') {
        setLightboxIndex(prev => (prev - 1 + activeCategoryImages.length) % activeCategoryImages.length);
      } else if (e.key === 'Escape') {
        setLightboxOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, activeCategoryImages]);

  // Smart WhatsApp Concierge Deep Link
  const getWhatsAppInquiryUrl = () => {
    const priceText = formatIndianCurrency(selectedOccupancy?.price || property?.price || 0);
    const roomType = selectedOccupancy?.occupancy || 'Single/Double';
    const message = `Hi Hobo Livings team! 👋 I am interested in visiting *${property?.title}* in *${property?.location}, ${property?.city}*.\n\n` +
      `🛏️ Sharing Preference: *${roomType} Sharing (₹${priceText}/mo)*\n` +
      `📅 Planned Move-in: *${moveInTimeline}*\n` +
      `Can you share directions and confirm if a room is available for a free site visit?`;
    
    return `https://wa.me/918920642742?text=${encodeURIComponent(message)}`;
  };

  const handleOpenWhatsApp = () => {
    window.open(getWhatsAppInquiryUrl(), '_blank');
  };

  // Google Maps Directions link
  const getGoogleMapsUrl = () => {
    const query = encodeURIComponent(`${property.title}, ${property.location}, ${property.city}`);
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
  };

  // Handle Schedule Visit or Bed Hold
  const handleScheduleVisitSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please login or sign up to schedule your visit.',
        variant: 'destructive',
      });
      localStorage.setItem('hobo_login_intent', JSON.stringify({
        intent: 'SCHEDULE_VISIT',
        propertyId: property.id,
        occupancy: selectedOccupancy?.occupancy || 'Single',
      }));
      router.push('/login');
      return;
    }

    if (!visitorName.trim()) {
      toast({ variant: 'destructive', title: 'Name Required', description: 'Please enter your name.' });
      return;
    }
    if (!visitorPhone.trim() || visitorPhone.trim().length < 10) {
      toast({ variant: 'destructive', title: 'Valid Phone Required', description: 'Please enter a 10-digit WhatsApp phone number.' });
      return;
    }

    setLoading(true);
    try {
      const isBedHold = bookingMode === 'bed_hold';
      const rawBookingData = {
        bookingType: isBedHold ? 'bed_hold' : 'free_visit',
        status: isBedHold ? 'Bed Held (48h)' : 'Visit Scheduled',
        propertyId: property.id || '',
        propertyTitle: property.title || 'Accommodation Unit',
        propertyLocation: property.location || '',
        propertyCity: property.city || '',
        propertyImage: property.image || '',
        occupancy: selectedOccupancy?.occupancy || 'Double',
        price: selectedOccupancy?.price || property.price || 0,
        tenantId: user.uid,
        tenantName: visitorName.trim() || userProfile?.name || 'Verified Tenant',
        tenantPhone: visitorPhone.trim(),
        tenantEmail: user.email || '',
        tenantCollegeOrWork: visitorCollege.trim() || 'Not specified',
        visitDate: visitDate || new Date().toISOString().split('T')[0],
        visitTimeSlot: visitTimeSlot || 'Evening (5:00 PM - 8:00 PM)',
        moveInTimeline: moveInTimeline || 'Within 7 Days',
        specialRequests: specialRequests.trim() || '',
        createdAt: new Date().toISOString(),
        ...(isBedHold ? { bedHoldExpiresAt: new Date(Date.now() + 48 * 3600 * 1000).toISOString() } : {}),
      };

      // Strip any undefined keys to guarantee valid Firestore document payload
      const bookingData = Object.fromEntries(
        Object.entries(rawBookingData).filter(([_, v]) => v !== undefined)
      ) as unknown as Booking;

      const docRef = await addDoc(collection(db, 'bookings'), bookingData);
      const finalBooking = { ...bookingData, id: docRef.id };
      
      setConfirmedPass(finalBooking);
      setBookingMode('visit_pass');
      
      toast({
        title: isBedHold ? '🔒 Bed Held for 48 Hours!' : '🗓️ Visit Scheduled Successfully!',
        description: 'Your Digital Hobo Visit Pass is ready with directions.',
      });
    } catch (err: any) {
      console.error(err);
      toast({ variant: 'destructive', title: 'Submission Failed', description: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please login to save this property.',
        variant: 'destructive',
      });
      localStorage.setItem('hobo_login_intent', JSON.stringify({
        intent: 'SAVE_FAVORITE',
        propertyId: property.id
      }));
      router.push('/login');
    } else {
      try {
        const userRef = doc(db, 'users', user.uid);
        await setDoc(userRef, {
          favorites: arrayUnion(property.id)
        }, { merge: true });
        toast({ title: 'Saved! ❤️', description: 'Property saved to your favorites.' });
      } catch (e: any) {
        console.error(e);
        toast({ variant: 'destructive', title: 'Error', description: 'Could not save to favorites.' });
      }
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({ title: 'Link Copied!', description: 'Property link copied to clipboard.' });
  };

  const handleCopyPass = () => {
    if (!confirmedPass) return;
    const passSummary = `🏡 Hobo Livings Visit Pass\n` +
      `Property: ${confirmedPass.propertyTitle}\n` +
      `Location: ${confirmedPass.propertyLocation}, ${confirmedPass.propertyCity}\n` +
      `Visit Date: ${confirmedPass.visitDate} (${confirmedPass.visitTimeSlot})\n` +
      `Room: ${confirmedPass.occupancy} Sharing (₹${formatIndianCurrency(confirmedPass.price)}/mo)\n` +
      `Directions: ${getGoogleMapsUrl()}`;
    
    navigator.clipboard.writeText(passSummary);
    setCopiedPass(true);
    setTimeout(() => setCopiedPass(false), 2500);
    toast({ title: 'Pass Details Copied!', description: 'Ready to share on WhatsApp or save.' });
  };

  const isOwner = userProfile?.activeRole === 'landlord';

  if (!property) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl w-full p-0 overflow-hidden bg-background">
          <VisuallyHidden>
            <DialogTitle>{property.title}</DialogTitle>
          </VisuallyHidden>

          {/* ========================================================= */}
          {/* VIEW 1: DIGITAL HOBO VISIT PASS (CONFIRMATION VIEW)       */}
          {/* ========================================================= */}
          {bookingMode === 'visit_pass' && confirmedPass ? (
            <div className="p-6 md:p-8 max-h-[90vh] overflow-y-auto space-y-6">
              
              {/* Header Badge */}
              <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full mb-1">
                  <CheckCircle2 className="h-10 w-10 animate-pulse" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold font-headline text-foreground">
                  {confirmedPass.bookingType === 'bed_hold' ? 'Bed Reserved for 48 Hours! 🔒' : 'Visit Scheduled Successfully! 🎉'}
                </h2>
                <p className="text-xs md:text-sm text-muted-foreground max-w-md mx-auto">
                  {confirmedPass.bookingType === 'bed_hold'
                    ? 'This room rate is locked for you. Please visit and complete the direct handshake with the owner within 48 hours.'
                    : 'Your assisted site visit is confirmed with zero brokerage and zero platform fees.'}
                </p>
              </div>

              {/* Digital Pass Card */}
              <div className="bg-card border-2 border-primary/20 rounded-2xl p-5 md:p-6 shadow-xl relative overflow-hidden">
                {/* Stamp */}
                <div className="absolute top-4 right-4 bg-emerald-500 text-white font-bold text-[10px] uppercase tracking-wider px-3 py-1 rounded-full shadow">
                  ✓ Verified Pass
                </div>

                <div className="flex items-start gap-3 border-b pb-4">
                  <div className="p-2.5 bg-primary/10 text-primary rounded-xl shrink-0">
                    <QrCode className="h-7 w-7" />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono font-bold text-muted-foreground uppercase">
                      Pass ID: HL-{confirmedPass.id ? confirmedPass.id.substring(0, 8).toUpperCase() : 'VISIT-PASS'}
                    </span>
                    <h3 className="text-lg md:text-xl font-bold font-headline leading-tight mt-0.5">
                      {confirmedPass.propertyTitle}
                    </h3>
                    <p className="text-xs text-muted-foreground flex items-center mt-1">
                      <MapPin className="h-3.5 w-3.5 mr-1 text-primary shrink-0" />
                      {confirmedPass.propertyLocation}, {confirmedPass.propertyCity}
                    </p>
                  </div>
                </div>

                {/* Grid details */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-4 py-2 text-xs border-b">
                  <div>
                    <span className="text-muted-foreground block">Visit Date</span>
                    <span className="font-bold text-foreground text-sm flex items-center gap-1 mt-0.5">
                      <Calendar className="h-3.5 w-3.5 text-primary" />
                      {confirmedPass.visitDate || 'Tomorrow'}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Time Slot</span>
                    <span className="font-bold text-foreground text-sm flex items-center gap-1 mt-0.5">
                      <Clock className="h-3.5 w-3.5 text-primary" />
                      {confirmedPass.visitTimeSlot?.split(' ')[0] || 'Evening'}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Sharing & Rent</span>
                    <span className="font-bold text-primary text-sm mt-0.5 block">
                      {confirmedPass.occupancy} (₹{formatIndianCurrency(confirmedPass.price)}/mo)
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Visitor</span>
                    <span className="font-bold text-foreground text-sm mt-0.5 block truncate">
                      {confirmedPass.tenantName}
                    </span>
                  </div>
                </div>

                {/* Directions & Contact */}
                <div className="space-y-3 pt-1">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button 
                      asChild 
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-5"
                    >
                      <a href={getGoogleMapsUrl()} target="_blank" rel="noopener noreferrer">
                        <Navigation className="mr-2 h-4 w-4" /> Open in Google Maps
                      </a>
                    </Button>
                    <Button 
                      onClick={handleOpenWhatsApp} 
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-5"
                    >
                      <MessageCircle className="mr-2 h-4 w-4" /> Chat with Caretaker
                    </Button>
                  </div>
                </div>
              </div>

              {/* Student Inspection Checklist */}
              <div className="p-4 bg-secondary/50 rounded-xl border space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <CheckSquare className="h-4 w-4 text-primary" /> What to inspect during your free visit:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-foreground/90 pt-1">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-500 font-bold">✓</span> <span>Check geyser & washroom water flow</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-500 font-bold">✓</span> <span>Connect to Wi-Fi to test speed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-500 font-bold">✓</span> <span>Ask caretaker for today's food menu</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-500 font-bold">✓</span> <span>Confirm electricity meter unit rate</span>
                  </div>
                </div>
              </div>

              {/* Footer actions */}
              <div className="flex gap-3 justify-between items-center pt-2">
                <Button variant="outline" onClick={handleCopyPass} className="text-xs">
                  {copiedPass ? <Check className="mr-1.5 h-3.5 w-3.5 text-emerald-500" /> : <Copy className="mr-1.5 h-3.5 w-3.5" />}
                  {copiedPass ? 'Copied!' : 'Copy Pass Summary'}
                </Button>
                <Button onClick={onClose} className="px-8 font-semibold">
                  Done
                </Button>
              </div>

            </div>
          ) : bookingMode === 'visit_schedule' || bookingMode === 'bed_hold' ? (
            
            /* ========================================================= */
            /* VIEW 2: 2-STEP SCHEDULE FREE VISIT & BED HOLD WIZARD     */
            /* ========================================================= */
            <div className="grid grid-cols-1 md:grid-cols-12 max-h-[90vh] overflow-y-auto">
              
              {/* Left Property Sidebar */}
              <div className="md:col-span-5 relative bg-muted flex flex-col justify-between p-6 text-white min-h-[220px] md:min-h-full">
                <Image 
                  src={getValidImageUrl(property.image, property.images)} 
                  alt={property.title || 'Property'} 
                  fill 
                  className="object-cover" 
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30" />
                
                <div className="relative z-10">
                  <Badge className="bg-primary text-white mb-2">{property.category}</Badge>
                  <h3 className="font-headline text-lg md:text-xl font-bold leading-snug">{property.title}</h3>
                  <p className="text-xs text-white/80 mt-1 flex items-center">
                    <MapPin className="h-3 w-3 mr-1 text-primary shrink-0" />
                    {property.location}, {property.city}
                  </p>
                </div>

                <div className="relative z-10 mt-6 pt-4 border-t border-white/20 space-y-2 text-xs text-white/90">
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Sharing Type:</span>
                    <span className="font-bold">{selectedOccupancy?.occupancy || 'Single'} Sharing</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Monthly Rent:</span>
                    <span className="font-bold text-emerald-400 text-sm">
                      ₹{formatIndianCurrency(selectedOccupancy?.price || property.price)}/mo
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Brokerage / Platform Fee:</span>
                    <span className="font-bold text-emerald-400">₹0 (Free)</span>
                  </div>
                  <div className="bg-white/10 rounded-lg p-2 mt-3 text-[11px] text-white/80 flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>No advance deposit or card required.</span>
                  </div>
                </div>
              </div>

              {/* Right Interactive Form Area */}
              <div className="md:col-span-7 p-6 md:p-8 space-y-6">
                
                {/* Header & Step progress */}
                <div className="flex justify-between items-start border-b pb-3">
                  <div>
                    <span className="text-[11px] font-bold text-primary uppercase tracking-wider">
                      {bookingMode === 'bed_hold' ? 'Step ' + visitStep + ' of 2 • Lock Price' : 'Step ' + visitStep + ' of 2 • Free Site Visit'}
                    </span>
                    <h2 className="text-xl md:text-2xl font-bold font-headline">
                      {bookingMode === 'bed_hold' ? 'Hold Bed for 48 Hours' : 'Schedule a Free Visit'}
                    </h2>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setBookingMode('none')} className="rounded-full">
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                <form onSubmit={handleScheduleVisitSubmit} className="space-y-5">
                  
                  {/* STEP 1: VISIT PREFERENCES */}
                  {visitStep === 1 ? (
                    <div className="space-y-4">
                      
                      {/* Sharing selection */}
                      <div className="space-y-2">
                        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                          1. Select Sharing Option
                        </Label>
                        <div className="grid grid-cols-3 gap-2">
                          {(property.roomOptions || [
                            { occupancy: 'Single', price: property.price },
                            { occupancy: 'Double', price: Math.round(property.price * 0.7) },
                            { occupancy: 'Triple', price: Math.round(property.price * 0.5) }
                          ]).map((opt) => (
                            <button
                              type="button"
                              key={opt.occupancy}
                              onClick={() => setSelectedOccupancy(opt as RoomOption)}
                              className={cn(
                                "p-2.5 rounded-xl border text-left transition-all text-xs",
                                selectedOccupancy?.occupancy === opt.occupancy
                                  ? "border-primary bg-primary/10 ring-2 ring-primary/20 shadow-sm"
                                  : "hover:border-border/80 bg-card"
                              )}
                            >
                              <div className="font-bold text-foreground">{opt.occupancy}</div>
                              <div className="text-primary font-semibold mt-0.5">₹{formatIndianCurrency(opt.price)}</div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Visit Date & Time Slot */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label htmlFor="visitDate" className="text-xs font-semibold text-muted-foreground">
                            Preferred Visit Date
                          </Label>
                          <Input
                            id="visitDate"
                            type="date"
                            required
                            min={new Date().toISOString().split('T')[0]}
                            value={visitDate}
                            onChange={(e) => setVisitDate(e.target.value)}
                            className="text-xs"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="timeSlot" className="text-xs font-semibold text-muted-foreground">
                            Time Slot
                          </Label>
                          <Select value={visitTimeSlot} onValueChange={(val: any) => setVisitTimeSlot(val)}>
                            <SelectTrigger id="timeSlot" className="text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {TIME_SLOTS.map((slot) => (
                                <SelectItem key={slot} value={slot} className="text-xs">
                                  {slot}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Move-in Timeline */}
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-muted-foreground">
                          Planned Move-in Timeline
                        </Label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {MOVE_IN_OPTIONS.map((timeline) => (
                            <button
                              type="button"
                              key={timeline}
                              onClick={() => setMoveInTimeline(timeline)}
                              className={cn(
                                "py-2 px-2 text-[11px] font-medium rounded-lg border transition-all text-center",
                                moveInTimeline === timeline
                                  ? "bg-secondary border-primary font-bold text-primary"
                                  : "hover:bg-muted text-muted-foreground"
                              )}
                            >
                              {timeline}
                            </button>
                          ))}
                        </div>
                      </div>

                      <Button 
                        type="button" 
                        onClick={() => setVisitStep(2)} 
                        className="w-full py-5 font-headline text-sm font-semibold mt-4"
                      >
                        Continue to Visitor Info <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>

                    </div>
                  ) : (
                    
                    /* STEP 2: CONTACT INFO */
                    <div className="space-y-4">
                      
                      <div className="space-y-1.5">
                        <Label htmlFor="visitorName" className="text-xs font-semibold">
                          Your Full Name <span className="text-primary">*</span>
                        </Label>
                        <Input
                          id="visitorName"
                          required
                          placeholder="e.g. Rahul Sharma"
                          value={visitorName}
                          onChange={(e) => setVisitorName(e.target.value)}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="visitorPhone" className="text-xs font-semibold">
                          WhatsApp Mobile Number <span className="text-primary">*</span>
                        </Label>
                        <div className="flex">
                          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 bg-muted text-muted-foreground text-xs font-mono font-medium">
                            +91
                          </span>
                          <Input
                            id="visitorPhone"
                            type="tel"
                            required
                            maxLength={10}
                            placeholder="9876543210"
                            className="rounded-l-none"
                            value={visitorPhone}
                            onChange={(e) => setVisitorPhone(e.target.value.replace(/\D/g, ''))}
                          />
                        </div>
                        <p className="text-[10px] text-muted-foreground">We send Google Maps directions and caretaker contact via WhatsApp.</p>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="visitorCollege" className="text-xs font-semibold">
                          College / Workplace <span className="text-muted-foreground font-normal">(Optional)</span>
                        </Label>
                        <Input
                          id="visitorCollege"
                          placeholder="e.g. Amity University / NIET / Jaypee"
                          value={visitorCollege}
                          onChange={(e) => setVisitorCollege(e.target.value)}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="specialRequests" className="text-xs font-semibold">
                          Special Requirements <span className="text-muted-foreground font-normal">(Optional)</span>
                        </Label>
                        <Input
                          id="specialRequests"
                          placeholder="e.g. Need room with balcony, vegetarian meals"
                          value={specialRequests}
                          onChange={(e) => setSpecialRequests(e.target.value)}
                        />
                      </div>

                      <div className="flex gap-3 pt-2">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setVisitStep(1)} 
                          className="flex-1 py-5"
                        >
                          <ChevronLeft className="mr-1 h-4 w-4" /> Back
                        </Button>
                        <Button 
                          type="submit" 
                          disabled={loading} 
                          className="flex-[2] py-5 font-headline font-semibold text-sm bg-primary hover:bg-primary/90"
                        >
                          {loading ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Confirming...</>
                          ) : (
                            <><CheckCircle2 className="mr-2 h-4 w-4" /> Get Visit Pass & Directions</>
                          )}
                        </Button>
                      </div>

                    </div>
                  )}

                </form>

              </div>

            </div>
          ) : (

            /* ========================================================= */
            /* VIEW 3: DEFAULT DETAILED DESCRIPTION & PROPERTY MODAL     */
            /* ========================================================= */
            <div className="grid grid-cols-1 md:grid-cols-2 max-h-[90vh] overflow-y-auto">
              
              {/* Left Hero Image + Gallery triggers */}
              <div className="relative h-64 md:h-full min-h-[320px] bg-muted group overflow-hidden">
                <Image 
                  src={getValidImageUrl(property.image, property.images)} 
                  alt={property.title || 'Property'} 
                  fill 
                  className="object-cover group-hover:scale-[1.03] transition-transform duration-500" 
                  unoptimized
                />
                
                {/* Photo Count badge + View Gallery trigger */}
                <div className="absolute bottom-4 right-4 flex flex-col gap-2">
                  <Button 
                    onClick={() => setGalleryOpen(true)}
                    className="bg-black/80 hover:bg-black/95 text-white border-none shadow-lg text-xs py-2 px-3 h-auto font-medium flex items-center gap-1.5"
                  >
                    <Camera className="h-4 w-4" />
                    <span>{allImages.length} Photo{allImages.length !== 1 && 's'}</span>
                  </Button>
                  <Button
                    onClick={() => setGalleryOpen(true)}
                    variant="secondary"
                    size="sm"
                    className="shadow-md text-xs font-semibold"
                  >
                    <Maximize2 className="h-3 w-3 mr-1.5" /> View Gallery
                  </Button>
                </div>

                {/* Zero Brokerage Tag on Image */}
                <div className="absolute top-4 left-4">
                  <Badge className="bg-emerald-600 text-white font-bold text-xs py-1 px-3 shadow-md">
                    ✓ Zero Brokerage Guaranteed
                  </Badge>
                </div>
              </div>
              
              {/* Right Content */}
              <div className="p-6 md:p-8 space-y-6">
                
                <div className="flex justify-between items-start">
                  <div>
                    <Badge className="mb-2 bg-primary/95 text-white">{property.category}</Badge>
                    <h2 className="text-2xl md:text-3xl font-headline font-bold break-words">{property.title}</h2>
                    <p className="text-sm text-muted-foreground mt-1 flex items-center">
                      <MapPin className="h-4 w-4 mr-1 text-primary shrink-0" />
                      {property.location}, {property.city}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4 items-center">
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                    <span className="font-bold">{property.rating}</span>
                  </div>
                  <span className="text-muted-foreground text-sm">({property.reviews} reviews)</span>
                  <span className="font-semibold text-xl text-primary ml-auto">₹{formatIndianCurrency(property.price)}/mo</span>
                </div>

                {/* Trust Highlights Box */}
                <div className="grid grid-cols-3 gap-2 p-3 bg-secondary/40 rounded-xl border text-center text-xs">
                  <div>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 block">₹0 Fee</span>
                    <span className="text-muted-foreground text-[10px]">Zero Brokerage</span>
                  </div>
                  <div className="border-x">
                    <span className="font-bold text-blue-600 dark:text-blue-400 block">Free Tour</span>
                    <span className="text-muted-foreground text-[10px]">Assisted Visit</span>
                  </div>
                  <div>
                    <span className="font-bold text-foreground block">Direct Terms</span>
                    <span className="text-muted-foreground text-[10px]">Owner Pricing</span>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-semibold mb-3">🛏️ Sharing & Pricing Options</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                    {property.roomOptions?.map((opt) => (
                      <div 
                        key={opt.occupancy} 
                        onClick={() => setSelectedOccupancy(opt)}
                        className={cn(
                          "p-3 rounded-lg border flex flex-col justify-between cursor-pointer transition-all",
                          selectedOccupancy?.occupancy === opt.occupancy
                            ? "border-primary bg-primary/10 ring-1 ring-primary"
                            : "bg-secondary/60 hover:bg-secondary"
                        )}
                      >
                        <span className="font-semibold text-muted-foreground text-xs">{opt.occupancy} Sharing</span>
                        <span className="font-bold text-primary mt-1 text-base">₹{formatIndianCurrency(opt.price)}/mo</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">📜 Description</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{property.description}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3">⚡ Amenities</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {property.amenities.map((amenity) => (
                      <div key={amenity} className="flex items-center space-x-2 text-sm text-muted-foreground p-2 rounded-md bg-secondary/30">
                        {amenityIcons[amenity]}
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-semibold mb-3">📍 Location & Nearby Landmarks</h3>
                  <div className="grid grid-cols-2 gap-3 text-xs text-muted-foreground">
                    {property.map?.nearby?.map((place) => (
                      <div key={place.name} className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-primary" />
                        <span><span className="font-semibold text-foreground">{place.distance}</span> from {place.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div>
                  <h3 className="font-semibold mb-3">💬 Student Reviews</h3>
                  <div className="text-sm text-muted-foreground p-3 bg-secondary/50 rounded-md">
                    <p className="italic">“Very clean and safe, close to my college!”</p>
                    <p className="text-right font-semibold mt-1 text-foreground">– Ankit S., BBA Student</p>
                  </div>
                </div>

                <Separator className="my-4" />

                {/* PRIMARY ACTIONS */}
                <div className="space-y-3 pt-2">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            onClick={() => handleInitiateVisit('visit_schedule')} 
                            className="flex-1 py-6 font-headline font-bold text-base shadow-lg"
                            disabled={isOwner}
                          >
                            <Calendar className="mr-2 h-5 w-5" /> Schedule Free Visit
                          </Button>
                        </TooltipTrigger>
                        {isOwner && (
                          <TooltipContent>
                            <p>Property owners cannot schedule visits.</p>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </TooltipProvider>

                    {/* Instant WhatsApp Inquiry Button */}
                    <Button 
                      onClick={handleOpenWhatsApp}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-6 px-4"
                      aria-label="Chat on WhatsApp"
                    >
                      <MessageCircle className="h-5 w-5 mr-1.5" />
                      <span>WhatsApp</span>
                    </Button>

                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" className="h-12 w-12" onClick={handleSave} aria-label="Save Property">
                        <Heart className="h-5 w-5" />
                      </Button>
                      <Button variant="outline" size="icon" className="h-12 w-12" onClick={handleShare} aria-label="Share Property">
                        <Share2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>

                  {/* High Intent Free Bed Hold Option */}
                  <div className="text-center pt-1">
                    <button
                      type="button"
                      onClick={() => handleInitiateVisit('bed_hold')}
                      className="text-xs text-muted-foreground hover:text-primary underline font-medium inline-flex items-center gap-1"
                    >
                      <Lock className="h-3 w-3" /> Prefer to hold this bed for 48 hours with 0 advance? Click here
                    </button>
                  </div>

                  {!user && (
                    <p className="text-center text-[11px] text-muted-foreground mt-2 flex items-center justify-center gap-1">
                      <Lock className="h-3 w-3 text-primary/70" /> Please sign in or create an account to schedule a visit & get your pass.
                    </p>
                  )}
                </div>

              </div>
            </div>
          )}

        </DialogContent>
      </Dialog>

      {/* PRD Categorized Gallery Overlay dialog */}
      <Dialog open={galleryOpen} onOpenChange={setGalleryOpen}>
        <DialogContent className="max-w-none w-screen h-screen p-0 m-0 border-none flex flex-col overflow-hidden bg-background rounded-none z-[60]">
          <VisuallyHidden>
            <DialogTitle>Photo Gallery: {property.title}</DialogTitle>
          </VisuallyHidden>
          
          {/* Header */}
          <div className="flex justify-between items-center px-6 py-4 border-b shrink-0 bg-background">
            <div>
              <h3 className="font-bold text-lg font-headline truncate max-w-[280px] sm:max-w-md">{property.title}</h3>
              <p className="text-xs text-muted-foreground">Total Photos: {allImages.length}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setGalleryOpen(false)} className="rounded-full">
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Tab Selection Row */}
          <div className="px-6 py-3 border-b overflow-x-auto whitespace-nowrap bg-muted/25 flex gap-2 shrink-0">
            {galleryCategories.map((cat) => (
              <Button
                key={cat.key}
                onClick={() => setActiveTab(cat.key)}
                variant={activeTab === cat.key ? "default" : "outline"}
                className="h-8 text-xs font-semibold rounded-full px-4"
              >
                {cat.label} ({cat.count})
              </Button>
            ))}
          </div>

          {/* Image Grid with Lazy Loading */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeCategoryImages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground text-sm">
                <Camera className="h-10 w-10 text-muted-foreground/40 mb-2" />
                <span>No images in this category.</span>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {activeCategoryImages.map((img, idx) => (
                  <div
                    key={img.id}
                    onClick={() => {
                      setLightboxIndex(idx);
                      setLightboxOpen(true);
                    }}
                    className="relative aspect-video rounded-lg overflow-hidden border bg-muted cursor-pointer hover:opacity-90 transition-opacity shadow-sm"
                  >
                    <Image
                      src={getValidImageUrl(img.url, [])}
                      alt={`${property.title} photo`}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                      className="object-cover"
                      loading="lazy"
                      unoptimized
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* PRD Lightbox Overlay dialog */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-none w-screen h-screen p-0 m-0 border-none flex flex-col justify-between bg-black text-white rounded-none z-[100]">
          <VisuallyHidden>
            <DialogTitle>Photo Lightbox View</DialogTitle>
          </VisuallyHidden>
          
          {/* Top Header */}
          <div className="flex justify-between items-center p-4 bg-black/60 text-white z-10 shrink-0">
            <span className="text-xs font-medium tracking-wide">
              {galleryCategories.find(c => c.key === activeTab)?.label} — {lightboxIndex + 1} of {activeCategoryImages.length}
            </span>
            <Button variant="ghost" size="icon" onClick={() => setLightboxOpen(false)} className="text-white hover:bg-white/20 rounded-full h-8 w-8">
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Main View Area */}
          <div className="flex-1 flex items-center justify-center relative px-12">
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 z-20 text-white hover:bg-white/20 rounded-full h-10 w-10 shrink-0"
              onClick={() => setLightboxIndex(prev => (prev - 1 + activeCategoryImages.length) % activeCategoryImages.length)}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>

            <div className="relative w-full h-full max-h-[80vh] flex items-center justify-center select-none">
              <Image
                src={getValidImageUrl(activeCategoryImages[lightboxIndex]?.url, [])}
                alt={`Image ${lightboxIndex + 1}`}
                width={1200}
                height={900}
                className="max-w-full max-h-full object-contain"
                priority
                unoptimized
              />
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 z-20 text-white hover:bg-white/20 rounded-full h-10 w-10 shrink-0"
              onClick={() => setLightboxIndex(prev => (prev + 1) % activeCategoryImages.length)}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>

          {/* Footer Controls instructions */}
          <div className="bg-black/60 p-3 text-center text-[10px] text-white/50 z-10 shrink-0 select-none hidden sm:block">
            Tip: Use Left/Right Arrow keys to navigate • Esc or click close button to return
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
