import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plane } from "lucide-react";

export function WelcomeBanner({ userName = "Traveler" }: { userName?: string }) {
  return (
    <div className="gradient-primary rounded-2xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm overflow-hidden relative">
      <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4">
        <Plane size={200} />
      </div>
      
      <div className="relative z-10">
        <h2 className="text-3xl font-bold mb-2">Welcome back, {userName}!</h2>
        <p className="text-white/80 max-w-lg text-lg">
          Ready for your next adventure? You have 2 upcoming trips. Let's make sure everything is planned perfectly.
        </p>
      </div>
      
      <div className="relative z-10 flex gap-4 w-full md:w-auto">
        <Button asChild className="btn-accent whitespace-nowrap w-full md:w-auto">
          <Link href="/trips/new">Plan a New Trip</Link>
        </Button>
      </div>
    </div>
  );
}
