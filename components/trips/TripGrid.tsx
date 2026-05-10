"use client";

import { TripCard } from "./TripCard";
import { SkeletonCard } from "@/components/ui/SkeletonCard";
import { Trip } from "@prisma/client";

interface TripGridProps {
  trips: Trip[];
  isLoading: boolean;
  onDuplicate?: (id: string) => void;
  onArchive?: (id: string) => void;
  onDelete?: (id: string) => void;
  onEdit?: (trip: Trip) => void;
}

export function TripGrid({ trips, isLoading, onDuplicate, onArchive, onDelete, onEdit }: TripGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (trips.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="bg-white p-6 rounded-full shadow-sm mb-4">
          <span className="text-4xl text-muted-foreground">✈️</span>
        </div>
        <h3 className="text-xl font-semibold text-[var(--primary)] mb-2">No trips found</h3>
        <p className="text-[var(--primary-muted)] max-w-sm">
          You haven't planned any trips that match your filters yet. Start exploring and add some!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {trips.map((trip) => (
        <TripCard 
          key={trip.id} 
          trip={trip}
          onDuplicate={onDuplicate}
          onArchive={onArchive}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}
