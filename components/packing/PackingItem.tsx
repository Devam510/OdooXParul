"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface PackingItemProps {
  item: any;
  tripId: string;
  onRefresh: () => void;
}

export function PackingItem({ item, tripId, onRefresh }: PackingItemProps) {
  const handleToggle = async (checked: boolean) => {
    try {
      const res = await fetch(`/api/trips/${tripId}/packing/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPacked: checked }),
      });
      if (!res.ok) throw new Error("Failed to update item");
      onRefresh();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/trips/${tripId}/packing/${item.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete item");
      onRefresh();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="flex items-center justify-between p-3 hover:bg-[var(--background)] rounded-lg group transition-colors">
      <div className="flex items-center space-x-3">
        <Checkbox 
          checked={item.isPacked} 
          onCheckedChange={handleToggle}
          className="data-[state=checked]:bg-[var(--accent)] data-[state=checked]:border-[var(--accent)]"
        />
        <span className={`${item.isPacked ? "line-through text-gray-400" : "text-[var(--primary)]"}`}>
          {item.name} {item.quantity > 1 && <span className="text-xs text-gray-500 ml-1">x{item.quantity}</span>}
        </span>
      </div>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={handleDelete} 
        className="h-8 w-8 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
