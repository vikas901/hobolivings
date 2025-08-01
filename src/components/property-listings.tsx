import { collection, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Property } from '@/lib/types';
import { PropertyFilters } from './property-filters';

async function getProperties(): Promise<Property[]> {
  try {
    const q = query(collection(db, 'properties'), where('status', '==', 'approved'));
    const querySnapshot = await getDocs(q);
    const fetchedProperties = querySnapshot.docs.map(doc => {
      const data = doc.data();
      // Ensure the image URL is a valid string before returning the property
      if (typeof data.image === 'string' && data.image.startsWith('https://res.cloudinary.com')) {
        return {
          id: doc.id,
          ...data,
          // Firestore Timestamps need to be converted for client components
          createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toMillis() : Date.now(),
        } as Property;
      }
      return null;
    }).filter((p): p is Property => p !== null); // Filter out any null entries

    return fetchedProperties;
  } catch (error) {
    console.error("Error fetching properties:", error);
    return [];
  }
}

export default async function PropertyListings() {
  const properties = await getProperties();
  const heroImageUrl = 'https://placehold.co/1600x600.png';

  return (
    <>
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center text-center bg-cover bg-center">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${heroImageUrl}')` }} data-ai-hint="student campus banner" />
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 container text-white px-4">
          <h1 className="font-headline text-4xl md:text-6xl font-bold">Find Your Student Haven</h1>
          <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto">The best student hostels, PGs, and rooms in Delhi NCR. Your search ends here.</p>
        </div>
      </section>
      
      <PropertyFilters properties={properties} />
    </>
  );
};
