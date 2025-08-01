import type { Timestamp } from 'firebase/firestore';

export type Amenity = 'WiFi' | 'AC' | 'Food' | 'Parking' | 'Laundry' | 'Geyser' | 'Housekeeping' | 'CCTV';
export type PropertyType = 'Boys' | 'Girls' | 'Co-ed';
export type PropertyCategory = 'Hostel' | 'PG' | 'Room' | 'Hotel';
export type PropertyStatus = 'pending' | 'approved' | 'rejected';

export interface RoomOption {
  occupancy: 'Single' | 'Double' | 'Triple';
  price: number;
}

export interface Property {
  id: string;
  title: string;
  image: string;
  images?: string[];
  dataAiHint?: string;
  price: number;
  location: string;
  city: string;
  rating: number;
  reviews: number;
  type: PropertyType;
  category: PropertyCategory;
  amenities: Amenity[];
  description: string;
  roomOptions: RoomOption[];
  map: {
    lat: number;
    lng: number;
    nearby: {
      name: string;
      distance: string;
    }[];
  };
  status: PropertyStatus;
  ownerId: string;
  createdAt?: number | Timestamp;
}

export type UserProfileType = 'student' | 'professional' | 'owner';

export interface UserProfile {
    uid: string;
    email: string;
    name: string;
    profileType: UserProfileType;
    createdAt: string;

    // Owner-specific fields
    phone?: string;
    address?: string;
    companyType?: 'individual' | 'company';
}
