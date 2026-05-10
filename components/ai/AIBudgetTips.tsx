"use client";

import { useState } from "react";
import { Lightbulb, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AIBudgetTips({ 
  tripTitle, 
  destinations, 
  currentExpenses 
}: { 
  tripTitle: string, 
  destinations: string[], 
  currentExpenses: any 
}) {
  const [tips, setTips] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  const fetchTips = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/ai/budget", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tripTitle, destinations, currentExpenses })
      });
      const data = await res.json();
      
      if (res.ok) {
        setTips(data.data.tips || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
      setHasLoaded(true);
    }
  };

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200 p-6 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-amber-900 flex items-center">
          <Lightbulb className="mr-2 h-5 w-5 text-amber-500 fill-amber-500" />
          AI Budget Insights
        </h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={fetchTips} 
          disabled={isLoading}
          className="text-amber-700 hover:text-amber-900 hover:bg-amber-100/50"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
        </Button>
      </div>

      {!hasLoaded ? (
        <div className="text-center py-6">
          <p className="text-sm text-amber-700 mb-3">Get personalized tips to save money on this trip based on your current expenses.</p>
          <Button onClick={fetchTips} disabled={isLoading} className="bg-amber-500 hover:bg-amber-600 text-white">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lightbulb className="mr-2 h-4 w-4" />}
            Analyze Budget
          </Button>
        </div>
      ) : tips.length > 0 ? (
        <ul className="space-y-3">
          {tips.map((tip, idx) => (
            <li key={idx} className="flex items-start text-sm text-amber-900 bg-white/60 p-3 rounded-lg">
              <span className="h-5 w-5 rounded-full bg-amber-200 text-amber-700 flex items-center justify-center text-xs font-bold mr-3 mt-0.5 shrink-0">
                {idx + 1}
              </span>
              <span className="leading-relaxed">{tip}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-amber-700 text-center">No tips available right now.</p>
      )}
    </div>
  );
}
