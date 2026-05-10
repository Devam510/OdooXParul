"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Plus, StickyNote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { NotesGrid } from "@/components/notes/NotesGrid";
import { NoteFormModal } from "@/components/notes/NoteFormModal";

export default function NotesPage() {
  const params = useParams();
  const router = useRouter();
  const tripId = params.id as string;
  
  const [trip, setTrip] = useState<any>(null);
  const [notes, setNotes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchTripAndNotes = async () => {
    setIsLoading(true);
    try {
      const [tripRes, notesRes] = await Promise.all([
        fetch(`/api/trips/${tripId}`),
        fetch(`/api/trips/${tripId}/notes`)
      ]);
      
      const tripResult = await tripRes.json();
      const notesResult = await notesRes.json();
      
      if (!tripRes.ok) throw new Error(tripResult.error?.message || "Failed to fetch trip");
      if (!notesRes.ok) throw new Error(notesResult.error?.message || "Failed to fetch notes");
      
      setTrip(tripResult.data);
      setNotes(notesResult.data);
    } catch (err: any) {
      toast.error(err.message);
      if (!trip) router.push(`/trips/${tripId}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (tripId) fetchTripAndNotes();
  }, [tripId, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--accent)]" />
      </div>
    );
  }

  if (!trip) return null;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Button variant="ghost" asChild className="mb-2 -ml-4 text-[var(--primary-muted)] hover:text-[var(--primary)]">
            <Link href={`/trips/${tripId}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Trip Details
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--primary)] flex items-center">
            <StickyNote className="mr-3 h-8 w-8 text-[var(--accent)]" />
            Travel Notes
          </h1>
          <p className="text-[var(--primary-muted)] mt-1">Keep track of ideas, links, and important info for {trip.title}</p>
        </div>
        
        <Button onClick={() => setIsModalOpen(true)} className="btn-accent">
          <Plus className="mr-2 h-4 w-4" />
          Add Note
        </Button>
      </div>

      <NotesGrid notes={notes} tripId={tripId} onRefresh={fetchTripAndNotes} />

      <NoteFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        tripId={tripId} 
        onSuccess={fetchTripAndNotes} 
      />
    </div>
  );
}
