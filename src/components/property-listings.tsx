
'use client';

import { useState, useMemo, type FC, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PropertyCard from './property-card';
import type { Property, Amenity, PropertyCategory, PropertyType } from '@/lib/types';
import { allAmenities, allCategories, allCities } from '@/lib/dummy-data';
import { ListFilter, Map, Search } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { PropertyDetailModal } from './property-detail-modal';
import { Skeleton } from './ui/skeleton';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface PropertyListingsProps {}

const PropertyListings: FC<PropertyListingsProps> = () => {
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState([0, 25000]);
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedType, setSelectedType] = useState<PropertyType | 'All'>('All');
  const [selectedCategories, setSelectedCategories] = useState<PropertyCategory[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<Amenity[]>([]);
  const [viewMode, setViewMode] = useState('list');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, 'properties'), where('status', '==', 'approved'));
        const querySnapshot = await getDocs(q);
        const propertiesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Property));
        setAllProperties(propertiesData);
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);


  const filteredProperties = useMemo(() => {
    return allProperties.filter((property) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        property.title.toLowerCase().includes(searchLower) ||
        property.location.toLowerCase().includes(searchLower);
      const matchesPrice = property.price >= priceRange[0] && property.price <= priceRange[1];
      const matchesCity = selectedCity === 'all' || property.city === selectedCity;
      const matchesType = selectedType === 'All' || property.type === selectedType;
      const matchesCategory =
        selectedCategories.length === 0 || selectedCategories.includes(property.category);
      const matchesAmenities = selectedAmenities.every((amenity) =>
        property.amenities.includes(amenity)
      );
      return (
        matchesSearch && matchesPrice && matchesCity && matchesType && matchesCategory && matchesAmenities
      );
    });
  }, [
    allProperties,
    searchTerm,
    priceRange,
    selectedCity,
    selectedType,
    selectedCategories,
    selectedAmenities,
  ]);

  const handleCategoryChange = (category: PropertyCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const handleAmenityChange = (amenity: Amenity) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };
  
  const handleCardClick = (property: Property) => {
    setSelectedProperty(property);
  }

  const handleModalClose = () => {
    setSelectedProperty(null);
  }

  const FiltersComponent = () => (
    <div className="space-y-6">
      <div>
        <Label htmlFor="city-select" className="font-semibold">City</Label>
        <Select value={selectedCity} onValueChange={setSelectedCity}>
          <SelectTrigger id="city-select" className="w-full mt-2">
            <SelectValue placeholder="Select City" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Cities</SelectItem>
            {allCities.map(city => <SelectItem key={city} value={city}>{city}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="font-semibold">Price Range (₹{priceRange[0]} - ₹{priceRange[1]})</Label>
        <Slider
          className="mt-4"
          min={0}
          max={25000}
          step={500}
          value={priceRange}
          onValueChange={(value) => setPriceRange(value)}
        />
      </div>

      <div>
        <Label className="font-semibold">Property Type</Label>
        <RadioGroup value={selectedType} onValueChange={(v) => setSelectedType(v as PropertyType | 'All')} className="mt-2 space-y-2">
          <div className="flex items-center space-x-2"><RadioGroupItem value="All" id="type-all" /><Label htmlFor="type-all">All</Label></div>
          <div className="flex items-center space-x-2"><RadioGroupItem value="Boys" id="type-boys" /><Label htmlFor="type-boys">Boys</Label></div>
          <div className="flex items-center space-x-2"><RadioGroupItem value="Girls" id="type-girls" /><Label htmlFor="type-girls">Girls</Label></div>
          <div className="flex items-center space-x-2"><RadioGroupItem value="Co-ed" id="type-coed" /><Label htmlFor="type-coed">Co-ed</Label></div>
        </RadioGroup>
      </div>
      
      <div>
        <Label className="font-semibold">Category</Label>
        <div className="mt-2 space-y-2">
          {allCategories.map(category => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox id={`cat-${category}`} checked={selectedCategories.includes(category)} onCheckedChange={() => handleCategoryChange(category)} />
              <Label htmlFor={`cat-${category}`}>{category}</Label>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <Label className="font-semibold">Amenities</Label>
        <div className="mt-2 space-y-2">
          {allAmenities.map(amenity => (
            <div key={amenity} className="flex items-center space-x-2">
              <Checkbox id={`amenity-${amenity}`} checked={selectedAmenities.includes(amenity)} onCheckedChange={() => handleAmenityChange( amenity)} />
              <Label htmlFor={`amenity-${amenity}`}>{amenity}</Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center text-center bg-cover bg-center">
        <div className="absolute inset-0 bg-cover bg-center" style={{backgroundImage: `url('https://placehold.co/1600x600.png')`}} data-ai-hint="student campus banner" /> 
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 container text-white px-4">
          <h1 className="font-headline text-4xl md:text-6xl font-bold">Find Your Student Haven</h1>
          <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto">The best student hostels, PGs, and rooms in Delhi NCR. Your search ends here.</p>
          <div className="mt-8 max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by city, location, or landmark..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-14 pl-12 pr-4 text-base rounded-full shadow-lg text-foreground"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filters */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24">
              <h2 className="text-xl font-headline font-bold mb-4">Filters</h2>
              <FiltersComponent />
            </div>
          </aside>

          {/* Listings and Mobile Filter Trigger */}
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-4">
              <div className="text-muted-foreground">
                {loading ? 'Loading...' : `${filteredProperties.length} properties found`}
              </div>
              <div className="flex items-center gap-2">
                <div className="lg:hidden">
                  <Sheet>
                    <SheetTrigger asChild>
                       <Button variant="outline" size="sm"><ListFilter className="mr-2 h-4 w-4" /> Filters</Button>
                    </SheetTrigger>
                    <SheetContent>
                        <SheetHeader><SheetTitle className="font-headline">Filters</SheetTitle></SheetHeader>
                        <div className="py-4"><FiltersComponent/></div>
                    </SheetContent>
                  </Sheet>
                </div>
                 <Button variant={viewMode === 'list' ? 'secondary' : 'outline'} size="sm" onClick={() => setViewMode('list')}>List</Button>
                 <Button variant={viewMode === 'map' ? 'secondary' : 'outline'} size="sm" onClick={() => setViewMode('map')}><Map className="mr-2 h-4 w-4" /> Map</Button>
              </div>
            </div>
            
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-96 w-full" />)}
                </div>
            ) : viewMode === 'list' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProperties.length > 0 ? (
                  filteredProperties.map((property) => (
                    <PropertyCard key={property.id} property={property} onCardClick={handleCardClick} />
                  ))
                ) : (
                  <p className="md:col-span-2 xl:col-span-3 text-center text-muted-foreground">No properties match your criteria. Try adjusting your filters.</p>
                )}
              </div>
            ) : (
              <div className="h-[600px] bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
                <p>Map view coming soon!</p>
              </div>
            )}
          </div>
        </div>
      </div>
      {selectedProperty && (
        <PropertyDetailModal 
            property={selectedProperty}
            isOpen={!!selectedProperty}
            onClose={handleModalClose}
        />
      )}
    </>
  );
};

export default PropertyListings;
