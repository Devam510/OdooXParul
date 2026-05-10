"use client";
import { Sun, Moon, Monitor } from "lucide-react";
import { useUIStore } from "@/store/uiStore";
import { useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ThemeToggle() {
  const { theme, setTheme } = useUIStore();

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.setAttribute("data-theme", "dark");
    else if (theme === "light") root.removeAttribute("data-theme");
    else {
      // System
      const dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (dark) root.setAttribute("data-theme", "dark");
      else root.removeAttribute("data-theme");
    }
  }, [theme]);

  const icons = { light: Sun, dark: Moon, system: Monitor };
  const Icon = icons[theme];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="text-white/70 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10 outline-none">
        <Icon className="w-4 h-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Sun className="w-4 h-4 mr-2" /> Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Moon className="w-4 h-4 mr-2" /> Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <Monitor className="w-4 h-4 mr-2" /> System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
