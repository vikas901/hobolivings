
import Header from '@/components/header';
import Footer from '@/components/footer';
import PropertyListings from '@/components/property-listings';
import { collection, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Property } from '@/lib/types';


export default async function Home() {
  
  const getProperties = async (): Promise<Property[]> => {
    try {
      const q = query(collection(db, 'properties'), where('status', '==', 'approved'));
      const querySnapshot = await getDocs(q);
      const fetchedProperties = querySnapshot.docs.map(doc => {
        const data = doc.data();
        
        const imageUrl = (data.images && data.images.length > 0 && typeof data.images[0] === 'string' && data.images[0].startsWith('https://res.cloudinary.com')) 
          ? data.images[0] 
          : (typeof data.image === 'string' && data.image.startsWith('https://res.cloudinary.com') ? data.image : 'https://placehold.co/600x400.png');

        return {
            id: doc.id,
            ...data,
            image: imageUrl,
            createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toMillis() : Date.now(),
          } as Property;

      }).filter((p): p is Property => p !== null); 

      return fetchedProperties;
    } catch (error) {
      console.error("Error fetching properties:", error);
      return [];
    }
  }
  
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
