"use client";

import { useAuthStore } from "@/store/authStore";
import { useTrips } from "@/hooks/useTrips";
import { WelcomeBanner } from "@/components/dashboard/WelcomeBanner";
import { TripStatsRow } from "@/components/dashboard/TripStatsRow";
import { UpcomingTrips } from "@/components/dashboard/UpcomingTrips";

export default function DashboardRoot() {
  const { user } = useAuthStore();
  const { trips, isLoading } = useTrips({ sort: "upcoming" });

  const upcomingTrips = trips.filter((t) => t.status === "PLANNING" || t.status === "ONGOING");
  const completedTrips = trips.filter((t) => t.status === "COMPLETED");

  const stats = {
    totalTrips: trips.length,
    countriesVisited: completedTrips.reduce((acc, trip) => acc + (trip._count?.stops || 0), 0), // Rough estimate for now
    upcomingDays: upcomingTrips.reduce((acc, trip) => {
      const diffTime = Math.abs(new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return acc + diffDays;
    }, 0),
    totalSpent: 0, // Implement budget later
  };

  if (isLoading) {
    return <div className="p-8 text-center text-[var(--primary-muted)]">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <WelcomeBanner userName={user?.username} />
      <TripStatsRow stats={stats} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <UpcomingTrips trips={upcomingTrips} />
          {/* We'll add RecentActivity or BudgetChart here later */}
        </div>
        <div className="space-y-6">
          {/* We'll add RecommendedCities or QuickActions here later */}
        </div>
      </div>
    </div>
  );
}
