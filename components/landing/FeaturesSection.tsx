"use client";
import { motion } from "framer-motion";
import { Route, Receipt, Package, Bot, Map, Users } from "lucide-react";

const features = [
  { icon: Route, title: "Smart Itinerary Builder", desc: "Drag-and-drop your days. AI fills the gaps with local gems, optimal routing, and time-aware suggestions.", color: "#14B8A6" },
  { icon: Receipt, title: "Group Expense Splitting", desc: "Track every penny automatically. Traveloop calculates who owes what with multi-currency support.", color: "#6366F1" },
  { icon: Package, title: "Shared Packing Lists", desc: "Never forget your charger again. Smart weather-based suggestions and collaborative checklists.", color: "#F59E0B" },
  { icon: Bot, title: "AI Travel Assistant", desc: "Ask anything. Get curated day plans, local restaurant picks, and real-time travel advice.", color: "#10B981" },
  { icon: Map, title: "Interactive Map View", desc: "Visualize your full journey. See saved places, routes, and daily itineraries on a stunning map.", color: "#3B82F6" },
  { icon: Users, title: "Real-time Collaboration", desc: "Invite your crew. Vote on activities, split decisions, and plan together from anywhere in the world.", color: "#EC4899" },
];

export default function FeaturesSection() {
  return (
    <section style={{ padding: "7rem 0" }} className="gradient-mesh">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <span className="badge badge-teal mb-5" style={{ fontSize: "12px", padding: "6px 16px" }}>Everything you need</span>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--slate)", marginBottom: "1rem" }}>
            Built for how you<br />actually travel
          </h2>
          <p style={{ fontSize: "18px", color: "var(--slate-muted)", maxWidth: "520px", margin: "0 auto", lineHeight: 1.7 }}>
            Every feature is designed to remove friction so you can focus on the experience.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, i) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.55, ease: "easeOut" }}
              whileHover={{ y: -4 }}
              className="card-premium card-glow p-7 cursor-default"
              style={{ borderRadius: "var(--radius-lg)" }}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5" style={{ background: `${feat.color}18` }}>
                <feat.icon className="w-6 h-6" style={{ color: feat.color }} />
              </div>
              <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "18px", fontWeight: 700, color: "var(--slate)", marginBottom: "0.625rem", letterSpacing: "-0.02em" }}>
                {feat.title}
              </h3>
              <p style={{ fontSize: "14px", color: "var(--slate-muted)", lineHeight: 1.7 }}>{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
