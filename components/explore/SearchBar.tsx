"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

export function SearchBar({ value, onChange, placeholder = "Search..." }: { value: string, onChange: (val: string) => void, placeholder?: string }) {
  return (
    <div className="relative w-full max-w-md">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-[var(--primary-muted)]" />
      </div>
      <Input 
        type="text" 
        className="pl-10 pr-10" 
        placeholder={placeholder} 
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button 
          onClick={() => onChange("")}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
