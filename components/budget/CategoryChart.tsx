"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const COLORS = ['#14B8A6', '#F59E0B', '#3B82F6', '#8B5CF6', '#EF4444', '#10B981', '#6366F1', '#EC4899'];

export function CategoryChart({ data }: { data: any[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-[var(--primary-muted)] text-sm">
        No expenses to display
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="45%"
          innerRadius={60}
          outerRadius={80}
          paddingAngle={5}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value: number) => `$${value.toFixed(2)}`}
          contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
        />
        <Legend verticalAlign="bottom" height={36} iconType="circle" />
      </PieChart>
    </ResponsiveContainer>
  );
}
