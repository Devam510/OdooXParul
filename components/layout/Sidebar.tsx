"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Map, Compass, User, Settings,
  Shield, ChevronLeft, ChevronRight, LogOut, Plane,
} from "lucide-react";
import { cn, getInitials } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import { useUIStore } from "@/store/uiStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/trips", label: "My Trips", icon: Map },
  { href: "/explore/cities", label: "Explore", icon: Compass },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const { sidebarCollapsed, setSidebarCollapsed } = useUIStore();

  return (
    <motion.aside
      animate={{ width: sidebarCollapsed ? 72 : 240 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="hidden md:flex flex-col h-screen sticky top-0 overflow-hidden"
      style={{ background: "var(--primary)", color: "#fff", flexShrink: 0 }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl flex-shrink-0"
          style={{ background: "var(--accent)" }}>
          <Plane className="w-5 h-5 text-white" />
        </div>
        <AnimatePresence>
          {!sidebarCollapsed && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="font-display text-lg font-bold text-white"
            >
              Traveloop
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link key={href} href={href}>
              <div className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 cursor-pointer",
                active
                  ? "sidebar-item-active"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              )}>
                <Icon className={cn("w-5 h-5 flex-shrink-0", active && "text-[--accent]")} />
                <AnimatePresence>
                  {!sidebarCollapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-sm font-medium"
                    >
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </Link>
          );
        })}

        {/* Admin link */}
        {user?.role === "ADMIN" && (
          <Link href="/admin">
            <div className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 cursor-pointer",
              pathname.startsWith("/admin")
                ? "sidebar-item-active"
                : "text-white/70 hover:bg-white/10 hover:text-white"
            )}>
              <Shield className="w-5 h-5 flex-shrink-0" />
              {!sidebarCollapsed && <span className="text-sm font-medium">Admin</span>}
            </div>
          </Link>
        )}
      </nav>

      {/* User + Collapse */}
      <div className="border-t border-white/10 p-3 space-y-2">
        {/* User info */}
        <div className="flex items-center gap-3 px-2 py-1">
          <Avatar className="w-8 h-8 flex-shrink-0">
            <AvatarImage src={user?.avatar ?? ""} />
            <AvatarFallback style={{ background: "var(--accent)", color: "#fff" }}>
              {getInitials(user?.fullName ?? "U")}
            </AvatarFallback>
          </Avatar>
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-w-0">
                <p className="text-sm font-medium text-white truncate">{user?.fullName}</p>
                <p className="text-xs text-white/50 truncate">@{user?.username}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Logout */}
        <button
          onClick={() => logout()}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-all duration-150"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!sidebarCollapsed && <span className="text-sm">Logout</span>}
        </button>

        {/* Collapse toggle */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="flex items-center justify-center w-full py-1 text-white/40 hover:text-white/70 transition-colors"
        >
          {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </motion.aside>
  );
}
