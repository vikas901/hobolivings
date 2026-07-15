'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { allAmenities, allCategories, allCities } from '@/lib/dummy-data';
import { Loader2, Trash2, Home, MapPin, Building2, IndianRupee, Sparkles, Camera, Check, ChevronsUpDown, Plus, Eye, ArrowLeft, ArrowRight, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth-context';
import { db } from '@/lib/firebase';
import { collection, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { CloudinaryUploadWidget } from '@/components/cloudinary-upload-widget';
import { useRouter } from 'next/navigation';
import type { Property, CategorizedImage, PropertyMedia } from '@/lib/types';
import { CurrencyInput, formatIndianCurrency } from '@/components/ui/currency-input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Star } from 'lucide-react';

const TITLE_MAX = 100;
const DESCRIPTION_MAX = 500;

const amenityIconMap: { [key: string]: React.ReactNode } = {
  WiFi: <span>📶</span>,
  AC: <span>❄️</span>,
  Food: <span>🍽️</span>,
  Parking: <span>🅿️</span>,
  Laundry: <span>🧺</span>,
  Geyser: <span>🚿</span>,
  Housekeeping: <span>🧹</span>,
  CCTV: <span>📹</span>,
};

// Form Category Config matching PRD
export interface PhotoCategoryConfig {
  key: keyof PropertyMedia;
  label: string;
  min: number;
  max: number;
  mandatory: boolean | ((propertyCategory: string) => boolean);
  description: string;
}

export const PHOTO_CATEGORIES: PhotoCategoryConfig[] = [
  { key: 'coverPhoto', label: 'Cover Photo', min: 1, max: 1, mandatory: true, description: 'Primary image shown in listings and search cards' },
  { key: 'bedroom', label: 'Bedroom / Room', min: 1, max: 10, mandatory: true, description: 'Different angles showing bed, space, and setup' },
  { key: 'bathroom', label: 'Bathroom', min: 1, max: 5, mandatory: true, description: 'Toilet, wash basin, shower area' },
  { key: 'buildingExterior', label: 'Building Exterior', min: 1, max: 5, mandatory: true, description: 'Front elevation, building gate, and entrance' },
  { key: 'corridor', label: 'Corridor / Common Area', min: 1, max: 5, mandatory: (cat) => cat === 'PG' || cat === 'Hostel', description: 'Corridors, lobby, stairs, or community rooms (Required for PG/Hostel)' },
  { key: 'kitchen', label: 'Kitchen', min: 1, max: 5, mandatory: false, description: 'Cooking area and facilities (if available)' },
  { key: 'dining', label: 'Dining Area', min: 1, max: 5, mandatory: false, description: 'Shared dining hall or tables (if available)' },
  { key: 'balcony', label: 'Balcony / Terrace', min: 1, max: 5, mandatory: false, description: 'Outdoor balcony or terrace views' },
  { key: 'amenities', label: 'Amenities', min: 1, max: 10, mandatory: false, description: 'Gym, recreation room, laundry room, Wi-Fi router, etc.' },
  { key: 'parking', label: 'Parking', min: 1, max: 5, mandatory: false, description: 'Parking spots, garage, or driveway' },
  { key: 'laundry', label: 'Laundry / Wash Area', min: 1, max: 5, mandatory: false, description: 'Washing area' },
  { key: 'nearby', label: 'Nearby Locality', min: 1, max: 5, mandatory: false, description: 'Nearby roads, metro, market' },
  { key: 'floorPlan', label: 'Floor Plan', min: 1, max: 2, mandatory: false, description: 'Property layout' },
];

const roomOptionSchema = z.object({
  occupancy: z.enum(['Single', 'Double', 'Triple']),
  price: z.coerce.number().min(1000, 'Price must be at least ₹1,000'),
});

const mediaImageSchema = z.object({
  id: z.string(),
  category: z.string(),
  url: z.string().url(),
  displayOrder: z.number(),
  uploadedAt: z.number(),
  uploadedBy: z.string(),
});

const mediaSchema = z.object({
  coverPhoto: mediaImageSchema.optional().nullable(),
  bedroom: z.array(mediaImageSchema).default([]),
  bathroom: z.array(mediaImageSchema).default([]),
  buildingExterior: z.array(mediaImageSchema).default([]),
  corridor: z.array(mediaImageSchema).default([]),
  kitchen: z.array(mediaImageSchema).default([]),
  dining: z.array(mediaImageSchema).default([]),
  balcony: z.array(mediaImageSchema).default([]),
  amenities: z.array(mediaImageSchema).default([]),
  parking: z.array(mediaImageSchema).default([]),
  laundry: z.array(mediaImageSchema).default([]),
  nearby: z.array(mediaImageSchema).default([]),
  floorPlan: z.array(mediaImageSchema).default([]),
});

const formSchema = z.object({
  title: z.string()
    .min(10, 'Title must be at least 10 characters.')
    .max(TITLE_MAX, `Title cannot exceed ${TITLE_MAX} characters.`),
  description: z.string()
    .min(50, 'Description must be at least 50 characters. Be descriptive!')
    .max(DESCRIPTION_MAX, `Description cannot exceed ${DESCRIPTION_MAX} characters.`),
  city: z.string().min(1, 'Please select a city from the list.'),
  location: z.string().min(10, 'Enter a detailed address (at least 10 characters).'),
  category: z.enum(allCategories as [string, ...string[]], { required_error: 'Please select a property category.' }),
  type: z.enum(['Boys', 'Girls', 'Co-ed'], { required_error: 'Please select who this property is for.' }),
  amenities: z.array(z.string()).min(1, 'Select at least one amenity to attract tenants.'),
  roomOptions: z.array(roomOptionSchema).min(1, 'Add at least one room/pricing option.'),
  media: mediaSchema,
  dataAiHint: z.string().max(25, 'Keep it brief — max 25 characters.').optional(),
}).superRefine((data, ctx) => {
  const media = data.media || {};
  const cat = data.category;

  PHOTO_CATEGORIES.forEach((config) => {
    const isMandatory = typeof config.mandatory === 'function' ? config.mandatory(cat) : config.mandatory;
    const images = config.key === 'coverPhoto'
      ? (media.coverPhoto ? [media.coverPhoto] : [])
      : ((media[config.key as keyof typeof media] as any[]) || []);

    if (isMandatory) {
      if (images.length < config.min) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `${config.label} is required (minimum ${config.min} photos required, currently has ${images.length}).`,
          path: ['media', config.key],
        });
      }
    }

    if (images.length > config.max) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `${config.label} cannot exceed ${config.max} photos (currently has ${images.length}).`,
        path: ['media', config.key],
      });
    }
  });
});

type PropertyFormValues = z.infer<typeof formSchema>;

interface PropertyListingFormProps {
  propertyToEdit?: Property;
}

export default function PropertyListingForm({ propertyToEdit }: PropertyListingFormProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [activeCategoryKey, setActiveCategoryKey] = useState<keyof PropertyMedia>('coverPhoto');
  const router = useRouter();

  // Legacy data parsing & media synthesis
  const initialMedia = useMemo(() => {
    if (!propertyToEdit) {
      return {
        coverPhoto: null,
        bedroom: [],
        bathroom: [],
        buildingExterior: [],
        corridor: [],
        kitchen: [],
        dining: [],
        balcony: [],
        amenities: [],
        parking: [],
        laundry: [],
        nearby: [],
        floorPlan: [],
      };
    }

    if (propertyToEdit.media) {
      return propertyToEdit.media;
    }

    // Synthesize media object from flat image/images fields
    const coverUrl = propertyToEdit.image || (propertyToEdit.images && propertyToEdit.images[0]);
    const coverPhoto = coverUrl ? {
      id: 'cover-1',
      category: 'coverPhoto',
      url: coverUrl,
      displayOrder: 0,
      uploadedAt: Date.now(),
      uploadedBy: propertyToEdit.ownerId || '',
    } : null;

    const otherUrls = (propertyToEdit.images || []).filter(url => url !== coverUrl);
    const bedroomPhotos = otherUrls.map((url, i) => ({
      id: `bedroom-${i}`,
      category: 'bedroom',
      url,
      displayOrder: i,
      uploadedAt: Date.now(),
      uploadedBy: propertyToEdit.ownerId || '',
    }));

    return {
      coverPhoto,
      bedroom: bedroomPhotos,
      bathroom: [],
      buildingExterior: [],
      corridor: [],
      kitchen: [],
      dining: [],
      balcony: [],
      amenities: [],
      parking: [],
      laundry: [],
      nearby: [],
      floorPlan: [],
    };
  }, [propertyToEdit]);

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      title: propertyToEdit?.title || '',
      description: propertyToEdit?.description || '',
      city: propertyToEdit?.city || '',
      location: propertyToEdit?.location || '',
      category: propertyToEdit?.category,
      type: propertyToEdit?.type,
      amenities: propertyToEdit?.amenities || [],
      roomOptions: propertyToEdit?.roomOptions || [{ occupancy: 'Single', price: 0 }],
      media: initialMedia,
      dataAiHint: propertyToEdit?.dataAiHint || '',
    },
  });
  
  const { fields, append, remove } = useFieldArray({
    name: 'roomOptions',
    control: form.control,
  });

  const [media, setMedia] = useState<PropertyMedia>(initialMedia);

  // Sync local media state to form values
  useEffect(() => {
    form.setValue('media', media as any);
    form.trigger('media');
  }, [media, form]);

  // Calculate form completion progress
  const watchedValues = form.watch();
  const formProgress = useMemo(() => {
    let completed = 0;
    const total = 7; // title, description, city, location, category+type, roomOptions, media validation checklist
    if (watchedValues.title?.length >= 10) completed++;
    if (watchedValues.description?.length >= 50) completed++;
    if (watchedValues.city) completed++;
    if (watchedValues.location?.length >= 10) completed++;
    if (watchedValues.category && watchedValues.type) completed++;
    if (watchedValues.roomOptions?.some(o => o.price > 0)) completed++;
    
    // Check coverPhoto and at least some bedroom photos uploaded to mark media as completed
    if (media.coverPhoto) completed++;
    
    return Math.round((completed / total) * 100);
  }, [watchedValues, media]);

  // Image validation status check
  const mediaStatusList = useMemo(() => {
    const propertyCategory = watchedValues.category || 'PG';
    
    return PHOTO_CATEGORIES.map((config) => {
      const isMandatory = typeof config.mandatory === 'function' ? config.mandatory(propertyCategory) : config.mandatory;
      const images = config.key === 'coverPhoto'
        ? (media.coverPhoto ? [media.coverPhoto] : [])
        : ((media[config.key] as any[]) || []);
      const count = images.length;
      
      let isValid = true;
      if (isMandatory && count < config.min) isValid = false;
      if (count > config.max) isValid = false;

      return {
        key: config.key,
        label: config.label,
        count,
        min: config.min,
        max: config.max,
        mandatory: isMandatory,
        isValid,
      };
    });
  }, [media, watchedValues.category]);

  const hasMediaErrors = useMemo(() => {
    return mediaStatusList.some(status => !status.isValid);
  }, [mediaStatusList]);

  // Photo handlers
  const handlePhotoUploadSuccess = (url: string) => {
    const categoryKey = activeCategoryKey;
    const currentList = categoryKey === 'coverPhoto'
      ? (media.coverPhoto ? [media.coverPhoto] : [])
      : ((media[categoryKey] as any[]) || []);

    const newPhoto: CategorizedImage = {
      id: `${categoryKey}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      category: categoryKey,
      url: url,
      displayOrder: categoryKey === 'coverPhoto' ? 0 : currentList.length,
      uploadedAt: Date.now(),
      uploadedBy: user?.uid || '',
    };

    setMedia(prev => {
      if (categoryKey === 'coverPhoto') {
        return { ...prev, coverPhoto: newPhoto };
      } else {
        const existing = (prev[categoryKey] as any[]) || [];
        return { ...prev, [categoryKey]: [...existing, newPhoto] };
      }
    });

    toast({
      title: "Image Uploaded",
      description: `Added to ${PHOTO_CATEGORIES.find(c => c.key === categoryKey)?.label || categoryKey}`,
    });
  };

  const deleteImage = (categoryKey: keyof PropertyMedia, imageId: string) => {
    setMedia(prev => {
      if (categoryKey === 'coverPhoto') {
        return { ...prev, coverPhoto: null };
      } else {
        const existing = (prev[categoryKey] as any[]) || [];
        const updated = existing.filter((img: any) => img.id !== imageId)
          .map((img: any, idx: number) => ({ ...img, displayOrder: idx }));
        return { ...prev, [categoryKey]: updated };
      }
    });
  };

  const reorderImage = (categoryKey: keyof PropertyMedia, index: number, direction: 'left' | 'right') => {
    if (categoryKey === 'coverPhoto') return;
    setMedia(prev => {
      const existing = [...((prev[categoryKey] as any[]) || [])];
      
      if (direction === 'left' && index > 0) {
        const temp = existing[index];
        existing[index] = existing[index - 1];
        existing[index - 1] = temp;
      } else if (direction === 'right' && index < existing.length - 1) {
        const temp = existing[index];
        existing[index] = existing[index + 1];
        existing[index + 1] = temp;
      }
      
      const updated = existing.map((img, idx) => ({ ...img, displayOrder: idx }));
      return { ...prev, [categoryKey]: updated };
    });
  };

  const moveImageCategory = (fromCategory: keyof PropertyMedia, imageId: string, toCategory: keyof PropertyMedia) => {
    if (fromCategory === toCategory) return;
    
    setMedia(prev => {
      let targetImage: any = null;
      const updatedPrev = { ...prev };

      if (fromCategory === 'coverPhoto') {
        targetImage = prev.coverPhoto;
        updatedPrev.coverPhoto = null;
      } else {
        const existing = (prev[fromCategory] as any[]) || [];
        targetImage = existing.find((img: any) => img.id === imageId);
        updatedPrev[fromCategory] = existing.filter((img: any) => img.id !== imageId)
          .map((img: any, idx: number) => ({ ...img, displayOrder: idx }));
      }

      if (!targetImage) return prev;

      targetImage.category = toCategory;
      if (toCategory === 'coverPhoto') {
        updatedPrev.coverPhoto = targetImage;
      } else {
        const existingTo = (prev[toCategory] as any[]) || [];
        targetImage.displayOrder = existingTo.length;
        updatedPrev[toCategory] = [...existingTo, targetImage];
      }

      return updatedPrev;
    });

    toast({
      title: "Image Moved",
      description: `Moved image to ${PHOTO_CATEGORIES.find(c => c.key === toCategory)?.label || toCategory}`,
    });
  };

  const onSubmit = async (data: PropertyFormValues) => {
    if (!user) {
        toast({
            variant: 'destructive',
            title: 'Authentication Error',
            description: 'You must be logged in to list a property.',
        });
        return;
    }

    if (hasMediaErrors) {
        toast({
            variant: 'destructive',
            title: 'Validation Error',
            description: 'Please fix all mandatory photo upload requirements before publishing.',
        });
        return;
    }

    setIsSubmitting(true);
    
    try {
        const lowestPrice = Math.min(...data.roomOptions.map(o => o.price));

        // Create flattened images urls array for backward compatibility
        const flatImages: string[] = [];
        if (data.media.coverPhoto?.url) flatImages.push(data.media.coverPhoto.url);
        
        PHOTO_CATEGORIES.forEach((config) => {
          if (config.key !== 'coverPhoto') {
            const list = data.media[config.key] || [];
            list.forEach((img: any) => {
              if (img && img.url) flatImages.push(img.url);
            });
          }
        });

        const coverPhotoUrl = data.media.coverPhoto?.url || 'https://placehold.co/600x400.png';

        if (propertyToEdit) {
            const docRef = doc(db, 'properties', propertyToEdit.id);
            const updatedData = {
                ...data,
                price: lowestPrice,
                image: coverPhotoUrl,
                images: flatImages,
                status: 'pending' as const,
                updatedAt: serverTimestamp(),
            };
            await updateDoc(docRef, updatedData);
            toast({
                title: 'Property Updated!',
                description: 'Your changes have been submitted for review.',
            });
        } else {
            const newData = {
                ...data,
                price: lowestPrice,
                image: coverPhotoUrl,
                images: flatImages,
                ownerId: user.uid,
                status: 'pending' as const,
                rating: 0,
                reviews: 0,
                createdAt: serverTimestamp(),
                map: { lat: 0, lng: 0, nearby: [] },
            };
            await addDoc(collection(db, 'properties'), newData);
            toast({
                title: 'Property Submitted! 🎉',
                description: 'Your property has been submitted for review. Redirecting to your dashboard...',
            });
        }
        
        router.push('/owner/dashboard');
        router.refresh();

    } catch (error) {
        console.error("Error submitting form: ", error);
        toast({
            variant: 'destructive',
            title: 'Submission Failed',
            description: 'There was an error saving your property. Please try again.',
        });
    } finally {
        setIsSubmitting(false);
    }
  };

  // Character counter helper
  const CharCounter = ({ current, max }: { current: number; max: number }) => {
    const percentage = (current / max) * 100;
    const isNearLimit = percentage > 80;
    const isOverLimit = current > max;
    return (
      <span className={cn(
        "text-xs tabular-nums",
        isOverLimit ? "text-destructive font-semibold" : isNearLimit ? "text-amber-500" : "text-muted-foreground"
      )}>
        {current}/{max}
      </span>
    );
  };

  // Section header helper
  const SectionHeader = ({ icon, number, title, subtitle }: { icon: React.ReactNode; number: number; title: string; subtitle: string }) => (
    <div className="flex items-start gap-3 mb-4">
      <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-primary/10 text-primary shrink-0">
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">Step {number}</span>
          {title}
        </h3>
        <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
      </div>
    </div>
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

        {/* Progress Bar */}
        <div className="sticky top-16 z-20 bg-background/95 backdrop-blur border-b py-3 px-1 -mx-6 -mt-6 mb-6 rounded-t-lg">
          <div className="flex items-center justify-between mb-2 px-6">
            <span className="text-sm font-medium text-muted-foreground">Form Completion</span>
            <span className="text-sm font-bold text-primary">{formProgress}%</span>
          </div>
          <div className="px-6">
            <Progress value={formProgress} className="h-2" />
          </div>
        </div>

        {/* 1. Basic Information */}
        <div className="space-y-4 p-6 border rounded-xl bg-card shadow-sm">
          <SectionHeader icon={<Home className="h-5 w-5" />} number={1} title="Basic Information" subtitle="Give your property an attractive title and detailed description." />

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Property Title</FormLabel>
                  <CharCounter current={field.value?.length || 0} max={TITLE_MAX} />
                </div>
                <FormControl>
                  <Input
                    placeholder="e.g., Spacious Boys Hostel Near Amity University with AC & WiFi"
                    {...field}
                    disabled={isSubmitting}
                    maxLength={TITLE_MAX + 10}
                  />
                </FormControl>
                <FormDescription>A catchy title helps tenants find your property. Include key features and location.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Description</FormLabel>
                  <CharCounter current={field.value?.length || 0} max={DESCRIPTION_MAX} />
                </div>
                <FormControl>
                  <Textarea
                    placeholder="Describe the property in detail — mention nearby colleges/offices, transport, furnishing, food quality, security, and what makes it special..."
                    className="min-h-[120px] resize-y"
                    {...field}
                    disabled={isSubmitting}
                    maxLength={DESCRIPTION_MAX + 20}
                  />
                </FormControl>
                <FormDescription>Detailed descriptions get 3x more inquiries. Mention what makes your property unique.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* 2. Location Details */}
        <div className="space-y-4 p-6 border rounded-xl bg-card shadow-sm">
          <SectionHeader icon={<MapPin className="h-5 w-5" />} number={2} title="Location Details" subtitle="Help tenants find your property easily." />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>City</FormLabel>
                  <Popover open={cityOpen} onOpenChange={setCityOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={cityOpen}
                          className={cn(
                            "w-full justify-between h-10",
                            !field.value && "text-muted-foreground"
                          )}
                          disabled={isSubmitting}
                        >
                          {field.value || "Search & select a city..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                      <Command>
                        <CommandInput placeholder="Type to search cities..." />
                        <CommandList>
                          <CommandEmpty>No city found. Try a different search.</CommandEmpty>
                          <CommandGroup>
                            {allCities.map((city) => (
                              <CommandItem
                                key={city}
                                value={city}
                                onSelect={() => {
                                  field.onChange(city);
                                  setCityOpen(false);
                                }}
                              >
                                <Check className={cn("mr-2 h-4 w-4", field.value === city ? "opacity-100" : "opacity-0")} />
                                {city}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormDescription>35+ cities available across India</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address / Locality</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Sector 62, Near Metro Station"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormDescription>Street, sector, or nearby landmark</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* 3. Property Details */}
        <div className="space-y-4 p-6 border rounded-xl bg-card shadow-sm">
          <SectionHeader icon={<Building2 className="h-5 w-5" />} number={3} title="Property Details" subtitle="Categorize your property correctly for better visibility." />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={(v) => {
                    field.onChange(v);
                    form.trigger(); // Trigger revalidation on change
                  }} defaultValue={field.value} disabled={isSubmitting}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger></FormControl>
                    <SelectContent>
                      {allCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Who is this property for?</FormLabel>
                  <FormControl>
                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-2" disabled={isSubmitting}>
                      {['Boys', 'Girls', 'Co-ed'].map(t => (
                        <FormItem key={t} className="flex-1">
                          <FormControl>
                            <label className={cn(
                              "flex items-center justify-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all text-sm font-medium",
                              field.value === t 
                                ? "border-primary bg-primary/5 text-primary" 
                                : "border-muted hover:border-primary/30"
                            )}>
                              <RadioGroupItem value={t} className="sr-only" />
                              {t === 'Boys' ? '👦' : t === 'Girls' ? '👧' : '🧑‍🤝‍🧑'} {t}
                            </label>
                          </FormControl>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        {/* 4. Room Options & Pricing */}
        <div className="space-y-4 p-6 border rounded-xl bg-card shadow-sm">
          <SectionHeader icon={<IndianRupee className="h-5 w-5" />} number={4} title="Room Options & Pricing" subtitle="Add different sharing options and their monthly prices." />

          {fields.map((field, index) => (
            <div key={field.id} className="flex items-end gap-4 p-4 bg-secondary/30 rounded-lg border border-dashed">
              <FormField
                control={form.control}
                name={`roomOptions.${index}.occupancy`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="text-xs">Occupancy Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="Single">🛏️ Single</SelectItem>
                        <SelectItem value="Double">🛏️🛏️ Double</SelectItem>
                        <SelectItem value="Triple">🛏️🛏️🛏️ Triple</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`roomOptions.${index}.price`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="text-xs">Price (per month)</FormLabel>
                    <FormControl>
                      <CurrencyInput
                        value={field.value}
                        onChange={(val) => field.onChange(val)}
                        placeholder="e.g., 8,000"
                        disabled={isSubmitting}
                        max={500000}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="shrink-0"
                onClick={() => remove(index)}
                disabled={fields.length <= 1 || isSubmitting}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ occupancy: 'Single', price: 0 })}
            disabled={isSubmitting || fields.length >= 5}
            className="w-full border-dashed"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Another Room Option
          </Button>
          <FormMessage>{form.formState.errors.roomOptions?.message}</FormMessage>
        </div>

        {/* 5. Amenities */}
        <div className="space-y-4 p-6 border rounded-xl bg-card shadow-sm">
          <SectionHeader icon={<Sparkles className="h-5 w-5" />} number={5} title="Amenities" subtitle="Check all amenities your property offers. More amenities = more bookings!" />
          <FormField
            control={form.control}
            name="amenities"
            render={() => (
              <FormItem>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {allAmenities.map((item) => (
                    <FormField
                      key={item}
                      control={form.control}
                      name="amenities"
                      render={({ field }) => {
                        const isChecked = field.value?.includes(item);
                        return (
                          <FormItem key={item}>
                            <FormControl>
                              <label className={cn(
                                "flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all select-none",
                                isChecked
                                  ? "border-primary bg-primary/5 shadow-sm"
                                  : "border-muted hover:border-primary/30 hover:bg-muted/50"
                              )}>
                                <Checkbox
                                  checked={isChecked}
                                  onCheckedChange={(checked) => {
                                    return checked
                                        ? field.onChange([...field.value, item])
                                        : field.onChange(field.value?.filter((value) => value !== item));
                                  }}
                                  disabled={isSubmitting}
                                  className="sr-only"
                                />
                                <span className="text-xl">{amenityIconMap[item]}</span>
                                <span className={cn("text-sm font-medium", isChecked && "text-primary")}>{item}</span>
                                {isChecked && <Check className="ml-auto h-4 w-4 text-primary" />}
                              </label>
                            </FormControl>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* 6. Categorized Photos Upload System */}
        <div className="space-y-6 p-6 border rounded-xl bg-card shadow-sm">
          <SectionHeader icon={<Camera className="h-5 w-5" />} number={6} title="Property Photos Gallery" subtitle="Upload structured, category-based images to build trust with tenants." />

          {/* Media Checklist Summary Dashboard */}
          <div className="p-4 bg-muted/40 rounded-lg border text-sm space-y-3">
            <h4 className="font-semibold flex items-center gap-2 text-foreground">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              Upload Requirements Checklist
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2 text-xs">
              {mediaStatusList.map((status) => (
                <div key={status.key} className="flex items-center justify-between py-1 border-b border-muted">
                  <span className={cn(
                    "font-medium", 
                    status.mandatory ? "text-foreground" : "text-muted-foreground"
                  )}>
                    {status.label} {status.mandatory && <span className="text-destructive">*</span>}
                  </span>
                  <div className="flex items-center gap-1.5 font-semibold">
                    <span className={cn(
                      status.isValid ? "text-green-600" : status.mandatory ? "text-destructive" : "text-amber-600"
                    )}>
                      ({status.count}/{status.max})
                    </span>
                    <span>
                      {status.isValid ? '✅' : '❌'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-muted-foreground">
              Note: <span className="text-destructive font-bold">*</span> represents mandatory photo categories based on the selected property category.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-4">
            
            {/* Category selection list */}
            <div className="md:col-span-4 space-y-2 border-r pr-0 md:pr-4">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">Categories</span>
              <div className="flex md:flex-col overflow-x-auto md:overflow-x-visible gap-1.5 pb-2 md:pb-0">
                {PHOTO_CATEGORIES.map((config) => {
                  const status = mediaStatusList.find(s => s.key === config.key);
                  const isSelected = activeCategoryKey === config.key;
                  return (
                    <button
                      key={config.key}
                      type="button"
                      onClick={() => setActiveCategoryKey(config.key)}
                      className={cn(
                        "flex items-center justify-between text-left px-3 py-2.5 rounded-lg text-xs font-medium transition-all shrink-0 md:shrink border",
                        isSelected 
                          ? "bg-primary text-primary-foreground border-primary shadow-sm"
                          : "bg-secondary/40 text-foreground border-transparent hover:bg-secondary/80"
                      )}
                    >
                      <span className="truncate mr-2">{config.label}</span>
                      <span className={cn(
                        "text-[10px] px-1.5 py-0.5 rounded-full font-bold",
                        isSelected 
                          ? "bg-primary-foreground/20 text-primary-foreground" 
                          : status?.isValid 
                            ? "bg-green-100 text-green-800" 
                            : status?.mandatory 
                              ? "bg-red-100 text-red-800" 
                              : "bg-muted text-muted-foreground"
                      )}>
                        {status?.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Category Photos Editor workspace */}
            <div className="md:col-span-8 space-y-4">
              {(() => {
                const config = PHOTO_CATEGORIES.find(c => c.key === activeCategoryKey)!;
                const status = mediaStatusList.find(s => s.key === activeCategoryKey)!;
                const images: CategorizedImage[] = activeCategoryKey === 'coverPhoto'
                  ? (media.coverPhoto ? [media.coverPhoto] : [])
                  : ((media[activeCategoryKey] as any[]) || []);

                return (
                  <div className="space-y-4">
                    <div className="flex justify-between items-start border-b pb-3">
                      <div>
                        <h4 className="font-semibold text-base text-foreground">{config.label}</h4>
                        <p className="text-xs text-muted-foreground mt-0.5">{config.description}</p>
                        <p className="text-[11px] text-primary/80 font-medium mt-1">
                          Limit: {config.min} to {config.max} photo{config.max > 1 && 's'} required ({status.mandatory ? 'Required' : 'Optional'})
                        </p>
                      </div>
                      
                      <CloudinaryUploadWidget
                        onUploadSuccess={handlePhotoUploadSuccess}
                        buttonText={images.length >= config.max ? "Limit Reached" : "Add Photos"}
                        className={cn("h-9 text-xs")}
                      />
                    </div>

                    {/* Image thumbnails list */}
                    {images.length === 0 ? (
                      <div className="h-48 border border-dashed rounded-lg flex flex-col items-center justify-center text-muted-foreground text-xs space-y-2 bg-muted/10">
                        <Camera className="h-8 w-8 text-muted-foreground/45" />
                        <p>No photos uploaded in this category yet.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {images.map((img, idx) => (
                          <div key={img.id} className="border rounded-lg overflow-hidden bg-background shadow-sm flex flex-col justify-between">
                            <div className="relative h-36 bg-muted">
                              <Image src={img.url} alt="Gallery Preview" fill className="object-cover" />
                              {activeCategoryKey === 'coverPhoto' && (
                                <Badge className="absolute top-2 left-2 bg-green-600">Active Cover</Badge>
                              )}
                            </div>
                            
                            <div className="p-2.5 space-y-2.5">
                              {/* Reorder and Delete controls */}
                              <div className="flex items-center justify-between gap-1.5">
                                <div className="flex items-center gap-1">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={() => reorderImage(activeCategoryKey, idx, 'left')}
                                    disabled={activeCategoryKey === 'coverPhoto' || idx === 0}
                                    title="Move Left"
                                  >
                                    <ArrowLeft className="h-3.5 w-3.5" />
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={() => reorderImage(activeCategoryKey, idx, 'right')}
                                    disabled={activeCategoryKey === 'coverPhoto' || idx === images.length - 1}
                                    title="Move Right"
                                  >
                                    <ArrowRight className="h-3.5 w-3.5" />
                                  </Button>
                                </div>

                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() => deleteImage(activeCategoryKey, img.id)}
                                  title="Delete Photo"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </div>

                              {/* Shift category dropdown */}
                              <div className="space-y-1">
                                <span className="text-[10px] text-muted-foreground block font-medium">Shift Category:</span>
                                <Select
                                  value={activeCategoryKey}
                                  onValueChange={(toCat) => moveImageCategory(activeCategoryKey, img.id, toCat as keyof PropertyMedia)}
                                >
                                  <SelectTrigger className="h-7 text-[10px] py-0 px-2 bg-secondary/50 border-muted">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {PHOTO_CATEGORIES.map(c => (
                                      <SelectItem key={c.key} value={c.key} className="text-xs">
                                        {c.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>

                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>

          </div>

          <FormField
            control={form.control}
            name="dataAiHint"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image Keywords (for AI)</FormLabel>
                <FormControl><Input placeholder="e.g., modern hostel" {...field} disabled={isSubmitting} /></FormControl>
                <FormDescription>Help our AI find better images later by providing one or two keywords.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Live Preview Toggle */}
        <div className="border rounded-xl overflow-hidden">
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="w-full flex items-center justify-between p-4 bg-secondary/30 hover:bg-secondary/50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium">Live Preview — How tenants will see your listing</span>
            </div>
            <Badge variant="secondary">{showPreview ? 'Hide' : 'Show'}</Badge>
          </button>
          {showPreview && (
            <div className="p-6 bg-muted/20">
              <Card className="max-w-sm mx-auto overflow-hidden shadow-lg">
                <div className="relative h-48 bg-muted">
                  {media.coverPhoto?.url ? (
                    <Image src={media.coverPhoto.url} alt="Preview" fill className="object-cover" />
                  ) : (
                    <div className="h-full flex items-center justify-center text-muted-foreground text-sm">No cover photo uploaded</div>
                  )}
                  {watchedValues.type && (
                    <Badge className="absolute top-2 right-2 bg-accent text-accent-foreground">{watchedValues.type}</Badge>
                  )}
                </div>
                <CardContent className="p-4">
                  <h4 className="font-headline text-lg font-bold line-clamp-2 min-h-[3rem]">
                    {watchedValues.title || 'Your Property Title'}
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1 flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    {watchedValues.location || 'Location'}{watchedValues.city ? `, ${watchedValues.city}` : ''}
                  </p>
                  <Separator className="my-3" />
                  <div className="flex items-center gap-2 flex-wrap">
                    {watchedValues.amenities?.slice(0, 4).map((a) => (
                      <span key={a} className="text-xs bg-secondary px-2 py-1 rounded-full">{a}</span>
                    ))}
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <div>
                      <span className="text-xl font-bold text-primary">
                        ₹{formatIndianCurrency(Math.min(...(watchedValues.roomOptions?.map(o => o.price || 0).filter(p => p > 0) || [0])))}
                      </span>
                      <span className="text-xs text-muted-foreground">/mo</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Star className="h-4 w-4 text-yellow-500" /> New
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button type="submit" size="lg" className="flex-1 py-6 text-base font-headline" disabled={isSubmitting || hasMediaErrors}>
            {isSubmitting && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
            {hasMediaErrors ? "Check Upload Requirements Checklist" : isSubmitting ? (propertyToEdit ? 'Updating...' : 'Submitting for Review...') : (propertyToEdit ? 'Update Property' : '🚀 Submit Property for Review')}
          </Button>
        </div>
        <p className="text-center text-xs text-muted-foreground -mt-4">
          Your property will be reviewed by our team before it goes live. This usually takes 24-48 hours.
        </p>
      </form>
    </Form>
  );
}
