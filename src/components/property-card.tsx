'use client';

import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Property } from '@/lib/types';
import { Star, MapPin, Wifi, Wind, UtensilsCrossed, ParkingCircle, ArrowRight, WashingMachine, Bath, Sparkles, Camera } from 'lucide-react';
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

export default function PropertyCard({ property, onCardClick }: PropertyCardProps) {
  
  return (
    <Card 
      className="flex flex-col overflow-hidden shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer group"
      onClick={() => onCardClick(property)}
    >
      <CardHeader className="p-0 relative">
        <Badge className="absolute top-2 right-2 z-10 bg-accent text-accent-foreground shadow-md">{property.type}</Badge>
        <div className="relative w-full aspect-[4/3] overflow-hidden bg-muted">
          <Image
            src={property.image || 'https://placehold.co/600x400.png'}
            alt={`Exterior view of ${property.title}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            data-ai-hint={property.dataAiHint}
          />
          {/* Photo count badge */}
          {((property.images && property.images.length > 0) || property.image) && (
            <Badge className="absolute bottom-2 left-2 z-10 bg-black/70 text-white hover:bg-black/80 border-none flex items-center gap-1 font-medium text-[10px]">
              <Camera className="h-3 w-3" />
              {property.images?.length || 1} Photo{(property.images?.length || 1) !== 1 && 's'}
            </Badge>
          )}
          {/* Gradient overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <CardTitle className="font-headline text-lg mb-2 line-clamp-2 min-h-[3.5rem] leading-7">
                {property.title}
              </CardTitle>
            </TooltipTrigger>
            {property.title.length > 40 && (
              <TooltipContent className="max-w-[280px]">
                <p>{property.title}</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
        <div className="flex items-center text-sm text-muted-foreground mb-2">
          <MapPin className="h-4 w-4 mr-1 shrink-0" />
          <span className="line-clamp-1">{property.location}, {property.city}</span>
        </div>
        <div className="flex justify-between items-center mb-4">
           <div className="flex items-center gap-2">
            {property.amenities.slice(0, 4).map((amenity) => (
              <TooltipProvider key={amenity} delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-secondary text-secondary-foreground">
                      {amenityIcons[amenity]}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent><p>{amenity}</p></TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
            {property.amenities.length > 4 && (
              <span className="text-xs text-muted-foreground font-medium">+{property.amenities.length - 4}</span>
            )}
          </div>
          <div className="flex items-center">
            <Star className="h-5 w-5 text-yellow-500 fill-yellow-500 mr-1" />
            <span className="font-bold">{property.rating.toFixed(1)}</span>
            <span className="text-xs text-muted-foreground ml-1">({property.reviews})</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 bg-secondary/50 flex justify-between items-center">
        <div>
            <p className="text-xl font-bold text-primary">₹{formatIndianCurrency(property.price)}</p>
            <p className="text-xs text-muted-foreground">/ month</p>
        </div>
        <Button className="group-hover:gap-3 transition-all">
          View Details <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
        </Button>
      </CardFooter>
    </Card>
  );
}
