"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useTripStore } from "@/store/tripStore";
import { useDebounce } from "@/hooks/useDebounce";
import { useEffect, useState } from "react";

export function TripFilters() {
  const { filters, setFilters } = useTripStore();
  const [searchValue, setSearchValue] = useState(filters.search);
  const debouncedSearch = useDebounce(searchValue, 300);

  useEffect(() => {
    setFilters({ search: debouncedSearch });
  }, [debouncedSearch, setFilters]);

  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search trips..."
          className="pl-9 bg-white"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </div>
      
      <div className="flex gap-2">
        <Select
          value={filters.status || "ALL"}
          onValueChange={(val) => setFilters({ status: val === "ALL" ? null : val })}
        >
          <SelectTrigger className="w-[140px] bg-white">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Status</SelectItem>
            <SelectItem value="PLANNING">Planning</SelectItem>
            <SelectItem value="ONGOING">Ongoing</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
            <SelectItem value="ARCHIVED">Archived</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.sort || "upcoming"}
          onValueChange={(val) => setFilters({ sort: val as "recent" | "upcoming" })}
        >
          <SelectTrigger className="w-[140px] bg-white">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="upcoming">Upcoming First</SelectItem>
            <SelectItem value="recent">Recently Created</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
