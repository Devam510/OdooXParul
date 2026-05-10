"use client";

import { useState, useEffect } from "react";
import { Loader2, Compass } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ActivityCard } from "@/components/explore/ActivityCard";
import { SearchBar } from "@/components/explore/SearchBar";
import { ActivityFilters } from "@/components/explore/ActivityFilters";
import { useDebounce } from "@/hooks/useDebounce";

export default function ActivitiesExplorePage() {
  const [activities, setActivities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ category: "", maxCost: 500, minRating: 0 });
  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    fetchActivities();
  }, [debouncedSearch, filters]);

  const fetchActivities = async () => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams({ q: debouncedSearch });
      if (filters.category) queryParams.append("category", filters.category);
      queryParams.append("maxCost", filters.maxCost.toString());
      queryParams.append("minRating", filters.minRating.toString());

      const res = await fetch(`/api/activities?${queryParams.toString()}`);
      const data = await res.json();
      if (res.ok) setActivities(data.data);
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
          <Compass className="mr-3 h-8 w-8 text-[var(--accent)]" />
          Explore Activities
        </h1>
        <p className="text-[var(--primary-muted)] mt-1">Find top-rated experiences and tours worldwide.</p>
      </div>

      <div className="space-y-4">
        <SearchBar 
          value={search} 
          onChange={setSearch} 
          placeholder="Search activities (e.g., Museum, Tour)..." 
        />
        <ActivityFilters filters={filters} setFilters={setFilters} />
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-[var(--accent)]" />
        </div>
      ) : activities.length === 0 ? (
        <div className="text-center p-12 bg-white rounded-xl border border-dashed">
          <p className="text-[var(--primary-muted)]">No activities found. Note: Ensure you have run the seed script.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {activities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </div>
      )}
    </div>
  );
}
