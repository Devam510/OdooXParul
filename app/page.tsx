import LandingNavbar from "@/components/landing/LandingNavbar";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import CTASection from "@/components/landing/CTASection";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-black font-sans selection:bg-teal-500/30">
      <LandingNavbar />
      
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <CTASection />
      </main>

      {/* Simple Footer */}
      <footer className="bg-white dark:bg-black py-10 border-t border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
          <p>© {new Date().getFullYear()} Traveloop. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
