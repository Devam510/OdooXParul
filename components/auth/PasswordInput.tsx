"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

export interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  showStrength?: boolean;
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, showStrength, value, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);

    // Basic password strength logic
    const calculateStrength = (pwd: string) => {
      let score = 0;
      if (!pwd) return 0;
      if (pwd.length > 7) score += 1;
      if (/[A-Z]/.test(pwd)) score += 1;
      if (/[a-z]/.test(pwd)) score += 1;
      if (/[0-9]/.test(pwd)) score += 1;
      if (/[^A-Za-z0-9]/.test(pwd)) score += 1;
      return score;
    };

    const strength = calculateStrength((value as string) || "");

    const getStrengthColor = (score: number) => {
      if (score === 0) return "bg-gray-200";
      if (score <= 2) return "bg-[var(--error)]";
      if (score <= 4) return "bg-[var(--warning)]";
      return "bg-[var(--success)]";
    };

    return (
      <div className="relative">
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            className={cn("pr-10", className)}
            ref={ref}
            value={value}
            {...props}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--primary-muted)] hover:text-[var(--accent)]"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
            <span className="sr-only">Toggle password visibility</span>
          </button>
        </div>

        {showStrength && value && (
          <div className="mt-2 flex gap-1 h-1 w-full">
            {[1, 2, 3, 4, 5].map((level) => (
              <div
                key={level}
                className={cn(
                  "h-full flex-1 rounded-full transition-colors",
                  strength >= level ? getStrengthColor(strength) : "bg-gray-200 dark:bg-gray-700"
                )}
              />
            ))}
          </div>
        )}
      </div>
    );
  }
);
PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
