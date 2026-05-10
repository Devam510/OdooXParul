import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, differenceInDays, parseISO } from "date-fns";

// ─── Tailwind merge ───────────────────────────────────────────────────────────
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ─── Date helpers ─────────────────────────────────────────────────────────────
export function formatDate(date: string | Date, fmt = "MMM d, yyyy"): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, fmt);
}

export function calculateTripDuration(start: string | Date, end: string | Date): number {
  const s = typeof start === "string" ? parseISO(start) : start;
  const e = typeof end === "string" ? parseISO(end) : end;
  return Math.max(0, differenceInDays(e, s));
}

export function formatDateRange(start: string | Date, end: string | Date): string {
  return `${formatDate(start, "MMM d")} – ${formatDate(end, "MMM d, yyyy")}`;
}

// ─── Currency ─────────────────────────────────────────────────────────────────
export function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
}

// ─── String helpers ───────────────────────────────────────────────────────────
export function truncate(str: string, max: number): string {
  return str.length > max ? str.slice(0, max - 3) + "..." : str;
}

export function slugify(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function getInitials(name: string): string {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
}

// ─── Cost index display ───────────────────────────────────────────────────────
export function costIndexLabel(index: number): string {
  return "$".repeat(Math.min(Math.max(index, 1), 4));
}

// ─── API helper ───────────────────────────────────────────────────────────────
export function getIP(req: Request): string {
  const forwarded = (req.headers as Headers).get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() ?? "unknown";
}
