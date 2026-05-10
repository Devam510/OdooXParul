"use client";
import { Bell, Search, Menu } from "lucide-react";
import { useUIStore } from "@/store/uiStore";
import { useAuthStore } from "@/store/authStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "./ThemeToggle";
import { getInitials } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavbarProps {
  title?: string;
}

export function Navbar({ title }: NavbarProps) {
  const { toggleSidebar } = useUIStore();
  const { user, logout } = useAuthStore();

  return (
    <header
      className="sticky top-0 z-30 flex items-center gap-4 px-4 md:px-6 h-16 border-b"
      style={{
        background: "var(--primary)",
        borderColor: "rgba(255,255,255,0.1)",
      }}
    >
      {/* Mobile menu button */}
      <button
        className="md:hidden text-white/70 hover:text-white transition-colors"
        onClick={toggleSidebar}
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Title */}
      {title && (
        <h1 className="text-white font-semibold text-base hidden sm:block">{title}</h1>
      )}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Search */}
      <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 text-white/60 text-sm cursor-pointer hover:bg-white/15 transition-colors">
        <Search className="w-4 h-4" />
        <span>Search trips...</span>
        <kbd className="ml-2 px-1.5 py-0.5 rounded text-xs bg-white/10">⌘K</kbd>
      </div>

      {/* Theme toggle */}
      <ThemeToggle />

      {/* Notifications */}
      <button className="relative text-white/70 hover:text-white transition-colors">
        <Bell className="w-5 h-5" />
        <span
          className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full"
          style={{ background: "var(--accent)" }}
        />
      </button>

      {/* User menu */}
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-white/10 transition-colors outline-none">
            <Avatar className="w-8 h-8">
              <AvatarImage src={user?.avatar ?? ""} />
              <AvatarFallback style={{ background: "var(--accent)", color: "#fff", fontSize: "12px" }}>
                {getInitials(user?.fullName ?? "U")}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-white/80 hidden sm:block">{user?.fullName?.split(" ")[0]}</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem onClick={() => window.location.href = '/profile'}>
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => window.location.href = '/settings'}>
            Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => logout()} className="text-red-600">
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
