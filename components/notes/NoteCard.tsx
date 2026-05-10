"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Pin, Trash2, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { NoteFormModal } from "./NoteFormModal";

const colorMap: Record<string, string> = {
  yellow: "bg-yellow-100 border-yellow-200 text-yellow-900",
  blue: "bg-blue-100 border-blue-200 text-blue-900",
  green: "bg-green-100 border-green-200 text-green-900",
  pink: "bg-pink-100 border-pink-200 text-pink-900",
  purple: "bg-purple-100 border-purple-200 text-purple-900",
};

export function NoteCard({ note, tripId, onRefresh }: { note: any, tripId: string, onRefresh: () => void }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const togglePin = async () => {
    try {
      const res = await fetch(`/api/trips/${tripId}/notes/${note.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPinned: !note.isPinned }),
      });
      if (!res.ok) throw new Error("Failed to update note");
      onRefresh();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this note?")) return;
    try {
      const res = await fetch(`/api/trips/${tripId}/notes/${note.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete note");
      toast.success("Note deleted");
      onRefresh();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const colorClass = colorMap[note.color || "yellow"];

  return (
    <>
      <div className={`p-5 rounded-xl border shadow-sm relative group flex flex-col h-full ${colorClass}`}>
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-bold text-lg pr-8 truncate">{note.title}</h3>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={togglePin}
            className={`absolute top-3 right-3 h-8 w-8 hover:bg-white/50 ${note.isPinned ? "text-[var(--accent)]" : "text-gray-400 opacity-0 group-hover:opacity-100"}`}
          >
            <Pin className={`h-4 w-4 ${note.isPinned ? "fill-current" : ""}`} />
          </Button>
        </div>
        
        <div className="flex-1 text-sm whitespace-pre-wrap overflow-y-auto mb-4 opacity-90">
          {note.content}
        </div>
        
        <div className="flex justify-between items-center text-xs opacity-60 pt-3 border-t border-black/10">
          <span>{format(new Date(note.updatedAt), "MMM d, yyyy")}</span>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-white/50" onClick={() => setIsEditModalOpen(true)}>
              <Edit2 className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-red-200/50 hover:text-red-700" onClick={handleDelete}>
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>

      <NoteFormModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        tripId={tripId} 
        onSuccess={onRefresh}
        initialData={note}
      />
    </>
  );
}
