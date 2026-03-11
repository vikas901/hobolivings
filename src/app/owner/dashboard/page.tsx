'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/auth-context';
import type { Property } from '@/lib/types';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { OwnerPropertiesTable } from '@/components/owner-properties-table';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';


export default function OwnerDashboardPage() {
  const { user, userProfile, loading: authLoading } = useAuth();
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Redirect if not an owner
    if (!authLoading && (!user || userProfile?.profileType !== 'owner')) {
      router.push('/list-your-property');
      return;
    }

    if (user) {
      const fetchProperties = async () => {
        setLoading(true);
        try {
          // Removed orderBy to prevent need for composite index
          const q = query(
            collection(db, 'properties'),
            where('ownerId', '==', user.uid)
          );
          const querySnapshot = await getDocs(q);
          const ownerProperties: Property[] = querySnapshot.docs.map(doc => {
            const data = doc.data();
            
            // Fallback image in case it's missing from the document
            const imageUrl = (data.image && typeof data.image === 'string') 
              ? data.image 
              : 'https://placehold.co/600x400.png';

            // Safely handle the createdAt timestamp, converting it to a number
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
                title: data.title || 'Untitled Property',
                image: imageUrl,
                images: data.images || [imageUrl],
                dataAiHint: data.dataAiHint || 'property exterior',
                price: data.price || 0,
                location: data.location || 'No location',
                city: data.city || 'No city',
                rating: data.rating || 0,
                reviews: data.reviews || 0,
                type: data.type || 'Co-ed',
                category: data.category || 'Room',
                amenities: data.amenities || [],
                description: data.description || '',
                roomOptions: data.roomOptions || [],
                map: data.map || { lat: 0, lng: 0, nearby: [] },
                status: data.status || 'pending',
                ownerId: data.ownerId,
                createdAt: createdAt,
              } as Property;
          });

          // Sort properties on the client-side to show newest first
          ownerProperties.sort((a, b) => (b.createdAt as number) - (a.createdAt as number));

          setProperties(ownerProperties);
        } catch (error) {
          console.error("Error fetching owner's properties:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchProperties();
    }
  }, [user, userProfile, authLoading, router]);

  const renderContent = () => {
    if (authLoading || loading) {
      return (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-10 w-36" />
          </div>
          <Skeleton className="h-64 w-full" />
        </div>
      );
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="font-headline text-2xl">My Properties</CardTitle>
                    <CardDescription>View and manage your property listings.</CardDescription>
                </div>
                <Button onClick={() => router.push('/list-your-property')}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    List New Property
                </Button>
            </CardHeader>
            <CardContent>
                <OwnerPropertiesTable properties={properties} />
            </CardContent>
        </Card>
    );
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-secondary">
        <div className="container mx-auto px-4 py-12">
          {renderContent()}
        </div>
      </main>
      <Footer />
    </div>
  );
}
