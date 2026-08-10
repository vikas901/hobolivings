import type { Property, RoomOption } from './types';
import { db } from './firebase';
import { collection, writeBatch, doc } from 'firebase/firestore';

export interface CityClusterConfig {
  city: string;
  clusters: {
    name: string;
    description: string;
    landmarks: { name: string; distance: string }[];
    priceRange: { min: number; max: number };
    coordinates: { lat: number; lng: number };
  }[];
}

export const CITY_CLUSTERS: CityClusterConfig[] = [
  {
    city: 'Greater Noida',
    clusters: [
      {
        name: 'Knowledge Park 2 (GL Bajaj, Galgotias, NIET)',
        description: 'Primary student hub surrounded by engineering and management colleges with Aqua Line metro access.',
        landmarks: [
          { name: 'Knowledge Park 2 Metro Station', distance: '350m' },
          { name: 'GL Bajaj Institute', distance: '200m' },
          { name: 'Galgotias College of Engg', distance: '400m' }
        ],
        priceRange: { min: 11000, max: 18500 },
        coordinates: { lat: 28.472, lng: 77.489 }
      },
      {
        name: 'Knowledge Park 3 (Sharda, Lloyd, IIMT)',
        description: 'Dense medical and engineering student residential district with food streets and markets.',
        landmarks: [
          { name: 'Sharda University Main Gate', distance: '300m' },
          { name: 'Knowledge Park 3 Metro', distance: '500m' },
          { name: 'Lloyd Law College', distance: '250m' }
        ],
        priceRange: { min: 12000, max: 21000 },
        coordinates: { lat: 28.461, lng: 77.502 }
      },
      {
        name: 'Pari Chowk & Alpha 1/2',
        description: 'Centrally connected commercial and residential zone with direct expressways and markets.',
        landmarks: [
          { name: 'Pari Chowk Metro Station', distance: '400m' },
          { name: 'Alpha 1 Commercial Market', distance: '200m' }
        ],
        priceRange: { min: 9500, max: 16000 },
        coordinates: { lat: 28.475, lng: 77.508 }
      },
      {
        name: 'Techzone 4 & Gaur City',
        description: 'Modern township living for corporate trainees and students near Noida Extension.',
        landmarks: [
          { name: 'Gaur City Mall', distance: '600m' },
          { name: 'Noida Extension Metro (Upcoming)', distance: '800m' }
        ],
        priceRange: { min: 10500, max: 17500 },
        coordinates: { lat: 28.608, lng: 77.432 }
      }
    ]
  },
  {
    city: 'Noida',
    clusters: [
      {
        name: 'Sector 125 (Amity University Hub)',
        description: 'High-energy university campus locality with luxury student accommodations and cafes.',
        landmarks: [
          { name: 'Amity University Gate 2', distance: '250m' },
          { name: 'Okhla Bird Sanctuary Metro', distance: '1.2km' }
        ],
        priceRange: { min: 14000, max: 26000 },
        coordinates: { lat: 28.544, lng: 77.333 }
      },
      {
        name: 'Sector 62 (IT Hub & JSS Academy)',
        description: 'Prime corporate and tech hub hosting major IT companies, JSS, and Jaypee institutes.',
        landmarks: [
          { name: 'Sector 62 Metro Station', distance: '400m' },
          { name: 'JSS Academy of Tech Education', distance: '300m' },
          { name: 'Candor TechSpace IT Park', distance: '500m' }
        ],
        priceRange: { min: 12500, max: 22000 },
        coordinates: { lat: 28.625, lng: 77.368 }
      },
      {
        name: 'Sector 15 & 18 (Atta Market / Central Noida)',
        description: 'Central metro hub near coaching centers, malls, and direct blue line to Delhi.',
        landmarks: [
          { name: 'Sector 18 Metro & Mall of India', distance: '450m' },
          { name: 'Sector 15 Coaching Market', distance: '300m' }
        ],
        priceRange: { min: 10000, max: 19000 },
        coordinates: { lat: 28.572, lng: 77.319 }
      }
    ]
  },
  {
    city: 'Delhi',
    clusters: [
      {
        name: 'North Campus (Kamla Nagar & GTB Nagar)',
        description: 'Historic Delhi University student corridor near SRCC, Hansraj, Hindu, and Miranda House.',
        landmarks: [
          { name: 'Vishwavidyalaya Metro Station', distance: '500m' },
          { name: 'Kamla Nagar Market Spark Mall', distance: '250m' },
          { name: 'Hudson Lane Food Street', distance: '300m' }
        ],
        priceRange: { min: 13500, max: 28000 },
        coordinates: { lat: 28.692, lng: 77.208 }
      },
      {
        name: 'South Campus (Satya Niketan & Dhaula Kuan)',
        description: 'South DU student hub for Venkateswara, ARSD, and Motilal Nehru colleges.',
        landmarks: [
          { name: 'Durgabai Deshmukh South Campus Metro', distance: '350m' },
          { name: 'Satya Niketan Central Market', distance: '150m' }
        ],
        priceRange: { min: 13000, max: 25000 },
        coordinates: { lat: 28.588, lng: 77.163 }
      },
      {
        name: 'Laxmi Nagar & Nirman Vihar (CA/UPSC Hub)',
        description: 'East Delhi competitive exams, CA, and coaching hub with intense student culture.',
        landmarks: [
          { name: 'Laxmi Nagar Metro Station', distance: '200m' },
          { name: 'V3S Mall Nirman Vihar', distance: '600m' }
        ],
        priceRange: { min: 8000, max: 15000 },
        coordinates: { lat: 28.631, lng: 77.277 }
      }
    ]
  },
  {
    city: 'Gurugram',
    clusters: [
      {
        name: 'Cyber City & DLF Phase 3',
        description: 'Ultra-modern co-living hub for young tech professionals, interns, and corporates.',
        landmarks: [
          { name: 'Moulsari Avenue Rapid Metro', distance: '300m' },
          { name: 'Cyber Hub Food District', distance: '700m' }
        ],
        priceRange: { min: 15000, max: 32000 },
        coordinates: { lat: 28.498, lng: 77.094 }
      },
      {
        name: 'Sector 48/49 (Sohna Road Tech Zone)',
        description: 'Residential and IT tech park corridor with spacious gated co-living apartments.',
        landmarks: [
          { name: 'Spaze i-Tech Park', distance: '400m' },
          { name: 'Vipul Trade Centre', distance: '300m' }
        ],
        priceRange: { min: 12000, max: 22000 },
        coordinates: { lat: 28.419, lng: 77.042 }
      }
    ]
  },
  {
    city: 'Kota',
    clusters: [
      {
        name: 'Landmark City (Kunhari / Allen Hub)',
        description: 'Premier coaching district for IIT-JEE and NEET aspirants right next to Allen Sangyan/Samyak.',
        landmarks: [
          { name: 'Allen Sangyan Campus', distance: '200m' },
          { name: 'Landmark Central Food Zone', distance: '150m' }
        ],
        priceRange: { min: 8500, max: 18000 },
        coordinates: { lat: 25.215, lng: 75.845 }
      },
      {
        name: 'Talwandi & Mahaveer Nagar',
        description: 'Established coaching hub near Resonance, Motion, and Career Point institutes.',
        landmarks: [
          { name: 'Motion IIT-JEE Main Building', distance: '250m' },
          { name: 'City Mall Jhalawar Road', distance: '600m' }
        ],
        priceRange: { min: 9000, max: 17000 },
        coordinates: { lat: 25.143, lng: 75.837 }
      }
    ]
  }
];

// Curated high-res hostel & modern room interior photo banks
const PHOTO_BANK = [
  'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=1000',
  'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=1000',
  'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=1000',
  'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&q=80&w=1000',
  'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&q=80&w=1000',
  'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=1000',
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=1000',
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=1000',
  'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=1000',
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=1000'
];

const PROPERTY_PREFIXES = ['Royal', 'Stanza', 'Skyline', 'Premier', 'Olive', 'Sai', 'Metro Point', 'Urban', 'Silver Oak', 'Comfort', 'Grand', 'Elite'];
const PROPERTY_SUFFIXES = ['Residency', 'Living', 'Student Stay', 'Hostel Suites', 'Co-Living Hub', 'Palms', 'House', 'Inn', 'Heights'];

export interface DiscoveryOptions {
  city: string;
  clusterName?: string;
  category?: 'Hostel' | 'PG' | 'all';
  gender?: 'Boys' | 'Girls' | 'Co-ed' | 'all';
  count: number;
}

/**
 * Generates rich, realistic scraped-style property data for a given city and locality cluster
 */
export function generateCityProperties(options: DiscoveryOptions): Property[] {
  const cityConfig = CITY_CLUSTERS.find(c => c.city.toLowerCase() === options.city.toLowerCase()) || CITY_CLUSTERS[0];
  const cluster = options.clusterName 
    ? cityConfig.clusters.find(cl => cl.name === options.clusterName) || cityConfig.clusters[0]
    : cityConfig.clusters[Math.floor(Math.random() * cityConfig.clusters.length)];

  const results: Property[] = [];
  const count = Math.min(Math.max(options.count || 10, 1), 50);

  for (let i = 0; i < count; i++) {
    const prefix = PROPERTY_PREFIXES[(i + Math.floor(Math.random() * 3)) % PROPERTY_PREFIXES.length];
    const suffix = PROPERTY_SUFFIXES[(i * 2) % PROPERTY_SUFFIXES.length];
    
    let gender: 'Boys' | 'Girls' | 'Co-ed' = 'Boys';
    if (options.gender && options.gender !== 'all') {
      gender = options.gender;
    } else {
      const gList: ('Boys' | 'Girls' | 'Co-ed')[] = ['Boys', 'Girls', 'Co-ed'];
      gender = gList[i % 3];
    }

    let category: 'Hostel' | 'PG' = 'Hostel';
    if (options.category && options.category !== 'all') {
      category = options.category;
    } else {
      category = i % 2 === 0 ? 'Hostel' : 'PG';
    }

    // Base price calculated from cluster range
    const basePrice = Math.round(
      (cluster.priceRange.min + Math.random() * (cluster.priceRange.max - cluster.priceRange.min)) / 500
    ) * 500;

    const singlePrice = Math.round((basePrice * 1.45) / 500) * 500;
    const triplePrice = Math.round((basePrice * 0.78) / 500) * 500;

    const roomOptions: RoomOption[] = [
      { occupancy: 'Double', price: basePrice },
      { occupancy: 'Single', price: singlePrice },
      { occupancy: 'Triple', price: triplePrice }
    ];

    const mainPhoto = PHOTO_BANK[i % PHOTO_BANK.length];
    const secondPhoto = PHOTO_BANK[(i + 3) % PHOTO_BANK.length];
    const thirdPhoto = PHOTO_BANK[(i + 6) % PHOTO_BANK.length];

    const propId = `hobo-${cityConfig.city.toLowerCase().replace(/\s+/g, '')}-${Date.now().toString(36)}-${i + 1}`;

    const property: Property = {
      id: propId,
      title: `${prefix} ${gender} ${category} ${suffix}`,
      description: `Verified ${gender.toLowerCase()} accommodation in ${cluster.name}, ${cityConfig.city}. Includes 3-time freshly cooked hygienic meals, high-speed Wi-Fi, biometric entry, daily housekeeping, and power backup. Located directly adjacent to major campus gates and public transport.`,
      price: basePrice,
      city: cityConfig.city,
      location: cluster.name.split('(')[0].trim(),
      category: category,
      type: gender,
      image: mainPhoto,
      images: [mainPhoto, secondPhoto, thirdPhoto],
      amenities: ['WiFi', 'AC', 'Food', 'Laundry', 'Housekeeping', 'CCTV', 'Parking', 'Geyser'],
      rating: parseFloat((4.3 + Math.random() * 0.6).toFixed(1)),
      reviews: Math.floor(18 + Math.random() * 95),
      roomOptions: roomOptions,
      map: {
        lat: cluster.coordinates.lat + (Math.random() - 0.5) * 0.008,
        lng: cluster.coordinates.lng + (Math.random() - 0.5) * 0.008,
        nearby: cluster.landmarks
      },
      status: 'approved',
      ownerId: 'admin_scraped_seed',
      createdAt: Date.now() - Math.floor(Math.random() * 86400000 * 30)
    };

    results.push(property);
  }

  return results;
}

/**
 * Ingests a batch of properties directly into Cloud Firestore
 */
export async function ingestPropertiesToFirestore(properties: Property[]): Promise<{ success: boolean; count: number; error?: string }> {
  try {
    if (!properties || properties.length === 0) {
      return { success: false, count: 0, error: 'No properties to ingest.' };
    }

    // Write in chunks of 25 to respect Firestore batch limits
    const CHUNK_SIZE = 25;
    for (let i = 0; i < properties.length; i += CHUNK_SIZE) {
      const chunk = properties.slice(i, i + CHUNK_SIZE);
      const batch = writeBatch(db);

      for (const p of chunk) {
        const propRef = doc(db, 'properties', p.id);
        const cleanPayload = Object.fromEntries(
          Object.entries(p).filter(([_, v]) => v !== undefined)
        );
        batch.set(propRef, cleanPayload, { merge: true });
      }

      await batch.commit();
    }

    return { success: true, count: properties.length };
  } catch (err: any) {
    console.error('Firestore batch ingestion error:', err);
    return { success: false, count: 0, error: err.message || 'Failed to write properties to Firestore.' };
  }
}

/**
 * Parses raw CSV content exported from Google Maps / Outscraper / Apify
 */
export function parseScrapedCsv(csvText: string, defaultCity: string = 'Greater Noida'): Property[] {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/["']/g, ''));
  const results: Property[] = [];

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const values = lines[i].split(',').map(v => v.trim().replace(/^["']|["']$/g, ''));
    
    const getVal = (keyPattern: string) => {
      const idx = headers.findIndex(h => h.includes(keyPattern));
      return idx !== -1 && values[idx] ? values[idx] : '';
    };

    const title = getVal('title') || getVal('name') || `PG Accommodation #${i}`;
    const city = getVal('city') || defaultCity;
    const location = getVal('location') || getVal('address') || `${city} Central`;
    const priceNum = parseInt(getVal('price') || getVal('rent')) || 12000;
    const img = getVal('image') || getVal('photo') || PHOTO_BANK[i % PHOTO_BANK.length];

    const prop: Property = {
      id: `scraped-${Date.now().toString(36)}-${i}`,
      title,
      description: `Discovered student accommodation in ${location}, ${city}. Includes furnished rooms, Wi-Fi, and security.`,
      price: priceNum,
      city,
      location,
      category: 'PG',
      type: 'Boys',
      image: img,
      images: [img],
      amenities: ['WiFi', 'AC', 'Food', 'Laundry', 'CCTV'],
      rating: 4.5,
      reviews: 12,
      roomOptions: [
        { occupancy: 'Double', price: priceNum },
        { occupancy: 'Single', price: Math.round(priceNum * 1.5) }
      ],
      map: { lat: 28.47, lng: 77.49, nearby: [{ name: 'Nearest Transit', distance: '500m' }] },
      status: 'approved',
      ownerId: 'admin_scraped_seed',
      createdAt: Date.now()
    };

    results.push(prop);
  }

  return results;
}
