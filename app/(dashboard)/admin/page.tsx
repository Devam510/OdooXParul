"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ShieldAlert } from "lucide-react";
import { StatsCards } from "@/components/admin/StatsCards";
import { TripsPerDayChart } from "@/components/admin/TripsPerDayChart";
import { TopCitiesTable } from "@/components/admin/TopCitiesTable";
import { UsersTable } from "@/components/admin/UsersTable";
import { toast } from "sonner";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/stats");
        const data = await res.json();
        
        if (res.status === 403) {
          toast.error("You do not have permission to view this page.");
          router.push("/trips");
          return;
        }

        if (res.ok) {
          setStats(data.data);
        } else {
          toast.error(data.error?.message || "Failed to load admin stats");
        }
      } catch (e: any) {
        toast.error("An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-[var(--accent)] mb-4" />
        <p className="text-gray-500 font-medium">Loading Admin Dashboard...</p>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--primary)] flex items-center">
          <ShieldAlert className="mr-3 h-8 w-8 text-red-600" />
          Admin Dashboard
        </h1>
        <p className="text-[var(--primary-muted)] mt-1">Platform overview and user management.</p>
      </div>

      <StatsCards stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <TripsPerDayChart data={stats.tripsPerDay} />
        <TopCitiesTable cities={stats.topCities} />
      </div>

      <UsersTable />
    </div>
  );
}
