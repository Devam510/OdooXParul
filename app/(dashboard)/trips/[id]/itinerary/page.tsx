"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Map, Calendar as CalendarIcon, List, LayoutGrid, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import dynamic from "next/dynamic";
import { TimelineView } from "@/components/itinerary/TimelineView";
import { CalendarView } from "@/components/itinerary/CalendarView";
import { ListView } from "@/components/itinerary/ListView";
import { CityGroupView } from "@/components/itinerary/CityGroupView";

const ItineraryBuilder = dynamic(() => import("@/components/itinerary/ItineraryBuilder").then(mod => mod.ItineraryBuilder), { 
  ssr: false,
  loading: () => <div className="p-12 text-center text-gray-500">Loading builder...</div>
});
import { AIItineraryGenerator } from "@/components/ai/AIItineraryGenerator";
import { toast } from "sonner";

export default function ItineraryPage() {
  const params = useParams();
  const router = useRouter();
  const tripId = params.id as string;
  
  const [trip, setTrip] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchItinerary = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/itinerary/${tripId}`);
      const result = await res.json();
      if (!res.ok) throw new Error(result.error?.message || "Failed to fetch itinerary");
      setTrip(result.data);
    } catch (err: any) {
      toast.error(err.message);
      router.push(`/trips/${tripId}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (tripId) fetchItinerary();
  }, [tripId, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--accent)]" />
      </div>
    );
  }

  if (!trip) return null;

  const handleAIGenerated = async (generatedStops: any[]) => {
    // Re-fetch to see the updated stops and activities
    fetchItinerary();
  };

  return (
    <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 flex-shrink-0">
        <div>
          <Button variant="ghost" asChild className="mb-2 -ml-4 text-[var(--primary-muted)] hover:text-[var(--primary)]">
            <Link href={`/trips/${tripId}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Trip Details
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--primary)]">Itinerary Builder</h1>
          <p className="text-[var(--primary-muted)]">Plan your day-to-day activities for {trip.title}</p>
        </div>
        
        <AIItineraryGenerator 
          tripId={tripId}
          destinations={trip.stops?.map((s: any) => s.city).filter(Boolean) || []}
          startDate={trip.startDate}
          endDate={trip.endDate}
          travelStyle={trip.tags?.[0] || "General"}
          onGenerated={handleAIGenerated}
        />
      </div>

      <Tabs defaultValue="builder" className="flex-1 flex flex-col min-h-0">
        <div className="bg-white p-2 rounded-lg border shadow-sm inline-block w-max mb-4">
          <TabsList className="bg-transparent">
            <TabsTrigger value="builder" className="data-[state=active]:bg-[var(--accent)] data-[state=active]:text-white">
              <Map className="mr-2 h-4 w-4" />
              Builder
            </TabsTrigger>
            <TabsTrigger value="timeline" className="data-[state=active]:bg-[var(--accent)] data-[state=active]:text-white">
              <List className="mr-2 h-4 w-4" />
              Timeline
            </TabsTrigger>
            <TabsTrigger value="calendar" className="data-[state=active]:bg-[var(--accent)] data-[state=active]:text-white">
              <CalendarIcon className="mr-2 h-4 w-4" />
              Calendar
            </TabsTrigger>
            <TabsTrigger value="list" className="data-[state=active]:bg-[var(--accent)] data-[state=active]:text-white">
              <LayoutGrid className="mr-2 h-4 w-4" />
              List
            </TabsTrigger>
            <TabsTrigger value="city" className="data-[state=active]:bg-[var(--accent)] data-[state=active]:text-white">
              <Map className="mr-2 h-4 w-4" />
              City View
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 min-h-0 bg-white rounded-xl border shadow-sm overflow-hidden flex flex-col">
          <TabsContent value="builder" className="h-full m-0 data-[state=active]:flex flex-col">
            <ItineraryBuilder trip={trip} onRefresh={fetchItinerary} />
          </TabsContent>
          
          <TabsContent value="timeline" className="h-full m-0 p-6 overflow-y-auto">
            <TimelineView trip={trip} />
          </TabsContent>
          
          <TabsContent value="calendar" className="h-full m-0 p-6 overflow-y-auto">
            <CalendarView trip={trip} />
          </TabsContent>
          
          <TabsContent value="list" className="h-full m-0 p-6 overflow-y-auto">
            <ListView trip={trip} />
          </TabsContent>

          <TabsContent value="city" className="h-full m-0 p-6 overflow-y-auto">
            <CityGroupView trip={trip} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
