"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

export function ActivityFilters({ filters, setFilters }: { filters: any, setFilters: any }) {
  return (
    <div className="bg-white p-4 rounded-xl border shadow-sm flex flex-wrap gap-6 items-end">
      <div className="space-y-2 w-[200px]">
        <Label>Category</Label>
        <Select value={filters.category} onValueChange={(v: any) => setFilters({ ...filters, category: v === 'all' ? '' : v })}>
          <SelectTrigger>
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="ADVENTURE">Adventure</SelectItem>
            <SelectItem value="SIGHTSEEING">Sightseeing</SelectItem>
            <SelectItem value="NIGHTLIFE">Nightlife</SelectItem>
            <SelectItem value="FOOD">Food & Dining</SelectItem>
            <SelectItem value="CULTURE">Culture</SelectItem>
            <SelectItem value="SHOPPING">Shopping</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2 w-[200px]">
        <Label>Max Cost (${filters.maxCost})</Label>
        <Slider 
          value={[filters.maxCost]} 
          onValueChange={(v: any) => setFilters({ ...filters, maxCost: v[0] })} 
          max={500} 
          min={0} 
          step={10} 
        />
      </div>

      <div className="space-y-2 w-[200px]">
        <Label>Min Rating ({filters.minRating}+ ⭐)</Label>
        <Slider 
          value={[filters.minRating]} 
          onValueChange={(v: any) => setFilters({ ...filters, minRating: v[0] })} 
          max={5} 
          min={0} 
          step={0.5} 
        />
      </div>
    </div>
  );
}
