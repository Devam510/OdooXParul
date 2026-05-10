"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { PackingList } from "@/components/packing/PackingList";
import { PackingProgress } from "@/components/packing/PackingProgress";
import { TemplateSelector } from "@/components/packing/TemplateSelector";
import { AddItemForm } from "@/components/packing/AddItemForm";
import { AIPackingSuggestions } from "@/components/ai/AIPackingSuggestions";
import { differenceInDays } from "date-fns";

export default function PackingPage() {
  const params = useParams();
  const router = useRouter();
  const tripId = params.id as string;
  
  const [trip, setTrip] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTripAndItems = async () => {
    setIsLoading(true);
    try {
      const [tripRes, itemsRes] = await Promise.all([
        fetch(`/api/trips/${tripId}`),
        fetch(`/api/trips/${tripId}/packing`)
      ]);
      
      const tripResult = await tripRes.json();
      const itemsResult = await itemsRes.json();
      
      if (!tripRes.ok) throw new Error(tripResult.error?.message || "Failed to fetch trip");
      if (!itemsRes.ok) throw new Error(itemsResult.error?.message || "Failed to fetch items");
      
      setTrip(tripResult.data);
      setItems(itemsResult.data);
    } catch (err: any) {
      toast.error(err.message);
      if (!trip) router.push(`/trips/${tripId}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (tripId) fetchTripAndItems();
  }, [tripId, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--accent)]" />
      </div>
    );
  }

  if (!trip) return null;

  const duration = differenceInDays(new Date(trip.endDate), new Date(trip.startDate)) + 1;
  const destinations = trip.stops?.map((s: any) => s.city?.name).filter(Boolean) || [];

  const handleAddAIItems = async (suggestedItems: any[]) => {
    try {
      const promises = suggestedItems.map((item: any) => 
        fetch(`/api/trips/${tripId}/packing`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...item, tripId })
        })
      );
      await Promise.all(promises);
      fetchTripAndItems();
    } catch (error) {
      toast.error("Failed to add some AI items");
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Button variant="ghost" asChild className="mb-2 -ml-4 text-[var(--primary-muted)] hover:text-[var(--primary)]">
            <Link href={`/trips/${tripId}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Trip Details
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--primary)] flex items-center">
            <Package className="mr-3 h-8 w-8 text-[var(--accent)]" />
            Packing List
          </h1>
          <p className="text-[var(--primary-muted)] mt-1">Get ready for {trip.title}</p>
        </div>
        
        <TemplateSelector tripId={tripId} onSuccess={fetchTripAndItems} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 bg-white p-6 rounded-xl shadow-sm border space-y-6">
          <PackingProgress items={items} />
          <AddItemForm tripId={tripId} onSuccess={fetchTripAndItems} />
          <div className="pt-4">
            <PackingList items={items} tripId={tripId} onRefresh={fetchTripAndItems} />
          </div>
        </div>
        
        <div className="space-y-6">
          <AIPackingSuggestions 
            destinations={destinations}
            duration={duration}
            tripType={trip.tags?.[0] || "General"}
            onAddItems={handleAddAIItems}
          />
        </div>
      </div>
    </div>
  );
}
