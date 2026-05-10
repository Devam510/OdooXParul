"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TripGrid } from "@/components/trips/TripGrid";
import { TripFilters } from "@/components/trips/TripFilters";
import { useTrips } from "@/hooks/useTrips";
import { useTripStore } from "@/store/tripStore";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function TripsPage() {
  const router = useRouter();
  const { filters } = useTripStore();
  const { trips, isLoading, mutate } = useTrips(filters);

  const handleDuplicate = async (id: string) => {
    try {
      const res = await fetch(`/api/trips/${id}/duplicate`, { method: "POST" });
      if (!res.ok) throw new Error("Failed to duplicate trip");
      toast.success("Trip duplicated successfully");
      mutate();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleArchive = async (id: string) => {
    try {
      const res = await fetch(`/api/trips/${id}/archive`, { method: "PATCH" });
      if (!res.ok) throw new Error("Failed to archive trip");
      toast.success("Trip archived status updated");
      mutate();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this trip? This action cannot be undone.")) return;
    try {
      const res = await fetch(`/api/trips/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete trip");
      toast.success("Trip deleted successfully");
      mutate();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleEdit = (trip: any) => {
    // In a full implementation, this would open an edit modal
    // For now, we can redirect to the detail page where they can edit
    router.push(`/trips/${trip.id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--primary)]">My Trips</h1>
          <p className="text-[var(--primary-muted)]">Manage and organize your upcoming adventures.</p>
        </div>
        <Button asChild className="btn-accent whitespace-nowrap w-full sm:w-auto">
          <Link href="/trips/new">
            <Plus className="mr-2 h-4 w-4" />
            Create Trip
          </Link>
        </Button>
      </div>

      <div className="bg-white p-4 rounded-xl border shadow-sm">
        <TripFilters />
      </div>

      <TripGrid
        trips={trips}
        isLoading={isLoading}
        onDuplicate={handleDuplicate}
        onArchive={handleArchive}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />
    </div>
  );
}
