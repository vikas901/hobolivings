'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/auth-context';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, PlusCircle } from 'lucide-react';

export default function ListYourPropertyPage() {
  const { user, loading: authLoading } = useAuth();
  const [profileType, setProfileType] = useState<string | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            setProfileType(userDoc.data().profileType);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        } finally {
          setLoadingProfile(false);
        }
      } else {
        setLoadingProfile(false);
      }
    };

    if (!authLoading) {
      fetchUserProfile();
    }
  }, [user, authLoading]);

  const renderContent = () => {
    if (authLoading || loadingProfile) {
      return (
        <div className="space-y-4">
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-10 w-1/4" />
        </div>
      );
    }

    if (!user) {
      return (
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-primary" />
          <h2 className="mt-4 text-2xl font-bold">Authentication Required</h2>
          <p className="mt-2 text-muted-foreground">
            You need to be logged in to list a property.
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <Button asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      );
    }

    if (profileType !== 'owner') {
       return (
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-primary" />
          <h2 className="mt-4 text-2xl font-bold">Incorrect Profile Type</h2>
          <p className="mt-2 text-muted-foreground">
            Only users with a "Property Owner" profile can list properties.
          </p>
           <p className="mt-1 text-sm text-muted-foreground">
             Please update your profile or create a new owner account.
          </p>
          <div className="mt-6">
            <Button variant="outline">Go to Your Profile</Button>
          </div>
        </div>
      );
    }

    // Main content for property owners
    return (
      <div className="w-full">
         <CardHeader>
            <CardTitle className="flex items-center gap-2 text-3xl font-headline">
              <PlusCircle />
              List Your Property
            </CardTitle>
            <CardDescription>
              Fill out the form below to add your property to Hobo Livings. It will be reviewed by our team before publishing.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Property Listing Form will go here */}
            <div className="p-8 border-2 border-dashed rounded-lg text-center">
              <h3 className="text-xl font-semibold">Property Listing Form Coming Soon!</h3>
              <p className="text-muted-foreground mt-2">This is where the detailed form to collect property information will be.</p>
            </div>
          </CardContent>
      </div>
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

    