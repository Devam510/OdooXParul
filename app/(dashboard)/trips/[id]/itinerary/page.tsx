"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Map, Calendar as CalendarIcon, List, LayoutGrid, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import dynamic from "next/dynamic";
import { TimelineView } from "@/components/itinerary/TimelineView";
import { CalendarView } from "@/components/itinerary/CalendarView";
import { ListView } from "@/components/itinerary/ListView";
import { CityGroupView } from "@/components/itinerary/CityGroupView";
import { AIItineraryGenerator } from "@/components/ai/AIItineraryGenerator";
import { toast } from "sonner";

const ItineraryBuilder = dynamic(() => import("@/components/itinerary/ItineraryBuilder").then(mod => mod.ItineraryBuilder), { 
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center justify-center h-full gap-4 text-[var(--slate-muted)]">
      <Loader2 className="w-8 h-8 animate-spin text-[var(--teal)]" />
      <span className="font-medium">Loading builder...</span>
    </div>
  )
});

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
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "var(--teal-glow)" }}>
          <Loader2 className="h-6 w-6 animate-spin" style={{ color: "var(--teal)" }} />
        </div>
        <p style={{ color: "var(--slate-muted)", fontSize: "14px", fontWeight: 500 }}>Loading itinerary...</p>
      </div>
    );
  }

  if (!trip) return null;

  const handleAIGenerated = async (generatedStops: any[]) => {
    fetchItinerary();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 flex-shrink-0">
        <div>
          <motion.div whileHover={{ x: -2 }} className="mb-2">
            <Link href={`/trips/${tripId}`} className="inline-flex items-center text-sm font-semibold transition-colors" style={{ color: "var(--slate-muted)" }}>
              <ArrowLeft className="mr-1.5 h-4 w-4" />
              Back to Trip Details
            </Link>
          </motion.div>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "28px", fontWeight: 800, color: "var(--slate)", letterSpacing: "-0.02em" }}>Itinerary Builder</h1>
          <p style={{ fontSize: "14px", color: "var(--slate-muted)", marginTop: "4px" }}>Plan your day-to-day activities for <strong className="text-[var(--slate)]">{trip.title}</strong></p>
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
        <div className="card-premium p-1.5 inline-flex w-max mb-4" style={{ background: "var(--surface)", borderRadius: "12px" }}>
          <TabsList className="bg-transparent gap-1">
            <TabsTrigger value="builder" className="data-[state=active]:bg-[var(--teal-light)] data-[state=active]:text-[var(--teal-dark)] rounded-md px-4 py-2 transition-all">
              <Map className="mr-2 h-4 w-4" /> Builder
            </TabsTrigger>
            <TabsTrigger value="timeline" className="data-[state=active]:bg-[var(--teal-light)] data-[state=active]:text-[var(--teal-dark)] rounded-md px-4 py-2 transition-all">
              <List className="mr-2 h-4 w-4" /> Timeline
            </TabsTrigger>
            <TabsTrigger value="calendar" className="data-[state=active]:bg-[var(--teal-light)] data-[state=active]:text-[var(--teal-dark)] rounded-md px-4 py-2 transition-all">
              <CalendarIcon className="mr-2 h-4 w-4" /> Calendar
            </TabsTrigger>
            <TabsTrigger value="list" className="data-[state=active]:bg-[var(--teal-light)] data-[state=active]:text-[var(--teal-dark)] rounded-md px-4 py-2 transition-all">
              <LayoutGrid className="mr-2 h-4 w-4" /> List
            </TabsTrigger>
            <TabsTrigger value="city" className="data-[state=active]:bg-[var(--teal-light)] data-[state=active]:text-[var(--teal-dark)] rounded-md px-4 py-2 transition-all">
              <Map className="mr-2 h-4 w-4" /> City View
            </TabsTrigger>
          </TabsList>
        </div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="flex-1 min-h-0 card-premium overflow-hidden flex flex-col" style={{ borderRadius: "var(--radius-lg)" }}>
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
        </motion.div>
      </Tabs>
    </motion.div>
  );
}
