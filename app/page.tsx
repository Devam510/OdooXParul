import LandingNavbar from "@/components/landing/LandingNavbar";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import StatsSection from "@/components/landing/StatsSection";
import CTASection from "@/components/landing/CTASection";

export const metadata = {
  title: "Traveloop — Plan Smarter. Travel Better.",
  description: "AI-powered travel planning. Organize itineraries, track budgets, manage packing lists, and get personalized recommendations.",
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen" style={{ background: "var(--bg)", fontFamily: "var(--font-body)" }}>
      <LandingNavbar />
      <main>
        <HeroSection />
        <StatsSection />
        <FeaturesSection />
        <CTASection />
      </main>
      <footer style={{ borderTop: "1px solid var(--border)", padding: "2rem 0", textAlign: "center" }}>
        <p style={{ color: "var(--slate-muted)", fontSize: "13px" }}>
          © {new Date().getFullYear()} Traveloop. Built for explorers.
        </p>
      </footer>
    </div>
  );
}

