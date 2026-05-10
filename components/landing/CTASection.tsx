"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

export default function CTASection() {
  return (
    <section style={{ padding: "7rem 0", position: "relative", overflow: "hidden" }}>
      {/* Background */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(135deg, var(--slate) 0%, #0F172A 100%)",
        zIndex: 0,
      }} />
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse 80% 60% at 50% 120%, rgba(20,184,166,0.20) 0%, transparent 60%)",
        zIndex: 1,
      }} />

      <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <span className="badge" style={{ background: "rgba(20,184,166,0.15)", color: "var(--teal)", marginBottom: "2rem", fontSize: "12px", padding: "6px 16px" }}>
            <Sparkles className="w-3.5 h-3.5" />
            Start free. No credit card needed.
          </span>

          <h2 style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(2.2rem, 5vw, 4rem)",
            fontWeight: 800,
            color: "#fff",
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
            marginBottom: "1.25rem",
          }}>
            Ready for your<br />next adventure?
          </h2>

          <p style={{
            fontSize: "18px",
            color: "rgba(255,255,255,0.6)",
            lineHeight: 1.7,
            maxWidth: "480px",
            margin: "0 auto 2.5rem",
          }}>
            Join thousands of travelers who use Traveloop to plan stress-free, unforgettable trips.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/signup">
              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="btn-primary flex items-center gap-2.5 group"
                style={{ padding: "0.9rem 2.25rem", fontSize: "16px" }}
              >
                Create free account
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </motion.button>
            </Link>
            <Link href="/login">
              <motion.button
                whileHover={{ scale: 1.02, y: -1 }}
                className="flex items-center gap-2.5 px-7 py-3.5 rounded-full font-medium transition-all"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "rgba(255,255,255,0.8)",
                  fontSize: "15px",
                }}
              >
                Sign in
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
