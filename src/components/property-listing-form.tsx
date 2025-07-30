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
import { Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
  mainImage: z.string().url('Please enter a valid URL.'),
});

type PropertyFormValues = z.infer<typeof formSchema>;

export default function PropertyListingForm() {
  const { toast } = useToast();
  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      city: '',
      location: '',
      amenities: [],
      roomOptions: [{ occupancy: 'Single', price: 0 }],
      mainImage: '',
    },
  });
  
  const { fields, append, remove } = useFieldArray({
    name: 'roomOptions',
    control: form.control,
  });

  const onSubmit = (data: PropertyFormValues) => {
    // TODO: Connect to firebase to save the data
    console.log(data);
    toast({
      title: 'Form Submitted!',
      description: 'Your property listing has been submitted for review.',
    });
    form.reset();
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
            render={({ field }) => (
              <FormItem>
                <FormLabel>Main Image URL</FormLabel>
                <FormControl><Input placeholder="https://example.com/image.png" {...field} /></FormControl>
                <FormDescription>For now, please provide a URL to an image. We'll add file uploads later.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" size="lg">Submit for Review</Button>
      </form>
    </Form>
  );
}
