"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { ArrowRight, Sparkles, Globe, Users, Zap } from "lucide-react";

function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animId: number;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.5,
      dx: (Math.random() - 0.5) * 0.3,
      dy: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.4 + 0.1,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.dx; p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(20,184,166,${p.opacity})`;
        ctx.fill();
      });
      // Draw connecting lines
      particles.forEach((a, i) => {
        particles.slice(i + 1).forEach(b => {
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(20,184,166,${0.08 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function HeroSection() {
  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden gradient-hero">
      <ParticleCanvas />

      {/* Ambient orbs */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(20,184,166,0.08) 0%, transparent 70%)", filter: "blur(40px)" }} />
      <div className="absolute bottom-1/4 left-1/4 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)", filter: "blur(40px)" }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-24 w-full">
        <div className="max-w-4xl">
          <motion.div variants={stagger} initial="hidden" animate="show">

            {/* Badge */}
            <motion.div variants={fadeUp} className="inline-flex mb-8">
              <span className="badge badge-teal" style={{ padding: "6px 16px", fontSize: "12px", gap: "6px" }}>
                <Sparkles className="w-3.5 h-3.5" />
                AI-Powered Travel Planning · 2026
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1 variants={fadeUp}
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(2.8rem, 7vw, 5.5rem)",
                fontWeight: 800,
                lineHeight: 1.05,
                letterSpacing: "-0.03em",
                color: "var(--slate)",
                marginBottom: "1.5rem",
              }}
            >
              Plan Smarter.<br />
              <span className="gradient-text">Travel Better.</span>
            </motion.h1>

            {/* Subtext */}
            <motion.p variants={fadeUp}
              style={{
                fontSize: "clamp(1rem, 2vw, 1.25rem)",
                color: "var(--slate-muted)",
                lineHeight: 1.7,
                maxWidth: "600px",
                marginBottom: "2.5rem",
              }}
            >
              Your intelligent travel companion. Organize itineraries, track shared expenses,
              manage packing lists, and unlock AI-powered destination insights — all in one beautifully crafted workspace.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div variants={fadeUp} className="flex flex-wrap gap-4 mb-16">
              <Link href="/signup">
                <motion.button
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="btn-primary flex items-center gap-2.5 group"
                  style={{ padding: "0.85rem 2rem", fontSize: "15px", borderRadius: "999px" }}
                >
                  Start for Free
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </motion.button>
              </Link>
              <Link href="/explore/cities">
                <motion.button
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-ghost flex items-center gap-2.5"
                  style={{ padding: "0.85rem 2rem", fontSize: "15px", borderRadius: "999px" }}
                >
                  <Globe className="w-4 h-4" />
                  Explore Destinations
                </motion.button>
              </Link>
            </motion.div>

            {/* Social proof */}
            <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-6">
              {[
                { icon: Users, label: "12,000+ travelers" },
                { icon: Globe, label: "180+ destinations" },
                { icon: Zap, label: "AI-assisted planning" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ background: "var(--teal-glow)" }}>
                    <Icon className="w-4 h-4" style={{ color: "var(--teal)" }} />
                  </div>
                  <span style={{ fontSize: "13px", fontWeight: 500, color: "var(--slate-muted)" }}>{label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Floating UI preview */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
          className="absolute right-0 top-1/2 -translate-y-1/2 hidden xl:block"
          style={{ width: "440px" }}
        >
          <div className="glass-strong rounded-2xl p-6 animate-float"
            style={{ boxShadow: "var(--shadow-xl)", border: "1px solid rgba(255,255,255,0.5)" }}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, var(--teal), var(--teal-dark))" }}>
                <Globe className="w-5 h-5 text-white" />
              </div>
              <div>
                <p style={{ fontSize: "14px", fontWeight: 700, color: "var(--slate)" }}>Bali Adventure 🌴</p>
                <p style={{ fontSize: "12px", color: "var(--slate-muted)" }}>Jun 14 – Jun 22, 2026</p>
              </div>
              <span className="badge badge-teal ml-auto">Active</span>
            </div>
            <div className="space-y-3">
              {[
                { day: "Day 1", activity: "Arrive · Seminyak Beach", done: true },
                { day: "Day 2", activity: "Ubud Monkey Forest · Rice Terraces", done: true },
                { day: "Day 3", activity: "Mount Batur Sunrise Hike", done: false },
              ].map(item => (
                <div key={item.day} className="flex items-center gap-3 p-3 rounded-xl"
                  style={{ background: item.done ? "var(--teal-glow)" : "var(--bg-secondary)" }}>
                  <div className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: item.done ? "var(--teal)" : "var(--slate-subtle)" }} />
                  <div className="min-w-0">
                    <p style={{ fontSize: "11px", fontWeight: 600, color: "var(--teal)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{item.day}</p>
                    <p style={{ fontSize: "13px", color: "var(--slate)", fontWeight: 500 }} className="truncate">{item.activity}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4" style={{ borderTop: "1px solid var(--border)" }}>
              <div className="flex items-center justify-between mb-2">
                <span style={{ fontSize: "12px", color: "var(--slate-muted)" }}>Budget Used</span>
                <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--teal)" }}>$840 / $2,000</span>
              </div>
              <div className="h-1.5 rounded-full" style={{ background: "var(--bg-secondary)" }}>
                <div className="h-full rounded-full" style={{ width: "42%", background: "linear-gradient(90deg, var(--teal), var(--teal-dark))" }} />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

