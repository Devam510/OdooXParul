"use client";

import Image from "next/image";
import { format, differenceInDays } from "date-fns";
import { Calendar, MapPin, User } from "lucide-react";

export function PublicTripHero({ trip }: { trip: any }) {
  const duration = differenceInDays(new Date(trip.endDate), new Date(trip.startDate)) + 1;

  return (
    <div className="relative w-full h-[400px] md:h-[500px] flex flex-col justify-end">
      {trip.coverImage ? (
        <Image
          src={trip.coverImage}
          alt={trip.title}
          fill
          className="object-cover"
          priority
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600" />
      )}
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
      
      <div className="relative z-10 p-6 md:p-12 max-w-7xl mx-auto w-full text-white">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">{trip.title}</h1>
        
        {trip.description && (
          <p className="text-lg md:text-xl text-gray-200 mb-6 max-w-3xl line-clamp-2">
            {trip.description}
          </p>
        )}
        
        <div className="flex flex-wrap items-center gap-6 text-sm md:text-base font-medium">
          <div className="flex items-center">
            <Calendar className="mr-2 h-5 w-5 text-blue-400" />
            {format(new Date(trip.startDate), "MMM d, yyyy")} - {format(new Date(trip.endDate), "MMM d, yyyy")} ({duration} days)
          </div>
          <div className="flex items-center">
            <MapPin className="mr-2 h-5 w-5 text-red-400" />
            {trip.stops?.length || 0} Destinations
          </div>
          {trip.user && (
            <div className="flex items-center">
              <User className="mr-2 h-5 w-5 text-green-400" />
              Created by {trip.user.fullName || trip.user.username}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
