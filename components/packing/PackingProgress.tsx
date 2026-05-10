"use client";

import { Progress } from "@/components/ui/progress";

export function PackingProgress({ items }: { items: any[] }) {
  const total = items.length;
  const packed = items.filter((i: any) => i.isPacked).length;
  const percentage = total === 0 ? 0 : Math.round((packed / total) * 100);

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="font-medium text-[var(--primary)]">Packing Progress</span>
        <span className="text-[var(--primary-muted)]">{packed} of {total} items ({percentage}%)</span>
      </div>
      <Progress value={percentage} className="h-2 bg-[var(--background-secondary)]">
        <div className="h-full bg-[var(--accent)] transition-all" style={{ width: `${percentage}%` }} />
      </Progress>
    </div>
  );
}
