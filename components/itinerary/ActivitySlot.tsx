"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Clock, MapPin, Trash2, GripVertical } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ActivitySlotProps {
  tripActivity: any;
  tripId: string;
  stopId: string;
  onRefresh: () => void;
}

export function ActivitySlot({ tripActivity, tripId, stopId, onRefresh }: ActivitySlotProps) {
  const { activity, scheduledDate, scheduledTime, notes } = tripActivity;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: tripActivity.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  };

  const handleDelete = async () => {
    if (!confirm("Remove this activity from your itinerary?")) return;
    
    try {
      const res = await fetch(`/api/trips/${tripId}/stops/${stopId}/activities/${tripActivity.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete activity");
      toast.success("Activity removed");
      onRefresh();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div 
      ref={setNodeRef}
      style={style}
      className={`bg-white border rounded-xl p-4 shadow-sm flex gap-4 hover:shadow-md transition-shadow group relative ${isDragging ? 'opacity-50' : 'opacity-100'}`}
    >
      <div 
        {...attributes} 
        {...listeners}
        className="absolute left-1 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing p-1 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <GripVertical className="h-4 w-4" />
      </div>

      <div className="flex flex-col items-center justify-center min-w-[80px] border-r pr-4 pl-4">
        <span className="text-sm font-semibold text-[var(--primary)]">
          {scheduledTime || "Anytime"}
        </span>
        {scheduledDate && (
          <span className="text-xs text-[var(--primary-muted)] mt-1">
            {format(new Date(scheduledDate), "MMM d")}
          </span>
        )}
      </div>
      
      <div className="flex-1 min-w-0 py-1">
        <div className="flex justify-between items-start">
          <h4 className="font-semibold text-[var(--primary)] truncate">{activity?.name || "Unknown Activity"}</h4>
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full whitespace-nowrap">
            {activity?.category || "General"}
          </span>
        </div>
        
        <div className="flex items-center text-xs text-[var(--primary-muted)] mt-2 gap-3">
          {activity?.durationMinutes && (
            <span className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {activity.durationMinutes} min
            </span>
          )}
          {activity?.address && (
            <span className="flex items-center truncate">
              <MapPin className="h-3 w-3 mr-1" />
              <span className="truncate max-w-[200px]">{activity.address}</span>
            </span>
          )}
        </div>
        
        {notes && (
          <div className="mt-3 text-sm text-[var(--primary-muted)] bg-gray-50 p-2 rounded border-l-2 border-[var(--accent)]">
            {notes}
          </div>
        )}
      </div>

      <div className="flex flex-col justify-start opacity-0 group-hover:opacity-100 transition-opacity pl-2">
        <Button variant="ghost" size="icon" onClick={handleDelete} className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
