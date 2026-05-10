"use client";
import { create } from "zustand";

export type ToastType = "success" | "error" | "info" | "warning";

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
}

interface UIState {
  theme: "light" | "dark" | "system";
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  toasts: Toast[];
  setTheme: (theme: "light" | "dark" | "system") => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  showToast: (toast: Omit<Toast, "id">) => void;
  dismissToast: (id: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  theme: "light",
  sidebarOpen: false,
  sidebarCollapsed: false,
  toasts: [],
  setTheme: (theme) => set({ theme }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
  showToast: (toast) => {
    const id = Math.random().toString(36).slice(2);
    set((s) => ({ toasts: [...s.toasts, { ...toast, id }] }));
    // Auto-dismiss after 4s
    setTimeout(() => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })), 4000);
  },
  dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));
