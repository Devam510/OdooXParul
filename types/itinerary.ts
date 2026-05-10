export type ActivityCategory = "ADVENTURE" | "SIGHTSEEING" | "NIGHTLIFE" | "FOOD" | "CULTURE" | "SHOPPING";

export interface Activity {
  id: string;
  cityId: string;
  name: string;
  description: string | null;
  image: string | null;
  durationMins: number;
  estimatedCost: number;
  category: ActivityCategory;
  rating: number;
}

export interface TripActivity {
  id: string;
  tripStopId: string;
  activityId: string;
  scheduledDate: string | null;
  scheduledTime: string | null;
  notes: string | null;
  status: "planned" | "done" | "skipped";
  activity: Activity;
}

export interface ItineraryDay {
  date: string;
  stopIds: string[];
}

