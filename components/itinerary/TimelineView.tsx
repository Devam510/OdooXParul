import { format } from "date-fns";
import { Clock, MapPin } from "lucide-react";

export function TimelineView({ trip }: { trip: any }) {
  const allActivities = trip.stops.flatMap((stop: any) => 
    (stop.activities || []).map((act: any) => ({
      ...act,
      stopCity: stop.city.name
    }))
  ).sort((a: any, b: any) => {
    const timeA = new Date(a.scheduledDate || "9999-12-31").getTime();
    const timeB = new Date(b.scheduledDate || "9999-12-31").getTime();
    return timeA - timeB;
  });

  if (allActivities.length === 0) {
    return <div className="text-center p-12 text-[var(--primary-muted)]">No activities planned yet.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="relative border-l-2 border-[var(--border-strong)] ml-4 md:ml-6 space-y-8">
        {allActivities.map((act: any, index: number) => (
          <div key={act.id} className="relative pl-8 md:pl-10">
            <div className="absolute left-[-9px] top-1 h-4 w-4 rounded-full bg-[var(--accent)] ring-4 ring-white" />
            
            <div className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2">
                <div>
                  <h4 className="font-bold text-lg text-[var(--primary)]">{act.activity.name}</h4>
                  <p className="text-sm font-medium text-[var(--accent)]">{act.stopCity}</p>
                </div>
                <div className="text-sm font-semibold text-[var(--primary-muted)] mt-2 md:mt-0 flex flex-col md:items-end">
                  {act.scheduledDate ? format(new Date(act.scheduledDate), "MMM d, yyyy") : "Unscheduled"}
                  <span className="text-[var(--primary)]">{act.scheduledTime || "Anytime"}</span>
                </div>
              </div>
              
              <div className="flex gap-4 mt-3 text-sm text-[var(--primary-muted)]">
                {act.activity.durationMinutes && (
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {act.activity.durationMinutes} min
                  </span>
                )}
                {act.activity.address && (
                  <span className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {act.activity.address}
                  </span>
                )}
              </div>
              
              {act.notes && (
                <p className="mt-3 text-sm bg-[var(--background)] p-3 rounded border-l-2 border-[var(--accent)]">
                  {act.notes}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
