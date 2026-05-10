"use client";

import { Star } from "lucide-react";

export function TopCitiesTable({ cities }: { cities: any[] }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      <div className="p-5 border-b bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-900">Top Popular Cities</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3">Rank</th>
              <th className="px-6 py-3">City Name</th>
              <th className="px-6 py-3">Popularity Score</th>
            </tr>
          </thead>
          <tbody>
            {cities?.map((city, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">#{index + 1}</td>
                <td className="px-6 py-4">{city.name}</td>
                <td className="px-6 py-4 flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 mr-1 fill-current" />
                  {city.popularity}
                </td>
              </tr>
            ))}
            {!cities?.length && (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-gray-500">No data available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
