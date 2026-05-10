"use client";

import { Check } from "lucide-react";

const STYLES = [
  { id: "budget", label: "Budget Backpacker" },
  { id: "mid-range", label: "Mid-Range Explorer" },
  { id: "luxury", label: "Luxury Seeker" },
  { id: "adventure", label: "Adrenaline Junkie" },
  { id: "relaxation", label: "Beach & Chill" },
  { id: "culture", label: "Culture Enthusiast" },
  { id: "foodie", label: "Culinary Explorer" },
  { id: "nature", label: "Nature Lover" },
];

export function TravelStyleSelector({ value, onChange }: { value: string, onChange: (val: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {STYLES.map((style) => (
        <button
          key={style.id}
          type="button"
          onClick={() => onChange(style.id)}
          className={`
            px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center
            ${value === style.id 
              ? 'bg-[var(--accent)] text-white shadow-sm' 
              : 'bg-white border border-gray-200 text-gray-600 hover:border-[var(--accent)] hover:text-[var(--accent)]'}
          `}
        >
          {value === style.id && <Check className="mr-1.5 h-3.5 w-3.5" />}
          {style.label}
        </button>
      ))}
    </div>
  );
}
