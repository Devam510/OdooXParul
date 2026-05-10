import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: { default: "Traveloop", template: "%s | Traveloop" },
  description: "Personalized travel planning made easy. Plan multi-city trips, build itineraries, manage budgets, and share your adventures.",
  keywords: ["travel", "itinerary", "trip planning", "budget", "travel planner"],
  openGraph: {
    type: "website",
    title: "Traveloop",
    description: "Personalized travel planning made easy.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {children}
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
