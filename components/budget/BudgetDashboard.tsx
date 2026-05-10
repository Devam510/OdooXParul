"use client";

import { useEffect, useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExpenseList } from "./ExpenseList";
import { CategoryChart } from "./CategoryChart";
import { BudgetOverview } from "./BudgetOverview";
import { BudgetBarChart } from "./BudgetBarChart";
import { BudgetLineChart } from "./BudgetLineChart";
import { BudgetAlert } from "./BudgetAlert";
import { CostSuggestions } from "./CostSuggestions";
import { AddExpenseModal } from "./AddExpenseModal";
import { AIBudgetTips } from "@/components/ai/AIBudgetTips";
import { toast } from "sonner";

export function BudgetDashboard({ tripId }: { tripId: string }) {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [stops, setStops] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const fetchExpenses = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/trips/${tripId}/expenses`);
      const result = await res.json();
      if (!res.ok) throw new Error(result.error?.message || "Failed to fetch expenses");
      setExpenses(result.data.expenses || result.data); // Handle both old and new API formats
      if (result.data.stops) setStops(result.data.stops);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [tripId]);

  const totalSpent = expenses.reduce((acc, exp) => acc + exp.amount, 0);
  // Dummy budget limit if not in DB. Assuming a limit for demo purposes.
  const budgetLimit = 5000; 
  
  // Calculate category breakdown
  const categoryData = expenses.reduce((acc: any, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {});
  
  const pieChartData = Object.entries(categoryData).map(([name, value]) => ({
    name,
    value,
  })).sort((a: any, b: any) => b.value - a.value);

  // Calculate city-wise cost breakdown
  const cityCostMap: Record<string, number> = {};
  stops.forEach((stop: any) => {
    if (stop.city) cityCostMap[stop.city.name] = 0;
  });
  expenses.forEach((exp: any) => {
    if (exp.tripStopId) {
      const stop = stops.find((s: any) => s.id === exp.tripStopId);
      if (stop && stop.city) {
        cityCostMap[stop.city.name] = (cityCostMap[stop.city.name] || 0) + exp.amount;
      }
    } else {
      cityCostMap["General"] = (cityCostMap["General"] || 0) + exp.amount;
    }
  });

  const barChartData = Object.entries(cityCostMap)
    .filter(([_, value]) => value > 0)
    .map(([name, amount]) => ({ name, amount }))
    .sort((a, b) => b.amount - a.amount);

  // Calculate daily spending trend
  const dailyCostMap: Record<string, number> = {};
  expenses.forEach((exp: any) => {
    const dateStr = new Date(exp.date).toISOString().split('T')[0];
    dailyCostMap[dateStr] = (dailyCostMap[dateStr] || 0) + exp.amount;
  });

  const lineChartData = Object.entries(dailyCostMap)
    .map(([date, amount]) => ({ date, amount }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight text-[var(--primary)]">Budget & Expenses</h2>
        <Button onClick={() => setIsAddModalOpen(true)} className="btn-accent">
          <Plus className="mr-2 h-4 w-4" />
          Add Expense
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-[var(--accent)]" />
        </div>
      ) : (
        <div className="space-y-6">
          <BudgetAlert totalSpent={totalSpent} budgetLimit={budgetLimit} />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <BudgetOverview totalSpent={totalSpent} budgetLimit={budgetLimit} />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-5 rounded-xl border shadow-sm h-[300px] flex flex-col">
                  <h3 className="font-semibold text-[var(--primary)] mb-4">City Comparison</h3>
                  <div className="flex-1 min-h-0">
                    <BudgetBarChart data={barChartData} />
                  </div>
                </div>
                <div className="bg-white p-5 rounded-xl border shadow-sm h-[300px] flex flex-col">
                  <h3 className="font-semibold text-[var(--primary)] mb-4">Daily Trend</h3>
                  <div className="flex-1 min-h-0">
                    <BudgetLineChart data={lineChartData} />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-xl border shadow-sm">
                <h3 className="font-semibold text-[var(--primary)] mb-4">Category Breakdown</h3>
                <div className="h-[220px]">
                  <CategoryChart data={pieChartData} />
                </div>
              </div>
              
              <AIBudgetTips 
                tripTitle="Your Trip" 
                destinations={[]} 
                currentExpenses={expenses} 
              />
            </div>
          </div>

          <div className="bg-white rounded-xl border shadow-sm flex flex-col max-h-[600px]">
            <div className="p-5 border-b">
              <h3 className="font-semibold text-[var(--primary)] text-lg">Expense List</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              <ExpenseList expenses={expenses} tripId={tripId} onRefresh={fetchExpenses} />
            </div>
          </div>
        </div>
      )}

      <AddExpenseModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        tripId={tripId} 
        onSuccess={fetchExpenses} 
      />
    </div>
  );
}
