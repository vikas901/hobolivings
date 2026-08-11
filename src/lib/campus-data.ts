export interface CampusHub {
  slug: string;
  name: string;
  shortName: string;
  title: string;
  metaDescription: string;
  locality: string;
  city: string;
  metro: string;
  walkingDistance: string;
  avgRent: string;
  heroImage: string;
  landmarks: string[];
  keyHighlights: string[];
  description: string;
  filterKeywords: string[];
  faqs: {
    question: string;
    answer: string;
  }[];
}

export const CAMPUS_HUBS: Record<string, CampusHub> = {
  'gl-bajaj-greater-noida': {
    slug: 'gl-bajaj-greater-noida',
    name: 'GL Bajaj Institute of Technology & Management',
    shortName: 'GL Bajaj',
    title: 'Verified Student Hostels & PGs near GL Bajaj Greater Noida (₹0 Brokerage)',
    metaDescription: 'Find verified hostels and PGs near GL Bajaj Institute in Knowledge Park 2, Greater Noida. Walking distance from campus gates, 3 hygienic meals, AC, and 100% zero brokerage.',
    locality: 'Knowledge Park 2, Greater Noida',
    city: 'Greater Noida',
    metro: 'Knowledge Park 2 Metro Station (Aqua Line - 500m)',
    walkingDistance: '2 to 7 mins walking (200m - 600m)',
    avgRent: '₹8,000 - ₹14,000 / month (Meals Included)',
    heroImage: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=1200',
    landmarks: ['GL Bajaj Gate 1 & 2', 'Knowledge Park 2 Metro', 'Nescafe Square', 'KP2 Commercial Center'],
    keyHighlights: [
      '3 Nutritious Meals Daily + Evening Tea',
      'High-Speed Wi-Fi & Dedicated Study Desks',
      '24/7 Power Backup & Biometric CCTV Security',
      '100% Zero Brokerage Guarantee with 48h Bed Hold'
    ],
    description: 'Hobo Livings provides verified student hostels and paying guest (PG) accommodations within 200m to 800m of GL Bajaj Institute in Knowledge Park 2, Greater Noida. All properties are physically inspected and feature zero brokerage, assisted physical site visits, and instant digital visit passes.',
    filterKeywords: ['gl bajaj', 'knowledge park 2', 'greater noida', 'knowledge park'],
    faqs: [
      {
        question: 'What is the average PG/Hostel rent near GL Bajaj Greater Noida?',
        answer: 'Double sharing rooms near GL Bajaj typically range from ₹8,500 to ₹11,500/month, while single rooms range from ₹12,000 to ₹14,500/month, including 3 meals daily, AC, Wi-Fi, and electricity backup.'
      },
      {
        question: 'How far are Hobo partner hostels from GL Bajaj campus gates?',
        answer: 'Our partner accommodations in Knowledge Park 2 are situated between 200 meters and 700 meters from GL Bajaj Gate 1 and Gate 2, allowing students to walk to college in under 5 minutes.'
      },
      {
        question: 'Does Hobo Livings charge any brokerage or registration fees from students?',
        answer: 'No. Hobo Livings offers a strict 100% zero brokerage guarantee. Physical site visits and 48-hour bed holds are completely free of charge.'
      },
      {
        question: 'How do I schedule a physical room visit near GL Bajaj?',
        answer: 'Select any listing, click "Schedule Free Visit", choose your date and time slot, and receive your Digital Visit Pass with caretaker contact and Google Maps navigation.'
      }
    ]
  },

  'galgotias-university-greater-noida': {
    slug: 'galgotias-university-greater-noida',
    name: 'Galgotias University & College of Engineering',
    shortName: 'Galgotias',
    title: 'Student Hostels & PGs near Galgotias Greater Noida (Zero Brokerage)',
    metaDescription: 'Discover verified hostels and PGs near Galgotias University & College in Greater Noida. AC rooms, daily meals, bus connectivity, and zero broker commission.',
    locality: 'Yamuna Expressway & Knowledge Park 2',
    city: 'Greater Noida',
    metro: 'Pari Chowk & Alpha 1 Metro Station',
    walkingDistance: 'Direct Campus Shuttle / 5-10 min commute',
    avgRent: '₹8,500 - ₹15,000 / month (Meals Included)',
    heroImage: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&q=80&w=1200',
    landmarks: ['Galgotias Campus', 'Pari Chowk Bus Stand', 'Knowledge Park 2', 'Alpha 1 Market'],
    keyHighlights: [
      'Campus Bus & Shuttle Pickup Points',
      '4-Time Hygienic Meals + North & South Indian Menu',
      'Gym, Laundry & Daily Housekeeping Included',
      'DPIIT Recognized Safe Housing Platform'
    ],
    description: 'Find verified student hostels and co-living spaces for Galgotias University students in Greater Noida. Experience transparent pricing, verified room photos, biometric access, and zero broker fees.',
    filterKeywords: ['galgotias', 'pari chowk', 'greater noida', 'knowledge park 2'],
    faqs: [
      {
        question: 'Are there student hostels with transport to Galgotias University?',
        answer: 'Yes, several Hobo verified hostels in Knowledge Park 2 and Pari Chowk provide daily pickup and drop shuttle services directly to the Galgotias University Yamuna Expressway campus.'
      },
      {
        question: 'What amenities are included in Galgotias student hostels?',
        answer: 'Amenities include 3 to 4 fresh meals daily, high-speed Wi-Fi, air conditioning, RO water purifier, laundry service, and 24/7 security with warden supervision.'
      },
      {
        question: 'Can I lock a room before reaching Greater Noida?',
        answer: 'Yes, our 48-Hour Zero-Cost Bed Hold allows students and parents to lock the room and price for 48 hours for ₹0 while traveling.'
      }
    ]
  },

  'sharda-university-greater-noida': {
    slug: 'sharda-university-greater-noida',
    name: 'Sharda University (Knowledge Park 3)',
    shortName: 'Sharda University',
    title: 'Verified Hostels & PGs near Sharda University Knowledge Park 3 (₹0 Commission)',
    metaDescription: 'Browse top-rated hostels & PGs near Sharda University Knowledge Park 3 Greater Noida. Verified photos, hygienic mess, attached washrooms, and zero brokerage.',
    locality: 'Knowledge Park 3, Greater Noida',
    city: 'Greater Noida',
    metro: 'Knowledge Park 2 & Pari Chowk Metro',
    walkingDistance: '3 to 8 mins walking (300m - 750m)',
    avgRent: '₹9,000 - ₹16,000 / month (All Meals Included)',
    heroImage: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=1200',
    landmarks: ['Sharda University Gate 4', 'Sharda Hospital', 'Knowledge Park 3 Market'],
    keyHighlights: [
      'Walking Distance from Sharda Campus & Hospital',
      'Spacious Single, Double & Triple Sharing Rooms',
      'Fingerprint Biometric & 24/7 CCTV Monitoring',
      'Free Assisted Site Visits & On-Ground Support'
    ],
    description: 'Verified student hostels and PGs located right outside Sharda University in Knowledge Park 3. Designed for medical, engineering, and international students seeking hygienic food and safe co-living.',
    filterKeywords: ['sharda', 'knowledge park 3', 'greater noida', 'kp3'],
    faqs: [
      {
        question: 'How close are the hostels to Sharda University Gate 4?',
        answer: 'Most of our verified accommodations in Knowledge Park 3 are located within 300 to 700 meters from Sharda University gates, well within a 5-minute walk.'
      },
      {
        question: 'Are single room PGs available near Sharda University?',
        answer: 'Yes, we have verified single occupancy AC rooms with attached washrooms, study tables, and meal plans starting at ₹12,500/month.'
      }
    ]
  },

  'amity-university-noida': {
    slug: 'amity-university-noida',
    name: 'Amity University Noida (Sector 125)',
    shortName: 'Amity University',
    title: 'Girls & Boys PGs near Amity University Noida Sector 125 (0 Brokerage)',
    metaDescription: 'Find verified girls and boys PGs near Amity University Sector 125 Noida. Walking distance from Gate 2 & 4, hygienic meals, AC, and 100% zero brokerage.',
    locality: 'Sector 125, Noida',
    city: 'Noida',
    metro: 'Botanical Garden / Okhla Bird Sanctuary Metro (Magenta Line)',
    walkingDistance: '5 to 10 mins walking (400m - 900m)',
    avgRent: '₹9,500 - ₹18,000 / month',
    heroImage: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=1200',
    landmarks: ['Amity Gate 2 & Gate 4', 'Raipur Khadar', 'Sector 125 Metro Link'],
    keyHighlights: [
      'Safe Girls & Boys Accommodations near Amity Gates',
      'AC Rooms with High-Speed Wi-Fi & Daily Housekeeping',
      'Zero Brokerage & Transparent Rent Agreements',
      'Assisted Physical Visits with Caretaker Handshake'
    ],
    description: 'Browse verified student PGs and rooms near Amity University Sector 125 Noida. Direct landlord pricing with zero broker markups, home-style meals, and 24/7 security.',
    filterKeywords: ['amity', 'sector 125', 'noida', 'raipur'],
    faqs: [
      {
        question: 'Are there safe Girls PGs near Amity University Sector 125?',
        answer: 'Yes, we list verified Girls PGs with female wardens, biometric attendance, strict guest policies, and 24/7 CCTV surveillance within 500m of Amity University.'
      },
      {
        question: 'How can I reach Amity University from Noida metro stations?',
        answer: 'The nearest metro stations are Okhla Bird Sanctuary and Botanical Garden on the Magenta/Blue Line, connected via direct 5-minute auto shuttles to Sector 125.'
      }
    ]
  },

  'knowledge-park-2-greater-noida': {
    slug: 'knowledge-park-2-greater-noida',
    name: 'Knowledge Park 2 Student Hub (Greater Noida)',
    shortName: 'Knowledge Park 2',
    title: 'Student Hostels & PGs in Knowledge Park 2 Greater Noida (₹0 Brokerage)',
    metaDescription: 'Discover top student hostels & PGs across Knowledge Park 2, Greater Noida. Near GL Bajaj, NIET, Lloyd & IIMT. 3 meals daily, AC, Wi-Fi, and zero commission.',
    locality: 'Knowledge Park 2, Greater Noida',
    city: 'Greater Noida',
    metro: 'Knowledge Park 2 Metro Station (Aqua Line - Central Hub)',
    walkingDistance: 'Central to all 12 major engineering colleges',
    avgRent: '₹7,500 - ₹13,500 / month',
    heroImage: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=1200',
    landmarks: ['Knowledge Park 2 Metro Station', 'NIET', 'GL Bajaj', 'Lloyd Institute', 'IIMT'],
    keyHighlights: [
      'Walking Distance to 10+ Engineering & MBA Colleges',
      'Aqua Line Metro Connectivity to Noida & Delhi',
      'Comprehensive Meal Plans with Evening Snacks',
      'DPIIT Govt Recognized Housing Platform'
    ],
    description: 'Knowledge Park 2 is the premier educational hub of Greater Noida. Explore 30+ verified hostels and PGs with zero brokerage, assisted visits, and instant online booking.',
    filterKeywords: ['knowledge park 2', 'kp2', 'greater noida', 'niet', 'lloyd', 'iimt'],
    faqs: [
      {
        question: 'Which colleges are located in Knowledge Park 2 Greater Noida?',
        answer: 'Knowledge Park 2 is home to GL Bajaj, NIET, Lloyd Law College, IIMT, GNIOT, Accurate Institute, and Mangalmay Institute.'
      },
      {
        question: 'Is metro transport accessible in Knowledge Park 2?',
        answer: 'Yes, the Knowledge Park 2 Metro Station on the Aqua Line is directly located in the hub, providing quick connectivity to Noida Sector 51 and Delhi Metro network.'
      }
    ]
  }
};
