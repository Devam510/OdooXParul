"use client";

import { useState } from "react";
import { Copy, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { PACKING_TEMPLATES } from "@/lib/constants";
import { toast } from "sonner";

export function TemplateSelector({ tripId, onSuccess }: { tripId: string, onSuccess: () => void }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleApplyTemplate = async (templateType: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/trips/${tripId}/packing/template`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateType }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error?.message || "Failed to apply template");
      }

      toast.success(`${templateType} template applied`);
      onSuccess();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const templates = Object.keys(PACKING_TEMPLATES);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Copy className="mr-2 h-4 w-4" />}
          Load Template
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Choose a packing list</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {templates.map(type => (
          <DropdownMenuItem key={type} onClick={() => handleApplyTemplate(type)} className="capitalize cursor-pointer">
            {type.toLowerCase()}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
