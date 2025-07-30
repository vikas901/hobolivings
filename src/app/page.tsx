'use client';

import Header from '@/components/header';
import Footer from '@/components/footer';
import PropertyListings from '@/components/property-listings';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useEffect, useState } from 'react';
import type { Property } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const q = query(collection(db, 'properties'), where('status', '==', 'approved'));
        const querySnapshot = await getDocs(q);
        const props: Property[] = [];
        querySnapshot.forEach((doc) => {
          props.push({ id: doc.id, ...doc.data() } as Property);
        });
        setProperties(props);
      } catch (error) {
        console.error("Error fetching properties: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const renderContent = () => {
    if (loading) {
      return (
        <div className='container mx-auto px-4 py-8'>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        </div>
      );
    }
    return <PropertyListings allProperties={properties} />;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {renderContent()}
      </main>
      <Footer />
    </div>
  );
}