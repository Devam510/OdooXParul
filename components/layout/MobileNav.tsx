"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Map, Compass, User, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/", label: "Home", icon: LayoutDashboard },
  { href: "/trips", label: "Trips", icon: Map },
  { href: "/explore/cities", label: "Explore", icon: Compass },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t"
      style={{ background: "var(--primary)", borderColor: "rgba(255,255,255,0.1)" }}
    >
      <div className="flex items-center justify-around h-16 px-2">
        {TABS.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link key={href} href={href} className="flex flex-col items-center gap-0.5 py-2 px-3 min-w-0 flex-1">
              <Icon
                className={cn("w-5 h-5 transition-colors", active ? "text-[--accent]" : "text-white/50")}
                style={active ? { color: "var(--accent)" } : undefined}
              />
              <span
                className={cn("text-[10px] font-medium transition-colors", active ? "text-[--accent]" : "text-white/50")}
                style={active ? { color: "var(--accent)" } : undefined}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
