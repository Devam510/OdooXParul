"use client";

import { useState, useEffect } from "react";
import { Loader2, Globe } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CityCard } from "@/components/explore/CityCard";
import { SearchBar } from "@/components/explore/SearchBar";
import { CityFilters } from "@/components/explore/CityFilters";
import { useDebounce } from "@/hooks/useDebounce";

export default function CitiesExplorePage() {
  const [cities, setCities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ country: "", maxCost: 4, minPopularity: 0 });
  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    fetchCities();
  }, [debouncedSearch, filters]);

  const fetchCities = async () => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams({ q: debouncedSearch });
      if (filters.country) queryParams.append("country", filters.country);
      queryParams.append("maxCost", filters.maxCost.toString());
      queryParams.append("minPopularity", filters.minPopularity.toString());

      const res = await fetch(`/api/cities?${queryParams.toString()}`);
      const data = await res.json();
      if (res.ok) setCities(data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--primary)] flex items-center">
          <Globe className="mr-3 h-8 w-8 text-[var(--accent)]" />
          Explore Destinations
        </h1>
        <p className="text-[var(--primary-muted)] mt-1">Discover popular cities, hidden gems, and top-rated locations.</p>
      </div>

      <div className="space-y-4">
        <SearchBar 
          value={search} 
          onChange={setSearch} 
          placeholder="Search cities (e.g., Paris, Tokyo)..." 
        />
        <CityFilters filters={filters} setFilters={setFilters} />
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-[var(--accent)]" />
        </div>
      ) : cities.length === 0 ? (
        <div className="text-center p-12 bg-white rounded-xl border border-dashed">
          <p className="text-[var(--primary-muted)]">No destinations found. Note: Ensure you have run the seed script.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cities.map((city) => (
            <CityCard key={city.id} city={city} />
          ))}
        </div>
      )}
    </div>
  );
}
