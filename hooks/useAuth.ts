import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { LoginInput, SignupInput } from "@/types/auth";
import { toast } from "sonner";

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { setAuth, logout, user, isAuthenticated } = useAuthStore();

  const handleLogin = async (data: LoginInput) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error?.message || "Login failed");
      }

      setAuth(result.data.user, result.data.accessToken);
      toast.success("Welcome back!");
      router.push("/");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (data: SignupInput) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error?.message || "Signup failed");
      }

      setAuth(result.data.user, result.data.accessToken);
      toast.success("Account created successfully!");
      router.push("/");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (err) {
      console.error(err);
    } finally {
      logout();
      router.push("/login");
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    login: handleLogin,
    signup: handleSignup,
    logout: handleLogout,
  };
};
