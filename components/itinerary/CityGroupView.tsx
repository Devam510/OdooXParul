"use client";

import { format } from "date-fns";
import { Clock, MapPin, Calendar } from "lucide-react";

export function CityGroupView({ trip }: { trip: any }) {
  if (!trip.stops || trip.stops.length === 0) {
    return (
      <div className="text-center p-12 bg-white rounded-xl border border-dashed text-[var(--primary-muted)]">
        No destinations added to your itinerary yet.
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {trip.stops.map((stop: any, index: number) => (
        <div key={stop.id} className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <div className="bg-[var(--background-secondary)] p-4 border-b flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-[var(--primary)] flex items-center">
                <span className="bg-[var(--accent)] text-white h-6 w-6 rounded-full flex items-center justify-center text-xs mr-2">
                  {index + 1}
                </span>
                {stop.city?.name}
              </h2>
              <div className="flex items-center text-sm text-[var(--primary-muted)] mt-1 ml-8">
                <Calendar className="h-4 w-4 mr-1" />
                {stop.arrivalDate ? format(new Date(stop.arrivalDate), "MMM d, yyyy") : "TBD"}
                {stop.departureDate ? ` - ${format(new Date(stop.departureDate), "MMM d, yyyy")}` : ""}
              </div>
            </div>
            {stop.hotelName && (
              <div className="text-sm bg-white px-3 py-1.5 rounded-lg border shadow-sm">
                <span className="text-[var(--primary-muted)]">Stay:</span> <span className="font-medium text-[var(--primary)]">{stop.hotelName}</span>
              </div>
            )}
          </div>
          
          <div className="p-4">
            {!stop.activities || stop.activities.length === 0 ? (
              <p className="text-[var(--primary-muted)] text-center py-6">No activities planned for this destination yet.</p>
            ) : (
              <div className="space-y-3">
                {stop.activities.map((act: any) => (
                  <div key={act.id} className="flex gap-4 p-3 hover:bg-[var(--background)] rounded-lg transition-colors border border-transparent hover:border-gray-100">
                    <div className="min-w-[80px] text-right pt-1">
                      <div className="font-medium text-[var(--primary)]">{act.scheduledTime || "Anytime"}</div>
                      {act.scheduledDate && (
                        <div className="text-xs text-[var(--primary-muted)]">{format(new Date(act.scheduledDate), "MMM d")}</div>
                      )}
                    </div>
                    
                    <div className="w-px bg-gray-200 shrink-0 relative mt-2 mb-2">
                      <div className="absolute top-1 -left-[5px] w-2.5 h-2.5 rounded-full border-2 border-[var(--accent)] bg-white"></div>
                    </div>
                    
                    <div className="flex-1 pb-2">
                      <h4 className="font-semibold text-[var(--primary)] text-lg">{act.activity?.name}</h4>
                      <span className="text-xs font-medium uppercase tracking-wider text-[var(--accent)] mb-2 block">
                        {act.activity?.category}
                      </span>
                      
                      <div className="flex items-center text-sm text-[var(--primary-muted)] gap-4 mt-1">
                        {act.activity?.durationMinutes && (
                          <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {Math.floor(act.activity.durationMinutes / 60)}h {act.activity.durationMinutes % 60}m
                          </span>
                        )}
                        {act.activity?.address && (
                          <span className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {act.activity.address}
                          </span>
                        )}
                      </div>
                      
                      {act.notes && (
                        <p className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                          {act.notes}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
