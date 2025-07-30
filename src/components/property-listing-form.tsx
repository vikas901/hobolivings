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
import { Label } from '@/components/ui/label';
import { allAmenities, allCategories, allCities } from '@/lib/dummy-data';
import { Loader2, Trash2, UploadCloud, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth-context';
import { db, storage } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { useState, useEffect } from 'react';
import { Progress } from './ui/progress';
import Image from 'next/image';


const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];


const roomOptionSchema = z.object({
  occupancy: z.enum(['Single', 'Double', 'Triple']),
  price: z.coerce.number().min(1, 'Price must be greater than 0'),
});

const formSchema = z.object({
  title: z.string().min(10, 'Title must be at least 10 characters long.'),
  description: z.string().min(50, 'Description must be at least 50 characters long.'),
  city: z.string().min(1, 'Please select a city.'),
  location: z.string().min(10, 'Location must be at least 10 characters long.'),
  category: z.enum(allCategories as [string, ...string[]], { required_error: 'Please select a category.' }),
  type: z.enum(['Boys', 'Girls', 'Co-ed'], { required_error: 'Please select a property type.' }),
  amenities: z.array(z.string()).min(1, 'Please select at least one amenity.'),
  roomOptions: z.array(roomOptionSchema).min(1, 'Please add at least one room option.'),
  mainImage: z
    .any()
    .refine((files) => files?.length == 1, 'Main image is required.')
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 4MB.`)
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      '.jpg, .jpeg, .png and .webp files are accepted.'
    ),
  dataAiHint: z.string().max(25, 'Hint should be a few keywords, max 25 characters.').optional(),
});

type PropertyFormValues = z.infer<typeof formSchema>;

export default function PropertyListingForm() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      city: '',
      location: '',
      amenities: [],
      roomOptions: [{ occupancy: 'Single', price: 0 }],
      dataAiHint: '',
    },
  });
  
  const { fields, append, remove } = useFieldArray({
    name: 'roomOptions',
    control: form.control,
  });

  const mainImage = form.watch('mainImage');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (mainImage && mainImage.length > 0) {
      const file = mainImage[0];
      if(file instanceof File) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    } else {
      setImagePreview(null);
    }
  }, [mainImage]);

  const uploadImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const storageRef = ref(storage, `property-images/${Date.now()}_${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error("Upload failed:", error);
          reject('Image upload failed. Please try again.');
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setUploadProgress(null);
            resolve(downloadURL);
          });
        }
      );
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

    setIsSubmitting(true);
    
    try {
        const imageUrl = await uploadImage(data.mainImage[0]);

        const lowestPrice = Math.min(...data.roomOptions.map(o => o.price));

        const propertyData = {
            ...data,
            ownerId: user.uid,
            status: 'approved' as const,
            price: lowestPrice,
            image: imageUrl,
            images: [imageUrl],
            rating: 0,
            reviews: 0,
            createdAt: serverTimestamp(),
            map: { 
                lat: 0, 
                lng: 0, 
                nearby: []
            }
        };

        const { mainImage, ...firestoreData } = propertyData;

        await addDoc(collection(db, 'properties'), firestoreData);

        toast({
            title: 'Property Listed!',
            description: 'Your property is now live on the platform.',
        });
        form.reset();
        setImagePreview(null);
    } catch (error) {
        console.error("Error adding document: ", error);
        toast({
            variant: 'destructive',
            title: 'Submission Failed',
            description: typeof error === 'string' ? error : 'There was an error listing your property. Please try again.',
        });
    } finally {
        setIsSubmitting(false);
        setUploadProgress(null);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Information */}
        <div className="space-y-4 p-6 border rounded-lg">
          <h3 className="text-lg font-medium">1. Basic Information</h3>
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Property Title</FormLabel>
                <FormControl><Input placeholder="e.g., Cozy Student Hostel near Campus" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl><Textarea placeholder="Tell us about your property..." {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Location */}
        <div className="space-y-4 p-6 border rounded-lg">
            <h3 className="text-lg font-medium">2. Location Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>City</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select a city" /></SelectTrigger></FormControl>
                            <SelectContent>
                                {allCities.map(city => <SelectItem key={city} value={city}>{city}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Address / Location</FormLabel>
                        <FormControl><Input placeholder="e.g., Knowledge Park III" {...field} /></FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </div>

        {/* Property Details */}
        <div className="space-y-4 p-6 border rounded-lg">
            <h3 className="text-lg font-medium">3. Property Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Category</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                        <FormLabel>Property Type</FormLabel>
                        <FormControl>
                            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4">
                                <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="Boys" /></FormControl><FormLabel className="font-normal">Boys</FormLabel></FormItem>
                                <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="Girls" /></FormControl><FormLabel className="font-normal">Girls</FormLabel></FormItem>
                                <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="Co-ed" /></FormControl><FormLabel className="font-normal">Co-ed</FormLabel></FormItem>
                            </RadioGroup>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </div>
        
        {/* Room Options & Pricing */}
        <div className="space-y-4 p-6 border rounded-lg">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">4. Room Options & Pricing</h3>
                <Button type="button" variant="outline" size="sm" onClick={() => append({ occupancy: 'Single', price: 0 })}>
                    Add Room Option
                </Button>
            </div>
            {fields.map((field, index) => (
            <div key={field.id} className="flex items-end gap-4 p-4 bg-secondary/50 rounded-md">
                <FormField
                    control={form.control}
                    name={`roomOptions.${index}.occupancy`}
                    render={({ field }) => (
                    <FormItem className="flex-1">
                        <FormLabel>Occupancy</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select Occupancy" /></SelectTrigger></FormControl>
                            <SelectContent>
                                <SelectItem value="Single">Single</SelectItem>
                                <SelectItem value="Double">Double</SelectItem>
                                <SelectItem value="Triple">Triple</SelectItem>
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
                        <FormLabel>Price (per month)</FormLabel>
                        <FormControl><Input type="number" placeholder="e.g., 8000" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)} disabled={fields.length <= 1}>
                    <Trash2 />
                </Button>
            </div>
            ))}
             <FormMessage>{form.formState.errors.roomOptions?.message}</FormMessage>
        </div>

        {/* Amenities */}
        <div className="space-y-4 p-6 border rounded-lg">
            <h3 className="text-lg font-medium">5. Amenities</h3>
            <FormField
                control={form.control}
                name="amenities"
                render={() => (
                    <FormItem>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {allAmenities.map((item) => (
                        <FormField
                            key={item}
                            control={form.control}
                            name="amenities"
                            render={({ field }) => (
                            <FormItem key={item} className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                <Checkbox
                                    checked={field.value?.includes(item)}
                                    onCheckedChange={(checked) => {
                                    return checked
                                        ? field.onChange([...field.value, item])
                                        : field.onChange(field.value?.filter((value) => value !== item));
                                    }}
                                />
                                </FormControl>
                                <FormLabel className="font-normal">{item}</FormLabel>
                            </FormItem>
                            )}
                        />
                        ))}
                    </div>
                    <FormMessage />
                    </FormItem>
                )}
            />
        </div>

         {/* Photos */}
        <div className="space-y-4 p-6 border rounded-lg">
          <h3 className="text-lg font-medium">6. Photos</h3>
          <FormField
            control={form.control}
            name="mainImage"
            render={({ field: { onChange, value, ...rest } }) => (
                <FormItem>
                    <FormLabel>Main Property Image</FormLabel>
                    <FormControl>
                        {imagePreview ? (
                            <div className="relative w-full max-w-sm h-56">
                                <Image
                                    src={imagePreview}
                                    alt="Image Preview"
                                    layout="fill"
                                    objectFit="cover"
                                    className="rounded-md border"
                                />
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-2 right-2 h-7 w-7"
                                    onClick={() => form.setValue('mainImage', undefined)}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center w-full">
                                <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-secondary hover:bg-secondary/80">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <UploadCloud className="w-8 h-8 mb-4 text-muted-foreground" />
                                        <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                        <p className="text-xs text-muted-foreground">PNG, JPG or WEBP (MAX. 4MB)</p>
                                    </div>
                                    <Input 
                                        id="dropzone-file" 
                                        type="file" 
                                        className="hidden" 
                                        accept={ACCEPTED_IMAGE_TYPES.join(',')}
                                        onChange={(e) => onChange(e.target.files)}
                                        {...rest}
                                    />
                                </label>
                            </div>
                        )}
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
            />
          <FormField
            control={form.control}
            name="dataAiHint"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image Keywords (for AI)</FormLabel>
                <FormControl><Input placeholder="e.g., modern hostel" {...field} /></FormControl>
                <FormDescription>Help our AI find better images later by providing one or two keywords.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {uploadProgress !== null && (
          <div className="space-y-2">
            <Label>Uploading Image...</Label>
            <Progress value={uploadProgress} />
          </div>
        )}


        <Button type="submit" size="lg" disabled={isSubmitting || uploadProgress !== null}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? 'Submitting...' : 'Submit for Review'}
        </Button>
      </form>
    </Form>
  );
}
