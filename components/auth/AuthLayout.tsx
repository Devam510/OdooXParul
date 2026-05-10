"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { PlaneTakeoff, Globe, Sparkles, MapPin } from "lucide-react";

const FEATURES = [
  { icon: Globe, text: "180+ destinations covered" },
  { icon: MapPin, text: "Smart itinerary builder" },
  { icon: Sparkles, text: "AI-powered planning" },
];

export function AuthLayout({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="min-h-screen flex" style={{ background: "var(--bg)", fontFamily: "var(--font-body)" }}>

      {/* Left Panel — Cinematic brand side */}
      <motion.div
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex flex-col justify-between w-[46%] relative overflow-hidden p-10"
        style={{
          background: "linear-gradient(145deg, #0F172A 0%, #134E4A 60%, #0F2027 100%)",
        }}
      >
        {/* Animated background glows */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(20,184,166,0.18) 0%, transparent 70%)", filter: "blur(50px)" }} />
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)", filter: "blur(50px)" }} />

        {/* Canvas dots */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: "radial-gradient(circle, rgba(20,184,166,0.3) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }} />

        {/* Logo */}
        <Link href="/" className="relative flex items-center gap-3 group z-10">
          <motion.div
            whileHover={{ scale: 1.07, rotate: -5 }}
            transition={{ type: "spring", stiffness: 400 }}
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, var(--teal) 0%, var(--teal-dark) 100%)" }}
          >
            <PlaneTakeoff className="w-5 h-5 text-white" />
          </motion.div>
          <span style={{ fontFamily: "var(--font-heading)", fontSize: "20px", fontWeight: 700, color: "#fff", letterSpacing: "-0.02em" }}>
            Traveloop
          </span>
        </Link>

        {/* Hero copy */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="relative z-10 space-y-6"
        >
          <h2 style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(2rem, 3.5vw, 2.8rem)",
            fontWeight: 800,
            color: "#fff",
            lineHeight: 1.15,
            letterSpacing: "-0.03em",
          }}>
            Your ultimate<br />
            <span style={{ color: "var(--teal)", display: "inline-block" }}>travel companion.</span>
          </h2>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "15px", lineHeight: 1.7, maxWidth: "360px" }}>
            Plan itineraries, track shared expenses, manage packing lists, and discover hidden gems — all in one beautifully crafted workspace.
          </p>

          <div className="space-y-3">
            {FEATURES.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "rgba(20,184,166,0.15)" }}>
                  <Icon className="w-4 h-4" style={{ color: "var(--teal)" }} />
                </div>
                <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.7)", fontWeight: 500 }}>{text}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Floating card preview */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="relative z-10 p-5 rounded-2xl"
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.12)",
            backdropFilter: "blur(12px)",
          }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, var(--teal), var(--teal-dark))" }}>
              <Globe className="w-4 h-4 text-white" />
            </div>
            <div>
              <p style={{ fontSize: "13px", fontWeight: 700, color: "#fff" }}>Santorini Getaway 🏛️</p>
              <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)" }}>Sep 8 – Sep 16, 2026</p>
            </div>
            <span className="ml-auto px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: "rgba(20,184,166,0.2)", color: "var(--teal)" }}>Active</span>
          </div>
          <div className="h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.1)" }}>
            <div className="h-full rounded-full" style={{ width: "65%", background: "linear-gradient(90deg, var(--teal), #6366F1)" }} />
          </div>
          <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", marginTop: "6px" }}>Planning progress: 65%</p>
        </motion.div>
      </motion.div>

      {/* Right Panel — Form */}
      <motion.div
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-1 flex flex-col justify-center items-center p-6 md:p-10"
      >
        {/* Mobile logo */}
        <Link href="/" className="flex lg:hidden items-center gap-2.5 mb-8 self-start">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, var(--teal) 0%, var(--teal-dark) 100%)" }}>
            <PlaneTakeoff className="w-5 h-5 text-white" />
          </div>
          <span style={{ fontFamily: "var(--font-heading)", fontSize: "18px", fontWeight: 700, color: "var(--slate)" }}>Traveloop</span>
        </Link>

        <div className="w-full max-w-[420px] space-y-7">
          {/* Header */}
          <div>
            <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "28px", fontWeight: 800, color: "var(--slate)", letterSpacing: "-0.03em", marginBottom: "6px" }}>
              {title}
            </h1>
            <p style={{ fontSize: "14px", color: "var(--slate-muted)", lineHeight: 1.6 }}>{subtitle}</p>
          </div>

          {/* Form slot */}
          <div>{children}</div>

          {/* Footer */}
          <p className="text-center" style={{ fontSize: "12px", color: "var(--slate-subtle)" }}>
            By continuing, you agree to our{" "}
            <Link href="#" className="underline" style={{ color: "var(--teal)" }}>Terms</Link>
            {" "}and{" "}
            <Link href="#" className="underline" style={{ color: "var(--teal)" }}>Privacy Policy</Link>.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
