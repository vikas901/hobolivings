'use client';

import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Property } from '@/lib/types';
import { Star, MapPin, Wifi, Wind, UtensilsCrossed, ParkingCircle, ArrowRight, WashingMachine, Bath, Sparkles, Camera, MessageCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { formatIndianCurrency } from '@/components/ui/currency-input';

interface PropertyCardProps {
  property: Property;
  onCardClick: (property: Property) => void;
}

const amenityIcons: { [key: string]: React.ReactNode } = {
  WiFi: <Wifi className="h-4 w-4" />,
  AC: <Wind className="h-4 w-4" />,
  Food: <UtensilsCrossed className="h-4 w-4" />,
  Parking: <ParkingCircle className="h-4 w-4" />,
  Laundry: <WashingMachine className="h-4 w-4" />,
  Geyser: <Bath className="h-4 w-4" />,
  Housekeeping: <Sparkles className="h-4 w-4" />,
  CCTV: <Camera className="h-4 w-4" />,
};

const getValidImageUrl = (image: any, images: any): string => {
  const fallback = 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800';
  if (typeof image === 'string' && image.trim().length > 0 && !image.includes('placehold.co')) {
    return image;
  }
  if (Array.isArray(images) && images.length > 0 && typeof images[0] === 'string' && !images[0].includes('placehold.co')) {
    return images[0];
  }
  return fallback;
};

export default function PropertyCard({ property, onCardClick }: PropertyCardProps) {
  const imageUrl = getValidImageUrl(property.image, property.images);
  const safeAmenities = Array.isArray(property.amenities) ? property.amenities : [];
  const safeRating = typeof property.rating === 'number' ? property.rating.toFixed(1) : '4.5';
  const safeReviews = typeof property.reviews === 'number' ? property.reviews : 0;
  const photoCount = (Array.isArray(property.images) && property.images.length > 0) ? property.images.length : 1;

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const priceText = formatIndianCurrency(property.price || 0);
    const message = `Hi Hobo Livings team! 👋 I am interested in visiting *${property.title || 'Accommodation'}* in *${property.location || 'Greater Noida'}, ${property.city || ''}* (Rent: ₹${priceText}/mo).\nIs a bed available for a free physical site visit?`;
    window.open(`https://wa.me/918920642742?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <Card 
      className="flex flex-col overflow-hidden shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer group"
      onClick={() => onCardClick(property)}
      data-property-id={property.id}
      data-property-title={property.title}
      data-property-price={property.price}
      data-property-city={property.city}
      data-property-type={property.type}
      aria-label={`View details and schedule visit for ${property.title || 'Property'} in ${property.city || 'Greater Noida'}`}
    >
      <CardHeader className="p-0 relative">
        <Badge className="absolute top-2 right-2 z-10 bg-accent text-accent-foreground shadow-md">{property.type || 'Co-ed'}</Badge>
        <div className="relative w-full aspect-[4/3] overflow-hidden bg-muted">
          <Image
            src={imageUrl}
            alt={`Exterior and room view of ${property.title || 'Property'} in ${property.location || 'Greater Noida'}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            data-ai-hint={property.dataAiHint || 'property room'}
            unoptimized
          />
          {/* Photo count badge */}
          <Badge className="absolute bottom-2 left-2 z-10 bg-black/70 text-white hover:bg-black/80 border-none flex items-center gap-1 font-medium text-[10px]">
            <Camera className="h-3 w-3" />
            {photoCount} Photo{photoCount !== 1 && 's'}
          </Badge>
          {/* Gradient overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <CardTitle className="font-headline text-lg mb-2 line-clamp-2 min-h-[3.5rem] leading-7">
                {property.title || 'Accommodation Unit'}
              </CardTitle>
            </TooltipTrigger>
            {(property.title || '').length > 40 && (
              <TooltipContent className="max-w-[280px]">
                <p>{property.title}</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
        <div className="flex items-center text-sm text-muted-foreground mb-2">
          <MapPin className="h-4 w-4 mr-1 shrink-0 text-primary" />
          <span className="line-clamp-1">{property.location || 'Location'}, {property.city || 'City'}</span>
        </div>

        {/* Zero Brokerage & Free Visit Trust Pill */}
        <div className="flex items-center gap-1.5 mb-3 flex-wrap">
          <span className="inline-flex items-center text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            ✓ Zero Brokerage
          </span>
          <span className="inline-flex items-center text-[11px] font-medium text-blue-700 dark:blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
            🗓️ 48h Bed Hold
          </span>
        </div>
        <div className="flex justify-between items-center mb-4">
           <div className="flex items-center gap-2">
            {safeAmenities.slice(0, 4).map((amenity) => (
              <TooltipProvider key={amenity} delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-secondary text-secondary-foreground" title={amenity}>
                      {amenityIcons[amenity]}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent><p>{amenity}</p></TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
            {safeAmenities.length > 4 && (
              <span className="text-xs text-muted-foreground font-medium">+{safeAmenities.length - 4}</span>
            )}
          </div>
          <div className="flex items-center">
            <Star className="h-5 w-5 text-yellow-500 fill-yellow-500 mr-1" />
            <span className="font-bold">{safeRating}</span>
            <span className="text-xs text-muted-foreground ml-1">({safeReviews})</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 bg-secondary/50 flex justify-between items-center gap-2">
        <div className="min-w-0">
          <p className="text-lg md:text-xl font-bold text-primary font-mono truncate">₹{formatIndianCurrency(property.price || 0)}</p>
          <p className="text-[10px] md:text-[11px] text-muted-foreground font-medium truncate">/ mo (₹0 Brokerage)</p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleWhatsAppClick}
            className="h-8 md:h-9 px-2 md:px-2.5 rounded-lg border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-700 transition-colors shadow-xs flex items-center gap-1 text-xs font-semibold"
            title="Chat on WhatsApp"
            aria-label="Chat on WhatsApp about this property"
          >
            <MessageCircle className="h-4 w-4 fill-emerald-500/20 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden sm:inline">WhatsApp</span>
          </Button>

          <Button 
            size="sm"
            className="group-hover:gap-2 transition-all font-semibold text-xs h-8 md:h-9 px-3"
            aria-label={`View details and schedule visit for ${property.title || 'property'}`}
          >
            View & Book <ArrowRight className="ml-1 h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
