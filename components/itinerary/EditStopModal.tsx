"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export function EditStopModal({ isOpen, onClose, tripId, stop, onSuccess }: any) {
  const [isLoading, setIsLoading] = useState(false);
  const [arrivalDate, setArrivalDate] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [hotelName, setHotelName] = useState("");
  const [hotelCostPerNight, setHotelCostPerNight] = useState("");
  const [transportType, setTransportType] = useState("FLIGHT");

  useEffect(() => {
    if (isOpen && stop) {
      setArrivalDate(stop.arrivalDate ? new Date(stop.arrivalDate).toISOString().slice(0, 10) : "");
      setDepartureDate(stop.departureDate ? new Date(stop.departureDate).toISOString().slice(0, 10) : "");
      setHotelName(stop.hotelName || "");
      setHotelCostPerNight(stop.hotelCostPerNight ? stop.hotelCostPerNight.toString() : "");
      setTransportType(stop.transportType || "FLIGHT");
    }
  }, [isOpen, stop]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch(`/api/trips/${tripId}/stops/${stop.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          arrivalDate: arrivalDate ? new Date(arrivalDate).toISOString() : undefined,
          departureDate: departureDate ? new Date(departureDate).toISOString() : undefined,
          hotelName: hotelName || undefined,
          hotelCostPerNight: hotelCostPerNight ? parseFloat(hotelCostPerNight) : undefined,
          transportType,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error?.message || "Failed to update destination");
      }

      toast.success("Destination details updated");
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!stop) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Details: {stop.city?.name}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Arrival Date</Label>
              <Input 
                type="date" 
                value={arrivalDate}
                onChange={(e) => setArrivalDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Departure Date</Label>
              <Input 
                type="date" 
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Hotel / Accommodation</Label>
            <Input 
              placeholder="e.g. Grand Plaza Hotel" 
              value={hotelName}
              onChange={(e) => setHotelName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Hotel Cost (per night)</Label>
              <Input 
                type="number"
                step="0.01" 
                placeholder="0.00" 
                value={hotelCostPerNight}
                onChange={(e) => setHotelCostPerNight(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Transport to next stop</Label>
              <Select value={transportType} onValueChange={(val: any) => setTransportType(val)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FLIGHT">Flight</SelectItem>
                  <SelectItem value="TRAIN">Train</SelectItem>
                  <SelectItem value="BUS">Bus</SelectItem>
                  <SelectItem value="CAR">Car</SelectItem>
                  <SelectItem value="SHIP">Ship</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" className="btn-accent" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
