'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/auth-context';
import type { Property } from '@/lib/types';
import Header from '@/components/header';
import Footer from '@/components/footer';
import PropertyListingForm from '@/components/property-listing-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';

export default function EditPropertyPage() {
    const params = useParams();
    const propertyId = params.propertyId as string;
    const router = useRouter();
    const { user, userProfile, loading: authLoading } = useAuth();
    const [property, setProperty] = useState<Property | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (authLoading) return;
        if (!user || userProfile?.profileType !== 'owner') {
            router.replace('/list-your-property');
            return;
        }

        if (!propertyId) {
            setError('Invalid property ID.');
            setLoading(false);
            return;
        }

        const fetchProperty = async () => {
            try {
                const docRef = doc(db, 'properties', propertyId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    if (data.ownerId !== user.uid) {
                        setError('You do not have permission to edit this property.');
                        setProperty(null);
                    } else {
                         const imageUrl = (data.image && typeof data.image === 'string') 
                            ? data.image 
                            : 'https://placehold.co/600x400.png';

                        let createdAt: number;
                        if (data.createdAt && data.createdAt instanceof Timestamp) {
                            createdAt = data.createdAt.toMillis();
                        } else if (typeof data.createdAt === 'number') {
                            createdAt = data.createdAt;
                        } else {
                            createdAt = Date.now();
                        }

                        setProperty({
                            id: docSnap.id,
                             ...data,
                            image: imageUrl,
                            images: data.images || [imageUrl],
                            createdAt,
                        } as Property);
                    }
                } else {
                    setError('Property not found.');
                    setProperty(null);
                }
            } catch (err) {
                console.error("Error fetching property:", err);
                setError('Failed to fetch property details.');
            } finally {
                setLoading(false);
            }
        };

        fetchProperty();

    }, [propertyId, user, authLoading, router, userProfile]);

    const renderContent = () => {
        if (loading || authLoading) {
            return (
                <div className="space-y-4 p-6">
                  <Skeleton className="h-8 w-1/2" />
                  <Skeleton className="h-4 w-3/4" />
                  <div className="pt-8 space-y-6">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
            );
        }

        if (error) {
             return (
                <CardContent className="text-center p-8">
                    <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
                    <h2 className="mt-4 text-2xl font-bold font-headline">An Error Occurred</h2>
                    <p className="mt-2 text-muted-foreground">{error}</p>
                </CardContent>
            );
        }

        if (property) {
            return (
                 <>
                    <CardHeader>
                        <CardTitle className="font-headline text-3xl">Edit Property</CardTitle>
                        <CardDescription>Update the details for your property: {property.title}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <PropertyListingForm propertyToEdit={property} />
                    </CardContent>
                 </>
            );
        }
        
        return null;
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
