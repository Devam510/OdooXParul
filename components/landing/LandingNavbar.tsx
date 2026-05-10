"use client";

import Link from "next/link";
import { PlaneTakeoff } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function LandingNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  
  // Basic check for auth status from client side
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Check if user has an access token in cookies
    const checkAuth = () => {
      const hasToken = document.cookie.includes("access_token=");
      setIsAuthenticated(hasToken);
    };
    checkAuth();
  }, [pathname]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        isScrolled
          ? "bg-white/80 backdrop-blur-md border-zinc-200 dark:bg-zinc-950/80 dark:border-zinc-800 py-3 shadow-sm"
          : "bg-transparent border-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-teal-600 text-white p-2 rounded-xl group-hover:bg-teal-500 transition-colors">
            <PlaneTakeoff className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Traveloop
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-600 dark:text-zinc-300">
          <Link href="#features" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
            Features
          </Link>
          <Link href="/explore/cities" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
            Explore
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <Link
              href="/trips"
              className="px-4 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-full transition-all hover:scale-105"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden sm:block px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-full transition-all hover:scale-105 shadow-md shadow-teal-500/20"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
