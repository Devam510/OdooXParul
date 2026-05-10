"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const COLORS = [
  { value: "yellow", label: "Yellow", bg: "bg-yellow-400" },
  { value: "blue", label: "Blue", bg: "bg-blue-400" },
  { value: "green", label: "Green", bg: "bg-green-400" },
  { value: "pink", label: "Pink", bg: "bg-pink-400" },
  { value: "purple", label: "Purple", bg: "bg-purple-400" },
];

export function NoteFormModal({ isOpen, onClose, tripId, onSuccess, initialData }: any) {
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [color, setColor] = useState("yellow");
  const [isPinned, setIsPinned] = useState(false);

  const isEdit = !!initialData;

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setTitle(initialData.title);
        setContent(initialData.content);
        setColor(initialData.color || "yellow");
        setIsPinned(initialData.isPinned || false);
      } else {
        setTitle("");
        setContent("");
        setColor("yellow");
        setIsPinned(false);
      }
    }
  }, [isOpen, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error("Title and content are required");
      return;
    }

    setIsLoading(true);
    try {
      const url = isEdit ? `/api/trips/${tripId}/notes/${initialData.id}` : `/api/trips/${tripId}/notes`;
      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, color, isPinned }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error?.message || `Failed to ${isEdit ? "update" : "add"} note`);
      }

      toast.success(`Note ${isEdit ? "updated" : "added"}`);
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Note" : "Add Note"}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input 
              placeholder="e.g. Restaurants to try" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Content</Label>
            <Textarea 
              placeholder="Write your notes here..." 
              className="min-h-[150px]"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex gap-3">
              {COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setColor(c.value)}
                  className={`h-8 w-8 rounded-full ${c.bg} transition-all ${color === c.value ? "ring-2 ring-offset-2 ring-[var(--primary)] scale-110" : ""}`}
                  aria-label={`Select ${c.label} color`}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Checkbox 
              id="pin-note" 
              checked={isPinned} 
              onCheckedChange={(checked) => setIsPinned(!!checked)}
            />
            <label
              htmlFor="pin-note"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              Pin to top
            </label>
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" className="btn-accent" disabled={isLoading || !title.trim() || !content.trim()}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEdit ? "Update Note" : "Save Note"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
