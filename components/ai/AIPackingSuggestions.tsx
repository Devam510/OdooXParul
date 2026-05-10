"use client";

import { useState } from "react";
import { Sparkles, Loader2, Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function AIPackingSuggestions({ 
  destinations, 
  duration, 
  tripType,
  onAddItems 
}: { 
  destinations: string[], 
  duration: number, 
  tripType: string,
  onAddItems: (items: any[]) => void 
}) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/ai/packing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ destinations, duration, type: tripType })
      });
      const data = await res.json();
      
      if (res.ok) {
        setSuggestions(data.data.items || []);
        toast.success("AI generated suggestions!");
      } else {
        toast.error(data.error?.message || "Failed to generate suggestions");
      }
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddAll = () => {
    onAddItems(suggestions);
    setSuggestions([]);
    toast.success("Added all items to packing list");
  };

  return (
    <div className="space-y-4">
      <Button 
        onClick={handleGenerate} 
        disabled={isGenerating || destinations.length === 0}
        variant="outline"
        className="w-full border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 text-indigo-600 bg-white"
      >
        {isGenerating ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Sparkles className="mr-2 h-4 w-4 text-indigo-500" />
        )}
        {isGenerating ? "Generating..." : "Suggest Items with AI"}
      </Button>

      {suggestions.length > 0 && (
        <div className="bg-indigo-50/50 border border-indigo-100 rounded-lg p-4">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-sm font-semibold text-indigo-900">AI Suggestions</h4>
            <Button size="sm" onClick={handleAddAll} className="h-7 text-xs bg-indigo-600 hover:bg-indigo-700">
              <Check className="h-3 w-3 mr-1" /> Add All
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 max-h-[200px] overflow-y-auto pr-2 pb-2">
            {suggestions.map((item, idx) => (
              <div key={idx} className="bg-white text-xs border border-indigo-200 px-2 py-1 rounded-md text-indigo-800 flex items-center shadow-sm">
                <span className="font-medium mr-1">{item.name}</span>
                <span className="text-indigo-400">({item.quantity})</span>
                <button 
                  onClick={() => {
                    onAddItems([item]);
                    setSuggestions(suggestions.filter((_, i) => i !== idx));
                  }}
                  className="ml-2 hover:text-indigo-600 bg-indigo-50 rounded-full p-0.5"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
