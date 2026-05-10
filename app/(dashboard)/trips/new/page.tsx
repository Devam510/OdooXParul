import { CreateTripForm } from "@/components/trips/CreateTripForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Create Trip | Traveloop",
};

export default function CreateTripPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <Button variant="ghost" asChild className="mb-4 -ml-4 text-[var(--primary-muted)] hover:text-[var(--primary)]">
          <Link href="/trips">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Trips
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--primary)]">Create a New Trip</h1>
        <p className="text-[var(--primary-muted)] mt-1">
          Start planning your next adventure. Fill in the details below to get started.
        </p>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-xl border shadow-sm">
        <CreateTripForm />
      </div>
    </div>
  );
}
