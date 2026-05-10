"use client";

import { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek } from "date-fns";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CalendarViewProps {
  trip: any;
}

export function CalendarView({ trip }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(trip.startDate ? new Date(trip.startDate) : new Date());

  const daysInMonth = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentMonth)),
    end: endOfWeek(endOfMonth(currentMonth))
  });

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  // Flatten activities with dates
  const activitiesByDate = trip.stops?.reduce((acc: any, stop: any) => {
    stop.activities?.forEach((act: any) => {
      if (act.scheduledDate) {
        const dateStr = new Date(act.scheduledDate).toISOString().split('T')[0];
        if (!acc[dateStr]) acc[dateStr] = [];
        acc[dateStr].push(act);
      }
    });
    return acc;
  }, {}) || {};

  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-[var(--primary)]">
          {format(currentMonth, "MMMM yyyy")}
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px bg-gray-200 border rounded-lg overflow-hidden flex-1">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="bg-gray-50 p-2 text-center text-sm font-medium text-[var(--primary-muted)]">
            {day}
          </div>
        ))}
        
        {daysInMonth.map((day, idx) => {
          const dateStr = day.toISOString().split('T')[0];
          const dayActivities = activitiesByDate[dateStr] || [];
          
          return (
            <div 
              key={idx} 
              className={`min-h-[100px] bg-white p-2 ${!isSameMonth(day, currentMonth) ? 'text-gray-400 bg-gray-50/50' : 'text-gray-900'} ${isSameDay(day, new Date()) ? 'ring-2 ring-[var(--accent)] ring-inset' : ''}`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className={`text-sm font-semibold ${isSameDay(day, new Date()) ? 'bg-[var(--accent)] text-white w-6 h-6 flex items-center justify-center rounded-full' : ''}`}>
                  {format(day, "d")}
                </span>
                {dayActivities.length > 0 && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-full">
                    {dayActivities.length}
                  </span>
                )}
              </div>
              
              <div className="space-y-1 overflow-y-auto max-h-[80px]">
                {dayActivities.map((act: any) => (
                  <div key={act.id} className="text-xs p-1 bg-[var(--background-secondary)] rounded truncate flex items-center gap-1 group relative">
                    <Clock className="h-3 w-3 shrink-0 text-[var(--primary-muted)]" />
                    <span className="truncate" title={act.activity?.name}>{act.activity?.name}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
