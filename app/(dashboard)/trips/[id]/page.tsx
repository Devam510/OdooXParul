"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { format, differenceInDays } from "date-fns";
import { 
  ArrowLeft, Calendar, MapPin, Globe, Lock, Share2, 
  Map, DollarSign, Briefcase, FileText, Settings, Loader2 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { TripStatusBadge } from "@/components/trips/TripStatusBadge";
import { ShareModal } from "@/components/shared/ShareModal";
import { toast } from "sonner";

export default function TripDetailPage() {
  const params = useParams();
  const router = useRouter();
  const tripId = params.id as string;
  const [trip, setTrip] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const res = await fetch(`/api/trips/${tripId}`);
        const result = await res.json();
        if (!res.ok) throw new Error(result.error?.message || "Failed to fetch trip");
        setTrip(result.data);
      } catch (err: any) {
        toast.error(err.message);
        router.push("/trips");
      } finally {
        setIsLoading(false);
      }
    };
    if (tripId) fetchTrip();
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

  const features = [
    { name: "Itinerary", icon: Map, color: "text-blue-500", bg: "bg-blue-100", href: `/trips/${tripId}/itinerary` },
    { name: "Budget", icon: DollarSign, color: "text-green-500", bg: "bg-green-100", href: `/trips/${tripId}/budget` },
    { name: "Packing", icon: Briefcase, color: "text-purple-500", bg: "bg-purple-100", href: `/trips/${tripId}/packing` },
    { name: "Notes", icon: FileText, color: "text-amber-500", bg: "bg-amber-100", href: `/trips/${tripId}/notes` },
  ];

  return (
    <div className="space-y-6 pb-20">
      <Button variant="ghost" asChild className="-ml-4 mb-2 text-[var(--primary-muted)] hover:text-[var(--primary)]">
        <Link href="/trips">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Trips
        </Link>
      </Button>

      {/* Hero Section */}
      <div className="relative rounded-2xl overflow-hidden bg-[var(--primary)] h-[300px] md:h-[400px] shadow-sm flex items-end">
        {trip.coverImage ? (
          <Image
            src={trip.coverImage}
            alt={trip.title}
            fill
            className="object-cover opacity-60"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--primary)] to-[var(--primary-light)] opacity-90" />
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        <div className="relative z-10 w-full p-6 md:p-10 text-white">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <TripStatusBadge status={trip.status} />
            <div className="flex items-center text-sm font-medium bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">
              {trip.visibility === "PUBLIC" ? <Globe className="mr-2 h-4 w-4" /> : <Lock className="mr-2 h-4 w-4" />}
              {trip.visibility === "PUBLIC" ? "Public" : "Private"}
            </div>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-2">{trip.title}</h1>
          
          <div className="flex flex-wrap items-center gap-6 mt-4 text-white/90 text-sm md:text-base">
            <div className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              {format(new Date(trip.startDate), "MMMM d")} - {format(new Date(trip.endDate), "MMMM d, yyyy")} ({duration} days)
            </div>
            <div className="flex items-center">
              <MapPin className="mr-2 h-5 w-5" />
              {trip.stops?.length || 0} Stops
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Left Column - Main Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <h2 className="text-xl font-semibold text-[var(--primary)] mb-4">About this trip</h2>
            <p className="text-[var(--primary-muted)] whitespace-pre-wrap">
              {trip.description || "No description provided. Add some details to remember what this trip is all about!"}
            </p>
            
            {trip.tags && trip.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-6">
                {trip.tags.map((tag: string) => (
                  <span key={tag} className="px-3 py-1 bg-[var(--background)] border text-[var(--primary-muted)] text-sm rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {features.map((feature) => (
              <Link key={feature.name} href={feature.href}>
                <div className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md hover:border-[var(--accent)] transition-all flex flex-col items-center justify-center text-center group cursor-pointer h-full">
                  <div className={`p-4 rounded-full ${feature.bg} mb-4 group-hover:scale-110 transition-transform`}>
                    <feature.icon className={`h-8 w-8 ${feature.color}`} />
                  </div>
                  <h3 className="font-semibold text-[var(--primary)]">{feature.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Right Column - Actions & Stops Overview */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border shadow-sm flex flex-col gap-3">
            <Button className="w-full btn-accent" asChild>
              <Link href={`/trips/${tripId}/itinerary`}>
                <Map className="mr-2 h-4 w-4" />
                Plan Itinerary
              </Link>
            </Button>
            <Button variant="outline" className="w-full" onClick={() => setIsShareModalOpen(true)}>
              <Share2 className="mr-2 h-4 w-4" />
              Share Trip
            </Button>
            <Button variant="outline" className="w-full text-[var(--primary-muted)]">
              <Settings className="mr-2 h-4 w-4" />
              Trip Settings
            </Button>
          </div>

          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <h2 className="text-xl font-semibold text-[var(--primary)] mb-4 flex items-center justify-between">
              Stops
              <span className="text-sm font-normal text-[var(--primary-muted)] bg-[var(--background)] px-2 py-1 rounded-full">
                {trip.stops?.length || 0}
              </span>
            </h2>
            
            {trip.stops && trip.stops.length > 0 ? (
              <div className="space-y-4">
                {trip.stops.map((stop: any, index: number) => (
                  <div key={stop.id} className="flex items-start gap-4 relative">
                    {index !== trip.stops.length - 1 && (
                      <div className="absolute left-4 top-8 bottom-[-16px] w-[2px] bg-gray-200" />
                    )}
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--accent)] text-white flex items-center justify-center font-semibold text-sm z-10">
                      {index + 1}
                    </div>
                    <div className="flex-1 pb-4">
                      <h4 className="font-medium text-[var(--primary)]">{stop.city?.name || "Unknown City"}</h4>
                      <p className="text-sm text-[var(--primary-muted)]">
                        {stop.arrivalDate && format(new Date(stop.arrivalDate), "MMM d")} 
                        {stop.departureDate && ` - ${format(new Date(stop.departureDate), "MMM d")}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-[var(--primary-muted)] border-2 border-dashed rounded-lg">
                <p>No stops added yet.</p>
                <Button variant="link" asChild className="text-[var(--accent)] mt-2">
                  <Link href={`/trips/${tripId}/itinerary`}>Add your first stop</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <ShareModal 
        isOpen={isShareModalOpen} 
        onClose={() => setIsShareModalOpen(false)} 
        tripId={tripId} 
      />
    </div>
  );
}
