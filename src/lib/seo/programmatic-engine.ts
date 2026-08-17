import { CampusHub, CAMPUS_HUBS } from '@/lib/campus-data';

export interface ProgrammaticPageStats {
  totalListingsCount: number;
  startingPrice: number;
  averagePrice: number;
  hasZeroBrokerageGuarantee: boolean;
  transitSummary: string;
  comparisonMatrix: {
    feature: string;
    col1: string;
    col2: string;
    col3: string;
  }[];
}

/**
 * Validates zero-thin-content safeguard
 * Ensures every programmatic URL has rich, unique, and actionable content
 */
export function validateZeroThinContent(hub: CampusHub): boolean {
  if (!hub.name || !hub.zeroClickSummary || hub.faqs.length < 2) {
    return false;
  }
  if (!hub.commuteHighlights || hub.commuteHighlights.length < 2) {
    return false;
  }
  return true;
}

/**
 * Generates programmatic comparison matrix for campus/locality hubs
 */
export function generateHubComparisonMatrix(hub: CampusHub) {
  return [
    {
      feature: 'Monthly Rent (AC Room + 3 Meals)',
      col1: `${hub.startingRent} - ${hub.avgRent.split(' ')[2] || '₹14,000'}`,
      col2: '₹14,000 - ₹22,000 (Inside Campus)',
      col3: '₹16,000 - ₹25,000 (Private Flat + Cook)',
    },
    {
      feature: 'Brokerage & Commission',
      col1: '₹0 (100% Zero Brokerage)',
      col2: '₹0',
      col3: '1 Month Rent (₹15,000+ to Broker)',
    },
    {
      feature: 'Food / Mess Quality',
      col1: '3 Fresh Meals + Evening Tea & Special Sunday Menu',
      col2: 'Fixed On-Campus Mess Schedule',
      col3: 'Self-Cooking or Unreliable Tiffin',
    },
    {
      feature: 'Wi-Fi & Electricity Backup',
      col1: 'Dedicated High-Speed Fiber + 24/7 Generator Backup',
      col2: 'Shared Campus Wi-Fi',
      col3: 'Separate Inverter / Extra Wi-Fi Bill',
    },
    {
      feature: 'Security & Wardens',
      col1: 'Biometric Attendance & 24/7 CCTV Surveillance',
      col2: 'Strict Campus Gate Security',
      col3: 'Standard Society Gate Only',
    },
    {
      feature: 'Assisted Visits & Bed Hold',
      col1: 'Free Physical Visit Pass + 48h Zero-Cost Bed Hold',
      col2: 'Annual Lottery / Limited Quota',
      col3: 'Immediate Non-refundable Token',
    },
  ];
}

/**
 * Returns all active hubs formatted for sitemap and dynamic paths
 */
export function getAllCampusHubSlugs(): string[] {
  return Object.keys(CAMPUS_HUBS);
}

export function getCampusHubBySlug(slug: string): CampusHub | undefined {
  return CAMPUS_HUBS[slug];
}
