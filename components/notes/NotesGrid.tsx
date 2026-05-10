"use client";

import { NoteCard } from "./NoteCard";

export function NotesGrid({ notes, tripId, onRefresh }: { notes: any[], tripId: string, onRefresh: () => void }) {
  if (notes.length === 0) {
    return (
      <div className="text-center p-16 border-2 border-dashed rounded-xl bg-white/50 text-[var(--primary-muted)]">
        No notes added yet. Click "Add Note" to create one.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {notes.map((note) => (
        <NoteCard key={note.id} note={note} tripId={tripId} onRefresh={onRefresh} />
      ))}
    </div>
  );
}
