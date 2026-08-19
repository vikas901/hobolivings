/**
 * Hobo Livings — 2026 Master Keyword Strategy & Pillar-Cluster Matrix
 * Covers 3-Tier Keyword Architecture for Greater Noida, Noida, Delhi NCR & Bangalore
 */

export interface KeywordTarget {
  keyword: string;
  tier: 'Tier 1 (Head)' | 'Tier 2 (Commercial Long-Tail)' | 'Tier 3 (Informational / GEO)';
  intent: 'Commercial' | 'Transactional' | 'Informational' | 'Navigational';
  monthlySearchVolumeEst: string;
  targetUrl: string;
  primaryH1: string;
  targetAudience: 'College Students' | 'Working Professionals' | 'Parents / Guardians';
  schemaTriggers: string[];
}

export const MASTER_KEYWORD_MATRIX: KeywordTarget[] = [
  // ==========================================
  // TIER 1: HEAD TERMS (Category & City Level)
  // ==========================================
  {
    keyword: 'hostels in greater noida',
    tier: 'Tier 1 (Head)',
    intent: 'Commercial',
    monthlySearchVolumeEst: '18,100 / mo',
    targetUrl: 'https://www.hoboliving.in/campuses/pari-chowk-greater-noida',
    primaryH1: 'Verified Student Hostels & PGs in Greater Noida (₹0 Brokerage)',
    targetAudience: 'College Students',
    schemaTriggers: ['LodgingBusiness', 'WebSite', 'FAQPage', 'BreadcrumbList'],
  },
  {
    keyword: 'pg in greater noida',
    tier: 'Tier 1 (Head)',
    intent: 'Commercial',
    monthlySearchVolumeEst: '22,400 / mo',
    targetUrl: 'https://www.hoboliving.in/',
    primaryH1: 'Affordable Living. Better Experiences in Greater Noida & Noida',
    targetAudience: 'College Students',
    schemaTriggers: ['LodgingBusiness', 'WebSite', 'FAQPage'],
  },
  {
    keyword: 'pg in noida',
    tier: 'Tier 1 (Head)',
    intent: 'Commercial',
    monthlySearchVolumeEst: '27,100 / mo',
    targetUrl: 'https://www.hoboliving.in/campuses/amity-university-noida',
    primaryH1: 'Verified Student PGs & Co-Living Spaces in Noida',
    targetAudience: 'Working Professionals',
    schemaTriggers: ['LodgingBusiness', 'WebSite', 'FAQPage'],
  },
  {
    keyword: 'co living spaces noida',
    tier: 'Tier 1 (Head)',
    intent: 'Commercial',
    monthlySearchVolumeEst: '8,900 / mo',
    targetUrl: 'https://www.hoboliving.in/campuses/jss-academy-sector-62-noida',
    primaryH1: 'Premium Co-Living Spaces in Sector 62 & Greater Noida',
    targetAudience: 'Working Professionals',
    schemaTriggers: ['LodgingBusiness', 'WebSite'],
  },
  {
    keyword: 'student accommodation greater noida',
    tier: 'Tier 1 (Head)',
    intent: 'Commercial',
    monthlySearchVolumeEst: '6,600 / mo',
    targetUrl: 'https://www.hoboliving.in/guides/student-housing-guide',
    primaryH1: 'Verified Student Accommodation in Knowledge Park & Pari Chowk',
    targetAudience: 'College Students',
    schemaTriggers: ['LodgingBusiness', 'FAQPage', 'HowTo'],
  },

  // ==============================================================
  // TIER 2: COMMERCIAL LONG-TAIL (Campus & Locality Specific - High Intent)
  // ==============================================================
  {
    keyword: 'pg near gl bajaj greater noida',
    tier: 'Tier 2 (Commercial Long-Tail)',
    intent: 'Transactional',
    monthlySearchVolumeEst: '4,800 / mo',
    targetUrl: 'https://www.hoboliving.in/campuses/gl-bajaj-greater-noida',
    primaryH1: 'Verified Student Hostels & PGs near GL Bajaj Greater Noida',
    targetAudience: 'College Students',
    schemaTriggers: ['LodgingBusiness', 'FAQPage', 'BreadcrumbList'],
  },
  {
    keyword: 'hostel near galgotias university greater noida',
    tier: 'Tier 2 (Commercial Long-Tail)',
    intent: 'Transactional',
    monthlySearchVolumeEst: '5,400 / mo',
    targetUrl: 'https://www.hoboliving.in/campuses/galgotias-university-greater-noida',
    primaryH1: 'Student Hostels & PGs near Galgotias University',
    targetAudience: 'College Students',
    schemaTriggers: ['LodgingBusiness', 'FAQPage', 'BreadcrumbList'],
  },
  {
    keyword: 'girls pg near sharda university',
    tier: 'Tier 2 (Commercial Long-Tail)',
    intent: 'Transactional',
    monthlySearchVolumeEst: '3,200 / mo',
    targetUrl: 'https://www.hoboliving.in/campuses/sharda-university-greater-noida',
    primaryH1: 'Safe & Verified Girls PGs near Sharda University (Knowledge Park 3)',
    targetAudience: 'College Students',
    schemaTriggers: ['LodgingBusiness', 'FAQPage'],
  },
  {
    keyword: 'boys hostel knowledge park 2',
    tier: 'Tier 2 (Commercial Long-Tail)',
    intent: 'Transactional',
    monthlySearchVolumeEst: '3,600 / mo',
    targetUrl: 'https://www.hoboliving.in/campuses/gl-bajaj-greater-noida',
    primaryH1: 'Boys Hostels in Knowledge Park 2 with 3 Meals & AC',
    targetAudience: 'College Students',
    schemaTriggers: ['LodgingBusiness', 'FAQPage'],
  },
  {
    keyword: 'pg near amity university noida sector 125',
    tier: 'Tier 2 (Commercial Long-Tail)',
    intent: 'Transactional',
    monthlySearchVolumeEst: '6,200 / mo',
    targetUrl: 'https://www.hoboliving.in/campuses/amity-university-noida',
    primaryH1: 'Luxury Student PGs near Amity University Noida (Sector 125)',
    targetAudience: 'College Students',
    schemaTriggers: ['LodgingBusiness', 'FAQPage'],
  },
  {
    keyword: 'pg in sector 62 noida for working professionals',
    tier: 'Tier 2 (Commercial Long-Tail)',
    intent: 'Transactional',
    monthlySearchVolumeEst: '4,100 / mo',
    targetUrl: 'https://www.hoboliving.in/campuses/jss-academy-sector-62-noida',
    primaryH1: 'Executive Co-Living & PGs in Sector 62 Noida near Metro',
    targetAudience: 'Working Professionals',
    schemaTriggers: ['LodgingBusiness', 'FAQPage'],
  },
  {
    keyword: 'zero brokerage pg in greater noida',
    tier: 'Tier 2 (Commercial Long-Tail)',
    intent: 'Transactional',
    monthlySearchVolumeEst: '2,900 / mo',
    targetUrl: 'https://www.hoboliving.in/',
    primaryH1: 'Zero Brokerage Hostels & PGs Across Greater Noida',
    targetAudience: 'College Students',
    schemaTriggers: ['LodgingBusiness', 'FAQPage'],
  },
  {
    keyword: 'single room pg in knowledge park greater noida',
    tier: 'Tier 2 (Commercial Long-Tail)',
    intent: 'Transactional',
    monthlySearchVolumeEst: '2,100 / mo',
    targetUrl: 'https://www.hoboliving.in/campuses/gl-bajaj-greater-noida',
    primaryH1: 'Single Occupancy Private Rooms in Knowledge Park',
    targetAudience: 'College Students',
    schemaTriggers: ['LodgingBusiness', 'FAQPage'],
  },

  // ==============================================================
  // TIER 3: INFORMATIONAL & AI SEARCH / GEO (Answer Engine Optimization)
  // ==============================================================
  {
    keyword: 'average pg rent in greater noida with food 2026',
    tier: 'Tier 3 (Informational / GEO)',
    intent: 'Informational',
    monthlySearchVolumeEst: '3,800 / mo',
    targetUrl: 'https://www.hoboliving.in/guides/hostel-vs-pg-cost-breakdown',
    primaryH1: 'Hostel vs PG Rent Breakdown in Greater Noida (2026 Edition)',
    targetAudience: 'Parents / Guardians',
    schemaTriggers: ['FAQPage', 'HowTo', 'BreadcrumbList'],
  },
  {
    keyword: 'hostel mess food vs tiffin service greater noida',
    tier: 'Tier 3 (Informational / GEO)',
    intent: 'Informational',
    monthlySearchVolumeEst: '1,900 / mo',
    targetUrl: 'https://www.hoboliving.in/guides/hostel-mess-vs-tiffin-food-guide',
    primaryH1: 'Hostel Mess vs Tiffin Service: Food Quality & Cost Guide',
    targetAudience: 'College Students',
    schemaTriggers: ['FAQPage', 'HowTo'],
  },
  {
    keyword: 'how to verify pg safety in knowledge park greater noida',
    tier: 'Tier 3 (Informational / GEO)',
    intent: 'Informational',
    monthlySearchVolumeEst: '2,200 / mo',
    targetUrl: 'https://www.hoboliving.in/guides/student-housing-guide',
    primaryH1: '18-Point Student PG Safety & Verification Checklist',
    targetAudience: 'Parents / Guardians',
    schemaTriggers: ['FAQPage', 'HowTo'],
  },
  {
    keyword: 'best areas to live near knowledge park 2 for students',
    tier: 'Tier 3 (Informational / GEO)',
    intent: 'Informational',
    monthlySearchVolumeEst: '2,700 / mo',
    targetUrl: 'https://www.hoboliving.in/campuses/pari-chowk-greater-noida',
    primaryH1: 'Best Localities for Student Living in Greater Noida',
    targetAudience: 'College Students',
    schemaTriggers: ['FAQPage', 'BreadcrumbList'],
  },
];

/**
 * Pillar and Cluster Topic Architecture
 */
export const CONTENT_PILLARS = [
  {
    pillarName: 'Student Living & Hostels in Greater Noida',
    pillarUrl: 'https://www.hoboliving.in/campuses/pari-chowk-greater-noida',
    clusters: [
      { name: 'GL Bajaj Knowledge Park 2 Cluster', url: '/campuses/gl-bajaj-greater-noida' },
      { name: 'Galgotias University & College Cluster', url: '/campuses/galgotias-university-greater-noida' },
      { name: 'Sharda University Knowledge Park 3 Cluster', url: '/campuses/sharda-university-greater-noida' },
      { name: 'NIET & Lloyd Group Cluster', url: '/campuses/niet-greater-noida' },
      { name: 'Knowledge Park 2 Metro Hub', url: '/campuses/knowledge-park-2-greater-noida' },
    ],
  },
  {
    pillarName: 'Student Living & Co-Living in Noida',
    pillarUrl: 'https://www.hoboliving.in/campuses/amity-university-noida',
    clusters: [
      { name: 'Amity University Sector 125 Cluster', url: '/campuses/amity-university-noida' },
      { name: 'JSS Academy & Sector 62 IT Hub', url: '/campuses/jss-academy-sector-62-noida' },
      { name: 'Sector 15 / 18 Commercial Belt', url: '/campuses/sector-15-noida' },
      { name: 'Sector 137 Expressway Hub', url: '/campuses/sector-137-noida' },
    ],
  },
  {
    pillarName: 'Student Survival Guides & Cost Calculators',
    pillarUrl: 'https://www.hoboliving.in/guides',
    clusters: [
      { name: '2026 Greater Noida Student Housing Guide', url: '/guides/student-housing-guide' },
      { name: 'Hostel vs PG Full Cost Breakdown', url: '/guides/hostel-vs-pg-cost-breakdown' },
      { name: 'Hostel Mess vs Tiffin Nutrition Guide', url: '/guides/hostel-mess-vs-tiffin-food-guide' },
    ],
  },
];
