'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
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
          const q = query(
            collection(db, 'properties'),
            where('ownerId', '==', user.uid),
            orderBy('createdAt', 'desc')
          );
          const querySnapshot = await getDocs(q);
          const ownerProperties = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Property));
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
