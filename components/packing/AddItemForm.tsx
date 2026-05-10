"use client";

import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PACKING_CATEGORIES } from "@/lib/constants";
import { toast } from "sonner";

export function AddItemForm({ tripId, onSuccess }: { tripId: string, onSuccess: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState(PACKING_CATEGORIES[0]);
  const [quantity, setQuantity] = useState("1");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);
    try {
      const res = await fetch(`/api/trips/${tripId}/packing`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          category,
          quantity: parseInt(quantity) || 1,
        }),
      });

      if (!res.ok) throw new Error("Failed to add item");
      
      onSuccess();
      setName("");
      setQuantity("1");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-end flex-wrap sm:flex-nowrap">
      <div className="flex-1 min-w-[200px]">
        <Input 
          placeholder="Item name (e.g. Passport)" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isLoading}
        />
      </div>
      <div className="w-full sm:w-[150px]">
        <Select value={category} onValueChange={setCategory} disabled={isLoading}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PACKING_CATEGORIES.map(cat => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="w-20">
        <Input 
          type="number" 
          min="1" 
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          disabled={isLoading}
        />
      </div>
      <Button type="submit" className="btn-accent shrink-0" disabled={isLoading || !name.trim()}>
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4 mr-1" />}
        Add
      </Button>
    </form>
  );
}
