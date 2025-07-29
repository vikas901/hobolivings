export type Amenity = 'WiFi' | 'AC' | 'Food' | 'Parking';
export type PropertyType = 'Boys' | 'Girls' | 'Co-ed';
export type PropertyCategory = 'Hostel' | 'PG' | 'Room' | 'Hotel';

export interface Property {
  id: string;
  title: string;
  image: string;
  dataAiHint?: string;
  price: number;
  location: string;
  city: string;
  rating: number;
  type: PropertyType;
  category: PropertyCategory;
  amenities: Amenity[];
  description: string;
}
