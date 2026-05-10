"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export function BudgetBarChart({ data }: { data: any[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-[var(--primary-muted)] text-sm">
        No city-wise data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
        <XAxis 
          dataKey="name" 
          tick={{ fontSize: 12, fill: '#6b7280' }} 
          tickLine={false}
          axisLine={{ stroke: '#e5e7eb' }}
        />
        <YAxis 
          tick={{ fontSize: 12, fill: '#6b7280' }} 
          tickLine={false}
          axisLine={false}
          tickFormatter={(val) => `$${val}`}
        />
        <Tooltip 
          cursor={{ fill: 'rgba(0,0,0,0.05)' }}
          contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          formatter={(value: any) => [`$${Number(value).toFixed(2)}`, 'Spent']}
        />
        <Bar 
          dataKey="amount" 
          fill="var(--accent)" 
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
