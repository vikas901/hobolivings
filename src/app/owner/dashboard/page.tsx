'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, query, where, getDocs, Timestamp, deleteDoc, doc } from 'firebase/firestore';
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
import { PropertyDetailModal } from '@/components/property-detail-modal';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';


export default function OwnerDashboardPage() {
  const { user, userProfile, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  // State for modals
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [propertyToDelete, setPropertyToDelete] = useState<Property | null>(null);

  const fetchProperties = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const q = query(
        collection(db, 'properties'),
        where('ownerId', '==', user.uid)
      );
      const querySnapshot = await getDocs(q);
      const ownerProperties: Property[] = querySnapshot.docs.map(doc => {
        const data = doc.data();
        
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
            media: data.media,
            map: data.map || { lat: 0, lng: 0, nearby: [] },
            status: data.status || 'pending',
            ownerId: data.ownerId,
            createdAt: createdAt,
          } as Property;
      });

      ownerProperties.sort((a, b) => (b.createdAt as number) - (a.createdAt as number));
      setProperties(ownerProperties);
    } catch (error) {
      console.error("Error fetching owner's properties:", error);
       toast({ variant: 'destructive', title: 'Error', description: "Could not fetch properties."});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && (!user || userProfile?.activeRole !== 'landlord')) {
      router.push('/list-your-property');
      return;
    }
    if (user) {
      fetchProperties();
    }
  }, [user, userProfile, authLoading, router]);

  // Handlers for View Modal
  const handleViewProperty = (property: Property) => {
    setSelectedProperty(property);
  };
  
  const handleCloseModal = () => {
    setSelectedProperty(null);
  };

  // Handlers for Delete Dialog
  const handleDeleteProperty = (property: Property) => {
    setPropertyToDelete(property);
  };

  const confirmDelete = async () => {
    if (!propertyToDelete) return;
    try {
      await deleteDoc(doc(db, 'properties', propertyToDelete.id));
      toast({ title: 'Success', description: 'Property deleted successfully.' });
      setPropertyToDelete(null);
      fetchProperties(); // Refresh the list
    } catch (error) {
      console.error("Error deleting property:", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete property.' });
      setPropertyToDelete(null);
    }
  };

  const handleEditProperty = (property: Property) => {
    router.push(`/owner/edit-property/${property.id}`);
  };


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
                <OwnerPropertiesTable 
                    properties={properties} 
                    onView={handleViewProperty}
                    onEdit={handleEditProperty}
                    onDelete={handleDeleteProperty}
                />
            </CardContent>
        </Card>
    );
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-secondary">
        <div className="container mx-auto px-4 py-12 space-y-6">
          {userProfile?.landlordKycStatus !== 'verified' && (
            <div className="p-4 rounded-xl border bg-amber-50 border-amber-200 text-amber-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="font-bold flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500 animate-pulse" />
                  {userProfile?.landlordKycStatus === 'pending' 
                    ? 'KYC Verification Pending' 
                    : userProfile?.landlordKycStatus === 'rejected' 
                      ? 'KYC Verification Rejected' 
                      : 'KYC Document Submission Required'}
                </p>
                <p className="text-xs text-amber-700 leading-relaxed max-w-3xl">
                  {userProfile?.landlordKycStatus === 'pending'
                    ? 'Your identity and bank credentials are currently under review by our administration. You can still list new properties, but they will remain hidden from tenants (unapproved status) until your owner profile is verified.'
                    : userProfile?.landlordKycStatus === 'rejected'
                      ? 'Your KYC documents were rejected by admin review. Please click the complete button to check details or re-verify.'
                      : 'To comply with Hobo Livings standards and publish properties to search listings, please complete your payout bank details and KYC documentation.'}
                </p>
              </div>
              {userProfile?.landlordKycStatus !== 'pending' && (
                <Button size="sm" onClick={() => router.push('/become-landlord')} className="bg-amber-600 hover:bg-amber-700 text-white shrink-0 text-xs">
                  Complete Verification
                </Button>
              )}
            </div>
          )}
          {renderContent()}
        </div>
      </main>
      <Footer />
      
      {/* View Modal */}
      {selectedProperty && (
        <PropertyDetailModal 
            property={selectedProperty}
            isOpen={!!selectedProperty}
            onClose={handleCloseModal}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!propertyToDelete} onOpenChange={(open) => !open && setPropertyToDelete(null)}>
          <AlertDialogContent>
              <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your
                      property listing.
                  </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setPropertyToDelete(null)}>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
              </AlertDialogFooter>
          </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
