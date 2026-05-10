"use client";

import { useState } from "react";
import { Sparkles, Loader2, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function AIItineraryGenerator({ 
  tripId, 
  destinations, 
  startDate, 
  endDate, 
  travelStyle, 
  onGenerated 
}: { 
  tripId: string, 
  destinations: any[], 
  startDate: string, 
  endDate: string, 
  travelStyle?: string,
  onGenerated: (stops: any[]) => void
}) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (destinations.length === 0) {
      return toast.error("Please add destinations first");
    }

    setIsGenerating(true);
    try {
      const res = await fetch("/api/ai/itinerary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ destinations, startDate, endDate, travelStyle, tripId })
      });
      const data = await res.json();
      
      if (res.ok) {
        toast.success("AI generated itinerary successfully!");
        onGenerated(data.data.stops);
      } else {
        toast.error(data.error?.message || "Failed to generate itinerary");
      }
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button 
      onClick={handleGenerate} 
      disabled={isGenerating || destinations.length === 0}
      className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white border-0 shadow-md"
    >
      {isGenerating ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Wand2 className="mr-2 h-4 w-4" />
      )}
      {isGenerating ? "Generating Magic..." : "Auto-Generate with AI"}
    </Button>
  );
}
