import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  className?: string;
}

export function StatCard({ label, value, icon: Icon, trend, trendUp, className }: StatCardProps) {
  return (
    <div className={cn("card p-5 card-hover", className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium" style={{ color: "var(--primary-muted)" }}>{label}</p>
          <p className="text-2xl font-bold mt-1" style={{ color: "var(--primary)" }}>{value}</p>
          {trend && (
            <p className={cn("text-xs mt-1 font-medium", trendUp ? "text-green-600" : "text-red-500")}>
              {trendUp ? "↑" : "↓"} {trend}
            </p>
          )}
        </div>
        <div className="p-2.5 rounded-xl" style={{ background: "var(--accent-light)" }}>
          <Icon className="w-5 h-5" style={{ color: "var(--accent)" }} />
        </div>
      </div>
    </div>
  );
}
