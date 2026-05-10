"use client";
import { useState, useEffect } from "react";
import { Bell, Search, Menu, Command } from "lucide-react";
import { useUIStore } from "@/store/uiStore";
import { useAuthStore } from "@/store/authStore";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "./ThemeToggle";
import { getInitials } from "@/lib/utils";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar({ title }: { title?: string }) {
  const { toggleSidebar } = useUIStore();
  const { user, logout } = useAuthStore();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const el = document.querySelector("main");
    if (!el) return;
    const handler = () => setScrolled(el.scrollTop > 10);
    el.addEventListener("scroll", handler);
    return () => el.removeEventListener("scroll", handler);
  }, []);

  return (
    <motion.header
      initial={{ y: -4, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-30 flex items-center gap-3 px-4 md:px-6 h-16 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(255,255,255,0.85)" : "var(--surface)",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: "1px solid var(--border)",
        boxShadow: scrolled ? "var(--shadow-sm)" : "none",
      }}
    >
      <button
        className="md:hidden p-2 rounded-lg transition-colors"
        style={{ color: "var(--slate-muted)" }}
        onClick={toggleSidebar}
        onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-secondary)")}
        onMouseLeave={e => (e.currentTarget.style.background = "")}
      >
        <Menu className="w-5 h-5" />
      </button>

      {title && (
        <h1 className="text-base font-semibold hidden sm:block" style={{ color: "var(--slate)", fontFamily: "var(--font-heading)" }}>
          {title}
        </h1>
      )}

      <div className="flex-1" />

      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className="hidden md:flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-sm transition-all duration-200"
        style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--slate-muted)", minWidth: "200px" }}
      >
        <Search className="w-4 h-4 flex-shrink-0" />
        <span>Search trips...</span>
        <div className="ml-auto flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 rounded text-xs font-medium" style={{ background: "var(--border)", color: "var(--slate-subtle)" }}>
            <Command className="w-3 h-3 inline" />K
          </kbd>
        </div>
      </motion.button>

      <ThemeToggle />

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative p-2 rounded-xl transition-colors"
        style={{ color: "var(--slate-muted)" }}
        onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-secondary)")}
        onMouseLeave={e => (e.currentTarget.style.background = "")}
      >
        <Bell className="w-5 h-5" />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: "var(--teal)" }} />
      </motion.button>

      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl transition-all duration-200 outline-none"
          style={{ border: "1px solid var(--border)" }}
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "var(--bg-secondary)")}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "")}
        >
          <Avatar className="w-7 h-7">
            <AvatarImage src={user?.avatar ?? ""} />
            <AvatarFallback style={{ background: "linear-gradient(135deg, var(--teal), var(--teal-dark))", color: "#fff", fontSize: "10px", fontWeight: 700 }}>
              {getInitials(user?.fullName ?? "U")}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium hidden sm:block" style={{ color: "var(--slate)" }}>
            {user?.fullName?.split(" ")[0]}
          </span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 rounded-xl" style={{ boxShadow: "var(--shadow-lg)", border: "1px solid var(--border)" }}>
          <DropdownMenuItem onClick={() => { window.location.href = "/profile"; }} className="rounded-lg cursor-pointer">Profile</DropdownMenuItem>
          <DropdownMenuItem onClick={() => { window.location.href = "/settings"; }} className="rounded-lg cursor-pointer">Settings</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => logout()} className="rounded-lg cursor-pointer text-red-500 focus:text-red-500">Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </motion.header>
  );
}
