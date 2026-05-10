import { MapPin, CalendarDays, DollarSign, CheckCircle } from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";

interface TripStatsRowProps {
  stats?: {
    totalTrips: number;
    countriesVisited: number;
    upcomingDays: number;
    totalSpent: number;
  };
}

export function TripStatsRow({ stats = { totalTrips: 0, countriesVisited: 0, upcomingDays: 0, totalSpent: 0 } }: TripStatsRowProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard 
        title="Total Trips" 
        value={stats.totalTrips.toString()} 
        icon={MapPin} 
        description="Planned and completed" 
      />
      <StatCard 
        title="Countries Visited" 
        value={stats.countriesVisited.toString()} 
        icon={CheckCircle} 
        description="Across all your trips" 
      />
      <StatCard 
        title="Upcoming Travel" 
        value={`${stats.upcomingDays} days`} 
        icon={CalendarDays} 
        description="In the next 6 months" 
      />
      <StatCard 
        title="Total Spent" 
        value={`$${stats.totalSpent}`} 
        icon={DollarSign} 
        description="On past trips" 
      />
    </div>
  );
}
