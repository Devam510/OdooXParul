"use client";
import Link from "next/link";
import { PlaneTakeoff } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export default function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    setIsAuthenticated(document.cookie.includes("access_token="));
  }, [pathname]);

  return (
    <motion.nav
      initial={{ y: -8, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(248,250,252,0.88)" : "transparent",
        backdropFilter: scrolled ? "blur(24px) saturate(180%)" : "none",
        borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
        boxShadow: scrolled ? "var(--shadow-sm)" : "none",
        padding: scrolled ? "0.625rem 0" : "1.25rem 0",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <motion.div
            whileHover={{ scale: 1.07, rotate: -5 }}
            transition={{ type: "spring", stiffness: 400 }}
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, var(--teal) 0%, var(--teal-dark) 100%)", boxShadow: "var(--shadow-teal-sm)" }}
          >
            <PlaneTakeoff className="w-5 h-5 text-white" />
          </motion.div>
          <span style={{ fontFamily: "var(--font-heading)", fontSize: "18px", fontWeight: 700, color: "var(--slate)", letterSpacing: "-0.02em" }}>
            Traveloop
          </span>
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-8">
          {[
            { href: "#features", label: "Features" },
            { href: "/explore/cities", label: "Explore" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-sm font-medium transition-colors duration-200"
              style={{ color: "var(--slate-muted)" }}
              onMouseEnter={e => ((e.target as HTMLElement).style.color = "var(--teal)")}
              onMouseLeave={e => ((e.target as HTMLElement).style.color = "var(--slate-muted)")}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Auth actions */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <Link href="/trips">
              <motion.button whileHover={{ scale: 1.03, y: -1 }} className="btn-primary" style={{ padding: "0.5rem 1.25rem", fontSize: "14px" }}>
                Go to Dashboard
              </motion.button>
            </Link>
          ) : (
            <>
              <Link href="/login" className="hidden sm:block text-sm font-medium transition-colors duration-200"
                style={{ color: "var(--slate-muted)", padding: "0.5rem 1rem" }}
                onMouseEnter={e => ((e.target as HTMLElement).style.color = "var(--slate)")}
                onMouseLeave={e => ((e.target as HTMLElement).style.color = "var(--slate-muted)")}
              >
                Log in
              </Link>
              <Link href="/signup">
                <motion.button whileHover={{ scale: 1.03, y: -1 }} whileTap={{ scale: 0.97 }} className="btn-primary" style={{ padding: "0.5rem 1.25rem", fontSize: "14px" }}>
                  Sign Up
                </motion.button>
              </Link>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
