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
import type { Property, CategorizedImage, PropertyMedia } from '@/lib/types';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { doc, setDoc, arrayUnion, collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { formatIndianCurrency } from '@/components/ui/currency-input';
import { cn } from '@/lib/utils';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import {
  Star, MapPin, Wifi, Wind, UtensilsCrossed, ParkingCircle, WashingMachine, Bath, Sparkles, Camera, Heart, Share2, ArrowRight, Loader2, CheckCircle2, ShieldCheck, X, ChevronLeft, ChevronRight, Maximize2
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

export function PropertyDetailModal({ property, isOpen, onClose, autoTriggerCheckout = false }: PropertyDetailModalProps) {
  const { user, userProfile } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  // Booking states
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guestsCount, setGuestsCount] = useState('1');
  const [selectedOccupancy, setSelectedOccupancy] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Gallery states
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Auto switch to checkout if recovering intent
  useEffect(() => {
    if (isOpen) {
      setCheckoutOpen(autoTriggerCheckout);
      setBookingConfirmed(false);
      setCheckIn('');
      setCheckOut('');
      setGuestsCount('1');
      if (property?.roomOptions && property.roomOptions.length > 0) {
        setSelectedOccupancy(property.roomOptions[0]);
      }
    }
  }, [isOpen, property, autoTriggerCheckout]);

  // Dynamic media synthesis for backward compatibility
  const media = useMemo((): PropertyMedia => {
    if (!property) return {};
    if (property.media) return property.media;

    // Synthesize cover and bedroom lists
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

  const handleBookNow = () => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please login to book a property.',
        variant: 'destructive',
      });
      localStorage.setItem('hobo_login_intent', JSON.stringify({
        intent: 'BOOK',
        propertyId: property.id
      }));
      router.push('/login');
    } else {
      setCheckoutOpen(true);
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

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkIn || !checkOut) {
      toast({ variant: 'destructive', title: 'Validation Error', description: 'Please choose check-in and check-out dates.' });
      return;
    }

    setLoading(true);
    try {
      const bookingData = {
        tenantId: user!.uid,
        tenantName: userProfile?.name || user!.email || 'Guest',
        propertyId: property.id,
        propertyTitle: property.title,
        propertyLocation: property.location,
        checkIn,
        checkOut,
        occupancy: selectedOccupancy?.occupancy || 'Single',
        guests: parseInt(guestsCount, 10),
        price: selectedOccupancy?.price || property.price,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
      };

      await addDoc(collection(db, 'bookings'), bookingData);
      setBookingConfirmed(true);
    } catch (err: any) {
      console.error(err);
      toast({ variant: 'destructive', title: 'Booking Failed', description: err.message });
    } finally {
      setLoading(false);
    }
  };
  
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({ title: 'Link Copied!', description: 'Property link copied to clipboard.' });
  };
  
  const isOwner = userProfile?.activeRole === 'landlord';

  if (!property) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl w-full p-0 overflow-hidden">
          <VisuallyHidden>
            <DialogTitle>{property.title}</DialogTitle>
          </VisuallyHidden>
          
          {bookingConfirmed ? (
            <div className="p-12 text-center space-y-6 max-w-md mx-auto">
              <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto animate-bounce" />
              <h2 className="text-3xl font-bold font-headline text-foreground">Stay Confirmed! 🎉</h2>
              <p className="text-muted-foreground text-sm">
                Your stay at <span className="font-semibold text-foreground">{property.title}</span> has been confirmed. The owner has been notified of your check-in on {checkIn}.
              </p>
              <Button onClick={onClose} className="w-full">Done</Button>
            </div>
          ) : checkoutOpen ? (
            
            /* secure checkout checkout view */
            <div className="grid grid-cols-1 md:grid-cols-2 max-h-[90vh] overflow-y-auto">
              <div className="relative h-64 md:h-full min-h-[250px] bg-muted">
                <Image src={property.image} alt={property.title} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6 text-white">
                  <div>
                    <Badge className="mb-2 bg-primary/95 text-white">{property.category}</Badge>
                    <h3 className="font-headline text-xl md:text-2xl font-bold break-words">{property.title}</h3>
                    <p className="text-xs text-white/80 mt-1 flex items-center">
                      <MapPin className="h-3 w-3 mr-1 shrink-0" />
                      {property.location}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-6 md:p-8 space-y-6">
                <div className="flex justify-between items-center pb-2 border-b">
                  <h2 className="text-xl font-bold font-headline">Secure Checkout</h2>
                  <Button variant="ghost" onClick={() => setCheckoutOpen(false)} className="h-8 w-8 p-0 text-lg">×</Button>
                </div>

                <form onSubmit={handleConfirmBooking} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="checkin">Check-In Date</Label>
                      <Input 
                        id="checkin" 
                        type="date" 
                        required 
                        value={checkIn} 
                        onChange={(e) => setCheckIn(e.target.value)} 
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="checkout">Check-Out Date</Label>
                      <Input 
                        id="checkout" 
                        type="date" 
                        required 
                        value={checkOut} 
                        onChange={(e) => setCheckOut(e.target.value)} 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="occupancy">Occupancy Option</Label>
                      <Select 
                        value={selectedOccupancy?.occupancy || ''} 
                        onValueChange={(val) => {
                          const opt = property.roomOptions.find(o => o.occupancy === val);
                          if (opt) setSelectedOccupancy(opt);
                        }}
                      >
                        <SelectTrigger id="occupancy">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {property.roomOptions.map((opt) => (
                            <SelectItem key={opt.occupancy} value={opt.occupancy}>
                              {opt.occupancy} (₹{formatIndianCurrency(opt.price)}/mo)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="guests">Number of Guests</Label>
                      <Select value={guestsCount} onValueChange={setGuestsCount}>
                        <SelectTrigger id="guests">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 Guest</SelectItem>
                          <SelectItem value="2">2 Guests</SelectItem>
                          <SelectItem value="3">3 Guests</SelectItem>
                          <SelectItem value="4">4 Guests</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="p-4 bg-secondary/80 rounded-lg text-xs space-y-2 pt-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Monthly Rent ({selectedOccupancy?.occupancy || 'Option'}):</span>
                      <span className="font-semibold text-foreground">₹{formatIndianCurrency(selectedOccupancy?.price || property.price)}/month</span>
                    </div>
                    <div className="flex justify-between border-t pt-2 text-sm font-semibold">
                      <span className="font-bold text-foreground">Payable Amount:</span>
                      <span className="font-bold text-primary">₹{formatIndianCurrency(selectedOccupancy?.price || property.price)}</span>
                    </div>
                  </div>

                  <Button type="submit" className="w-full py-6 font-headline text-base" disabled={loading}>
                    {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <ShieldCheck className="mr-2 h-5 w-5" />}
                    Pay & Confirm Booking
                  </Button>
                </form>
              </div>
            </div>
          ) : (

            /* Default Detailed Description View */
            <div className="grid grid-cols-1 md:grid-cols-2 max-h-[90vh] overflow-y-auto">
              
              {/* PRD Hero Section: Cover Image + Total Photos Count Badge */}
              <div className="relative h-64 md:h-full min-h-[320px] bg-muted group overflow-hidden">
                <Image 
                  src={property.image || 'https://placehold.co/800x600.png'} 
                  alt={property.title} 
                  fill 
                  className="object-cover group-hover:scale-[1.03] transition-transform duration-500" 
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
              </div>
              
              <div className="p-6 md:p-8 space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <Badge className="mb-2 bg-primary/95 text-white">{property.category}</Badge>
                    <h2 className="text-2xl md:text-3xl font-headline font-bold break-words">{property.title}</h2>
                    <p className="text-sm text-muted-foreground mt-1 flex items-center">
                      <MapPin className="h-4 w-4 mr-1 shrink-0" />
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
                  <span className="font-semibold text-lg text-primary ml-auto">₹{formatIndianCurrency(property.price)}/mo</span>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-semibold mb-3">🛏️ Sharing & Pricing Options</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {property.roomOptions?.map((opt) => (
                      <div key={opt.occupancy} className="p-3 bg-secondary/60 rounded-md border flex flex-col justify-between">
                        <span className="font-semibold text-muted-foreground">{opt.occupancy} Sharing</span>
                        <span className="font-bold text-primary mt-1">₹{formatIndianCurrency(opt.price)}/mo</span>
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
                  <h3 className="font-semibold mb-3">📍 Location Nearby</h3>
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
                  <h3 className="font-semibold mb-3">💬 User Reviews</h3>
                  <div className="text-sm text-muted-foreground p-3 bg-secondary/50 rounded-md">
                    <p className="italic">“Very clean and safe, close to my college!”</p>
                    <p className="text-right font-semibold mt-1 text-foreground">– Ankit S., BBA Student</p>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="flex flex-col sm:flex-row gap-2 mt-6">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex-1">
                          <Button onClick={handleBookNow} className="w-full py-5 font-headline" disabled={isOwner}>
                            Book Now <ArrowRight className="ml-2" />
                          </Button>
                        </div>
                      </TooltipTrigger>
                      {isOwner && (
                        <TooltipContent>
                          <p>Property owners cannot book properties.</p>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </TooltipProvider>

                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={handleSave} aria-label="Save Property">
                      <Heart className="h-5 w-5" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={handleShare} aria-label="Share Property">
                      <Share2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
                {!user && <p className="text-center text-[10px] text-muted-foreground mt-2">You must be logged in to book/save properties.</p>}

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
                      src={img.url}
                      alt={`${property.title} photo`}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                      className="object-cover"
                      loading="lazy"
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
            
            {/* Left Control button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 z-20 text-white hover:bg-white/20 rounded-full h-10 w-10 shrink-0"
              onClick={() => setLightboxIndex(prev => (prev - 1 + activeCategoryImages.length) % activeCategoryImages.length)}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>

            {/* Picture Container */}
            <div className="relative w-full h-full max-h-[80vh] flex items-center justify-center select-none">
              <Image
                src={activeCategoryImages[lightboxIndex]?.url || ''}
                alt={`Image ${lightboxIndex + 1}`}
                width={1200}
                height={900}
                className="max-w-full max-h-full object-contain"
                priority
              />
            </div>

            {/* Right Control button */}
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
