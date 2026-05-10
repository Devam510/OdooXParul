"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2, Calendar, MoreVertical } from "lucide-react";
import { format } from "date-fns";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { EditStopModal } from "./EditStopModal";
import { useState } from "react";

interface StopCardProps {
  stop: any;
  tripId: string;
  isSelected: boolean;
  onClick: () => void;
  onRefresh: () => void;
}

export function StopCard({ stop, tripId, isSelected, onClick, onRefresh }: StopCardProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: stop.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Remove this destination and all its activities?")) return;
    
    try {
      const res = await fetch(`/api/trips/${tripId}/stops/${stop.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete stop");
      toast.success("Destination removed");
      onRefresh();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onClick}
      className={`relative flex items-center p-3 rounded-xl border cursor-pointer transition-colors group ${
        isSelected 
          ? "bg-white border-[var(--accent)] shadow-sm ring-1 ring-[var(--accent)]" 
          : "bg-white border-[var(--border)] hover:border-[var(--primary-muted)]"
      } ${isDragging ? "opacity-50" : "opacity-100"}`}
    >
      <div 
        {...attributes} 
        {...listeners}
        className="mr-3 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing p-1"
        onClick={(e) => e.stopPropagation()}
      >
        <GripVertical className="h-4 w-4" />
      </div>

      <div className="flex-1 min-w-0">
        <h4 className={`font-medium truncate ${isSelected ? "text-[var(--accent)]" : "text-[var(--primary)]"}`}>
          {stop.city.name}
        </h4>
        <div className="flex items-center text-xs text-[var(--primary-muted)] mt-1">
          <Calendar className="mr-1 h-3 w-3" />
          {stop.arrivalDate ? format(new Date(stop.arrivalDate), "MMM d") : "TBD"}
          {stop.departureDate ? ` - ${format(new Date(stop.departureDate), "MMM d")}` : ""}
        </div>
      </div>

      <div className="ml-2 flex items-center">
        <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-600 mr-2">
          {stop.activities?.length || 0}
        </span>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-[var(--primary)]">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setIsEditModalOpen(true); }}>
              <Calendar className="mr-2 h-4 w-4" />
              Edit Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDelete} className="text-red-600 focus:text-red-600 focus:bg-red-50">
              <Trash2 className="mr-2 h-4 w-4" />
              Remove Destination
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <EditStopModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        tripId={tripId} 
        stop={stop}
        onSuccess={onRefresh} 
      />
    </div>
  );
}
