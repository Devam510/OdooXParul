import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  ctaLabel?: string;
  onCta?: () => void;
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, ctaLabel, onCta, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 text-center", className)}>
      <div className="p-4 rounded-2xl mb-4" style={{ background: "var(--accent-light)" }}>
        <Icon className="w-8 h-8" style={{ color: "var(--accent)" }} />
      </div>
      <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--primary)" }}>{title}</h3>
      <p className="text-sm max-w-xs" style={{ color: "var(--primary-muted)" }}>{description}</p>
      {ctaLabel && onCta && (
        <Button onClick={onCta} className="mt-6 btn-accent" style={{ background: "var(--accent)" }}>
          {ctaLabel}
        </Button>
      )}
    </div>
  );
}
