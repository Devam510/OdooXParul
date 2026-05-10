"use client";

import { formatCurrency } from "@/lib/utils";

export function BudgetOverview({ totalSpent, budgetLimit }: { totalSpent: number; budgetLimit: number }) {
  // If no budget limit is set, default to a visually appealing 100% or just show spent
  const limit = budgetLimit || Math.max(totalSpent * 1.5, 1000);
  const percentage = Math.min((totalSpent / limit) * 100, 100);
  
  const getProgressColor = () => {
    if (percentage < 60) return "bg-green-500";
    if (percentage < 85) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm">
      <div className="flex justify-between items-end mb-4">
        <div>
          <p className="text-[var(--primary-muted)] text-sm font-medium mb-1">Total Spent</p>
          <h3 className="text-3xl font-bold text-[var(--primary)]">{formatCurrency(totalSpent)}</h3>
        </div>
        <div className="text-right">
          <p className="text-[var(--primary-muted)] text-sm font-medium mb-1">Budget Limit</p>
          <p className="text-lg font-semibold text-gray-700">{budgetLimit ? formatCurrency(budgetLimit) : "Not set"}</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs text-[var(--primary-muted)] font-medium">
          <span>{percentage.toFixed(1)}% used</span>
          {budgetLimit > 0 && <span>{formatCurrency(Math.max(budgetLimit - totalSpent, 0))} remaining</span>}
        </div>
        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${getProgressColor()}`} 
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}
