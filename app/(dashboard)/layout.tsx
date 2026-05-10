"use client";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { MobileNav } from "@/components/layout/MobileNav";
import { AIChatbot } from "@/components/ai/AIChatbot";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--background)" }}>
      {/* Sidebar — desktop only */}
      <Sidebar />

      {/* Main area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 md:pb-6">
          {children}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <MobileNav />

      {/* Global AI Chatbot */}
      <AIChatbot />
    </div>
  );
}
