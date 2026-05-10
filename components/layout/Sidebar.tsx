"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Map, Compass, User, Settings,
  Shield, ChevronRight, LogOut, PlaneTakeoff,
} from "lucide-react";
import { cn, getInitials } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import { useUIStore } from "@/store/uiStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard, exact: true },
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
      animate={{ width: sidebarCollapsed ? 68 : 228 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="hidden md:flex flex-col h-screen sticky top-0 overflow-hidden flex-shrink-0 z-40"
      style={{ background: "var(--surface)", borderRight: "1px solid var(--border)" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5" style={{ borderBottom: "1px solid var(--border)" }}>
        <motion.div
          whileHover={{ scale: 1.05, rotate: -5 }}
          transition={{ type: "spring", stiffness: 400 }}
          className="flex items-center justify-center w-9 h-9 rounded-xl flex-shrink-0"
          style={{ background: "linear-gradient(135deg, var(--teal) 0%, var(--teal-dark) 100%)", boxShadow: "var(--shadow-teal-sm)" }}
        >
          <PlaneTakeoff className="w-5 h-5 text-white" />
        </motion.div>
        <AnimatePresence>
          {!sidebarCollapsed && (
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.2 }}
              style={{ fontFamily: "var(--font-heading)", fontSize: "17px", fontWeight: 700, color: "var(--slate)", letterSpacing: "-0.02em" }}
            >
              Traveloop
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2.5 py-4 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link key={href} href={href}>
              <motion.div
                whileHover={{ x: 2 }}
                transition={{ duration: 0.15 }}
                className={cn(
                  "relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 cursor-pointer group",
                  active ? "sidebar-item-active" : ""
                )}
                style={!active ? { color: "var(--slate-muted)" } : {}}
                onMouseEnter={e => {
                  if (!active) (e.currentTarget as HTMLElement).style.background = "var(--bg-secondary)";
                }}
                onMouseLeave={e => {
                  if (!active) (e.currentTarget as HTMLElement).style.background = "";
                }}
              >
                <Icon className="w-5 h-5 flex-shrink-0 transition-all duration-200" style={active ? { color: "var(--teal)" } : {}} />
                <AnimatePresence>
                  {!sidebarCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-sm font-medium overflow-hidden whitespace-nowrap"
                      style={{ color: active ? "var(--teal)" : "var(--slate-muted)" }}
                    >
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>
          );
        })}

        {user?.role === "ADMIN" && (
          <Link href="/admin">
            <motion.div
              whileHover={{ x: 2 }}
              className={cn(
                "relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 cursor-pointer",
                pathname.startsWith("/admin") ? "sidebar-item-active" : ""
              )}
              style={!pathname.startsWith("/admin") ? { color: "var(--slate-muted)" } : {}}
            >
              <Shield className="w-5 h-5 flex-shrink-0" style={pathname.startsWith("/admin") ? { color: "var(--teal)" } : {}} />
              {!sidebarCollapsed && <span className="text-sm font-medium">Admin</span>}
            </motion.div>
          </Link>
        )}
      </nav>

      {/* Footer */}
      <div className="p-3 space-y-1" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="flex items-center gap-3 px-2 py-2 rounded-xl" style={{ background: "var(--bg-secondary)" }}>
          <Avatar className="w-8 h-8 flex-shrink-0">
            <AvatarImage src={user?.avatar ?? ""} />
            <AvatarFallback style={{ background: "linear-gradient(135deg, var(--teal), var(--teal-dark))", color: "#fff", fontSize: "11px", fontWeight: 700 }}>
              {getInitials(user?.fullName ?? "U")}
            </AvatarFallback>
          </Avatar>
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-w-0 flex-1">
                <p className="text-sm font-semibold truncate" style={{ color: "var(--slate)", lineHeight: 1.3 }}>{user?.fullName}</p>
                <p className="text-xs truncate" style={{ color: "var(--slate-muted)" }}>@{user?.username}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={() => logout()}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-xl transition-all duration-150"
          style={{ color: "var(--slate-muted)" }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#FEE2E2"; (e.currentTarget as HTMLElement).style.color = "#EF4444"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = ""; (e.currentTarget as HTMLElement).style.color = "var(--slate-muted)"; }}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!sidebarCollapsed && <span className="text-sm font-medium">Logout</span>}
        </button>

        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="flex items-center justify-center w-full py-1.5 rounded-xl transition-all duration-150"
          style={{ color: "var(--slate-subtle)" }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--bg-secondary)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = ""; }}
        >
          <motion.div animate={{ rotate: sidebarCollapsed ? 0 : 180 }} transition={{ duration: 0.3 }}>
            <ChevronRight className="w-4 h-4" />
          </motion.div>
        </button>
      </div>
    </motion.aside>
  );
}
