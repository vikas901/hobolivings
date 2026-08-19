/**
 * Comprehensive City Pillar Dataset for Hobo Livings (2026 Edition)
 * Powers /coliving/[slug] high-authority pillar pages
 */

export interface CityLocality {
  name: string;
  type: 'Student Hub' | 'IT Corridor' | 'Commercial & Residential';
  avgRent: string;
  metroConnectivity: string;
  safetyRating: string;
  keyCollegesOrCompanies: string[];
}

export interface CityPillarData {
  slug: string;
  name: string;
  state: string;
  title: string;
  metaDescription: string;
  heroImage: string;
  tagline: string;
  startingRent: string;
  avgRent: string;
  totalProperties: string;
  localities: CityLocality[];
  topCampusesAndHubs: {
    name: string;
    slug?: string;
    distanceOrLocality: string;
  }[];
  transitGuide: {
    mode: string;
    details: string;
  }[];
  zeroClickSummary: string;
  overview: string;
  faqs: {
    question: string;
    answer: string;
  }[];
}

export const CITY_PILLARS: Record<string, CityPillarData> = {
  'greater-noida': {
    slug: 'greater-noida',
    name: 'Greater Noida',
    state: 'Uttar Pradesh',
    title: 'Co-Living & Verified Student Hostels in Greater Noida (₹0 Brokerage)',
    metaDescription: 'Find verified co-living spaces, student hostels, and PGs in Greater Noida near Knowledge Park, Pari Chowk, and Yamuna Expressway. 3 meals included, AC rooms, 48h bed hold, and zero brokerage.',
    heroImage: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=1200',
    tagline: 'The Ultimate Student & Co-Living Hub in Delhi NCR',
    startingRent: '₹7,500 / month',
    avgRent: '₹8,500 - ₹14,000 / month',
    totalProperties: '150+ Verified Accommodations',
    localities: [
      {
        name: 'Knowledge Park 2',
        type: 'Student Hub',
        avgRent: '₹8,000 - ₹13,500',
        metroConnectivity: 'Knowledge Park 2 Metro (Aqua Line)',
        safetyRating: '4.8 / 5 (Biometric & 24/7 Security)',
        keyCollegesOrCompanies: ['GL Bajaj', 'NIET', 'Lloyd Law College', 'IIMT'],
      },
      {
        name: 'Knowledge Park 3',
        type: 'Student Hub',
        avgRent: '₹8,500 - ₹14,500',
        metroConnectivity: 'Knowledge Park 2 / Alpha 1 Metro',
        safetyRating: '4.9 / 5 (CCTV & Security Wardens)',
        keyCollegesOrCompanies: ['Sharda University', 'GNIOT', 'Mangalmay'],
      },
      {
        name: 'Pari Chowk & Alpha 1',
        type: 'Commercial & Residential',
        avgRent: '₹9,000 - ₹15,000',
        metroConnectivity: 'Pari Chowk & Alpha 1 Metro Station',
        safetyRating: '4.7 / 5 (Well-lit commercial zone)',
        keyCollegesOrCompanies: ['Commercial Hubs', 'Retail Markets', 'Galgotias Shuttle Point'],
      },
      {
        name: 'Yamuna Expressway',
        type: 'Student Hub',
        avgRent: '₹8,500 - ₹14,000',
        metroConnectivity: 'Feeder buses to Pari Chowk Metro',
        safetyRating: '4.7 / 5 (Gated Campus Hostels)',
        keyCollegesOrCompanies: ['Galgotias University', 'Noida International Univ (NIU)'],
      },
    ],
    topCampusesAndHubs: [
      { name: 'GL Bajaj Institute', slug: 'gl-bajaj-greater-noida', distanceOrLocality: 'Knowledge Park 2' },
      { name: 'Galgotias University', slug: 'galgotias-university-greater-noida', distanceOrLocality: 'Yamuna Expressway / KP2' },
      { name: 'Sharda University', slug: 'sharda-university-greater-noida', distanceOrLocality: 'Knowledge Park 3' },
      { name: 'NIET Institute', slug: 'niet-greater-noida', distanceOrLocality: 'Knowledge Park 2' },
      { name: 'Pari Chowk Hub', slug: 'pari-chowk-greater-noida', distanceOrLocality: 'Central Metro Hub' },
    ],
    transitGuide: [
      {
        mode: 'Noida Metro Aqua Line',
        details: 'Seamlessly connects Greater Noida (Knowledge Park 2, Pari Chowk, Alpha 1, Depot) to Sector 51 Noida (interchange with Delhi Metro Blue Line).',
      },
      {
        mode: 'Noida-Greater Noida Expressway',
        details: 'High-speed 6-lane connectivity to South Delhi, Noida Sector 125 (Amity), and Mahamaya Flyover.',
      },
      {
        mode: 'Campus Feeder Shuttles & E-Rickshaws',
        details: '₹10–₹20 flat-fare electric rickshaws available 24/7 across all Knowledge Park sectors.',
      },
    ],
    zeroClickSummary: 'Co-living in Greater Noida is centered in Knowledge Park 2 & 3 and Pari Chowk. Average monthly rents range from ₹7,500 to ₹14,500 per bed, inclusive of 3 fresh meals, high-speed Wi-Fi, air conditioning, and 24/7 biometric security with 100% zero brokerage through Hobo Livings.',
    overview: 'Greater Noida is India’s premier higher education corridor, home to over 50,000 engineering, medical, management, and law students. Hobo Livings provides verified, fully-managed co-living spaces and student hostels engineered for academic excellence, safety, and community comfort.',
    faqs: [
      {
        question: 'What is the average rent for a co-living space or PG in Greater Noida with food?',
        answer: 'Triple sharing rooms start at ₹7,500–₹9,000/month, double sharing rooms range from ₹9,500–₹12,500/month, and private single rooms range from ₹13,500–₹16,000/month. All prices include 3 meals daily, AC, high-speed Wi-Fi, and electricity backup.',
      },
      {
        question: 'Which is the best locality in Greater Noida for college students?',
        answer: 'Knowledge Park 2 and Knowledge Park 3 are the most popular student localities, situated within 2–5 minutes walking distance from major campuses like GL Bajaj, Sharda, and NIET, and served by the Aqua Line Metro.',
      },
      {
        question: 'Does Hobo Livings charge any broker fees in Greater Noida?',
        answer: 'No. Hobo Livings provides a 100% zero brokerage guarantee for all students and tenants. Free guided physical visits and 48-hour bed holds are provided at zero cost.',
      },
      {
        question: 'How do physical visit passes work in Greater Noida?',
        answer: 'Click "Schedule Free Visit" on any property listing, pick your preferred date and time, and instantly receive your Digital Visit Pass with caretaker phone contact and Google Maps navigation.',
      },
    ],
  },

  'noida': {
    slug: 'noida',
    name: 'Noida',
    state: 'Uttar Pradesh',
    title: 'Co-Living Spaces & Executive PGs in Noida (Zero Brokerage)',
    metaDescription: 'Discover verified co-living spaces and PGs in Noida Sector 62, Sector 125 near Amity, and Sector 15/18. Furnished rooms, high-speed Wi-Fi, daily meals, and zero broker commission.',
    heroImage: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1200',
    tagline: 'Modern Co-Living for Students & Working Professionals in Noida',
    startingRent: '₹9,000 / month',
    avgRent: '₹10,500 - ₹18,000 / month',
    totalProperties: '120+ Verified Accommodations',
    localities: [
      {
        name: 'Sector 62 (IT & Institutional Hub)',
        type: 'IT Corridor',
        avgRent: '₹10,000 - ₹16,500',
        metroConnectivity: 'Sector 62 & Electronic City Metro (Blue Line)',
        safetyRating: '4.8 / 5 (Corporate IT zone)',
        keyCollegesOrCompanies: ['JSS Academy', 'TCS', 'Barclays', 'Tech Mahindra'],
      },
      {
        name: 'Sector 125 & 126 (Amity Hub)',
        type: 'Student Hub',
        avgRent: '₹11,000 - ₹19,000',
        metroConnectivity: 'Okhla Bird Sanctuary / Botanical Garden Metro',
        safetyRating: '4.9 / 5 (Student friendly & gated)',
        keyCollegesOrCompanies: ['Amity University Noida', 'HCL Technologies', 'Expressway IT Parks'],
      },
      {
        name: 'Sector 15 & 18 (Commercial Central)',
        type: 'Commercial & Residential',
        avgRent: '₹9,500 - ₹15,000',
        metroConnectivity: 'Noida Sector 15 & Sector 18 Metro (Blue Line)',
        safetyRating: '4.8 / 5 (Metro hub & shopping malls)',
        keyCollegesOrCompanies: ['Noida Film City', 'Atta Market', 'DLF Mall of India'],
      },
      {
        name: 'Sector 137 (Expressway Corporate)',
        type: 'Commercial & Residential',
        avgRent: '₹10,500 - ₹17,500',
        metroConnectivity: 'Sector 137 Metro (Aqua Line)',
        safetyRating: '4.9 / 5 (Gated High-Rise Societies)',
        keyCollegesOrCompanies: ['Advant Navis Business Park', 'MetLife', 'Genpact'],
      },
    ],
    topCampusesAndHubs: [
      { name: 'Amity University Noida', slug: 'amity-university-noida', distanceOrLocality: 'Sector 125' },
      { name: 'JSS Academy & IT Hub', slug: 'jss-academy-sector-62-noida', distanceOrLocality: 'Sector 62' },
      { name: 'Sector 15 Metro Hub', slug: 'sector-15-noida', distanceOrLocality: 'Near Film City' },
      { name: 'Sector 137 Expressway', slug: 'sector-137-noida', distanceOrLocality: 'Near Advant Tower' },
    ],
    transitGuide: [
      {
        mode: 'Delhi Metro Blue Line',
        details: 'Direct rapid transit from Noida Electronic City (Sector 62) and Botanical Garden to Connaught Place (Rajiv Chowk) and Central Delhi.',
      },
      {
        mode: 'Delhi Metro Magenta Line',
        details: 'Connects Botanical Garden to South Delhi (Hauz Khas, IIT Delhi) and Indira Gandhi International Airport Terminal 1.',
      },
      {
        mode: 'Noida-Greater Noida Aqua Line',
        details: 'Interchange at Sector 51/52 connecting central Noida to all of Greater Noida Knowledge Park.',
      },
    ],
    zeroClickSummary: 'Co-living in Noida ranges between ₹9,000 to ₹18,000 per month across prime hubs in Sector 62, Sector 125 (Amity), and Sector 137. Accommodations include AC, meals, high-speed fiber, daily housekeeping, and 24/7 security with zero broker commission on Hobo Livings.',
    overview: 'Noida is a thriving metropolis combining premier universities with multinational tech giants. Hobo Livings offers flexible co-living accommodations with month-to-month leases, deposit-free booking options, and community lounges for IT professionals and college students.',
    faqs: [
      {
        question: 'What is the average rent for co-living in Noida Sector 62 and Sector 125?',
        answer: 'Double sharing rooms range from ₹10,000 to ₹14,000/month, while single private rooms range from ₹15,000 to ₹20,000/month, inclusive of meals, housekeeping, Wi-Fi, and power backup.',
      },
      {
        question: 'Are co-living spaces in Noida suitable for IT working professionals?',
        answer: 'Yes. Our properties in Sector 62 and Sector 137 feature high-speed fiber internet, ergonomic study/work desks, 24/7 power backup, and are located within 500 meters of Blue Line and Aqua Line metro stations.',
      },
      {
        question: 'Is food included in Noida co-living spaces?',
        answer: 'Most Hobo partner accommodations offer optional or fully included 3 fresh hygienic meals daily (breakfast, lunch, dinner) with North and South Indian varieties.',
      },
    ],
  },

  'bangalore': {
    slug: 'bangalore',
    name: 'Bangalore (Bengaluru)',
    state: 'Karnataka',
    title: 'Co-Living Spaces in Bangalore | HSR Layout, Koramangala & Whitefield (Zero Brokerage)',
    metaDescription: 'Find modern co-living spaces and shared apartments in Bangalore near HSR Layout, Koramangala, Bellandur, and Whitefield. Fully furnished, high-speed Wi-Fi, zero brokerage.',
    heroImage: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&q=80&w=1200',
    tagline: 'Silicon Valley Co-Living Designed for Techies & Remote Workers',
    startingRent: '₹11,000 / month',
    avgRent: '₹12,500 - ₹24,000 / month',
    totalProperties: '80+ Verified Accommodations',
    localities: [
      {
        name: 'HSR Layout (Sectors 1 to 7)',
        type: 'IT Corridor',
        avgRent: '₹12,000 - ₹22,000',
        metroConnectivity: 'Silk Board & HSR Metro (Yellow / Green Line Extension)',
        safetyRating: '4.9 / 5 (Prime Startup & Tech Hub)',
        keyCollegesOrCompanies: ['Swiggy HQ', 'Kite Zerodha', 'Myntra', 'Startup Incubators'],
      },
      {
        name: 'Koramangala (Blocks 1 to 8)',
        type: 'Commercial & Residential',
        avgRent: '₹14,000 - ₹26,000',
        metroConnectivity: 'Tavarekere / Dairy Circle Metro',
        safetyRating: '4.8 / 5 (Cafes, Restaurants & Gated Enclaves)',
        keyCollegesOrCompanies: ['Flipkart', 'Infosys Park', 'St. Johns Medical College'],
      },
      {
        name: 'Bellandur & Outer Ring Road (ORR)',
        type: 'IT Corridor',
        avgRent: '₹13,000 - ₹24,000',
        metroConnectivity: 'Outer Ring Road Metro Corridor (Upcoming)',
        safetyRating: '4.8 / 5 (EcoSpace & Tech Parks)',
        keyCollegesOrCompanies: ['Ecospace', 'Prestige Tech Park', 'Cisco', 'Intel'],
      },
      {
        name: 'Whitefield & ITPL',
        type: 'IT Corridor',
        avgRent: '₹11,000 - ₹20,000',
        metroConnectivity: 'Whitefield & ITPL Metro (Purple Line)',
        safetyRating: '4.8 / 5 (Purple Line Metro Linked)',
        keyCollegesOrCompanies: ['ITPL', 'SAP Labs', 'Dell', 'TCS Whitefield'],
      },
    ],
    topCampusesAndHubs: [
      { name: 'HSR Layout Tech Corridor', distanceOrLocality: 'Startup Epicenter' },
      { name: 'Koramangala 4th & 5th Block', distanceOrLocality: 'Near Sony World' },
      { name: 'Bellandur ORR Tech Parks', distanceOrLocality: 'Near Ecospace' },
      { name: 'Whitefield ITPL Hub', distanceOrLocality: 'Purple Line Terminal' },
    ],
    transitGuide: [
      {
        mode: 'Namma Metro Purple Line',
        details: 'Direct connection from Whitefield and ITPL across Central Bangalore (MG Road, Majestic, Indiranagar) to Challaghatta.',
      },
      {
        mode: 'Namma Metro Green & Yellow Lines',
        details: 'Seamless connection through Silk Board to Electronic City and South Bangalore.',
      },
      {
        mode: 'BMTC Volvo AC Buses (Vajra & Vayu Vajra)',
        details: 'Round-the-clock air-conditioned bus network connecting all tech parks to Kempegowda International Airport (BLR).',
      },
    ],
    zeroClickSummary: 'Co-living in Bangalore starts from ₹11,000/month in Whitefield and ₹13,000–₹24,000/month in HSR Layout and Koramangala. Amenities include high-speed Wi-Fi, power backup, daily cleaning, and flexible month-to-month leases with zero broker commissions.',
    overview: 'Bangalore is the innovation capital of India. Hobo Livings provides tech-enabled, fully-furnished co-living suites and studio apartments designed specifically for software engineers, founders, designers, and college students seeking zero-brokerage, flexible month-to-month living.',
    faqs: [
      {
        question: 'What is the average rent for a co-living room in HSR Layout, Bangalore?',
        answer: 'Double sharing rooms in HSR Layout start around ₹12,000–₹15,000/month, while private single studios range between ₹18,000–₹24,000/month, including Wi-Fi, electricity backup, housekeeping, and community events.',
      },
      {
        question: 'Do co-living spaces in Bangalore require heavy security deposits?',
        answer: 'No. Unlike traditional Bangalore landlords who demand 6–10 months of deposit, Hobo Livings offers low 1-month refundable security deposits with zero broker fees.',
      },
      {
        question: 'Is high-speed internet provided for work-from-home (WFH) in Bangalore?',
        answer: 'All Hobo partner accommodations in Bangalore are equipped with commercial-grade dual-band fiber internet (up to 300 Mbps) with 100% generator power backup.',
      },
    ],
  },
};

export function getAllCityPillarSlugs(): string[] {
  return Object.keys(CITY_PILLARS);
}

export function getCityPillarBySlug(slug: string): CityPillarData | undefined {
  return CITY_PILLARS[slug];
}
