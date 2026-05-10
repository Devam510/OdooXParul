"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/useDebounce";

interface AddStopModalProps {
  isOpen: boolean;
  onClose: () => void;
  tripId: string;
  onSuccess: () => void;
}

export function AddStopModal({ isOpen, onClose, tripId, onSuccess }: AddStopModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [cities, setCities] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  
  const [selectedCityId, setSelectedCityId] = useState("");
  const [arrivalDate, setArrivalDate] = useState("");
  const [departureDate, setDepartureDate] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchCities();
    }
  }, [isOpen, debouncedSearch]);

  const fetchCities = async () => {
    try {
      const res = await fetch(`/api/cities?q=${debouncedSearch}`);
      const data = await res.json();
      if (res.ok) setCities(data.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCityId) {
      toast.error("Please select a city");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`/api/trips/${tripId}/stops`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cityId: selectedCityId,
          arrivalDate: arrivalDate ? arrivalDate + "T00:00:00.000Z" : null,
          departureDate: departureDate ? departureDate + "T00:00:00.000Z" : null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error?.message || "Failed to add destination");
      }

      toast.success("Destination added");
      onSuccess();
      onClose();
      // reset
      setSelectedCityId("");
      setArrivalDate("");
      setDepartureDate("");
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
          <DialogTitle>Add Destination</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Search City</Label>
            <Input 
              placeholder="Type to search cities..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {cities.length > 0 && (
              <Select value={selectedCityId} onValueChange={setSelectedCityId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select from results" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map(city => (
                    <SelectItem key={city.id} value={city.id}>
                      {city.name}, {city.country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {search && cities.length === 0 && (
              <p className="text-sm text-muted-foreground">No cities found. Note: You may need to seed the DB.</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Arrival Date (Optional)</Label>
              <Input 
                type="date" 
                value={arrivalDate}
                onChange={(e) => setArrivalDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Departure Date (Optional)</Label>
              <Input 
                type="date" 
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" className="btn-accent" disabled={isLoading || !selectedCityId}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Destination
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
