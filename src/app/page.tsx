import Header from '@/components/header';
import Footer from '@/components/footer';
import PropertyListings from '@/components/property-listings';
import { collection, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Property } from '@/lib/types';


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
          createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toMillis() : Date.now(),
        } as Property;
      }
      return null;
    }).filter((p): p is Property => p !== null); 

    return fetchedProperties;
  } catch (error) {
    console.error("Error fetching properties:", error);
    return [];
  }
}


export default async function Home() {
  const properties = await getProperties();
  
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <PropertyListings properties={properties} />
      </main>
      <Footer />
    </div>
  );
}