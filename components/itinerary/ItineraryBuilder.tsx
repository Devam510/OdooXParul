"use client";

import { useState } from "react";
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragEndEvent
} from "@dnd-kit/core";
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy 
} from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StopCard } from "./StopCard";
import { ActivitySlot } from "./ActivitySlot";
import { AddStopModal } from "./AddStopModal";
import { AddActivityModal } from "./AddActivityModal";
import { toast } from "sonner";

interface ItineraryBuilderProps {
  trip: any;
  onRefresh: () => void;
}

export function ItineraryBuilder({ trip, onRefresh }: ItineraryBuilderProps) {
  const [stops, setStops] = useState<any[]>(trip.stops || []);
  const [selectedStopId, setSelectedStopId] = useState<string | null>(stops.length > 0 ? stops[0].id : null);
  const [isAddStopOpen, setIsAddStopOpen] = useState(false);
  const [isAddActivityOpen, setIsAddActivityOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setStops((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        
        const newOrder = arrayMove(items, oldIndex, newIndex);
        
        // Optimistic update
        updateStopOrderInDB(newOrder.map((s: any) => s.id));
        return newOrder;
      });
    }
  };

  const handleActivityDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id && selectedStopId) {
      setStops((items) => {
        const newStops = [...items];
        const stopIndex = newStops.findIndex((s: any) => s.id === selectedStopId);
        if (stopIndex > -1 && newStops[stopIndex].activities) {
          const oldIndex = newStops[stopIndex].activities.findIndex((a: any) => a.id === active.id);
          const newIndex = newStops[stopIndex].activities.findIndex((a: any) => a.id === over.id);
          
          newStops[stopIndex].activities = arrayMove(newStops[stopIndex].activities, oldIndex, newIndex);
          
          updateActivityOrderInDB(newStops[stopIndex].activities.map((a: any) => a.id));
        }
        return newStops;
      });
    }
  };

  const updateStopOrderInDB = async (orderedIds: string[]) => {
    try {
      const res = await fetch(`/api/trips/${trip.id}/stops/reorder`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderedIds }),
      });
      if (!res.ok) throw new Error("Failed to reorder stops");
      toast.success("Order updated");
    } catch (err: any) {
      toast.error(err.message);
      onRefresh(); // revert
    }
  };

  const updateActivityOrderInDB = async (orderedIds: string[]) => {
    if (!selectedStopId) return;
    try {
      const res = await fetch(`/api/trips/${trip.id}/stops/${selectedStopId}/activities/reorder`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderedIds }),
      });
      if (!res.ok) throw new Error("Failed to reorder activities");
    } catch (err: any) {
      toast.error(err.message);
      onRefresh(); // revert
    }
  };

  const selectedStop = stops.find((s: any) => s.id === selectedStopId);

  return (
    <div className="flex h-full w-full overflow-hidden divide-x">
      {/* Left Sidebar - Stops list */}
      <div className="w-1/3 bg-[var(--background)] flex flex-col h-full">
        <div className="p-4 border-b bg-white flex justify-between items-center shrink-0">
          <h3 className="font-semibold text-[var(--primary)]">Destinations</h3>
          <Button size="sm" onClick={() => setIsAddStopOpen(true)} className="btn-accent h-8">
            <Plus className="h-4 w-4 mr-1" /> Add
          </Button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {stops.length === 0 ? (
            <div className="text-center p-6 border-2 border-dashed rounded-lg text-[var(--primary-muted)]">
              No stops added yet. Let's add your first destination!
            </div>
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={stops.map((s: any) => s.id)} strategy={verticalListSortingStrategy}>
                {stops.map((stop: any) => (
                  <StopCard 
                    key={stop.id} 
                    stop={stop} 
                    tripId={trip.id}
                    isSelected={selectedStopId === stop.id}
                    onClick={() => setSelectedStopId(stop.id)}
                    onRefresh={() => {
                      if (stops.length === 1) setSelectedStopId(null);
                      onRefresh();
                    }}
                  />
                ))}
              </SortableContext>
            </DndContext>
          )}
        </div>
      </div>

      {/* Right Area - Activities for selected stop */}
      <div className="flex-1 bg-white flex flex-col h-full">
        {selectedStop ? (
          <>
            <div className="p-4 border-b flex justify-between items-center shrink-0">
              <div>
                <h3 className="font-semibold text-lg text-[var(--primary)]">{selectedStop.city.name}</h3>
                <p className="text-sm text-[var(--primary-muted)]">Manage activities and itinerary</p>
              </div>
              <Button onClick={() => setIsAddActivityOpen(true)} className="btn-accent">
                <Plus className="h-4 w-4 mr-2" /> Add Activity
              </Button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 bg-[var(--background-secondary)]/50">
              {selectedStop.activities && selectedStop.activities.length > 0 ? (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleActivityDragEnd}>
                  <SortableContext items={selectedStop.activities.map((a: any) => a.id)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-4 max-w-3xl mx-auto">
                      {selectedStop.activities.map((act: any) => (
                        <ActivitySlot 
                          key={act.id} 
                          tripActivity={act} 
                          tripId={trip.id}
                          stopId={selectedStop.id}
                          onRefresh={onRefresh}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              ) : (
                <div className="text-center p-12 max-w-lg mx-auto">
                  <div className="bg-white p-6 rounded-2xl shadow-sm border">
                    <h4 className="text-lg font-medium text-[var(--primary)] mb-2">Your schedule is empty</h4>
                    <p className="text-[var(--primary-muted)] mb-6">
                      Add flights, hotel check-ins, sightseeing, or dining reservations to build your itinerary.
                    </p>
                    <Button onClick={() => setIsAddActivityOpen(true)} variant="outline">
                      Browse Activities
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-[var(--primary-muted)]">
            Select a destination to view or add activities
          </div>
        )}
      </div>

      {/* Modals */}
      <AddStopModal 
        isOpen={isAddStopOpen} 
        onClose={() => setIsAddStopOpen(false)} 
        tripId={trip.id} 
        onSuccess={onRefresh} 
      />
      
      {selectedStop && (
        <AddActivityModal 
          isOpen={isAddActivityOpen} 
          onClose={() => setIsAddActivityOpen(false)} 
          tripId={trip.id} 
          stopId={selectedStop.id} 
          cityId={selectedStop.cityId}
          onSuccess={onRefresh} 
        />
      )}
    </div>
  );
}
