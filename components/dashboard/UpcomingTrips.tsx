import Link from "next/link";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, MapPin } from "lucide-react";

export function UpcomingTrips({ trips = [] }: { trips?: any[] }) {
  if (trips.length === 0) {
    return (
      <div className="card p-6 flex flex-col items-center text-center space-y-4">
        <div className="bg-[var(--primary-light)]/10 p-4 rounded-full">
          <Calendar className="h-8 w-8 text-[var(--primary-muted)]" />
        </div>
        <div>
          <h3 className="font-semibold text-[var(--primary)] text-lg">No Upcoming Trips</h3>
          <p className="text-[var(--primary-muted)] text-sm mt-1">You don't have any trips planned yet.</p>
        </div>
        <Button asChild className="btn-accent mt-2">
          <Link href="/trips/new">Plan a Trip</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="p-5 border-b flex justify-between items-center bg-white">
        <h3 className="font-bold text-lg text-[var(--primary)]">Upcoming Trips</h3>
        <Button variant="ghost" size="sm" asChild className="text-[var(--accent)] hover:text-[var(--accent-hover)]">
          <Link href="/trips">
            View All <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </div>
      <div className="divide-y bg-white">
        {trips.slice(0, 3).map((trip) => (
          <Link key={trip.id} href={`/trips/${trip.id}`} className="block p-5 hover:bg-[var(--background-secondary)] transition-colors group">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-semibold text-[var(--primary)] group-hover:text-[var(--accent)] transition-colors">
                {trip.title}
              </h4>
              <span className="badge-accent">
                {format(new Date(trip.startDate), "MMM d")}
              </span>
            </div>
            <div className="flex items-center text-sm text-[var(--primary-muted)] gap-4">
              <span className="flex items-center">
                <MapPin className="mr-1 h-3.5 w-3.5" />
                {trip.stops?.length || 0} stops
              </span>
              <span className="flex items-center">
                <Calendar className="mr-1 h-3.5 w-3.5" />
                {format(new Date(trip.startDate), "MMM d")} - {format(new Date(trip.endDate), "MMM d, yyyy")}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
