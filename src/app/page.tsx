
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
        
        // Ensure image URL is valid, otherwise use a placeholder
        const imageUrl = (data.images && data.images.length > 0 && typeof data.images[0] === 'string' && data.images[0].startsWith('https://res.cloudinary.com')) 
          ? data.images[0] 
          : 'https://placehold.co/600x400.png';

        // Safely handle the createdAt timestamp
        let createdAt: number;
        if (data.createdAt && data.createdAt instanceof Timestamp) {
            createdAt = data.createdAt.toMillis();
        } else if (typeof data.createdAt === 'number') {
            createdAt = data.createdAt;
        } else {
            createdAt = Date.now();
        }


        return {
            id: doc.id,
            title: data.title,
            image: imageUrl,
            images: data.images || [imageUrl],
            dataAiHint: data.dataAiHint || 'property exterior',
            price: data.price,
            location: data.location,
            city: data.city,
            rating: data.rating,
            reviews: data.reviews,
            type: data.type,
            category: data.category,
            amenities: data.amenities,
            description: data.description,
            roomOptions: data.roomOptions,
            map: data.map,
            status: data.status,
            ownerId: data.ownerId,
            createdAt: createdAt,
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
