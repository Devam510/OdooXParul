"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { formatCurrency } from "@/lib/utils";

const COLORS = {
  HOTEL: "#8b5cf6",
  TRANSPORT: "#3b82f6",
  FOOD: "#f59e0b",
  ACTIVITIES: "#10b981",
  MISCELLANEOUS: "#6b7280"
};

export function PublicBudgetSummary({ summary }: { summary: any }) {
  if (!summary || summary.totalSpent === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border p-8 text-center text-[var(--primary-muted)]">
        Budget details are not available for this trip.
      </div>
    );
  }

  const data = Object.entries(summary.byCategory).map(([name, value]) => ({
    name,
    value
  })).filter((item: any) => (item.value as number) > 0);

  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      <div className="p-6 border-b bg-gray-50 flex justify-between items-center">
        <h3 className="font-semibold text-[var(--primary)] text-lg">Total Cost Overview</h3>
        <span className="text-2xl font-bold text-[var(--primary)]">{formatCurrency(summary.totalSpent)}</span>
      </div>
      
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS] || COLORS.MISCELLANEOUS} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: any) => formatCurrency(value)}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="space-y-4">
          <h4 className="font-medium text-[var(--primary)] mb-2">Cost Breakdown</h4>
          {data.sort((a: any, b: any) => b.value - a.value).map((item: any, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: COLORS[item.name as keyof typeof COLORS] || COLORS.MISCELLANEOUS }} 
                />
                <span className="text-sm font-medium text-gray-700 capitalize">{item.name.toLowerCase()}</span>
              </div>
              <span className="text-sm font-semibold">{formatCurrency(item.value)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
