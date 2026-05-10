"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export function TripsPerDayChart({ data }: { data: any[] }) {
  if (!data || data.length === 0) return <div className="text-center text-gray-500 py-10">No data available</div>;

  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm h-[400px] flex flex-col">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Trips Created (Last 30 Days)</h3>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12, fill: '#6b7280' }} 
              tickLine={false}
              axisLine={{ stroke: '#e5e7eb' }}
              tickFormatter={(val) => {
                const d = new Date(val);
                return `${d.getMonth() + 1}/${d.getDate()}`;
              }}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: '#6b7280' }} 
              tickLine={false}
              axisLine={false}
            />
            <Tooltip 
              cursor={{ fill: 'rgba(0,0,0,0.05)' }}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Bar dataKey="count" fill="var(--accent)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
