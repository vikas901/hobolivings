
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
import { ListFilter, Map as MapIcon, X } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { PropertyDetailModal } from './property-detail-modal';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { doc, setDoc, arrayUnion } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { formatIndianCurrency } from '@/components/ui/currency-input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

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
  const [autoCheckout, setAutoCheckout] = useState(false);

  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (properties.length === 0) return;
    const action = searchParams.get('action');
    const propertyId = searchParams.get('propertyId');
    if (!propertyId) return;

    const prop = properties.find(p => p.id === propertyId);
    if (!prop) return;

    if (action === 'book') {
      setSelectedProperty(prop);
      setAutoCheckout(true);
      
      const url = new URL(window.location.href);
      url.searchParams.delete('action');
      url.searchParams.delete('propertyId');
      window.history.replaceState({}, '', url.toString());
    } else if (action === 'save' && user) {
      const saveFavorite = async () => {
        try {
          await setDoc(doc(db, 'users', user.uid), {
            favorites: arrayUnion(propertyId)
          }, { merge: true });
          toast({ title: 'Saved! ❤️', description: 'Property saved to your favorites.' });
          setSelectedProperty(prop);
        } catch (e) {
          console.error(e);
        }
      };
      saveFavorite();
      
      const url = new URL(window.location.href);
      url.searchParams.delete('action');
      url.searchParams.delete('propertyId');
      window.history.replaceState({}, '', url.toString());
    }
  }, [searchParams, properties, user]);

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
    setAutoCheckout(false);
  }

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedCity !== 'all') count++;
    if (selectedType !== 'All') count++;
    if (selectedCategories.length > 0) count += selectedCategories.length;
    if (selectedAmenities.length > 0) count += selectedAmenities.length;
    if (priceRange[0] > 0 || priceRange[1] < maxPrice) count++;
    return count;
  }, [selectedCity, selectedType, selectedCategories, selectedAmenities, priceRange, maxPrice]);

  const handleClearAllFilters = () => {
    setSelectedCity('all');
    setSelectedType('All');
    setSelectedCategories([]);
    setSelectedAmenities([]);
    setPriceRange([0, maxPrice]);
    setSearchTerm('');
  };

  const renderFilterControls = (
    <div className="space-y-6">
      {/* Clear All Button */}
      {activeFilterCount > 0 && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleClearAllFilters} 
          className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <X className="mr-2 h-4 w-4" /> Clear All Filters ({activeFilterCount})
        </Button>
      )}

      {/* City Filter */}
      <div>
        <Label htmlFor="city-select" className="font-semibold text-sm">City</Label>
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

      {/* Price Range Slider */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="font-semibold text-sm">Monthly Budget</Label>
          <span className="text-xs font-bold text-primary font-mono bg-primary/10 px-2 py-0.5 rounded">
            ₹{(priceRange[0] ?? 0).toLocaleString('en-IN')} to ₹{(priceRange[1] ?? 0).toLocaleString('en-IN')}
          </span>
        </div>

        {/* Quick Price Preset Chips */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {[
            { label: 'All', range: [0, maxPrice] },
            { label: '< ₹10k', range: [0, 10000] },
            { label: '₹10k-₹15k', range: [10000, 15000] },
            { label: '₹15k-₹20k', range: [15000, 20000] },
            { label: '₹20k+', range: [20000, maxPrice] },
          ].map((preset, idx) => {
            const isSelected = priceRange[0] === preset.range[0] && priceRange[1] === preset.range[1];
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setPriceRange(preset.range as [number, number])}
                className={cn(
                  "text-[11px] px-2 py-0.5 rounded-full border transition-colors font-medium",
                  isSelected
                    ? "bg-primary text-white border-primary shadow-sm"
                    : "bg-secondary/60 border-border text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                {preset.label}
              </button>
            );
          })}
        </div>

        {/* Range Slider */}
        <div className="pt-2 px-1">
          <Slider
            min={0}
            max={maxPrice}
            step={500}
            value={priceRange}
            onValueChange={(val) => setPriceRange(val as [number, number])}
            className="w-full"
          />
        </div>
        <div className="flex items-center justify-between text-[10px] text-muted-foreground px-1 font-mono">
          <span>Min: ₹0</span>
          <span>Max: ₹{(maxPrice ?? 50000).toLocaleString('en-IN')}</span>
        </div>
      </div>

      {/* Property Type Filter */}
      <div>
        <Label className="font-semibold text-sm">Property Type</Label>
        <RadioGroup value={selectedType} onValueChange={(v) => setSelectedType(v as PropertyType | 'All')} className="mt-2 space-y-2">
          <div className="flex items-center space-x-2"><RadioGroupItem value="All" id="type-all" /><Label htmlFor="type-all" className="cursor-pointer text-xs">All</Label></div>
          <div className="flex items-center space-x-2"><RadioGroupItem value="Boys" id="type-boys" /><Label htmlFor="type-boys" className="cursor-pointer text-xs">Boys</Label></div>
          <div className="flex items-center space-x-2"><RadioGroupItem value="Girls" id="type-girls" /><Label htmlFor="type-girls" className="cursor-pointer text-xs">Girls</Label></div>
          <div className="flex items-center space-x-2"><RadioGroupItem value="Co-ed" id="type-coed" /><Label htmlFor="type-coed" className="cursor-pointer text-xs">Co-ed</Label></div>
        </RadioGroup>
      </div>
      
      {/* Category Filter */}
      <div>
        <Label className="font-semibold text-sm">Category</Label>
        <div className="mt-2 space-y-2">
          {allCategories.map(category => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox id={`cat-${category}`} checked={selectedCategories.includes(category)} onCheckedChange={() => handleCategoryChange(category)} />
              <Label htmlFor={`cat-${category}`} className="cursor-pointer text-xs">{category}</Label>
            </div>
          ))}
        </div>
      </div>
      
      {/* Amenities Filter */}
      <div>
        <Label className="font-semibold text-sm">Amenities</Label>
        <div className="mt-2 space-y-2">
          {allAmenities.map(amenity => (
            <div key={amenity} className="flex items-center space-x-2">
              <Checkbox id={`amenity-${amenity}`} checked={selectedAmenities.includes(amenity)} onCheckedChange={() => handleAmenityChange(amenity)} />
              <Label htmlFor={`amenity-${amenity}`} className="cursor-pointer text-xs">{amenity}</Label>
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
              {renderFilterControls}
            </div>
          </aside>

          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-4">
              
              <div className="flex items-center gap-2">
                <div className="lg:hidden">
                  <Sheet>
                    <SheetTrigger asChild>
                       <Button variant="outline" size="sm" className="relative">
                         <ListFilter className="mr-2 h-4 w-4" /> Filters
                         {activeFilterCount > 0 && (
                           <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-[10px]">
                             {activeFilterCount}
                           </Badge>
                         )}
                       </Button>
                    </SheetTrigger>
                    <SheetContent>
                        <SheetHeader><SheetTitle className="font-headline">Filters</SheetTitle></SheetHeader>
                        <div className="py-4 overflow-y-auto max-h-[calc(100vh-100px)]">{renderFilterControls}</div>
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
                  <div className="md:col-span-2 xl:col-span-3 text-center py-16 space-y-3">
                    <p className="text-2xl">🔍</p>
                    <p className="text-muted-foreground font-medium">No properties match your criteria.</p>
                    <p className="text-sm text-muted-foreground">Try adjusting your filters or search term.</p>
                    {activeFilterCount > 0 && (
                      <Button variant="outline" size="sm" onClick={handleClearAllFilters}>
                        <X className="mr-2 h-4 w-4" /> Clear All Filters
                      </Button>
                    )}
                  </div>
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
            autoTriggerCheckout={autoCheckout}
        />
      )}
    </>
  )
}
