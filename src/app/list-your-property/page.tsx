'use client';

import { useState } from 'react';
import { useAuth } from '@/context/auth-context';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, UserCheck, Loader2, ShieldCheck } from 'lucide-react';
import PropertyListingForm from '@/components/property-listing-form';
import { useRouter } from 'next/navigation';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

export default function ListYourPropertyPage() {
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [switching, setSwitching] = useState(false);

  const handleSwitchToLandlord = async () => {
    if (!user || !userProfile) return;
    setSwitching(true);
    try {
      await setDoc(doc(db, 'users', user.uid), {
        activeRole: 'landlord'
      }, { merge: true });
      toast({ title: 'Success', description: 'Switched to Landlord Mode successfully!' });
      window.location.reload();
    } catch (e: any) {
      console.error(e);
      toast({ variant: 'destructive', title: 'Error switching roles', description: e.message });
    } finally {
      setSwitching(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="space-y-4 p-6">
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-10 w-1/4" />
        </div>
      );
    }

    if (!user) {
      return (
        <CardContent className="text-center p-8">
          <AlertCircle className="mx-auto h-12 w-12 text-primary" />
          <h2 className="mt-4 text-2xl font-bold font-headline">Get Started Listing Your Property</h2>
          <p className="mt-2 text-muted-foreground">
            You need to be logged in to list properties on Hobo Livings.
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <Button onClick={() => router.push('/login')}>Login / Sign Up</Button>
          </div>
        </CardContent>
      );
    }

    const hasLandlordRole = userProfile?.roles?.includes('landlord');
    const isLandlordActive = userProfile?.activeRole === 'landlord';

    if (!isLandlordActive) {
      return (
        <CardContent className="text-center p-8 space-y-4">
          <AlertCircle className="mx-auto h-12 w-12 text-primary animate-pulse" />
          <h2 className="text-2xl font-bold font-headline">Become a Host on Hobo Livings</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Earn extra income by listing and managing co-living spaces, hostels, and PGs in Delhi NCR. Get verified to start hosting!
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            {hasLandlordRole ? (
              <Button onClick={handleSwitchToLandlord} disabled={switching}>
                {switching ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserCheck className="mr-2 h-4 w-4" />}
                Switch to Host Mode
              </Button>
            ) : (
              <Button onClick={() => router.push('/become-landlord')}>
                <ShieldCheck className="mr-2 h-4 w-4" />
                Complete Landlord KYC Verification
              </Button>
            )}
          </div>
        </CardContent>
      );
    }

    // Main content for property owners
    return (
      <>
         <CardHeader>
            <CardTitle className="flex items-center gap-2 text-3xl font-headline">
              List Your Property
            </CardTitle>
            <CardDescription>
              Fill out the form below to add your property to Hobo Livings. It will be reviewed by our team before publishing.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PropertyListingForm />
          </CardContent>
      </>
    );
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-secondary">
        <div className="container mx-auto px-4 py-12">
           <Card className="max-w-4xl mx-auto">
             {renderContent()}
           </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
