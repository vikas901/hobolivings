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

export type BookingType = 'free_visit' | 'bed_hold' | 'inquiry';
export type BookingStatus = 'Visit Scheduled' | 'Bed Held (48h)' | 'Visited' | 'Move-in Finalized' | 'Cancelled';
export type VisitTimeSlot = 'Morning (10:00 AM - 1:00 PM)' | 'Afternoon (2:00 PM - 5:00 PM)' | 'Evening (5:00 PM - 8:00 PM)';
export type MoveInTimeline = 'Immediate' | 'Within 7 Days' | 'Next 2 Weeks' | 'Next Month';

export interface Booking {
  id?: string;
  bookingType: BookingType;
  status: BookingStatus;
  
  // Property Info
  propertyId: string;
  propertyTitle: string;
  propertyLocation: string;
  propertyCity?: string;
  propertyImage?: string;
  occupancy: 'Single' | 'Double' | 'Triple';
  price: number;

  // Tenant / Visitor Info
  tenantId?: string;
  tenantName: string;
  tenantPhone: string;
  tenantEmail?: string;
  tenantCollegeOrWork?: string;
  
  // Visit & Timeline details
  visitDate?: string;
  visitTimeSlot?: VisitTimeSlot;
  moveInTimeline?: MoveInTimeline;
  specialRequests?: string;

  // Timestamps
  createdAt: string | number;
  updatedAt?: string | number;
  bedHoldExpiresAt?: string;
}
