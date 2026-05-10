"use client";

import { PackingItem } from "./PackingItem";

export function PackingList({ items, tripId, onRefresh }: { items: any[], tripId: string, onRefresh: () => void }) {
  if (items.length === 0) {
    return (
      <div className="text-center p-12 text-[var(--primary-muted)] border-2 border-dashed rounded-lg">
        Your packing list is empty. Add items above or load a template.
      </div>
    );
  }

  // Group by category
  const grouped = items.reduce((acc: any, item) => {
    const cat = item.category || "Uncategorized";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([category, catItems]: [string, any]) => (
        <div key={category} className="space-y-2">
          <h3 className="font-semibold text-lg text-[var(--primary)] border-b pb-2">{category}</h3>
          <div className="space-y-1">
            {catItems.map((item: any) => (
              <PackingItem key={item.id} item={item} tripId={tripId} onRefresh={onRefresh} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
