"use client";

import { format } from "date-fns";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/utils";

export function ExpenseList({ expenses, tripId, onRefresh }: { expenses: any[], tripId: string, onRefresh: () => void }) {
  if (expenses.length === 0) {
    return (
      <div className="text-center p-12 text-[var(--primary-muted)]">
        No expenses recorded yet.
      </div>
    );
  }

  const handleDelete = async (expId: string) => {
    if (!confirm("Are you sure you want to delete this expense?")) return;
    
    try {
      const res = await fetch(`/api/trips/${tripId}/expenses/${expId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete expense");
      toast.success("Expense deleted");
      onRefresh();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="space-y-3">
      {expenses.map((exp) => (
        <div key={exp.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-[var(--background-secondary)] transition-colors border">
          <div className="flex flex-col">
            <span className="font-medium text-[var(--primary)]">{exp.description || exp.category}</span>
            <div className="flex gap-2 text-xs text-[var(--primary-muted)] mt-1">
              <span className="bg-gray-100 px-2 py-0.5 rounded-full">{exp.category}</span>
              <span>{format(new Date(exp.date), "MMM d, yyyy")}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-bold text-[var(--primary)]">{formatCurrency(exp.amount, exp.currency)}</span>
            <Button variant="ghost" size="icon" onClick={() => handleDelete(exp.id)} className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
