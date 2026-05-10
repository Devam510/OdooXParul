"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function AddToTripModal({ isOpen, onClose, activity, city }: { isOpen: boolean, onClose: () => void, activity?: any, city?: any }) {
  const [trips, setTrips] = useState<any[]>([]);
  const [selectedTripId, setSelectedTripId] = useState("");
  const [stops, setStops] = useState<any[]>([]);
  const [selectedStopId, setSelectedStopId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      fetchTrips();
    }
  }, [isOpen]);

  const fetchTrips = async () => {
    try {
      const res = await fetch("/api/trips");
      const data = await res.json();
      if (res.ok) setTrips(data.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (selectedTripId) {
      fetchStops(selectedTripId);
    } else {
      setStops([]);
    }
  }, [selectedTripId]);

  const fetchStops = async (tripId: string) => {
    try {
      const res = await fetch(`/api/itinerary/${tripId}`);
      const data = await res.json();
      if (res.ok && data.data.stops) {
        setStops(data.data.stops);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAdd = async () => {
    if (!selectedTripId) return toast.error("Please select a trip");

    setIsLoading(true);
    try {
      if (city) {
        // Adding a city stop to trip
        const res = await fetch(`/api/trips/${selectedTripId}/stops`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cityId: city.id,
            order: stops.length, // Put at end
          }),
        });
        if (!res.ok) throw new Error("Failed to add destination");
        toast.success(`${city.name} added to your trip!`);
        router.push(`/trips/${selectedTripId}/itinerary`);
      } else if (activity) {
        // Adding an activity to a stop
        if (!selectedStopId) return toast.error("Please select a destination stop");
        const res = await fetch(`/api/trips/${selectedTripId}/stops/${selectedStopId}/activities`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            activityId: activity.id,
          }),
        });
        if (!res.ok) throw new Error("Failed to add activity");
        toast.success(`${activity.name} added to your itinerary!`);
        router.push(`/trips/${selectedTripId}/itinerary`);
      }
      onClose();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add to Trip</DialogTitle>
          <DialogDescription>
            {city ? `Add ${city.name} as a destination.` : `Add ${activity?.name} to your itinerary.`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Trip</label>
            <Select value={selectedTripId} onValueChange={(val: any) => setSelectedTripId(val)}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a trip..." />
              </SelectTrigger>
              <SelectContent>
                {trips.map((t: any) => (
                  <SelectItem key={t.id} value={t.id}>{t.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {activity && selectedTripId && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Destination Stop</label>
              <Select value={selectedStopId} onValueChange={(val: any) => setSelectedStopId(val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a stop..." />
                </SelectTrigger>
                <SelectContent>
                  {stops.map((s: any) => (
                    <SelectItem key={s.id} value={s.id}>{s.city?.name || 'Unknown'}</SelectItem>
                  ))}
                  {stops.length === 0 && (
                    <SelectItem value="none" disabled>No destinations in this trip yet</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleAdd} className="btn-accent" disabled={isLoading || (!selectedTripId) || (activity && !selectedStopId)}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
