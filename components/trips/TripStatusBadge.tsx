import { Badge } from "@/components/ui/badge";
import { TripStatus } from "@prisma/client";

interface TripStatusBadgeProps {
  status: TripStatus;
}

export function TripStatusBadge({ status }: TripStatusBadgeProps) {
  switch (status) {
    case "PLANNING":
      return <Badge variant="secondary" className="bg-[var(--primary-muted)]/20 text-[var(--primary)] hover:bg-[var(--primary-muted)]/30">Planning</Badge>;
    case "ONGOING":
      return <Badge className="bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)]">Ongoing</Badge>;
    case "COMPLETED":
      return <Badge variant="outline" className="border-[var(--success)] text-[var(--success)]">Completed</Badge>;
    case "ARCHIVED":
      return <Badge variant="outline" className="text-muted-foreground border-muted">Archived</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
}
