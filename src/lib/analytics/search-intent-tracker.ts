import { collection, addDoc, serverTimestamp, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface SearchIntentLog {
  queryText: string;
  sourcePage: string;
  timestamp?: any;
  filterApplied?: {
    city?: string;
    propertyType?: string;
    category?: string;
    maxPrice?: number;
  };
}

/**
 * Anonymously tracks on-site search query for first-party data SEO
 */
export async function trackSearchQuery(
  searchTerm: string,
  sourcePage: string = 'homepage',
  filterApplied?: SearchIntentLog['filterApplied']
) {
  const cleanTerm = searchTerm.trim().toLowerCase();
  if (!cleanTerm || cleanTerm.length < 2) return;

  try {
    // Avoid tracking sensitive data or passwords
    if (cleanTerm.includes('@') || cleanTerm.includes('password') || cleanTerm.length > 100) {
      return;
    }

    await addDoc(collection(db, 'search_intent_logs'), {
      queryText: cleanTerm,
      sourcePage,
      filterApplied: filterApplied || {},
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    // Gracefully handle offline or permission restrictions
    if (typeof window !== 'undefined') {
      try {
        const localLogs = JSON.parse(localStorage.getItem('hobo_search_logs') || '[]');
        localLogs.push({ queryText: cleanTerm, timestamp: Date.now() });
        localStorage.setItem('hobo_search_logs', JSON.stringify(localLogs.slice(-50)));
      } catch (e) {
        // Silently ignore storage errors
      }
    }
  }
}

/**
 * Default High-Intent Curated Trending Keywords
 * (Used when cold-starting or offline)
 */
export const DEFAULT_TRENDING_SEARCHES = [
  'PG near GL Bajaj with Food',
  'Girls Hostel Knowledge Park 2',
  'Single Room PG Pari Chowk',
  'Hostel near Sharda Gate 4',
  'Hostel with Aqua Line Metro',
  'Zero Brokerage PG Noida 62',
  'Boys PG near Galgotias University',
  'AC Single Room under ₹12000'
];

/**
 * Retrieves top trending search queries for dynamic UI display
 */
export async function getTrendingSearchKeywords(): Promise<string[]> {
  try {
    const q = query(
      collection(db, 'search_intent_logs'),
      orderBy('timestamp', 'desc'),
      limit(20)
    );
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const texts = snapshot.docs.map((doc) => doc.data().queryText as string).filter(Boolean);
      const unique = Array.from(new Set(texts));
      if (unique.length >= 4) {
        return unique.slice(0, 8);
      }
    }
  } catch (e) {
    // Fall back to curated list
  }
  return DEFAULT_TRENDING_SEARCHES;
}
