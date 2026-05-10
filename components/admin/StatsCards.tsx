"use client";

import { Users, Plane, MapPin, Compass } from "lucide-react";

export function StatsCards({ stats }: { stats: any }) {
  if (!stats) return null;

  const cards = [
    { title: "Total Users", value: stats.totalUsers, icon: Users, color: "bg-blue-100 text-blue-600" },
    { title: "Total Trips", value: stats.totalTrips, icon: Plane, color: "bg-green-100 text-green-600" },
    { title: "Top Cities", value: stats.topCities?.length || 0, icon: MapPin, color: "bg-purple-100 text-purple-600" },
    { title: "Top Activities", value: stats.topActivities?.length || 0, icon: Compass, color: "bg-orange-100 text-orange-600" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, idx) => (
        <div key={idx} className="bg-white p-6 rounded-xl border shadow-sm flex items-center gap-4">
          <div className={`p-4 rounded-full ${card.color}`}>
            <card.icon className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">{card.title}</p>
            <h4 className="text-2xl font-bold text-gray-900">{card.value}</h4>
          </div>
        </div>
      ))}
    </div>
  );
}
