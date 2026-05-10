import { format } from "date-fns";

export function ListView({ trip }: { trip: any }) {
  if (!trip.stops || trip.stops.length === 0) {
    return <div className="text-center p-12 text-[var(--primary-muted)]">No stops planned yet.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-6">
      <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-[var(--background)] text-[var(--primary-muted)] border-b">
            <tr>
              <th className="px-6 py-4 font-medium">Destination</th>
              <th className="px-6 py-4 font-medium">Dates</th>
              <th className="px-6 py-4 font-medium">Activity</th>
              <th className="px-6 py-4 font-medium">Schedule</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {trip.stops.map((stop: any) => {
              const activities = stop.activities || [];
              const rowSpan = Math.max(1, activities.length);
              
              return (
                <React.Fragment key={stop.id}>
                  {activities.length === 0 ? (
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-[var(--primary)]">{stop.city.name}</td>
                      <td className="px-6 py-4 text-[var(--primary-muted)]">
                        {stop.arrivalDate ? format(new Date(stop.arrivalDate), "MMM d") : "-"} to {stop.departureDate ? format(new Date(stop.departureDate), "MMM d") : "-"}
                      </td>
                      <td className="px-6 py-4 text-gray-400 italic">No activities</td>
                      <td className="px-6 py-4 text-gray-400">-</td>
                    </tr>
                  ) : (
                    activities.map((act: any, i: number) => (
                      <tr key={act.id} className="hover:bg-gray-50 transition-colors">
                        {i === 0 && (
                          <>
                            <td rowSpan={rowSpan} className="px-6 py-4 font-semibold text-[var(--primary)] align-top bg-white">
                              {stop.city.name}
                            </td>
                            <td rowSpan={rowSpan} className="px-6 py-4 text-[var(--primary-muted)] align-top bg-white">
                              {stop.arrivalDate ? format(new Date(stop.arrivalDate), "MMM d") : "-"} to {stop.departureDate ? format(new Date(stop.departureDate), "MMM d") : "-"}
                            </td>
                          </>
                        )}
                        <td className="px-6 py-4">
                          <span className="font-medium text-[var(--primary)] block">{act.activity.name}</span>
                          {act.activity.category && <span className="text-xs text-gray-500">{act.activity.category}</span>}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="block">{act.scheduledDate ? format(new Date(act.scheduledDate), "MMM d") : "-"}</span>
                          <span className="text-[var(--primary-muted)]">{act.scheduledTime || "Anytime"}</span>
                        </td>
                      </tr>
                    ))
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import React from "react";
