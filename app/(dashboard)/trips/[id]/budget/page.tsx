"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BudgetDashboard } from "@/components/budget/BudgetDashboard";
import { toast } from "sonner";

export default function BudgetPage() {
  const params = useParams();
  const router = useRouter();
  const tripId = params.id as string;
  
  const [trip, setTrip] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTrip = async () => {
    try {
      const res = await fetch(`/api/trips/${tripId}`);
      const result = await res.json();
      if (!res.ok) throw new Error(result.error?.message || "Failed to fetch trip");
      setTrip(result.data);
    } catch (err: any) {
      toast.error(err.message);
      router.push(`/trips/${tripId}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (tripId) fetchTrip();
  }, [tripId, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--accent)]" />
      </div>
    );
  }

  if (!trip) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Button variant="ghost" asChild className="mb-2 -ml-4 text-[var(--primary-muted)] hover:text-[var(--primary)]">
            <Link href={`/trips/${tripId}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Trip Details
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--primary)]">Budget & Expenses</h1>
          <p className="text-[var(--primary-muted)]">Track your spending for {trip.title}</p>
        </div>
      </div>

      <BudgetDashboard tripId={tripId} />
    </div>
  );
}
