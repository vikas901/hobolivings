
'use client';

import { useState, useMemo, type FC, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PropertyCard from './property-card';
import type { Property, Amenity, PropertyCategory, PropertyType } from '@/lib/types';
import { allAmenities, allCategories } from '@/lib/dummy-data';
import { ListFilter, Map as MapIcon } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { PropertyDetailModal } from './property-detail-modal';

interface PropertyFiltersProps {
  properties: Property[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export const PropertyFilters: FC<PropertyFiltersProps> = ({ properties, searchTerm, setSearchTerm }) => {
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [maxPrice, setMaxPrice] = useState(50000);
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedType, setSelectedType] = useState<PropertyType | 'All'>('All');
  const [selectedCategories, setSelectedCategories] = useState<PropertyCategory[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<Amenity[]>([]);
  const [viewMode, setViewMode] = useState('list');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  useEffect(() => {
    if (properties.length > 0) {
      const highestPropertyPrice = Math.max(...properties.map(p => p.price));
      const newMaxPrice = Math.ceil(highestPropertyPrice / 1000) * 1000;
      
      setMaxPrice(newMaxPrice > 0 ? newMaxPrice : 50000);
      
      // If the slider is still at its default max value, update it to reflect the actual data.
      if (priceRange[1] === 50000) {
        setPriceRange([0, newMaxPrice]);
      }
    }
  }, [properties]);
  
  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        property.title.toLowerCase().includes(searchLower) ||
        property.location.toLowerCase().includes(searchLower) ||
        property.city.toLowerCase().includes(searchLower);
      const matchesPrice = property.price >= priceRange[0] && property.price <= priceRange[1];
      const matchesCity = selectedCity === 'all' || property.city === selectedCity;
      const matchesType = selectedType === 'All' || property.type === selectedType;
      const matchesCategory =
        selectedCategories.length === 0 || selectedCategories.includes(property.category);
      const matchesAmenities = selectedAmenities.every((amenity) =>
        property.amenities?.includes(amenity)
      );
      return (
        matchesSearch && matchesPrice && matchesCity && matchesType && matchesCategory && matchesAmenities
      );
    });
  }, [
    searchTerm,
    priceRange,
    selectedCity,
    selectedType,
    selectedCategories,
    selectedAmenities,
    properties
  ]);

  const uniqueCities = useMemo(() => {
    const cities = new Set(properties.map(p => p.city));
    return Array.from(cities);
  }, [properties]);

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
            {uniqueCities.map(city => <SelectItem key={city} value={city}>{city}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="font-semibold">Price Range (₹{priceRange[0].toLocaleString()} - ₹{priceRange[1].toLocaleString()})</Label>
        <Slider
          className="mt-4"
          min={0}
          max={maxPrice}
          step={500}
          value={priceRange}
          onValueChange={(value) => setPriceRange(value as [number, number])}
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
    <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24">
              <h2 className="text-xl font-headline font-bold mb-4">Filters</h2>
              <FiltersComponent />
            </div>
          </aside>

          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-4">
              
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
                 <Button variant={viewMode === 'map' ? 'secondary' : 'outline'} size="sm" onClick={() => setViewMode('map')}><MapIcon className="mr-2 h-4 w-4" /> Map</Button>
              </div>
            </div>
            
            <p className="mb-4 text-muted-foreground">
                {filteredProperties.length} properties found
            </p>

            {viewMode === 'list' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProperties.length > 0 ? (
                  filteredProperties.map((property) => (
                    <PropertyCard key={property.id} property={property} onCardClick={handleCardClick} />
                  ))
                ) : (
                  <p className="md:col-span-2 xl:col-span-3 text-center text-muted-foreground py-16">No properties match your criteria. Try adjusting your filters.</p>
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
  )
}
