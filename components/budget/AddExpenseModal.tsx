"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EXPENSE_CATEGORIES } from "@/lib/constants";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export function AddExpenseModal({ isOpen, onClose, tripId, onSuccess }: any) {
  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0]);
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount))) {
      toast.error("Please enter a valid amount");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`/api/trips/${tripId}/expenses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parseFloat(amount),
          currency,
          category,
          description: description || undefined,
          date: new Date(date).toISOString(),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error?.message || "Failed to add expense");
      }

      toast.success("Expense added");
      onSuccess();
      onClose();
      // reset
      setAmount("");
      setDescription("");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Expense</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 space-y-2">
              <Label>Amount</Label>
              <Input 
                type="number" 
                step="0.01"
                placeholder="0.00" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Currency</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                  <SelectItem value="JPY">JPY</SelectItem>
                  <SelectItem value="INR">INR</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {EXPENSE_CATEGORIES.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Input 
              placeholder="e.g. Dinner at Luigi's" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Date</Label>
            <Input 
              type="date" 
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" className="btn-accent" disabled={isLoading || !amount}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Expense
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
