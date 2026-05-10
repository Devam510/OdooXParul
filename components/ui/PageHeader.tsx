import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, subtitle, action, className }: PageHeaderProps) {
  return (
    <div className={cn("flex items-start justify-between gap-4 mb-6", className)}>
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "var(--primary)", fontFamily: "var(--font-display)" }}>
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm mt-1" style={{ color: "var(--primary-muted)" }}>{subtitle}</p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}
