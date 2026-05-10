import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthUser } from "@/types/auth";

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  setAuth: (user: AuthUser, token: string) => void;
  updateUser: (user: Partial<AuthUser>) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      setAuth: (user, token) =>
        set({ user, accessToken: token, isAuthenticated: true }),
      updateUser: (updatedUser) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedUser } : null,
        })),
      logout: () => set({ user: null, accessToken: null, isAuthenticated: false }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user }), // Only persist user info, not access token
    }
  )
);
