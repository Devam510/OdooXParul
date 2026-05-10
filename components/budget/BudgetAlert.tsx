"use client";

import { AlertTriangle, Info } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export function BudgetAlert({ totalSpent, budgetLimit }: { totalSpent: number; budgetLimit: number }) {
  if (!budgetLimit || budgetLimit <= 0) return null;

  const percentage = (totalSpent / budgetLimit) * 100;
  
  if (percentage < 80) return null;

  const isCritical = percentage >= 100;

  return (
    <div className={`p-4 rounded-xl border flex items-start gap-3 ${
      isCritical 
        ? "bg-red-50 border-red-200 text-red-800" 
        : "bg-yellow-50 border-yellow-200 text-yellow-800"
    }`}>
      {isCritical ? (
        <AlertTriangle className="h-5 w-5 mt-0.5 shrink-0 text-red-600" />
      ) : (
        <Info className="h-5 w-5 mt-0.5 shrink-0 text-yellow-600" />
      )}
      <div>
        <h4 className="font-semibold text-sm">
          {isCritical ? "Budget Exceeded!" : "Nearing Budget Limit"}
        </h4>
        <p className="text-sm mt-1">
          {isCritical 
            ? `You have exceeded your budget of ${formatCurrency(budgetLimit)} by ${formatCurrency(totalSpent - budgetLimit)}.` 
            : `You have spent ${Math.round(percentage)}% of your ${formatCurrency(budgetLimit)} budget. Only ${formatCurrency(budgetLimit - totalSpent)} remaining.`
          }
        </p>
      </div>
    </div>
  );
}
