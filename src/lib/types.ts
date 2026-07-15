import type { Timestamp } from 'firebase/firestore';

export type Amenity = 'WiFi' | 'AC' | 'Food' | 'Parking' | 'Laundry' | 'Geyser' | 'Housekeeping' | 'CCTV';
export type PropertyType = 'Boys' | 'Girls' | 'Co-ed';
export type PropertyCategory = 'Hostel' | 'PG' | 'Room' | 'Hotel';
export type PropertyStatus = 'pending' | 'approved' | 'rejected';

export interface RoomOption {
  occupancy: 'Single' | 'Double' | 'Triple';
  price: number;
}

export interface CategorizedImage {
  id: string;
  category: string;
  url: string;
  displayOrder: number;
  uploadedAt: number;
  uploadedBy: string;
}

export interface PropertyMedia {
  coverPhoto?: CategorizedImage | null;
  bedroom?: CategorizedImage[];
  bathroom?: CategorizedImage[];
  buildingExterior?: CategorizedImage[];
  corridor?: CategorizedImage[];
  kitchen?: CategorizedImage[];
  dining?: CategorizedImage[];
  balcony?: CategorizedImage[];
  amenities?: CategorizedImage[];
  parking?: CategorizedImage[];
  laundry?: CategorizedImage[];
  nearby?: CategorizedImage[];
  floorPlan?: CategorizedImage[];
}

export interface Property {
  id: string;
  title: string;
  image: string;
  images?: string[];
  media?: PropertyMedia;
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
    profileType?: UserProfileType;
    createdAt: string;
    isAdmin?: boolean;
    roles: ('tenant' | 'landlord')[];
    activeRole: 'tenant' | 'landlord';
    tenantType?: 'student' | 'professional';
    landlordKycStatus?: 'pending' | 'verified' | 'rejected' | 'none';
    landlordKycData?: {
      phone?: string;
      address?: string;
      companyType?: 'individual' | 'company';
      govtIdUrl?: string;
      selfieUrl?: string;
      ownershipProofUrl?: string;
      bankDetails?: {
        holderName: string;
        accountNumber: string;
        ifscCode: string;
      };
    };
    favorites?: string[];

    // Legacy fields for backward compatibility
    phone?: string;
    address?: string;
    companyType?: 'individual' | 'company';
}
