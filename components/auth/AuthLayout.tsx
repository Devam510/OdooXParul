import React from "react";
import Link from "next/link";
import { Plane } from "lucide-react";

export function AuthLayout({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left Panel */}
      <div className="hidden md:flex flex-col justify-center items-center bg-[var(--primary)] text-white p-10 relative">
        <div className="absolute top-8 left-8 flex items-center gap-2">
          <div className="bg-[var(--accent)] p-2 rounded-lg">
            <Plane className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">Traveloop</span>
        </div>
        
        <div className="max-w-md space-y-6">
          <h1 className="text-4xl font-bold leading-tight">
            Your ultimate travel companion.
          </h1>
          <p className="text-[var(--primary-muted)] text-lg">
            Plan itineraries, manage budgets, organize packing lists, and discover hidden gems all in one place.
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex flex-col justify-center items-center bg-[var(--background)] p-6 md:p-10">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center md:text-left md:hidden mb-8 flex justify-center">
             <div className="flex items-center gap-2">
              <div className="bg-[var(--accent)] p-2 rounded-lg">
                <Plane className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight">Traveloop</span>
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-[var(--primary)]">{title}</h2>
            <p className="text-[var(--primary-muted)] mt-2">{subtitle}</p>
          </div>

          {children}

          <div className="text-center mt-6 text-sm text-[var(--primary-muted)]">
            By continuing, you agree to our{" "}
            <Link href="#" className="text-[var(--accent)] hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="#" className="text-[var(--accent)] hover:underline">
              Privacy Policy
            </Link>.
          </div>
        </div>
      </div>
    </div>
  );
}
