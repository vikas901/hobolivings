import type { Property } from './types';

const ADMIN_OWNER_UID = 'hobo_official_owner';

export const properties: Property[] = [
  // ==================== DELHI ====================
  {
    id: 'delhi-hostel-1',
    title: 'North Campus Student Hostel',
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=800'
    ],
    dataAiHint: 'student hostel delhi',
    price: 12000,
    location: 'Vijay Nagar, Near DU North Campus',
    city: 'Delhi',
    rating: 4.8,
    reviews: 124,
    type: 'Boys',
    category: 'Hostel',
    amenities: ['WiFi', 'AC', 'Food', 'Laundry', 'Housekeeping', 'CCTV', 'Geyser'],
    description: 'Vibrant student hostel located 5 minutes from Delhi University North Campus colleges. Offers 4-time meals, high-speed WiFi, bio-metric entry, and study lounges.',
    roomOptions: [
      { occupancy: 'Double', price: 12000 },
      { occupancy: 'Single', price: 17000 }
    ],
    map: { lat: 28.69, lng: 77.2, nearby: [{ name: 'Vishwavidyalaya Metro', distance: '600m' }, { name: 'SRCC College', distance: '800m' }] },
    status: 'approved',
    ownerId: ADMIN_OWNER_UID,
    createdAt: Date.now() - 86400000 * 30
  },
  {
    id: 'delhi-pg-1',
    title: 'South Campus Girls Luxury PG',
    image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&q=80&w=800'
    ],
    dataAiHint: 'girls pg delhi',
    price: 14500,
    location: 'Satya Niketan, Near Venkateswara College',
    city: 'Delhi',
    rating: 4.9,
    reviews: 98,
    type: 'Girls',
    category: 'PG',
    amenities: ['WiFi', 'AC', 'Food', 'CCTV', 'Geyser', 'Housekeeping'],
    description: 'Safe and aesthetic PG for female students. Located in Satya Niketan food street lane with 24/7 security warden, keycard access, and nutritious hygienic meals.',
    roomOptions: [
      { occupancy: 'Double', price: 14500 },
      { occupancy: 'Single', price: 21000 }
    ],
    map: { lat: 28.58, lng: 77.16, nearby: [{ name: 'Durgabai Deshmukh South Campus Metro', distance: '400m' }] },
    status: 'approved',
    ownerId: ADMIN_OWNER_UID,
    createdAt: Date.now() - 86400000 * 25
  },
  {
    id: 'delhi-room-1',
    title: 'Furnished Independent Room in Laxmi Nagar',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800'
    ],
    dataAiHint: 'independent room delhi',
    price: 9500,
    location: 'Vikas Marg, Laxmi Nagar',
    city: 'Delhi',
    rating: 4.3,
    reviews: 42,
    type: 'Co-ed',
    category: 'Room',
    amenities: ['WiFi', 'AC', 'Parking', 'Geyser'],
    description: 'Fully furnished independent room with attached balcony and modern washroom. Great for CA/UPSC aspirants and young professionals.',
    roomOptions: [
      { occupancy: 'Single', price: 9500 }
    ],
    map: { lat: 28.63, lng: 77.27, nearby: [{ name: 'Laxmi Nagar Metro', distance: '300m' }] },
    status: 'approved',
    ownerId: ADMIN_OWNER_UID,
    createdAt: Date.now() - 86400000 * 20
  },
  {
    id: 'delhi-hotel-1',
    title: 'Executive Long-Stay Hotel Dwarka',
    image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800'
    ],
    dataAiHint: 'hotel stay dwarka',
    price: 26000,
    location: 'Sector 12, Dwarka',
    city: 'Delhi',
    rating: 4.7,
    reviews: 86,
    type: 'Co-ed',
    category: 'Hotel',
    amenities: ['WiFi', 'AC', 'Food', 'Housekeeping', 'Parking', 'CCTV'],
    description: 'Premium serviced hotel suite tailored for monthly corporate stays and airport commuters. Includes daily breakfast, housekeeping, and gym access.',
    roomOptions: [
      { occupancy: 'Single', price: 26000 }
    ],
    map: { lat: 28.59, lng: 77.04, nearby: [{ name: 'Dwarka Sector 12 Metro', distance: '500m' }, { name: 'IGI Airport', distance: '12km' }] },
    status: 'approved',
    ownerId: ADMIN_OWNER_UID,
    createdAt: Date.now() - 86400000 * 15
  },

  // ==================== NOIDA ====================
  {
    id: 'noida-hostel-1',
    title: 'Sector 62 Premium Boys Hostel',
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800'
    ],
    dataAiHint: 'boys hostel noida',
    price: 13500,
    location: 'Institutional Area, Sector 62',
    city: 'Noida',
    rating: 4.8,
    reviews: 142,
    type: 'Boys',
    category: 'Hostel',
    amenities: ['WiFi', 'AC', 'Food', 'Laundry', 'Housekeeping', 'CCTV', 'Parking'],
    description: 'Top-rated student hostel in Noida Sector 62 IT hub. Close to JSS Academy, Jaypee, and major IT parks with 4-time meals and high-speed fiber internet.',
    roomOptions: [
      { occupancy: 'Double', price: 13500 },
      { occupancy: 'Single', price: 19500 }
    ],
    map: { lat: 28.62, lng: 77.37, nearby: [{ name: 'Noida Sector 62 Metro', distance: '400m' }] },
    status: 'approved',
    ownerId: ADMIN_OWNER_UID,
    createdAt: Date.now() - 86400000 * 28
  },
  {
    id: 'noida-pg-1',
    title: 'Sector 125 Safe Girls PG',
    image: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&q=80&w=800'
    ],
    dataAiHint: 'girls pg noida',
    price: 15000,
    location: 'Sector 125, Near Amity University',
    city: 'Noida',
    rating: 4.9,
    reviews: 165,
    type: 'Girls',
    category: 'PG',
    amenities: ['WiFi', 'AC', 'Food', 'Laundry', 'CCTV', 'Housekeeping', 'Geyser'],
    description: 'Ultra-safe residential PG for female students of Amity University. Offers bio-metric security, balcony views, daily room cleaning, and homely food.',
    roomOptions: [
      { occupancy: 'Double', price: 15000 },
      { occupancy: 'Single', price: 23000 }
    ],
    map: { lat: 28.54, lng: 77.33, nearby: [{ name: 'Amity University Gate 2', distance: '300m' }] },
    status: 'approved',
    ownerId: ADMIN_OWNER_UID,
    createdAt: Date.now() - 86400000 * 22
  },
  {
    id: 'noida-room-1',
    title: 'Studio Room near Advant IT Park',
    image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800'
    ],
    dataAiHint: 'studio room noida',
    price: 17500,
    location: 'Sector 137, Expressway',
    city: 'Noida',
    rating: 4.7,
    reviews: 74,
    type: 'Co-ed',
    category: 'Room',
    amenities: ['WiFi', 'AC', 'Housekeeping', 'Parking', 'Laundry'],
    description: 'Modern, fully-furnished studio apartment room tailored for software engineers and corporate executives working near Advant Navis.',
    roomOptions: [
      { occupancy: 'Single', price: 17500 }
    ],
    map: { lat: 28.51, lng: 77.41, nearby: [{ name: 'Advant IT Park', distance: '600m' }, { name: 'Sector 137 Metro', distance: '500m' }] },
    status: 'approved',
    ownerId: ADMIN_OWNER_UID,
    createdAt: Date.now() - 86400000 * 18
  },
  {
    id: 'noida-hotel-1',
    title: 'Boutique Corporate Hotel Sector 18',
    image: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800'
    ],
    dataAiHint: 'hotel noida sec 18',
    price: 28000,
    location: 'Sector 18, Near DLF Mall',
    city: 'Noida',
    rating: 4.6,
    reviews: 92,
    type: 'Co-ed',
    category: 'Hotel',
    amenities: ['WiFi', 'AC', 'Food', 'Housekeeping', 'Parking', 'CCTV'],
    description: 'Serviced monthly hotel suite in the commercial center of Noida Sector 18. Perfect access to Metro, Mall of India, and fine dining.',
    roomOptions: [
      { occupancy: 'Single', price: 28000 }
    ],
    map: { lat: 28.57, lng: 77.32, nearby: [{ name: 'DLF Mall of India', distance: '400m' }, { name: 'Sector 18 Metro', distance: '300m' }] },
    status: 'approved',
    ownerId: ADMIN_OWNER_UID,
    createdAt: Date.now() - 86400000 * 12
  },

  // ==================== GREATER NOIDA ====================
  {
    id: 'grnoida-hostel-1',
    title: 'Knowledge Park Student Hub Hostel',
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=800'
    ],
    dataAiHint: 'knowledge park hostel',
    price: 11000,
    location: 'Knowledge Park II, Near Sharda & Galgotias',
    city: 'Greater Noida',
    rating: 4.7,
    reviews: 135,
    type: 'Co-ed',
    category: 'Hostel',
    amenities: ['WiFi', 'AC', 'Food', 'Laundry', 'Geyser', 'CCTV', 'Housekeeping'],
    description: 'Spacious student hostel located in the heart of Knowledge Park II. Walking distance from Sharda University, Galgotias, and GL Bajaj.',
    roomOptions: [
      { occupancy: 'Triple', price: 11000 },
      { occupancy: 'Double', price: 13500 }
    ],
    map: { lat: 28.47, lng: 77.5, nearby: [{ name: 'Sharda University', distance: '500m' }, { name: 'Knowledge Park II Metro', distance: '700m' }] },
    status: 'approved',
    ownerId: ADMIN_OWNER_UID,
    createdAt: Date.now() - 86400000 * 29
  },
  {
    id: 'grnoida-pg-1',
    title: 'Alpha 1 Executive Boys PG',
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80&w=800'
    ],
    dataAiHint: 'alpha 1 boys pg',
    price: 8500,
    location: 'Commercial Belt, Alpha 1',
    city: 'Greater Noida',
    rating: 4.4,
    reviews: 58,
    type: 'Boys',
    category: 'PG',
    amenities: ['WiFi', 'Food', 'Parking', 'Geyser', 'Housekeeping'],
    description: 'Affordable, clean PG for boys right next to Alpha 1 Commercial Belt and Metro Station. Includes 3 meals daily and laundry services.',
    roomOptions: [
      { occupancy: 'Triple', price: 8500 },
      { occupancy: 'Double', price: 10500 }
    ],
    map: { lat: 28.46, lng: 77.51, nearby: [{ name: 'Alpha 1 Metro', distance: '300m' }] },
    status: 'approved',
    ownerId: ADMIN_OWNER_UID,
    createdAt: Date.now() - 86400000 * 24
  },
  {
    id: 'grnoida-room-1',
    title: 'Gated Society Room in Pari Chowk',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=800'
    ],
    dataAiHint: 'pari chowk room',
    price: 10500,
    location: 'Beta II, Near Pari Chowk',
    city: 'Greater Noida',
    rating: 4.5,
    reviews: 39,
    type: 'Co-ed',
    category: 'Room',
    amenities: ['WiFi', 'AC', 'Parking', 'Housekeeping', 'Geyser'],
    description: 'Private furnished room in a gated high-rise society near Pari Chowk. Quiet environment, ideal for researchers and senior students.',
    roomOptions: [
      { occupancy: 'Single', price: 10500 }
    ],
    map: { lat: 28.46, lng: 77.51, nearby: [{ name: 'Pari Chowk', distance: '800m' }] },
    status: 'approved',
    ownerId: ADMIN_OWNER_UID,
    createdAt: Date.now() - 86400000 * 19
  },
  {
    id: 'grnoida-hotel-1',
    title: 'Expressway Stay Hotel Techzone 4',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800'
    ],
    dataAiHint: 'techzone hotel',
    price: 22000,
    location: 'Techzone 4, Greater Noida West',
    city: 'Greater Noida',
    rating: 4.6,
    reviews: 48,
    type: 'Co-ed',
    category: 'Hotel',
    amenities: ['WiFi', 'AC', 'Food', 'Housekeeping', 'Parking', 'CCTV'],
    description: 'Modern corporate hotel suite for monthly stays in Greater Noida West. Fully air-conditioned with restaurant and high-speed Wi-Fi.',
    roomOptions: [
      { occupancy: 'Single', price: 22000 }
    ],
    map: { lat: 28.53, lng: 77.45, nearby: [{ name: 'Gaur City Mall', distance: '1.5km' }] },
    status: 'approved',
    ownerId: ADMIN_OWNER_UID,
    createdAt: Date.now() - 86400000 * 14
  },

  // ==================== GURGAON ====================
  {
    id: 'gurgaon-hostel-1',
    title: 'Cyber City Techies Hostel',
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800'
    ],
    dataAiHint: 'cyber city hostel',
    price: 16000,
    location: 'Sector 24, Near DLF Cyber City',
    city: 'Gurgaon',
    rating: 4.9,
    reviews: 188,
    type: 'Boys',
    category: 'Hostel',
    amenities: ['WiFi', 'AC', 'Food', 'Laundry', 'Housekeeping', 'Parking', 'CCTV'],
    description: 'High-tech hostel for tech professionals and interns near Cyber Hub. Work-from-hostel setups, ergonomic desks, and 24/7 power backup.',
    roomOptions: [
      { occupancy: 'Double', price: 16000 },
      { occupancy: 'Single', price: 24000 }
    ],
    map: { lat: 28.49, lng: 77.09, nearby: [{ name: 'Cyber City Rapid Metro', distance: '500m' }, { name: 'Cyber Hub', distance: '700m' }] },
    status: 'approved',
    ownerId: ADMIN_OWNER_UID,
    createdAt: Date.now() - 86400000 * 27
  },
  {
    id: 'gurgaon-pg-1',
    title: 'Golf Course Road Girls Luxury PG',
    image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&q=80&w=800'
    ],
    dataAiHint: 'golf course road pg',
    price: 18500,
    location: 'Sector 43, Golf Course Road',
    city: 'Gurgaon',
    rating: 4.9,
    reviews: 140,
    type: 'Girls',
    category: 'PG',
    amenities: ['WiFi', 'AC', 'Food', 'Laundry', 'CCTV', 'Housekeeping', 'Geyser'],
    description: 'Ultra-premium PG for women in Gurgaon prime sector. Gourmet food menu, rooftop garden, bi-weekly linen change, and biometric access.',
    roomOptions: [
      { occupancy: 'Double', price: 18500 },
      { occupancy: 'Single', price: 27000 }
    ],
    map: { lat: 28.45, lng: 77.09, nearby: [{ name: 'Sector 42-43 Rapid Metro', distance: '300m' }] },
    status: 'approved',
    ownerId: ADMIN_OWNER_UID,
    createdAt: Date.now() - 86400000 * 21
  },
  {
    id: 'gurgaon-room-1',
    title: 'Private Co-Living Room in Sohna Road',
    image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80&w=800'
    ],
    dataAiHint: 'sohna road coliving',
    price: 15000,
    location: 'Sector 48, Sohna Road',
    city: 'Gurgaon',
    rating: 4.6,
    reviews: 63,
    type: 'Co-ed',
    category: 'Room',
    amenities: ['WiFi', 'AC', 'Parking', 'Housekeeping', 'Geyser'],
    description: 'Spacious private room in a vibrant co-living apartment near Subhash Chowk. High-speed optical fiber, lounge access, and gaming zone.',
    roomOptions: [
      { occupancy: 'Single', price: 15000 }
    ],
    map: { lat: 28.41, lng: 77.04, nearby: [{ name: 'Vatika Business Park', distance: '400m' }] },
    status: 'approved',
    ownerId: ADMIN_OWNER_UID,
    createdAt: Date.now() - 86400000 * 16
  },
  {
    id: 'gurgaon-hotel-1',
    title: 'Corporate Suites MG Road',
    image: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80&w=800'
    ],
    dataAiHint: 'mg road hotel',
    price: 32000,
    location: 'MG Road, Near MGF Metropolitan Mall',
    city: 'Gurgaon',
    rating: 4.8,
    reviews: 110,
    type: 'Co-ed',
    category: 'Hotel',
    amenities: ['WiFi', 'AC', 'Food', 'Housekeeping', 'Parking', 'CCTV'],
    description: '5-star style long stay hotel room right on MG Road. In-room dining, laundry service, airport pickup, and executive lounges.',
    roomOptions: [
      { occupancy: 'Single', price: 32000 }
    ],
    map: { lat: 28.48, lng: 77.08, nearby: [{ name: 'MG Road Metro', distance: '200m' }] },
    status: 'approved',
    ownerId: ADMIN_OWNER_UID,
    createdAt: Date.now() - 86400000 * 10
  },

  // ==================== GHAZIABAD ====================
  {
    id: 'ghaziabad-hostel-1',
    title: 'Indirapuram Youth Hostel',
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800'
    ],
    dataAiHint: 'indirapuram hostel',
    price: 9000,
    location: 'Ahinsa Khand 1, Indirapuram',
    city: 'Ghaziabad',
    rating: 4.5,
    reviews: 52,
    type: 'Boys',
    category: 'Hostel',
    amenities: ['WiFi', 'Food', 'Laundry', 'CCTV', 'Geyser'],
    description: 'Well-maintained hostel for students and job seekers in Indirapuram. Quick access to Noida Sector 62 and Electronic City Metro.',
    roomOptions: [
      { occupancy: 'Triple', price: 9000 },
      { occupancy: 'Double', price: 11000 }
    ],
    map: { lat: 28.64, lng: 77.37, nearby: [{ name: 'Noida Electronic City Metro', distance: '1.2km' }] },
    status: 'approved',
    ownerId: ADMIN_OWNER_UID,
    createdAt: Date.now() - 86400000 * 26
  },
  {
    id: 'ghaziabad-pg-1',
    title: 'Vaishali Secure Girls PG',
    image: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=800'
    ],
    dataAiHint: 'vaishali girls pg',
    price: 10000,
    location: 'Sector 4, Vaishali',
    city: 'Ghaziabad',
    rating: 4.6,
    reviews: 78,
    type: 'Girls',
    category: 'PG',
    amenities: ['WiFi', 'AC', 'Food', 'CCTV', 'Housekeeping', 'Geyser'],
    description: 'Comfortable girls PG opposite Vaishali Metro Station. Home-cooked food, high security, and seamless Metro connectivity to Delhi.',
    roomOptions: [
      { occupancy: 'Double', price: 10000 },
      { occupancy: 'Single', price: 14000 }
    ],
    map: { lat: 28.64, lng: 77.34, nearby: [{ name: 'Vaishali Metro', distance: '300m' }] },
    status: 'approved',
    ownerId: ADMIN_OWNER_UID,
    createdAt: Date.now() - 86400000 * 23
  },
  {
    id: 'ghaziabad-room-1',
    title: 'Furnished Room in Raj Nagar',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800'
    ],
    dataAiHint: 'raj nagar room',
    price: 8500,
    location: 'Raj Nagar Sector 10',
    city: 'Ghaziabad',
    rating: 4.3,
    reviews: 31,
    type: 'Co-ed',
    category: 'Room',
    amenities: ['WiFi', 'AC', 'Parking', 'Geyser'],
    description: 'Private furnished room in a quiet residential sector of Raj Nagar. Ideal for coaching students and professionals.',
    roomOptions: [
      { occupancy: 'Single', price: 8500 }
    ],
    map: { lat: 28.68, lng: 77.43, nearby: [{ name: 'Raj Nagar District Centre', distance: '500m' }] },
    status: 'approved',
    ownerId: ADMIN_OWNER_UID,
    createdAt: Date.now() - 86400000 * 17
  },
  {
    id: 'ghaziabad-hotel-1',
    title: 'Metro Residency Hotel Link Road',
    image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=800'
    ],
    dataAiHint: 'link road hotel',
    price: 20000,
    location: 'Link Road, Near Kaushambi Metro',
    city: 'Ghaziabad',
    rating: 4.4,
    reviews: 64,
    type: 'Co-ed',
    category: 'Hotel',
    amenities: ['WiFi', 'AC', 'Food', 'Housekeeping', 'Parking', 'CCTV'],
    description: 'Serviced monthly hotel accommodation on Ghaziabad-Delhi border near Kaushambi & Anand Vihar ISBT.',
    roomOptions: [
      { occupancy: 'Single', price: 20000 }
    ],
    map: { lat: 28.65, lng: 77.32, nearby: [{ name: 'Kaushambi Metro', distance: '400m' }, { name: 'Anand Vihar ISBT', distance: '1km' }] },
    status: 'approved',
    ownerId: ADMIN_OWNER_UID,
    createdAt: Date.now() - 86400000 * 11
  },

  // ==================== FARIDABAD ====================
  {
    id: 'faridabad-hostel-1',
    title: 'Sector 16 Student Hostel',
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=800'
    ],
    dataAiHint: 'faridabad hostel',
    price: 8500,
    location: 'Sector 16, Near YMCA University',
    city: 'Faridabad',
    rating: 4.4,
    reviews: 46,
    type: 'Co-ed',
    category: 'Hostel',
    amenities: ['WiFi', 'Food', 'Laundry', 'CCTV', 'Geyser'],
    description: 'Popular student hostel located right near JC Bose YMCA University. Includes 3 meals daily, laundry, and study tables.',
    roomOptions: [
      { occupancy: 'Triple', price: 8500 },
      { occupancy: 'Double', price: 10500 }
    ],
    map: { lat: 28.38, lng: 77.31, nearby: [{ name: 'YMCA University', distance: '400m' }, { name: 'Neelam Chowk Metro', distance: '800m' }] },
    status: 'approved',
    ownerId: ADMIN_OWNER_UID,
    createdAt: Date.now() - 86400000 * 25
  },
  {
    id: 'faridabad-pg-1',
    title: 'NIT Faridabad Executive PG',
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800'
    ],
    dataAiHint: 'nit faridabad pg',
    price: 9000,
    location: 'NIT 3, Near BK Hospital Chowk',
    city: 'Faridabad',
    rating: 4.5,
    reviews: 58,
    type: 'Boys',
    category: 'PG',
    amenities: ['WiFi', 'AC', 'Food', 'Housekeeping', 'Geyser'],
    description: 'Clean, well-ventilated executive PG for working professionals and students in NIT Faridabad area.',
    roomOptions: [
      { occupancy: 'Double', price: 9000 },
      { occupancy: 'Single', price: 13000 }
    ],
    map: { lat: 28.39, lng: 77.29, nearby: [{ name: 'Bata Chowk Metro', distance: '1km' }] },
    status: 'approved',
    ownerId: ADMIN_OWNER_UID,
    createdAt: Date.now() - 86400000 * 20
  },
  {
    id: 'faridabad-room-1',
    title: 'Green Fields Private Room',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800'
    ],
    dataAiHint: 'green fields room',
    price: 10000,
    location: 'Green Fields Colony',
    city: 'Faridabad',
    rating: 4.6,
    reviews: 34,
    type: 'Girls',
    category: 'Room',
    amenities: ['WiFi', 'AC', 'Parking', 'Housekeeping'],
    description: 'Secure, private room with independent washroom in a lush green colony near South Delhi border.',
    roomOptions: [
      { occupancy: 'Single', price: 10000 }
    ],
    map: { lat: 28.43, lng: 77.3, nearby: [{ name: 'NHPC Chowk Metro', distance: '900m' }] },
    status: 'approved',
    ownerId: ADMIN_OWNER_UID,
    createdAt: Date.now() - 86400000 * 15
  },
  {
    id: 'faridabad-hotel-1',
    title: 'Grand Stay Hotel Sector 81',
    image: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=800'
    ],
    dataAiHint: 'sector 81 hotel',
    price: 24000,
    location: 'Bypass Road, Sector 81',
    city: 'Faridabad',
    rating: 4.5,
    reviews: 50,
    type: 'Co-ed',
    category: 'Hotel',
    amenities: ['WiFi', 'AC', 'Food', 'Housekeeping', 'Parking', 'CCTV'],
    description: 'Serviced monthly hotel suites in Greater Faridabad sector with 24-hour room service, parking, and dining.',
    roomOptions: [
      { occupancy: 'Single', price: 24000 }
    ],
    map: { lat: 28.37, lng: 77.34, nearby: [{ name: 'Puri High Street', distance: '500m' }] },
    status: 'approved',
    ownerId: ADMIN_OWNER_UID,
    createdAt: Date.now() - 86400000 * 8
  }
];

export const allAmenities: ('WiFi' | 'AC' | 'Food' | 'Parking' | 'Laundry' | 'Geyser' | 'Housekeeping' | 'CCTV')[] = [
  'WiFi', 'AC', 'Food', 'Parking', 'Laundry', 'Geyser', 'Housekeeping', 'CCTV'
];

export const allCategories: ('Hostel' | 'PG' | 'Room' | 'Hotel')[] = [
  'Hostel', 'PG', 'Room', 'Hotel'
];

export const allCities = [
  // Delhi NCR (Primary Focus)
  'Delhi', 'Noida', 'Greater Noida', 'Gurgaon', 'Ghaziabad', 'Faridabad',
  // Major Metros
  'Mumbai', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata', 'Ahmedabad',
  // Tier-2 Cities
  'Jaipur', 'Lucknow', 'Chandigarh', 'Indore', 'Kochi', 'Coimbatore',
  'Bhopal', 'Nagpur', 'Vadodara', 'Thiruvananthapuram', 'Visakhapatnam',
  'Patna', 'Dehradun', 'Mangalore', 'Mysore', 'Surat', 'Ranchi',
  'Bhubaneswar', 'Goa', 'Pondicherry', 'Agra', 'Varanasi'
];
