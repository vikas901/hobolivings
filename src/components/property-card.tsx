'use client';

import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Property } from '@/lib/types';
import { Star, MapPin, Wifi, Wind, UtensilsCrossed, ParkingCircle, ArrowRight, WashingMachine, Bath, Sparkles, Camera } from 'lucide-react';

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
      className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
      onClick={() => onCardClick(property)}
    >
      <CardHeader className="p-0 relative">
        <Badge className="absolute top-2 right-2 z-10 bg-accent text-accent-foreground">{property.type}</Badge>
        <Image
          src={property.image}
          alt={property.title}
          width={600}
          height={400}
          className="w-full h-48 object-cover"
          data-ai-hint={property.dataAiHint}
        />
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="font-headline text-lg mb-2 truncate">{property.title}</CardTitle>
        <div className="flex items-center text-sm text-muted-foreground mb-2">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{property.location}</span>
        </div>
        <div className="flex justify-between items-center mb-4">
           <div className="flex items-center gap-2">
            {property.amenities.slice(0, 4).map((amenity) => (
              <div key={amenity} className="flex items-center justify-center h-8 w-8 rounded-full bg-secondary text-secondary-foreground" title={amenity}>
                {amenityIcons[amenity]}
              </div>
            ))}
          </div>
          <div className="flex items-center">
            <Star className="h-5 w-5 text-yellow-500 mr-1" />
            <span className="font-bold">{property.rating.toFixed(1)}</span>
            <span className="text-xs text-muted-foreground ml-1">({property.reviews})</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 bg-secondary/50 flex justify-between items-center">
        <div>
            <p className="text-xl font-bold text-primary">₹{property.price.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">/ month</p>
        </div>
        <Button>
          View Details <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
