"use client";

import Image from "next/image";
import Link from "next/link";
import { format, differenceInDays } from "date-fns";
import { TripStatusBadge } from "./TripStatusBadge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreVertical, Calendar, MapPin, Copy, Edit, Trash2, Archive } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TripCardProps {
  trip: any; // We'll type this properly later with the expanded Prisma type
  onDuplicate?: (id: string) => void;
  onArchive?: (id: string) => void;
  onDelete?: (id: string) => void;
  onEdit?: (trip: any) => void;
}

export function TripCard({ trip, onDuplicate, onArchive, onDelete, onEdit }: TripCardProps) {
  const duration = differenceInDays(new Date(trip.endDate), new Date(trip.startDate)) + 1;

  return (
    <Card className="overflow-hidden flex flex-col hover:shadow-md transition-shadow group">
      <Link href={`/trips/${trip.id}`} className="relative h-48 w-full block">
        {trip.coverImage ? (
          <Image
            src={trip.coverImage}
            alt={trip.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-[var(--primary-light)] flex items-center justify-center text-white">
            <span className="text-xl font-semibold opacity-50">{trip.title.charAt(0).toUpperCase()}</span>
          </div>
        )}
        <div className="absolute top-4 left-4">
          <TripStatusBadge status={trip.status} />
        </div>
        <div className="absolute top-4 right-4 z-10">
          <DropdownMenu>
            <DropdownMenuTrigger className="h-8 w-8 rounded-full bg-white/80 hover:bg-white text-[var(--primary)] shadow-sm inline-flex items-center justify-center">
              <MoreVertical className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
              <DropdownMenuItem onClick={() => onEdit?.(trip)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDuplicate?.(trip.id)}>
                <Copy className="mr-2 h-4 w-4" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onArchive?.(trip.id)}>
                <Archive className="mr-2 h-4 w-4" />
                {trip.status === "ARCHIVED" ? "Unarchive" : "Archive"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onDelete?.(trip.id)} className="text-[var(--error)] focus:text-[var(--error)] focus:bg-[var(--error)]/10">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Link>
      
      <CardContent className="flex-1 p-5">
        <Link href={`/trips/${trip.id}`} className="hover:underline">
          <h3 className="font-semibold text-lg line-clamp-1 mb-2 text-[var(--primary)]">
            {trip.title}
          </h3>
        </Link>
        
        <div className="space-y-2 text-sm text-[var(--primary-muted)]">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>
              {format(new Date(trip.startDate), "MMM d, yyyy")} - {duration} days
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>{trip._count?.stops || 0} stops planned</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
