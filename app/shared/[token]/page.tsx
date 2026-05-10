"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { PublicTripHero } from "@/components/shared/PublicTripHero";
import { PublicTimeline } from "@/components/shared/PublicTimeline";
import { PublicBudgetSummary } from "@/components/shared/PublicBudgetSummary";
import { Loader2, Globe, Lock } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SharedTripPage() {
  const params = useParams();
  const token = params.token as string;
  const [trip, setTrip] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const res = await fetch(`/api/shared/${token}`);
        const result = await res.json();
        
        if (!res.ok) {
          throw new Error(result.error?.message || "Failed to load shared trip");
        }
        
        setTrip(result.data);
      } catch (err: any) {
        setError(err.message);
        toast.error(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (token) fetchTrip();
  }, [token]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="h-10 w-10 animate-spin text-[var(--accent)] mb-4" />
        <p className="text-gray-500 font-medium">Loading itinerary...</p>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6 text-center">
        <div className="bg-white p-8 rounded-2xl shadow-sm border max-w-md w-full">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="h-8 w-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Link Unavailable</h1>
          <p className="text-gray-500 mb-8">{error || "This shared link is invalid or has expired."}</p>
          <Button asChild className="w-full btn-accent">
            <Link href="/">Return Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <PublicTripHero trip={trip} />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-[-40px] relative z-20 space-y-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-[var(--primary)] mb-6 flex items-center">
                <Globe className="mr-2 h-6 w-6 text-[var(--accent)]" />
                Itinerary
              </h2>
              <PublicTimeline stops={trip.stops} />
            </div>
          </div>
          
          <div className="space-y-8 mt-12 lg:mt-0">
            <PublicBudgetSummary summary={trip.budgetSummary} />
            
            <div className="bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] p-8 rounded-xl text-white text-center shadow-lg">
              <h3 className="text-xl font-bold mb-2">Plan Your Own Trip</h3>
              <p className="text-sm text-white/80 mb-6">
                Traveloop helps you organize your itineraries, track expenses, and manage packing lists all in one place.
              </p>
              <Button asChild className="w-full bg-white text-[var(--primary)] hover:bg-gray-100">
                <Link href="/">Get Started Free</Link>
              </Button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
