"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export function BudgetLineChart({ data }: { data: any[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-[var(--primary-muted)] text-sm">
        No daily spending data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
        <XAxis 
          dataKey="date" 
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
          contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          formatter={(value: any) => [`$${value.toFixed(2)}`, 'Daily Spent']}
          labelStyle={{ color: '#111827', fontWeight: 'bold', marginBottom: '4px' }}
        />
        <Line 
          type="monotone" 
          dataKey="amount" 
          stroke="var(--accent)" 
          strokeWidth={3}
          dot={{ r: 4, fill: 'var(--accent)', strokeWidth: 2, stroke: '#fff' }}
          activeDot={{ r: 6, strokeWidth: 0 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
