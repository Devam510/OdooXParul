"use client";

import { format } from "date-fns";
import { MapPin, Clock, Hotel, Plane, Navigation, Activity as ActivityIcon } from "lucide-react";
import Image from "next/image";

export function PublicTimeline({ stops }: { stops: any[] }) {
  if (!stops || stops.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border p-12 text-center text-[var(--primary-muted)]">
        No destinations planned for this trip yet.
      </div>
    );
  }

  const getTransportIcon = (type: string) => {
    switch (type) {
      case "FLIGHT": return <Plane className="h-4 w-4" />;
      case "TRAIN": return <Navigation className="h-4 w-4" />; // Replace with Train icon if available
      default: return <Navigation className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-8">
      {stops.map((stop, index) => (
        <div key={index} className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="p-6 border-b flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="flex items-center justify-center h-6 w-6 rounded-full bg-[var(--accent)] text-white text-xs font-bold">
                  {index + 1}
                </span>
                <h3 className="text-2xl font-bold text-[var(--primary)]">{stop.city?.name}</h3>
                <span className="text-sm font-medium text-[var(--primary-muted)] ml-2">
                  {stop.city?.country}
                </span>
              </div>
              <p className="text-sm text-[var(--primary-muted)] mt-2">
                {stop.arrivalDate && format(new Date(stop.arrivalDate), "MMM d, yyyy")} 
                {stop.departureDate && ` — ${format(new Date(stop.departureDate), "MMM d, yyyy")}`}
              </p>
            </div>

            <div className="flex flex-col gap-2 text-sm text-[var(--primary-muted)]">
              {stop.hotelName && (
                <div className="flex items-center bg-gray-50 px-3 py-1.5 rounded-md">
                  <Hotel className="h-4 w-4 mr-2 text-blue-500" />
                  {stop.hotelName}
                </div>
              )}
              {stop.transportType && stop.transportType !== "NONE" && (
                <div className="flex items-center bg-gray-50 px-3 py-1.5 rounded-md">
                  <span className="mr-2 text-indigo-500">{getTransportIcon(stop.transportType)}</span>
                  Arriving via {stop.transportType.charAt(0) + stop.transportType.slice(1).toLowerCase()}
                </div>
              )}
            </div>
          </div>

          {stop.activities && stop.activities.length > 0 ? (
            <div className="p-6">
              <h4 className="font-semibold text-[var(--primary)] mb-4 flex items-center">
                <ActivityIcon className="mr-2 h-4 w-4 text-green-500" />
                Planned Activities
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {stop.activities.map((activity: any, actIndex: number) => (
                  <div key={actIndex} className="flex border rounded-lg overflow-hidden group hover:border-[var(--accent)] transition-colors">
                    {activity.image && (
                      <div className="relative w-24 h-full hidden sm:block">
                        <Image src={activity.image} alt={activity.name} fill className="object-cover" />
                      </div>
                    )}
                    <div className="p-3 flex-1 flex flex-col justify-center">
                      <h5 className="font-semibold text-sm line-clamp-1">{activity.name}</h5>
                      <div className="flex items-center gap-3 mt-1 text-xs text-[var(--primary-muted)]">
                        {activity.durationMins && (
                          <span className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {Math.floor(activity.durationMins / 60)}h {activity.durationMins % 60}m
                          </span>
                        )}
                        <span className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {activity.category}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-6 text-sm text-[var(--primary-muted)] italic">
              No specific activities planned for this stop.
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
