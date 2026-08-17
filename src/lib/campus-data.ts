export interface CampusHub {
  slug: string;
  name: string;
  shortName: string;
  title: string;
  metaDescription: string;
  locality: string;
  city: string;
  hubType: 'college' | 'locality' | 'metro-hub';
  metro: string;
  walkingDistance: string;
  avgRent: string;
  startingRent: string;
  totalVerifiedBeds: string;
  heroImage: string;
  landmarks: string[];
  keyHighlights: string[];
  zeroClickSummary: string;
  commuteHighlights: string[];
  nearbyColleges: string[];
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
    hubType: 'college',
    title: 'Verified Student Hostels & PGs near GL Bajaj Greater Noida (₹0 Brokerage)',
    metaDescription: 'Find verified hostels and PGs near GL Bajaj Institute in Knowledge Park 2, Greater Noida. Walking distance from campus gates, 3 hygienic meals, AC, and 100% zero brokerage.',
    locality: 'Knowledge Park 2, Greater Noida',
    city: 'Greater Noida',
    metro: 'Knowledge Park 2 Metro Station (Aqua Line - 500m)',
    walkingDistance: '2 to 7 mins walking (200m - 600m)',
    avgRent: '₹8,000 - ₹14,000 / month (Meals Included)',
    startingRent: '₹8,000',
    totalVerifiedBeds: '450+ Verified Beds',
    heroImage: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=1200',
    landmarks: ['GL Bajaj Gate 1 & 2', 'Knowledge Park 2 Metro', 'Nescafe Square', 'KP2 Commercial Center'],
    keyHighlights: [
      '3 Nutritious Meals Daily + Evening Tea',
      'High-Speed Wi-Fi & Dedicated Study Desks',
      '24/7 Power Backup & Biometric CCTV Security',
      '100% Zero Brokerage Guarantee with 48h Bed Hold'
    ],
    zeroClickSummary: 'Hostels near GL Bajaj Greater Noida are located 200m–700m from campus gates in Knowledge Park 2. Typical rents range from ₹8,000 to ₹14,000 per month, covering 3 daily meals, high-speed Wi-Fi, air conditioning, daily housekeeping, and 24/7 biometric security with ₹0 brokerage.',
    commuteHighlights: [
      '2-5 minutes walk to GL Bajaj Gate 1 & 2',
      '5 minutes walk to Knowledge Park 2 Metro Station (Aqua Line)',
      '10 minutes auto ride to Pari Chowk Commercial Hub'
    ],
    nearbyColleges: ['NIET', 'Lloyd Law College', 'IIMT', 'GNIOT'],
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
    hubType: 'college',
    title: 'Student Hostels & PGs near Galgotias Greater Noida (Zero Brokerage)',
    metaDescription: 'Discover verified hostels and PGs near Galgotias University & College in Greater Noida. AC rooms, daily meals, bus connectivity, and zero broker commission.',
    locality: 'Yamuna Expressway & Knowledge Park 2',
    city: 'Greater Noida',
    metro: 'Pari Chowk & Alpha 1 Metro Station',
    walkingDistance: 'Direct Campus Shuttle / 5-10 min commute',
    avgRent: '₹8,500 - ₹15,000 / month (Meals Included)',
    startingRent: '₹8,500',
    totalVerifiedBeds: '500+ Verified Beds',
    heroImage: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&q=80&w=1200',
    landmarks: ['Galgotias Campus', 'Pari Chowk Bus Stand', 'Knowledge Park 2', 'Alpha 1 Market'],
    keyHighlights: [
      'Campus Bus & Shuttle Pickup Points',
      '4-Time Hygienic Meals + North & South Indian Menu',
      'Gym, Laundry & Daily Housekeeping Included',
      'DPIIT Recognized Safe Housing Platform'
    ],
    zeroClickSummary: 'Accommodations for Galgotias University students in Greater Noida offer verified rooms in Knowledge Park 2, Pari Chowk, and near Yamuna Expressway. Monthly packages start at ₹8,500 including 4 nutritious meals daily, AC, high-speed internet, laundry, and daily college bus pickups with ₹0 brokerage.',
    commuteHighlights: [
      'Direct bus shuttle pickup from Knowledge Park 2 and Pari Chowk',
      '7 minutes drive to Galgotias College in Knowledge Park 2',
      '15 minutes drive to Galgotias University Yamuna Expressway campus'
    ],
    nearbyColleges: ['Bennett University', 'Noida International University (NIU)', 'Sharda University'],
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
    hubType: 'college',
    title: 'Verified Hostels & PGs near Sharda University Knowledge Park 3 (₹0 Commission)',
    metaDescription: 'Browse top-rated hostels & PGs near Sharda University Knowledge Park 3 Greater Noida. Verified photos, hygienic mess, attached washrooms, and zero brokerage.',
    locality: 'Knowledge Park 3, Greater Noida',
    city: 'Greater Noida',
    metro: 'Knowledge Park 2 & Pari Chowk Metro',
    walkingDistance: '3 to 8 mins walking (300m - 750m)',
    avgRent: '₹9,000 - ₹16,000 / month (All Meals Included)',
    startingRent: '₹9,000',
    totalVerifiedBeds: '380+ Verified Beds',
    heroImage: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=1200',
    landmarks: ['Sharda University Gate 4', 'Sharda Hospital', 'Knowledge Park 3 Market'],
    keyHighlights: [
      'Walking Distance from Sharda Campus & Hospital',
      'Spacious Single, Double & Triple Sharing Rooms',
      'Fingerprint Biometric & 24/7 CCTV Monitoring',
      'Free Assisted Site Visits & On-Ground Support'
    ],
    zeroClickSummary: 'Hostels near Sharda University in Knowledge Park 3 are situated within 300m–750m of Gate 4 and Sharda Hospital. Rents range between ₹9,000 and ₹16,000/month, featuring fully furnished AC rooms, 3 hygienic meals, high-speed Wi-Fi, 24/7 CCTV, and zero broker commissions.',
    commuteHighlights: [
      '3-6 minutes walk to Sharda Gate 4',
      '5 minutes auto ride to Knowledge Park 2 Metro Station',
      '8 minutes drive to Pari Chowk'
    ],
    nearbyColleges: ['Dronacharya Group of Institutions', 'GNIOT', 'Pari Chowk Hub'],
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
    hubType: 'college',
    title: 'Girls & Boys PGs near Amity University Noida Sector 125 (0 Brokerage)',
    metaDescription: 'Find verified girls and boys PGs near Amity University Sector 125 Noida. Walking distance from Gate 2 & 4, hygienic meals, AC, and 100% zero brokerage.',
    locality: 'Sector 125, Noida',
    city: 'Noida',
    metro: 'Botanical Garden / Okhla Bird Sanctuary Metro (Magenta Line)',
    walkingDistance: '5 to 10 mins walking (400m - 900m)',
    avgRent: '₹9,500 - ₹18,000 / month',
    startingRent: '₹9,500',
    totalVerifiedBeds: '320+ Verified Beds',
    heroImage: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=1200',
    landmarks: ['Amity Gate 2 & Gate 4', 'Raipur Khadar', 'Sector 125 Metro Link'],
    keyHighlights: [
      'Safe Girls & Boys Accommodations near Amity Gates',
      'AC Rooms with High-Speed Wi-Fi & Daily Housekeeping',
      'Zero Brokerage & Transparent Rent Agreements',
      'Assisted Physical Visits with Caretaker Handshake'
    ],
    zeroClickSummary: 'PGs near Amity University Sector 125 Noida are located 400m–900m from campus gates in Raipur Khadar and Sector 126. Rents range from ₹9,500 to ₹18,000 per month, including air conditioning, 3 daily meals, Wi-Fi, biometric security, and zero broker commissions.',
    commuteHighlights: [
      '5-8 minutes walk to Amity Gate 2 & 4',
      '5 minutes auto ride to Okhla Bird Sanctuary Metro Station (Magenta Line)',
      '10 minutes to Botanical Garden Metro Interchange'
    ],
    nearbyColleges: ['Jaypee Institute Sector 128', 'HCL Technologies Campus Sector 126'],
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

  'niet-greater-noida': {
    slug: 'niet-greater-noida',
    name: 'Noida Institute of Engineering and Technology (NIET)',
    shortName: 'NIET',
    hubType: 'college',
    title: 'Verified Student Hostels & PGs near NIET Greater Noida (0 Brokerage)',
    metaDescription: 'Find verified hostels and PGs near NIET in Knowledge Park 2, Greater Noida. 2-5 mins walk to campus, 3 meals, AC, and zero broker commission.',
    locality: 'Knowledge Park 2, Greater Noida',
    city: 'Greater Noida',
    metro: 'Knowledge Park 2 Metro Station (Aqua Line - 400m)',
    walkingDistance: '2 to 5 mins walking (200m - 500m)',
    avgRent: '₹8,000 - ₹13,500 / month (Meals Included)',
    startingRent: '₹8,000',
    totalVerifiedBeds: '280+ Verified Beds',
    heroImage: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&q=80&w=1200',
    landmarks: ['NIET Main Gate', 'Knowledge Park 2 Metro', 'KP2 Food Plaza'],
    keyHighlights: [
      'Instant Walk to NIET Engineering & Pharmacy Blocks',
      'Complete Mess Facility with Evening Tea & Snacks',
      '24/7 Power Backup & RO Drinking Water',
      'Zero Brokerage Guarantee'
    ],
    zeroClickSummary: 'Hostels near NIET Greater Noida in Knowledge Park 2 are situated within 200m to 500m from NIET campus gates. Rents average between ₹8,000 and ₹13,500/month for double/single AC rooms including 3 meals, Wi-Fi, laundry, and zero broker commission.',
    commuteHighlights: [
      '2-4 minutes walk to NIET main entrance',
      '4 minutes walk to Knowledge Park 2 Metro Station',
      '8 minutes drive to Pari Chowk'
    ],
    nearbyColleges: ['GL Bajaj', 'Lloyd Law College', 'IIMT Group'],
    description: 'Find verified student accommodations within walking distance of NIET in Knowledge Park 2 Greater Noida. Enjoy verified room pictures, 48-hour free bed holds, and direct owner pricing.',
    filterKeywords: ['niet', 'knowledge park 2', 'greater noida', 'niet pg'],
    faqs: [
      {
        question: 'How close are the PGs to NIET Greater Noida campus?',
        answer: 'Our verified properties are between 200m and 500m from NIET gates, allowing students to walk to classes in under 4 minutes.'
      },
      {
        question: 'Are electricity and Wi-Fi included in NIET hostel rent?',
        answer: 'High-speed Wi-Fi and power backup are included. AC electricity is billed as per individual room sub-meters at nominal state tariffs.'
      }
    ]
  },

  'lloyd-institute-greater-noida': {
    slug: 'lloyd-institute-greater-noida',
    name: 'Lloyd Law College & Lloyd Group of Institutions',
    shortName: 'Lloyd College',
    hubType: 'college',
    title: 'Student Hostels & PGs near Lloyd Law College Knowledge Park 2 (₹0 Brokerage)',
    metaDescription: 'Verified hostels and PGs near Lloyd Law College and Lloyd Institute in Knowledge Park 2 Greater Noida. Quiet study spaces, 3 meals, AC, and zero broker fees.',
    locality: 'Knowledge Park 2, Greater Noida',
    city: 'Greater Noida',
    metro: 'Knowledge Park 2 Metro Station (Aqua Line - 350m)',
    walkingDistance: '2 to 6 mins walking (250m - 600m)',
    avgRent: '₹8,500 - ₹14,000 / month',
    startingRent: '₹8,500',
    totalVerifiedBeds: '220+ Verified Beds',
    heroImage: 'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?auto=format&fit=crop&q=80&w=1200',
    landmarks: ['Lloyd Law Campus', 'KP2 Metro Station', 'Judicial Training Center Link'],
    keyHighlights: [
      'Quiet, Study-Oriented Environment for Law & Pharmacy Students',
      'Comfortable Single and Double Sharing AC Rooms',
      'Biometric Security & Strict Entry Protocol',
      'Free Assisted Visits & Zero Brokerage'
    ],
    zeroClickSummary: 'Hostels near Lloyd Law College in Knowledge Park 2 Greater Noida provide student-friendly accommodation 250m–600m from campus. Monthly rents range from ₹8,500 to ₹14,000 including 3 wholesome meals, Wi-Fi, study desks, and 24/7 security with ₹0 brokerage.',
    commuteHighlights: [
      '3-5 minutes walk to Lloyd Law College gates',
      '4 minutes walk to Knowledge Park 2 Metro Station',
      '10 minutes to Pari Chowk'
    ],
    nearbyColleges: ['GL Bajaj', 'NIET', 'Accurate Institute'],
    description: 'Explore verified student hostels and co-living spaces near Lloyd Law College and Lloyd Institute in Knowledge Park 2 Greater Noida with zero brokerage and instant digital visit passes.',
    filterKeywords: ['lloyd', 'lloyd law', 'knowledge park 2', 'greater noida'],
    faqs: [
      {
        question: 'Are there quiet PGs with good study desks near Lloyd Law College?',
        answer: 'Yes, our partner hostels cater specifically to law and graduate students, offering sound-insulated study desks, quiet reading zones, and high-speed Wi-Fi.'
      }
    ]
  },

  'jss-academy-sector-62-noida': {
    slug: 'jss-academy-sector-62-noida',
    name: 'JSS Academy of Technical Education (Sector 62 Noida)',
    shortName: 'JSS Noida',
    hubType: 'college',
    title: 'Verified Hostels & PGs near JSS Academy Sector 62 Noida (Zero Brokerage)',
    metaDescription: 'Find verified boys & girls PGs near JSS Academy of Technical Education Sector 62 Noida. Near Electronic City Metro, 3 meals, AC, and zero brokerage.',
    locality: 'Sector 62, Noida',
    city: 'Noida',
    metro: 'Noida Electronic City Metro Station (Blue Line - 600m)',
    walkingDistance: '4 to 9 mins walking (350m - 800m)',
    avgRent: '₹9,000 - ₹16,500 / month',
    startingRent: '₹9,000',
    totalVerifiedBeds: '260+ Verified Beds',
    heroImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1200',
    landmarks: ['JSS Main Gate', 'Noida Electronic City Metro', 'Fortis Hospital Sector 62'],
    keyHighlights: [
      'Close to Noida Electronic City Blue Line Metro',
      'Surrounded by IT Hubs & Coaching Institutes',
      'Attached Washroom AC Rooms with Hygienic Meals',
      'Zero Brokerage & Assisted Visits'
    ],
    zeroClickSummary: 'Accommodations near JSS Academy Sector 62 Noida are situated 350m–800m from campus and Noida Electronic City Metro on the Blue Line. Monthly rents range from ₹9,000 to ₹16,500, offering 3 daily meals, high-speed internet, power backup, and zero broker commissions.',
    commuteHighlights: [
      '5 minutes walk to JSS campus',
      '6 minutes walk to Noida Electronic City Metro Station',
      '15 minutes drive to Sector 18 Atta Market'
    ],
    nearbyColleges: ['Symbiosis Centre for Management Studies Sector 62', 'IIM Lucknow Noida Campus'],
    description: 'Find verified student PGs and co-living rooms near JSS Academy of Technical Education in Sector 62 Noida with direct owner pricing, verified photos, and zero broker fees.',
    filterKeywords: ['jss', 'sector 62', 'noida', 'jss academy', 'electronic city'],
    faqs: [
      {
        question: 'Which metro station is closest to JSS Sector 62 Noida?',
        answer: 'Noida Electronic City Metro Station on the Blue Line is just 600m away, providing direct connectivity to Central Delhi, Rajiv Chowk, and Ghaziabad.'
      }
    ]
  },

  'knowledge-park-2-greater-noida': {
    slug: 'knowledge-park-2-greater-noida',
    name: 'Knowledge Park 2 Student Hub (Greater Noida)',
    shortName: 'Knowledge Park 2',
    hubType: 'locality',
    title: 'Student Hostels & PGs in Knowledge Park 2 Greater Noida (₹0 Brokerage)',
    metaDescription: 'Discover top student hostels & PGs across Knowledge Park 2, Greater Noida. Near GL Bajaj, NIET, Lloyd & IIMT. 3 meals daily, AC, Wi-Fi, and zero commission.',
    locality: 'Knowledge Park 2, Greater Noida',
    city: 'Greater Noida',
    metro: 'Knowledge Park 2 Metro Station (Aqua Line - Central Hub)',
    walkingDistance: 'Central to all 12 major engineering colleges',
    avgRent: '₹7,500 - ₹13,500 / month',
    startingRent: '₹7,500',
    totalVerifiedBeds: '1200+ Verified Beds',
    heroImage: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=1200',
    landmarks: ['Knowledge Park 2 Metro Station', 'NIET', 'GL Bajaj', 'Lloyd Institute', 'IIMT'],
    keyHighlights: [
      'Walking Distance to 10+ Engineering & MBA Colleges',
      'Aqua Line Metro Connectivity to Noida & Delhi',
      'Comprehensive Meal Plans with Evening Snacks',
      'DPIIT Govt Recognized Housing Platform'
    ],
    zeroClickSummary: 'Knowledge Park 2 is Greater Noida’s premier educational cluster housing GL Bajaj, NIET, Lloyd, and IIMT. Average student accommodation rent is ₹7,500–₹13,500/month, covering 3 meals daily, AC, Wi-Fi, and biometric security with direct Aqua Line metro connectivity and ₹0 brokerage.',
    commuteHighlights: [
      'Immediate access to Knowledge Park 2 Metro Station',
      'Walking distance to 12 top colleges',
      '5 minutes to Pari Chowk intersection'
    ],
    nearbyColleges: ['GL Bajaj', 'NIET', 'Lloyd Law', 'IIMT', 'GNIOT', 'Accurate Institute'],
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
  },

  'knowledge-park-3-greater-noida': {
    slug: 'knowledge-park-3-greater-noida',
    name: 'Knowledge Park 3 Hub (Greater Noida)',
    shortName: 'Knowledge Park 3',
    hubType: 'locality',
    title: 'Verified Student Hostels & PGs in Knowledge Park 3 Greater Noida (0 Brokerage)',
    metaDescription: 'Find verified hostels & PGs in Knowledge Park 3 Greater Noida near Sharda University, Dronacharya & Sharda Hospital. AC rooms, 3 meals, and zero brokerage.',
    locality: 'Knowledge Park 3, Greater Noida',
    city: 'Greater Noida',
    metro: 'Knowledge Park 2 & Pari Chowk Metro (Aqua Line)',
    walkingDistance: 'Walking distance to Sharda & medical/dental colleges',
    avgRent: '₹8,500 - ₹15,500 / month',
    startingRent: '₹8,500',
    totalVerifiedBeds: '650+ Verified Beds',
    heroImage: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=1200',
    landmarks: ['Sharda University', 'Knowledge Park 3 Commercial Complex', 'Dronacharya Institute'],
    keyHighlights: [
      'Immediate Proximity to Sharda University & Hospital',
      'Quiet Residential Pockets with Green Parks',
      'Modern High-Rise Student Residences with Elevators',
      'Zero Brokerage Guarantee'
    ],
    zeroClickSummary: 'Knowledge Park 3 in Greater Noida is home to Sharda University and Dronacharya College. Student accommodations range from ₹8,500 to ₹15,500/month with full meal plans, AC, Wi-Fi, 24/7 security, and convenient auto connections to Pari Chowk with ₹0 brokerage.',
    commuteHighlights: [
      '2-7 minutes walk to Sharda University',
      '5 minutes auto ride to Knowledge Park 2 Metro',
      '7 minutes to Pari Chowk'
    ],
    nearbyColleges: ['Sharda University', 'Dronacharya Group', 'GNIOT'],
    description: 'Browse verified student hostels in Knowledge Park 3 Greater Noida. Safe accommodations with verified caretakers, zero brokerage, and free site visit scheduling.',
    filterKeywords: ['knowledge park 3', 'kp3', 'sharda', 'greater noida'],
    faqs: [
      {
        question: 'Are there medical student friendly PGs in Knowledge Park 3?',
        answer: 'Yes, we feature 24/7 access accommodations with late dinner provisions specifically tailored for Sharda Hospital medical and nursing interns.'
      }
    ]
  },

  'pari-chowk-greater-noida': {
    slug: 'pari-chowk-greater-noida',
    name: 'Pari Chowk Central Transit Hub (Greater Noida)',
    shortName: 'Pari Chowk',
    hubType: 'metro-hub',
    title: 'Student Hostels & PGs near Pari Chowk Greater Noida (₹0 Brokerage)',
    metaDescription: 'Find verified student hostels and PGs near Pari Chowk Greater Noida. Central metro station, direct bus shuttles to all colleges, 3 meals, and zero brokerage.',
    locality: 'Pari Chowk, Greater Noida',
    city: 'Greater Noida',
    metro: 'Pari Chowk Metro Station (Aqua Line - Central Transit)',
    walkingDistance: 'Direct transit access to 25+ colleges and markets',
    avgRent: '₹7,500 - ₹14,000 / month',
    startingRent: '₹7,500',
    totalVerifiedBeds: '750+ Verified Beds',
    heroImage: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&q=80&w=1200',
    landmarks: ['Pari Chowk Roundabout', 'Pari Chowk Metro Station', 'Ansal Plaza Mall', 'Alfa Commercial Market'],
    keyHighlights: [
      'Major Central Transit Hub for Greater Noida & Expressway',
      'Walking Distance to Malls, Cafes, Banks & Medical Stores',
      'Direct Bus & Metro Access to Galgotias, Sharda, Bennett & Amity',
      'Zero Brokerage & 48h Bed Hold'
    ],
    zeroClickSummary: 'Pari Chowk is Greater Noida’s central transit and commercial nerve center. PGs near Pari Chowk cost ₹7,500–₹14,000/month, providing unmatched access to Aqua Line metro, Ansal Plaza mall, and direct college shuttle routes with ₹0 broker fees.',
    commuteHighlights: [
      '1 minute walk to Pari Chowk Metro Station',
      'Direct college shuttles to Galgotias, Bennett, and NIU',
      '3 minutes to Alpha 1 Commercial Center'
    ],
    nearbyColleges: ['Galgotias University', 'Bennett University', 'GL Bajaj', 'Sharda University'],
    description: 'Pari Chowk connects all of Greater Noida. Choose from verified student co-living spaces and PGs with zero brokerage and seamless access to transit and dining.',
    filterKeywords: ['pari chowk', 'greater noida', 'ansal plaza', 'aqua line'],
    faqs: [
      {
        question: 'Why choose a PG near Pari Chowk Greater Noida?',
        answer: 'Pari Chowk offers the best transport connectivity in Greater Noida, with immediate metro access, college bus stops, multi-cuisine food joints, and 24/7 pharmacies.'
      }
    ]
  },

  'alpha-1-greater-noida': {
    slug: 'alpha-1-greater-noida',
    name: 'Alpha 1 Residential & Student Hub (Greater Noida)',
    shortName: 'Alpha 1',
    hubType: 'locality',
    title: 'Verified Student Hostels & PGs in Alpha 1 Greater Noida (0 Brokerage)',
    metaDescription: 'Browse verified girls and boys PGs in Alpha 1 Greater Noida. Walk to Alpha 1 Metro, green parks, markets, 3 meals daily, AC, and zero brokerage.',
    locality: 'Alpha 1, Greater Noida',
    city: 'Greater Noida',
    metro: 'Alpha 1 Metro Station (Aqua Line - 200m)',
    walkingDistance: '2 to 6 mins walking to metro and commercial complex',
    avgRent: '₹8,000 - ₹14,500 / month',
    startingRent: '₹8,000',
    totalVerifiedBeds: '420+ Verified Beds',
    heroImage: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=1200',
    landmarks: ['Alpha 1 Metro Station', 'Alpha 1 Commercial Center', 'Ganga Shopping Complex'],
    keyHighlights: [
      'Peaceful Residential Sector with Wide Roads & Parks',
      'Walking Distance to Alpha 1 Metro Station',
      'Home-Style Fresh Food & Separate Boys/Girls Properties',
      'Zero Brokerage Guarantee'
    ],
    zeroClickSummary: 'Alpha 1 is one of Greater Noida’s top student-preferred residential sectors. Accommodations range from ₹8,000 to ₹14,500/month, featuring fully furnished rooms, home-style meals, 24/7 security, and immediate access to the Alpha 1 Aqua Line Metro Station with ₹0 brokerage.',
    commuteHighlights: [
      '2-4 minutes walk to Alpha 1 Metro Station',
      '5 minutes to Knowledge Park 2 via Metro',
      '4 minutes drive to Pari Chowk'
    ],
    nearbyColleges: ['GL Bajaj', 'Galgotias', 'NIET', 'GNIOT'],
    description: 'Find verified student accommodations in Alpha 1 Greater Noida. Safe, green sector with complete amenities, zero brokerage, and free assisted room visits.',
    filterKeywords: ['alpha 1', 'alpha', 'greater noida', 'alpha 1 pg'],
    faqs: [
      {
        question: 'How easy is it to commute to Knowledge Park 2 colleges from Alpha 1?',
        answer: 'It takes just 4 minutes via the Aqua Line metro (Alpha 1 Station to Knowledge Park 2 Station) or a short 6-minute e-rickshaw ride.'
      }
    ]
  },

  'sector-62-noida': {
    slug: 'sector-62-noida',
    name: 'Sector 62 IT & Student Hub (Noida)',
    shortName: 'Sector 62 Noida',
    hubType: 'locality',
    title: 'Verified Boys & Girls PGs in Sector 62 Noida (Zero Brokerage)',
    metaDescription: 'Find verified PGs in Sector 62 Noida near JSS, Fortis, and Electronic City Metro. AC rooms, 3 hygienic meals, high-speed Wi-Fi, and 100% zero brokerage.',
    locality: 'Sector 62, Noida',
    city: 'Noida',
    metro: 'Noida Electronic City Metro Station (Blue Line)',
    walkingDistance: 'Walking distance to major IT parks and colleges',
    avgRent: '₹9,000 - ₹17,000 / month',
    startingRent: '₹9,000',
    totalVerifiedBeds: '350+ Verified Beds',
    heroImage: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=1200',
    landmarks: ['Noida Electronic City Metro', 'Fortis Hospital Sector 62', 'Stellar IT Park', 'JSS College'],
    keyHighlights: [
      'Direct Blue Line Metro Connectivity to Central Delhi & Connaught Place',
      'Safe Gated Communities with Female/Male Warden Caretakers',
      'High-Speed Fiber Internet & Dedicated Work Desks',
      'Zero Brokerage Guarantee'
    ],
    zeroClickSummary: 'Sector 62 is Noida’s foremost student and IT hub. Monthly PG rents range from ₹9,000 to ₹17,000, including 3 hygienic meals daily, air conditioning, fiber Wi-Fi, daily housekeeping, and direct Blue Line metro access with ₹0 broker fees.',
    commuteHighlights: [
      '3-6 minutes walk to Noida Electronic City Metro Station',
      '5 minutes to Fortis Hospital and Stellar IT Park',
      '20 minutes to Delhi Anand Vihar'
    ],
    nearbyColleges: ['JSS Academy', 'Symbiosis Noida', 'IIM Lucknow Noida'],
    description: 'Discover verified student and working professional PGs in Sector 62 Noida with direct landlord pricing, free physical visits, and 100% zero brokerage.',
    filterKeywords: ['sector 62', 'noida', 'electronic city', 'jss noida pg'],
    faqs: [
      {
        question: 'Are meals included in Sector 62 Noida PGs?',
        answer: 'Yes, our verified properties include 3 hygienic meals daily (breakfast, lunch, and dinner) along with weekend special menus.'
      }
    ]
  },

  'bennett-university-greater-noida': {
    slug: 'bennett-university-greater-noida',
    name: 'Bennett University (TechZone 2 Greater Noida)',
    shortName: 'Bennett University',
    hubType: 'college',
    title: 'Student Hostels & PGs near Bennett University Greater Noida (0 Brokerage)',
    metaDescription: 'Find verified off-campus student hostels & PGs near Bennett University TechZone 2 Greater Noida. Daily shuttle, 3 meals, AC rooms, and zero brokerage.',
    locality: 'TechZone 2 & Pari Chowk, Greater Noida',
    city: 'Greater Noida',
    metro: 'Pari Chowk & Alpha 1 Metro Station',
    walkingDistance: 'Direct shuttle pickup to Bennett Campus',
    avgRent: '₹9,000 - ₹16,000 / month',
    startingRent: '₹9,000',
    totalVerifiedBeds: '240+ Verified Beds',
    heroImage: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&q=80&w=1200',
    landmarks: ['Bennett Campus', 'TechZone 2', 'Pari Chowk Transit', 'Wipro SEZ Link'],
    keyHighlights: [
      'Affordable Off-Campus Housing Alternative with Shuttles',
      'Quality Nutritious Meals with Non-Veg/Veg Options',
      'High-Speed Wi-Fi, Laundry & Housekeeping Included',
      'Zero Brokerage & 48-Hour Bed Hold'
    ],
    zeroClickSummary: 'Off-campus student hostels for Bennett University in Greater Noida provide verified AC rooms in TechZone 2 and Pari Chowk. Rents range from ₹9,000 to ₹16,000/month including 3 meals daily, daily college shuttles, laundry, and zero broker commissions.',
    commuteHighlights: [
      'Direct shuttle service to Bennett University gates',
      '10 minutes drive to Pari Chowk transit hub',
      '12 minutes to Knowledge Park 2'
    ],
    nearbyColleges: ['Bennett University', 'Noida International University', 'Galgotias University'],
    description: 'Find verified student accommodations for Bennett University students with zero broker fees, daily campus commute options, and free assisted site visits.',
    filterKeywords: ['bennett', 'bennett university', 'techzone 2', 'greater noida'],
    faqs: [
      {
        question: 'Are there daily shuttles to Bennett University from student hostels?',
        answer: 'Yes, partner hostels in Pari Chowk and TechZone 2 provide scheduled daily morning and evening shuttle vans to Bennett University.'
      }
    ]
  }
};
