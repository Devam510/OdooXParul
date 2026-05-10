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
import { useDebounce } from "@/hooks/useDebounce";

interface AddActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  tripId: string;
  stopId: string;
  cityId: string;
  onSuccess: () => void;
}

export function AddActivityModal({ isOpen, onClose, tripId, stopId, cityId, onSuccess }: AddActivityModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [activities, setActivities] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  
  const [selectedActivityId, setSelectedActivityId] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchActivities();
    }
  }, [isOpen, debouncedSearch, cityId]);

  const fetchActivities = async () => {
    try {
      const res = await fetch(`/api/activities?cityId=${cityId}&q=${debouncedSearch}`);
      const data = await res.json();
      if (res.ok) setActivities(data.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedActivityId) {
      toast.error("Please select an activity");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`/api/trips/${tripId}/stops/${stopId}/activities`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          activityId: selectedActivityId,
          scheduledDate: scheduledDate ? scheduledDate + "T00:00:00.000Z" : null,
          scheduledTime: scheduledTime || null,
          notes: notes || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error?.message || "Failed to add activity");
      }

      toast.success("Activity added");
      onSuccess();
      onClose();
      // reset
      setSelectedActivityId("");
      setScheduledDate("");
      setScheduledTime("");
      setNotes("");
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
          <DialogTitle>Add Activity</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Search Activity</Label>
            <Input 
              placeholder="Search places, restaurants, etc." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {activities.length > 0 && (
              <Select value={selectedActivityId} onValueChange={(val: any) => setSelectedActivityId(val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select from results" />
                </SelectTrigger>
                <SelectContent>
                  {activities.map(act => (
                    <SelectItem key={act.id} value={act.id}>
                      {act.name} ({act.category})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {search && activities.length === 0 && (
              <p className="text-sm text-muted-foreground">No activities found.</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date (Optional)</Label>
              <Input 
                type="date" 
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Time (Optional)</Label>
              <Input 
                type="time" 
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Notes (Optional)</Label>
            <Textarea 
              placeholder="Confirmation numbers, what to bring, etc."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" className="btn-accent" disabled={isLoading || !selectedActivityId}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Activity
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
