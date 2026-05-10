"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { format, differenceInDays } from "date-fns";
import { motion } from "framer-motion";
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
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "var(--teal-glow)" }}>
          <Loader2 className="h-6 w-6 animate-spin" style={{ color: "var(--teal)" }} />
        </div>
        <p style={{ color: "var(--slate-muted)", fontSize: "14px", fontWeight: 500 }}>Loading trip details...</p>
      </div>
    );
  }

  if (!trip) return null;

  const duration = differenceInDays(new Date(trip.endDate), new Date(trip.startDate)) + 1;

  const features = [
    { name: "Itinerary", desc: "Plan stops", icon: Map, color: "#3B82F6", href: `/trips/${tripId}/itinerary` },
    { name: "Budget", desc: "Track expenses", icon: DollarSign, color: "#10B981", href: `/trips/${tripId}/budget` },
    { name: "Packing", desc: "Checklists", icon: Briefcase, color: "#8B5CF6", href: `/trips/${tripId}/packing` },
    { name: "Notes", desc: "Ideas & links", icon: FileText, color: "#F59E0B", href: `/trips/${tripId}/notes` },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="space-y-6 pb-20">
      <div className="flex items-center gap-2 mb-2">
        <motion.div whileHover={{ x: -2 }}>
          <Link href="/trips" className="inline-flex items-center text-sm font-semibold transition-colors" style={{ color: "var(--slate-muted)" }}>
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Back to Trips
          </Link>
        </motion.div>
      </div>

      {/* Hero Section */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative rounded-[24px] overflow-hidden bg-[var(--slate)] h-[320px] md:h-[420px] flex items-end"
        style={{ boxShadow: "var(--shadow-lg)" }}
      >
        {trip.coverImage ? (
          <Image src={trip.coverImage} alt={trip.title} fill className="object-cover opacity-70 mix-blend-overlay" priority sizes="100vw" />
        ) : (
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #0F2027, #203A43, #2C5364)" }} />
        )}
        
        {/* Dynamic mesh overlay */}
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.2) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#060B14]/90 via-[#060B14]/40 to-transparent" />
        
        <div className="relative z-10 w-full p-6 md:p-10 text-white">
          <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="flex flex-wrap items-center gap-3 mb-4">
            <TripStatusBadge status={trip.status} />
            <div className="flex items-center text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.1)" }}>
              {trip.visibility === "PUBLIC" ? <Globe className="mr-1.5 h-3.5 w-3.5" /> : <Lock className="mr-1.5 h-3.5 w-3.5" />}
              {trip.visibility === "PUBLIC" ? "Public" : "Private"}
            </div>
          </motion.div>
          
          <motion.h1 initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: "0.75rem" }}>
            {trip.title}
          </motion.h1>
          
          <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="flex flex-wrap items-center gap-x-6 gap-y-3 text-white/80 text-sm md:text-base font-medium">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-[var(--teal)]" />
              {format(new Date(trip.startDate), "MMM d")} - {format(new Date(trip.endDate), "MMM d, yyyy")} <span className="opacity-60">({duration} days)</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[var(--teal)]" />
              {trip.stops?.length || 0} Stops
            </div>
          </motion.div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Left Column - Main Details */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="card-premium p-6 md:p-8" style={{ borderRadius: "var(--radius-lg)" }}>
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "20px", fontWeight: 700, color: "var(--slate)", marginBottom: "1rem" }}>Trip Overview</h2>
            <p style={{ fontSize: "15px", lineHeight: 1.7, color: "var(--slate-light)", whiteSpace: "pre-wrap" }}>
              {trip.description || "No description provided. Add some details to remember what this trip is all about!"}
            </p>
            
            {trip.tags && trip.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-6 pt-6" style={{ borderTop: "1px solid var(--border)" }}>
                {trip.tags.map((tag: string) => (
                  <span key={tag} className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: "var(--bg-secondary)", color: "var(--slate-muted)", border: "1px solid var(--border)" }}>
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </motion.div>

          {/* Module Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <Link key={feature.name} href={feature.href}>
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 + (i * 0.05) }}
                    whileHover={{ y: -4, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="card-premium p-5 flex flex-col items-center justify-center text-center h-full group"
                    style={{ borderRadius: "var(--radius-lg)", borderBottom: `2px solid ${feature.color}20` }}
                  >
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3" style={{ background: `${feature.color}15` }}>
                      <Icon className="h-6 w-6" style={{ color: feature.color }} />
                    </div>
                    <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "15px", fontWeight: 700, color: "var(--slate)" }}>{feature.name}</h3>
                    <p style={{ fontSize: "11px", color: "var(--slate-subtle)", marginTop: "2px" }}>{feature.desc}</p>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right Column - Actions & Stops Overview */}
        <div className="space-y-6">
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="card-premium p-5 flex flex-col gap-3" style={{ borderRadius: "var(--radius-lg)" }}>
            <Link href={`/trips/${tripId}/itinerary`}>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full btn-primary flex items-center justify-center gap-2">
                <Map className="h-4 w-4" /> Plan Itinerary
              </motion.button>
            </Link>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setIsShareModalOpen(true)} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full font-semibold text-sm transition-colors" style={{ background: "var(--bg-secondary)", color: "var(--slate)", border: "1px solid var(--border)" }}>
              <Share2 className="h-4 w-4" /> Share Trip
            </motion.button>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full font-semibold text-sm transition-colors" style={{ color: "var(--slate-muted)", background: "transparent" }}>
              <Settings className="h-4 w-4" /> Settings
            </motion.button>
          </motion.div>

          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="card-premium p-6" style={{ borderRadius: "var(--radius-lg)" }}>
            <div className="flex items-center justify-between mb-6 pb-4" style={{ borderBottom: "1px solid var(--border)" }}>
              <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "18px", fontWeight: 700, color: "var(--slate)" }}>Route</h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold" style={{ background: "var(--bg-secondary)", color: "var(--slate-muted)" }}>
                {trip.stops?.length || 0} stops
              </span>
            </div>
            
            {trip.stops && trip.stops.length > 0 ? (
              <div className="space-y-0 relative before:absolute before:inset-0 before:ml-[15px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-[var(--teal)] before:via-[var(--teal)] before:to-transparent">
                {trip.stops.map((stop: any, index: number) => (
                  <div key={stop.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active py-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full border-4 border-white bg-[var(--teal)] text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10" style={{ fontSize: "12px", fontWeight: 700 }}>
                      {index + 1}
                    </div>
                    <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border transition-all duration-200" style={{ background: "var(--surface)", borderColor: "var(--border)", boxShadow: "var(--shadow-xs)" }}>
                      <h4 style={{ fontFamily: "var(--font-heading)", fontSize: "14px", fontWeight: 700, color: "var(--slate)", marginBottom: "2px" }}>{stop.city?.name || "Unknown City"}</h4>
                      <p style={{ fontSize: "12px", color: "var(--slate-subtle)" }}>
                        {stop.arrivalDate && format(new Date(stop.arrivalDate), "MMM d")} 
                        {stop.departureDate && ` - ${format(new Date(stop.departureDate), "MMM d")}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 px-4 rounded-xl" style={{ border: "1px dashed var(--border)", background: "var(--bg-secondary)" }}>
                <MapPin className="h-8 w-8 mx-auto mb-3" style={{ color: "var(--slate-subtle)" }} />
                <p style={{ fontSize: "14px", fontWeight: 500, color: "var(--slate-muted)", marginBottom: "12px" }}>No stops added yet.</p>
                <Link href={`/trips/${tripId}/itinerary`}>
                  <Button variant="outline" size="sm" className="font-semibold text-[var(--teal)] border-[var(--teal-light)] hover:bg-[var(--teal-glow)]">Add first stop</Button>
                </Link>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      <ShareModal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} tripId={tripId} />
    </motion.div>
  );
}
