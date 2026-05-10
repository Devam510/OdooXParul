"use client";

import Image from "next/image";
import Link from "next/link";
import { format, differenceInDays, isPast, isToday } from "date-fns";
import { TripStatusBadge } from "./TripStatusBadge";
import { motion } from "framer-motion";
import { MoreVertical, Calendar, MapPin, Copy, Edit, Trash2, Archive, Plane, ArrowRight } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TripCardProps {
  trip: any;
  onDuplicate?: (id: string) => void;
  onArchive?: (id: string) => void;
  onDelete?: (id: string) => void;
  onEdit?: (trip: any) => void;
}

const COVER_GRADIENTS = [
  "linear-gradient(135deg, #0F2027, #203A43, #2C5364)",
  "linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)",
  "linear-gradient(135deg, #134E4A, #0F2027, #1a1a2e)",
  "linear-gradient(135deg, #2d1b69, #11998e, #38ef7d)",
  "linear-gradient(135deg, #0F172A, #1E3A5F, #134E4A)",
];

function getGradient(id: string) {
  const hash = id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return COVER_GRADIENTS[hash % COVER_GRADIENTS.length];
}

export function TripCard({ trip, onDuplicate, onArchive, onDelete, onEdit }: TripCardProps) {
  const duration = differenceInDays(new Date(trip.endDate), new Date(trip.startDate)) + 1;
  const daysUntil = differenceInDays(new Date(trip.startDate), new Date());
  const isStarted = isPast(new Date(trip.startDate)) || isToday(new Date(trip.startDate));

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="card-premium overflow-hidden flex flex-col group"
      style={{ borderRadius: "var(--radius-lg)", height: "100%" }}
    >
      {/* Cover image / gradient */}
      <Link href={`/trips/${trip.id}`} className="relative h-44 w-full block overflow-hidden flex-shrink-0">
        {trip.coverImage ? (
          <Image
            src={trip.coverImage}
            alt={trip.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center relative overflow-hidden"
            style={{ background: getGradient(trip.id) }}>
            {/* Animated dot grid */}
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }} />
            <span style={{ fontSize: "48px", fontWeight: 900, color: "rgba(255,255,255,0.12)", fontFamily: "var(--font-heading)", letterSpacing: "-0.04em", textTransform: "uppercase" }}>
              {trip.title.charAt(0)}
            </span>
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)" }} />

        {/* Status badge */}
        <div className="absolute top-3.5 left-3.5 z-10">
          <TripStatusBadge status={trip.status} />
        </div>

        {/* Menu */}
        <div className="absolute top-3.5 right-3.5 z-10">
          <DropdownMenu>
            <DropdownMenuTrigger className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-150"
              style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.2)" }}
              onClick={e => e.stopPropagation()}
            >
              <MoreVertical className="w-4 h-4 text-white" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" onClick={e => e.stopPropagation()} className="rounded-xl" style={{ border: "1px solid var(--border)", boxShadow: "var(--shadow-lg)" }}>
              <DropdownMenuItem onClick={() => onEdit?.(trip)} className="rounded-lg cursor-pointer">
                <Edit className="mr-2 w-4 h-4" /> Edit Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDuplicate?.(trip.id)} className="rounded-lg cursor-pointer">
                <Copy className="mr-2 w-4 h-4" /> Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onArchive?.(trip.id)} className="rounded-lg cursor-pointer">
                <Archive className="mr-2 w-4 h-4" />
                {trip.status === "ARCHIVED" ? "Unarchive" : "Archive"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onDelete?.(trip.id)} className="rounded-lg cursor-pointer text-red-500 focus:text-red-500 focus:bg-red-50">
                <Trash2 className="mr-2 w-4 h-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Countdown pill on image */}
        {daysUntil > 0 && (
          <div className="absolute bottom-3 right-3 z-10 px-2.5 py-1 rounded-full text-xs font-bold"
            style={{ background: "rgba(20,184,166,0.9)", color: "#fff", backdropFilter: "blur(8px)" }}>
            {daysUntil}d away
          </div>
        )}
        {isStarted && trip.status === "ONGOING" && (
          <div className="absolute bottom-3 right-3 z-10 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5"
            style={{ background: "rgba(20,184,166,0.9)", color: "#fff" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            Live
          </div>
        )}
      </Link>

      {/* Body */}
      <div className="flex-1 p-4 flex flex-col gap-3">
        <Link href={`/trips/${trip.id}`}>
          <h3 className="font-bold text-base line-clamp-1 transition-colors duration-150 group-hover:text-[var(--teal)]"
            style={{ fontFamily: "var(--font-heading)", color: "var(--slate)", letterSpacing: "-0.02em" }}>
            {trip.title}
          </h3>
        </Link>

        <div className="flex items-center gap-3 text-xs" style={{ color: "var(--slate-muted)" }}>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            {format(new Date(trip.startDate), "MMM d, yyyy")}
          </span>
          <span style={{ color: "var(--border)" }}>·</span>
          <span className="flex items-center gap-1.5">
            <Plane className="w-3.5 h-3.5" />
            {duration} days
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs" style={{ color: "var(--slate-muted)" }}>
          <MapPin className="w-3.5 h-3.5" />
          {trip._count?.stops || trip.stops?.length || 0} stops planned
        </div>

        {/* Progress bar */}
        <div className="mt-auto pt-2" style={{ borderTop: "1px solid var(--border)" }}>
          <div className="flex items-center justify-between mb-1.5">
            <span style={{ fontSize: "11px", color: "var(--slate-subtle)", fontWeight: 500 }}>Planning progress</span>
            <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--teal)" }}>
              {Math.min(100, ((trip._count?.stops || 0) / Math.max(duration, 1)) * 100).toFixed(0)}%
            </span>
          </div>
          <div className="h-1 rounded-full" style={{ background: "var(--bg-secondary)" }}>
            <div className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${Math.min(100, ((trip._count?.stops || 0) / Math.max(duration, 1)) * 100)}%`,
                background: "linear-gradient(90deg, var(--teal), var(--teal-dark))",
              }} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
