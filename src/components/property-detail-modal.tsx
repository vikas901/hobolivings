'use client';

import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type { Property } from '@/lib/types';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import {
  Star, MapPin, Wifi, Wind, UtensilsCrossed, ParkingCircle, WashingMachine, Bath, Sparkles, Camera, Heart, Share2, ArrowRight
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface PropertyDetailModalProps {
  property: Property;
  isOpen: boolean;
  onClose: () => void;
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

export function PropertyDetailModal({ property, isOpen, onClose }: PropertyDetailModalProps) {
  const { user, userProfile } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const handleBookNow = () => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please login to book a property.',
        variant: 'destructive',
      });
      router.push('/login');
    } else {
      toast({
        title: 'Coming Soon!',
        description: 'Booking functionality is not yet implemented.',
      });
    }
  };

  const handleSave = () => {
    toast({ title: 'Saved!', description: 'Property saved to your favorites.' });
  };
  
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({ title: 'Link Copied!', description: 'Property link copied to clipboard.' });
  };
  
  const isOwner = userProfile?.profileType === 'owner';

  if (!property) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full p-0">
        <div className="grid grid-cols-1 md:grid-cols-2 max-h-[90vh] overflow-hidden">
          <div className="relative">
             <Carousel className="w-full h-full">
              <CarouselContent>
                {property.images?.map((img, index) => (
                  <CarouselItem key={index}>
                    <Image src={img} alt={`${property.title} gallery image ${index + 1}`} width={800} height={600} className="w-full h-full object-cover" data-ai-hint="property interior" />
                  </CarouselItem>
                )) || <Image src={property.image} alt={property.title} width={800} height={600} className="w-full h-full object-cover" data-ai-hint="property exterior" />}
              </CarouselContent>
              <CarouselPrevious className="left-4" />
              <CarouselNext className="right-4" />
            </Carousel>
          </div>

          <div className="p-6 overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-headline text-2xl md:text-3xl mb-2">{property.title}</DialogTitle>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Star className="h-4 w-4 mr-1 text-yellow-500" />
                  <span>{property.rating.toFixed(1)} ({property.reviews} Reviews)</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{property.location}</span>
                </div>
              </div>
              <div className="flex items-baseline gap-2 mt-2">
                 <p className="text-2xl font-bold text-primary">₹{property.price.toLocaleString()}/month</p>
                 <Badge>{property.type} {property.category}</Badge>
              </div>
            </DialogHeader>

            <Separator className="my-4" />

            <div>
              <h3 className="font-semibold mb-2">🧾 Description</h3>
              <p className="text-sm text-muted-foreground">{property.description}</p>
            </div>

            <Separator className="my-4" />

            <div>
                <h3 className="font-semibold mb-3">🛏️ Amenities</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                    {property.amenities.map(amenity => (
                        <div key={amenity} className="flex items-center gap-2">
                           {amenityIcons[amenity]}
                           <span>{amenity}</span>
                        </div>
                    ))}
                </div>
            </div>

            <Separator className="my-4" />
            
            <div>
                <h3 className="font-semibold mb-3">📏 Room Options</h3>
                <div className="space-y-2">
                    {property.roomOptions.map(option => (
                        <div key={option.occupancy} className="flex justify-between items-center text-sm p-2 bg-secondary/50 rounded-md">
                            <span>{option.occupancy} Occupancy</span>
                            <span className="font-semibold">₹{option.price.toLocaleString()}/month</span>
                        </div>
                    ))}
                </div>
            </div>

            <Separator className="my-4" />
            
            <div>
              <h3 className="font-semibold mb-3">🗺️ Location</h3>
              <div className="h-40 bg-muted rounded-lg flex items-center justify-center text-muted-foreground mb-4">
                Map View Placeholder
              </div>
              <div className="space-y-2 text-sm">
                 {property.map.nearby.map(place => (
                    <div key={place.name} className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-primary" />
                      <span><span className="font-semibold">{place.distance}</span> from {place.name}</span>
                    </div>
                 ))}
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div>
                <h3 className="font-semibold mb-3">💬 User Reviews</h3>
                <div className="text-sm text-muted-foreground p-3 bg-secondary/50 rounded-md">
                    <p className="italic">“Very clean and safe, close to my college!”</p>
                    <p className="text-right font-semibold mt-1">– Ankit S., BBA Student</p>
                </div>
            </div>

             <Separator className="my-4" />

            <div className="flex flex-col sm:flex-row gap-2 mt-6">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex-1">
                        <Button onClick={handleBookNow} className="w-full font-headline" disabled={isOwner}>
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
             {!user && <p className="text-center text-xs text-muted-foreground mt-2">You must be logged in to book.</p>}

          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
