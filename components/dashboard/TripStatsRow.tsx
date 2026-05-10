import { MapPin, CalendarDays, DollarSign, Globe } from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";

interface TripStatsRowProps {
  stats?: {
    totalTrips: number;
    totalStops: number;
    upcomingDays: number;
    totalSpent: number;
  };
}

export function TripStatsRow({ stats = { totalTrips: 0, totalStops: 0, upcomingDays: 0, totalSpent: 0 } }: TripStatsRowProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard 
        label="Total Trips" 
        value={stats.totalTrips.toString()} 
        icon={MapPin} 
      />
      <StatCard 
        label="Places Visited" 
        value={stats.totalStops.toString()} 
        icon={Globe} 
      />
      <StatCard 
        label="Upcoming Travel" 
        value={`${stats.upcomingDays} days`} 
        icon={CalendarDays} 
      />
      <StatCard 
        label="Total Spent" 
        value={`$${stats.totalSpent}`} 
        icon={DollarSign} 
      />
    </div>
  );
}
