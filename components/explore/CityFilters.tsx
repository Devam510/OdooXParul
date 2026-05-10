"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

export function CityFilters({ filters, setFilters }: { filters: any, setFilters: any }) {
  return (
    <div className="bg-white p-4 rounded-xl border shadow-sm flex flex-wrap gap-6 items-end">
      <div className="space-y-2 w-[200px]">
        <Label>Country</Label>
        <Select value={filters.country} onValueChange={(v) => setFilters({ ...filters, country: v === 'all' ? '' : v })}>
          <SelectTrigger>
            <SelectValue placeholder="All Countries" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Countries</SelectItem>
            <SelectItem value="France">France</SelectItem>
            <SelectItem value="Japan">Japan</SelectItem>
            <SelectItem value="Italy">Italy</SelectItem>
            <SelectItem value="USA">USA</SelectItem>
            <SelectItem value="Spain">Spain</SelectItem>
            <SelectItem value="Australia">Australia</SelectItem>
            <SelectItem value="Brazil">Brazil</SelectItem>
            <SelectItem value="South Africa">South Africa</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2 w-[200px]">
        <Label>Max Cost Index ({filters.maxCost === 4 ? '$$$$' : filters.maxCost === 3 ? '$$$' : filters.maxCost === 2 ? '$$' : '$'})</Label>
        <Slider 
          value={[filters.maxCost]} 
          onValueChange={(v) => setFilters({ ...filters, maxCost: v[0] })} 
          max={4} 
          min={1} 
          step={1} 
        />
      </div>

      <div className="space-y-2 w-[200px]">
        <Label>Min Popularity ({filters.minPopularity}+ ⭐)</Label>
        <Slider 
          value={[filters.minPopularity]} 
          onValueChange={(v) => setFilters({ ...filters, minPopularity: v[0] })} 
          max={5} 
          min={0} 
          step={0.5} 
        />
      </div>
    </div>
  );
}
