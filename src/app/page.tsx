'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import Header from '@/components/header';
import Footer from '@/components/footer';
import PropertyListings from '@/components/property-listings';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();

  const isOwner = user && userProfile?.activeRole === 'landlord';

  useEffect(() => {
    if (!loading && isOwner) {
      router.push('/owner/dashboard');
    }
  }, [loading, isOwner, router]);

  // While checking auth state or if the user is an owner who will be redirected,
  // show a loading skeleton to prevent flashing the student homepage.
  if (loading || isOwner) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 container py-8">
          <div className="space-y-4">
            <Skeleton className="h-[50vh] min-h-[400px] w-full" />
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-8">
              <div className="hidden lg:block lg:col-span-1 space-y-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-24 w-full" />
              </div>
              <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <Skeleton className="h-96 w-full" />
                <Skeleton className="h-96 w-full" />
                <Skeleton className="h-96 w-full" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  // If the user is not an owner (or is logged out) and loading is complete, show the default homepage.
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <PropertyListings />
      </main>
      <Footer />
    </div>
  );
}
