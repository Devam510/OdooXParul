"use client";
import { motion } from "framer-motion";
import { MapPin, CalendarDays, DollarSign, Globe, TrendingUp } from "lucide-react";

interface StatsProps {
  stats?: {
    totalTrips: number;
    totalStops: number;
    upcomingDays: number;
    totalSpent: number;
  };
}

const CARD_CONFIG = [
  {
    key: "totalTrips" as const,
    label: "Total Trips",
    icon: MapPin,
    color: "#14B8A6",
    suffix: "",
    prefix: "",
    trend: "+2 this month",
  },
  {
    key: "totalStops" as const,
    label: "Places Visited",
    icon: Globe,
    color: "#6366F1",
    suffix: "",
    prefix: "",
    trend: "Across 8 countries",
  },
  {
    key: "upcomingDays" as const,
    label: "Upcoming Travel",
    icon: CalendarDays,
    color: "#F59E0B",
    suffix: " days",
    prefix: "",
    trend: "In next 90 days",
  },
  {
    key: "totalSpent" as const,
    label: "Total Spent",
    icon: DollarSign,
    color: "#10B981",
    suffix: "",
    prefix: "$",
    trend: "Across all trips",
  },
];

export function TripStatsRow({
  stats = { totalTrips: 0, totalStops: 0, upcomingDays: 0, totalSpent: 0 },
}: StatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {CARD_CONFIG.map((card, i) => {
        const Icon = card.icon;
        const value = stats[card.key];
        return (
          <motion.div
            key={card.key}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, duration: 0.45 }}
            whileHover={{ y: -3 }}
            className="card-premium p-5 cursor-default"
            style={{ borderRadius: "var(--radius-lg)" }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${card.color}18` }}>
                <Icon className="w-5 h-5" style={{ color: card.color }} />
              </div>
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full" style={{ background: `${card.color}12` }}>
                <TrendingUp className="w-3 h-3" style={{ color: card.color }} />
                <span style={{ fontSize: "10px", fontWeight: 600, color: card.color }}>↑</span>
              </div>
            </div>

            <p style={{ fontFamily: "var(--font-heading)", fontSize: "26px", fontWeight: 800, color: "var(--slate)", letterSpacing: "-0.03em", lineHeight: 1 }}>
              {card.prefix}{value.toLocaleString()}{card.suffix}
            </p>
            <p style={{ fontSize: "12px", fontWeight: 600, color: "var(--slate-muted)", marginTop: "4px" }}>{card.label}</p>
            <p style={{ fontSize: "11px", color: "var(--slate-subtle)", marginTop: "6px" }}>{card.trend}</p>
          </motion.div>
        );
      })}
    </div>
  );
}
