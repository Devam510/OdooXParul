"use client";

import { useAuthStore } from "@/store/authStore";
import { useTrips } from "@/hooks/useTrips";
import { WelcomeBanner } from "@/components/dashboard/WelcomeBanner";
import { TripStatsRow } from "@/components/dashboard/TripStatsRow";
import { UpcomingTrips } from "@/components/dashboard/UpcomingTrips";
import { motion } from "framer-motion";
import Link from "next/link";
import { Plus, Map, Package, Receipt, Sparkles, ArrowRight, Plane } from "lucide-react";

const QUICK_ACTIONS = [
  { href: "/trips/new", icon: Plus, label: "New Trip", desc: "Start planning", color: "#14B8A6" },
  { href: "/explore/cities", icon: Map, label: "Explore", desc: "Discover destinations", color: "#6366F1" },
  { href: "/trips", icon: Package, label: "Packing", desc: "Manage your lists", color: "#F59E0B" },
  { href: "/trips", icon: Receipt, label: "Expenses", desc: "Track your budget", color: "#EC4899" },
];

function QuickActions() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4 }}
      className="card-premium p-5"
      style={{ borderRadius: "var(--radius-lg)" }}
    >
      <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "15px", fontWeight: 700, color: "var(--slate)", marginBottom: "1rem" }}>
        Quick Actions
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {QUICK_ACTIONS.map(({ href, icon: Icon, label, desc, color }, i) => (
          <Link href={href} key={label}>
            <motion.div
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="p-3.5 rounded-xl cursor-pointer transition-all"
              style={{ background: `${color}0D`, border: `1px solid ${color}20` }}
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2.5" style={{ background: `${color}18` }}>
                <Icon className="w-4 h-4" style={{ color }} />
              </div>
              <p style={{ fontSize: "13px", fontWeight: 700, color: "var(--slate)" }}>{label}</p>
              <p style={{ fontSize: "11px", color: "var(--slate-muted)", marginTop: "2px" }}>{desc}</p>
            </motion.div>
          </Link>
        ))}
      </div>
    </motion.div>
  );
}

function AIPlannerTeaser() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4 }}
      className="relative overflow-hidden rounded-2xl p-5"
      style={{
        background: "linear-gradient(135deg, #1E1B4B 0%, #134E4A 100%)",
        border: "1px solid rgba(99,102,241,0.2)",
      }}
    >
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)", filter: "blur(24px)" }} />

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(99,102,241,0.2)" }}>
            <Sparkles className="w-4 h-4" style={{ color: "#818CF8" }} />
          </div>
          <span style={{ fontSize: "12px", fontWeight: 700, color: "#818CF8", textTransform: "uppercase", letterSpacing: "0.06em" }}>AI Assistant</span>
        </div>
        <p style={{ fontSize: "14px", fontWeight: 700, color: "#fff", marginBottom: "6px", lineHeight: 1.4 }}>
          Let AI plan your next trip
        </p>
        <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.55)", marginBottom: "1rem", lineHeight: 1.6 }}>
          Describe your dream destination and get a full itinerary in seconds.
        </p>
        <Link href="/trips/new">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
            style={{ background: "rgba(99,102,241,0.25)", color: "#C7D2FE", border: "1px solid rgba(99,102,241,0.25)" }}
          >
            Try AI Planner
            <ArrowRight className="w-3.5 h-3.5" />
          </motion.button>
        </Link>
      </div>
    </motion.div>
  );
}

function SkeletonDashboard() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto p-6">
      <div className="skeleton h-36 rounded-2xl" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-28 rounded-xl" />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 skeleton h-64 rounded-xl" />
        <div className="skeleton h-64 rounded-xl" />
      </div>
    </div>
  );
}

export default function DashboardRoot() {
  const { user } = useAuthStore();
  const { trips, isLoading } = useTrips({ sort: "upcoming" });

  if (isLoading) return <SkeletonDashboard />;

  const upcomingTrips = trips.filter(t => t.status === "PLANNING" || t.status === "ONGOING");
  const completedTrips = trips.filter(t => t.status === "COMPLETED");

  const stats = {
    totalTrips: trips.length,
    totalStops: completedTrips.reduce((acc, trip) => acc + ((trip as any)._count?.stops || 0), 0),
    upcomingDays: upcomingTrips.reduce((acc, trip) => {
      const diff = Math.abs(new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime());
      return acc + Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
    }, 0),
    totalSpent: 0,
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <WelcomeBanner userName={user?.username} upcomingCount={upcomingTrips.length} />
      <TripStatsRow stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <UpcomingTrips trips={upcomingTrips} />

          {/* Recent completed trips */}
          {completedTrips.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="card-premium overflow-hidden"
              style={{ borderRadius: "var(--radius-lg)" }}
            >
              <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
                <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "16px", fontWeight: 700, color: "var(--slate)" }}>
                  Past Adventures
                </h3>
                <Link href="/trips?filter=completed">
                  <span className="text-xs font-semibold flex items-center gap-1" style={{ color: "var(--teal)" }}>
                    View all <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </Link>
              </div>
              {completedTrips.slice(0, 3).map((trip, i) => (
                <Link key={trip.id} href={`/trips/${trip.id}`}
                  className="flex items-center gap-3 px-5 py-3.5 transition-all duration-150 group block"
                  style={{ borderBottom: i < 2 ? "1px solid var(--border)" : undefined }}
                  onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-secondary)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "")}
                >
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(16,185,129,0.1)" }}>
                    <Plane className="w-4 h-4" style={{ color: "#10B981" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: "var(--slate)" }}>{trip.title}</p>
                    <p className="text-xs" style={{ color: "var(--slate-muted)" }}>
                      {new Date(trip.startDate).getFullYear()} · {(trip as any)._count?.stops ?? 0} stops
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: "rgba(16,185,129,0.1)", color: "#10B981" }}>Done</span>
                </Link>
              ))}
            </motion.div>
          )}
        </div>

        {/* Right sidebar */}
        <div className="space-y-5">
          <QuickActions />
          <AIPlannerTeaser />
        </div>
      </div>
    </div>
  );
}
