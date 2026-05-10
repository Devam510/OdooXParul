"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { PlaneTakeoff, Plus, ArrowRight, Sparkles } from "lucide-react";

export function WelcomeBanner({ userName = "Traveler", upcomingCount = 0 }: { userName?: string; upcomingCount?: number }) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-2xl p-7 md:p-8"
      style={{
        background: "linear-gradient(135deg, #0F172A 0%, #134E4A 60%, #0A1628 100%)",
        boxShadow: "var(--shadow-xl)",
      }}
    >
      {/* Decorative grid */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
        backgroundImage: "radial-gradient(circle, rgba(20,184,166,0.4) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }} />

      {/* Ambient glow */}
      <div className="absolute top-0 right-0 w-80 h-80 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(20,184,166,0.15) 0%, transparent 65%)", filter: "blur(40px)" }} />
      <div className="absolute bottom-0 left-1/3 w-64 h-64 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(99,102,241,0.10) 0%, transparent 65%)", filter: "blur(40px)" }} />

      {/* Floating plane icon */}
      <div className="absolute bottom-4 right-6 opacity-8 pointer-events-none">
        <PlaneTakeoff className="w-32 h-32 text-white" style={{ opacity: 0.06 }} />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5" style={{ background: "rgba(20,184,166,0.2)", color: "var(--teal)" }}>
              <Sparkles className="w-3 h-3" />
              AI-powered workspace
            </span>
          </div>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", lineHeight: 1.2 }}>
            {greeting}, <span style={{ color: "var(--teal)" }}>{userName}!</span> ✈️
          </h2>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "14px", lineHeight: 1.6, maxWidth: "480px" }}>
            {upcomingCount > 0
              ? `You have ${upcomingCount} upcoming trip${upcomingCount > 1 ? "s" : ""}. Let's make sure everything is planned perfectly.`
              : "Ready to plan your next adventure? Create your first trip and let AI do the heavy lifting."}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link href="/trips/new">
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all"
              style={{ background: "linear-gradient(135deg, var(--teal) 0%, var(--teal-dark) 100%)", color: "#fff", boxShadow: "0 4px 16px rgba(20,184,166,0.35)" }}
            >
              <Plus className="w-4 h-4" />
              Plan New Trip
            </motion.button>
          </Link>
          <Link href="/trips">
            <motion.button
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all"
              style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.8)" }}
            >
              View All Trips
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
