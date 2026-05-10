"use client";

import { Lightbulb } from "lucide-react";
import { EXPENSE_CATEGORIES } from "@/lib/constants";

export function CostSuggestions({ expenses, totalSpent }: { expenses: any[], totalSpent: number }) {
  if (!expenses || expenses.length === 0 || totalSpent === 0) return null;

  // Calculate category totals
  const categoryTotals = expenses.reduce((acc: any, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {});

  const suggestions: string[] = [];

  // Generate rule-based suggestions
  if ((categoryTotals["Food"] || 0) / totalSpent > 0.4) {
    suggestions.push("Food is taking up over 40% of your budget. Consider trying local street food or cooking some meals.");
  }

  if ((categoryTotals["Hotel"] || 0) / totalSpent > 0.5) {
    suggestions.push("Accommodation is over 50% of your budget. Look for cheaper hostels or consider booking further in advance next time.");
  }

  if ((categoryTotals["Transport"] || 0) / totalSpent > 0.3) {
    suggestions.push("Transportation costs are high. Explore public transit options or walking instead of taxis/rideshares.");
  }

  if (suggestions.length === 0) {
    suggestions.push("Your spending seems well-balanced across categories. Keep it up!");
  }

  return (
    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
      <div className="flex items-center gap-2 text-blue-800 font-semibold mb-3">
        <Lightbulb className="h-5 w-5" />
        Budget Insights
      </div>
      <ul className="space-y-2 text-sm text-blue-900">
        {suggestions.map((suggestion, index) => (
          <li key={index} className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" />
            <span>{suggestion}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
