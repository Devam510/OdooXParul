"use client";
import Link from "next/link";
import { format, differenceInDays } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Calendar, MapPin, Plane, Plus } from "lucide-react";

const STATUS_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  PLANNING: { bg: "rgba(99,102,241,0.12)", text: "#6366F1", label: "Planning" },
  ONGOING:  { bg: "rgba(20,184,166,0.12)", text: "#14B8A6", label: "Ongoing" },
  COMPLETED: { bg: "rgba(16,185,129,0.12)", text: "#10B981", label: "Completed" },
  ARCHIVED: { bg: "rgba(148,163,184,0.12)", text: "#94A3B8", label: "Archived" },
};

export function UpcomingTrips({ trips = [] }: { trips?: any[] }) {
  if (trips.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="card-premium p-10 flex flex-col items-center text-center gap-5"
        style={{ borderRadius: "var(--radius-lg)" }}
      >
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: "var(--teal-glow)" }}>
          <Plane className="w-8 h-8" style={{ color: "var(--teal)" }} />
        </div>
        <div>
          <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "18px", fontWeight: 700, color: "var(--slate)", marginBottom: "6px" }}>
            No upcoming trips
          </h3>
          <p style={{ fontSize: "14px", color: "var(--slate-muted)" }}>You don't have any trips planned yet. Start your first adventure!</p>
        </div>
        <Link href="/trips/new">
          <motion.button
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="btn-primary flex items-center gap-2"
            style={{ padding: "0.65rem 1.5rem", fontSize: "14px" }}
          >
            <Plus className="w-4 h-4" />
            Plan a Trip
          </motion.button>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="card-premium overflow-hidden"
      style={{ borderRadius: "var(--radius-lg)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
        <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "16px", fontWeight: 700, color: "var(--slate)" }}>
          Upcoming Trips
        </h3>
        <Link href="/trips">
          <motion.span
            whileHover={{ x: 2 }}
            className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
            style={{ color: "var(--teal)" }}
          >
            View All <ArrowRight className="w-3.5 h-3.5" />
          </motion.span>
        </Link>
      </div>

      {/* Trip rows */}
      <AnimatePresence>
        {trips.slice(0, 4).map((trip, i) => {
          const duration = differenceInDays(new Date(trip.endDate), new Date(trip.startDate)) + 1;
          const statusConfig = STATUS_COLORS[trip.status] ?? STATUS_COLORS.PLANNING;
          const daysUntil = differenceInDays(new Date(trip.startDate), new Date());

          return (
            <motion.div
              key={trip.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <Link href={`/trips/${trip.id}`}
                className="flex items-center gap-4 px-5 py-4 transition-all duration-150 group block"
                style={{ borderBottom: i < trips.slice(0, 4).length - 1 ? "1px solid var(--border)" : undefined }}
                onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-secondary)")}
                onMouseLeave={e => (e.currentTarget.style.background = "")}
              >
                {/* Color stripe */}
                <div className="w-1 h-10 rounded-full flex-shrink-0"
                  style={{ background: statusConfig.text }} />

                {/* Trip icon */}
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: statusConfig.bg }}>
                  <Plane className="w-5 h-5" style={{ color: statusConfig.text }} />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h4 className="font-semibold truncate text-sm" style={{ color: "var(--slate)" }}>
                      {trip.title}
                    </h4>
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold flex-shrink-0"
                      style={{ background: statusConfig.bg, color: statusConfig.text }}>
                      {statusConfig.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs" style={{ color: "var(--slate-muted)" }}>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {format(new Date(trip.startDate), "MMM d")} · {duration}d
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {trip.stops?.length ?? trip._count?.stops ?? 0} stops
                    </span>
                  </div>
                </div>

                {/* Countdown */}
                <div className="flex-shrink-0 text-right hidden sm:block">
                  {daysUntil > 0 ? (
                    <>
                      <p style={{ fontFamily: "var(--font-heading)", fontSize: "16px", fontWeight: 800, color: "var(--teal)", lineHeight: 1 }}>{daysUntil}</p>
                      <p style={{ fontSize: "10px", color: "var(--slate-subtle)", fontWeight: 500 }}>days away</p>
                    </>
                  ) : daysUntil === 0 ? (
                    <span className="px-2 py-1 rounded-lg text-xs font-bold" style={{ background: "rgba(20,184,166,0.15)", color: "var(--teal)" }}>Today!</span>
                  ) : (
                    <span style={{ fontSize: "11px", color: "var(--slate-subtle)" }}>In progress</span>
                  )}
                </div>

                <ArrowRight className="w-4 h-4 flex-shrink-0 transition-transform group-hover:translate-x-1" style={{ color: "var(--slate-subtle)" }} />
              </Link>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </motion.div>
  );
}
