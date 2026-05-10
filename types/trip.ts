import type { TripActivity } from "./itinerary";

export type TripStatus = "PLANNING" | "ONGOING" | "COMPLETED" | "ARCHIVED";
export type TripVisibility = "PRIVATE" | "PUBLIC";
export type TransportType = "FLIGHT" | "TRAIN" | "BUS" | "CAR" | "SHIP" | "OTHER";

export interface City {
  id: string;
  name: string;
  country: string;
  description: string | null;
  image: string | null;
  costIndex: number;
  latitude: number | null;
  longitude: number | null;
  popularity: number;
}

export interface Trip {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  coverImage: string | null;
  startDate: string;
  endDate: string;
  visibility: TripVisibility;
  status: TripStatus;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  _count?: { stops: number };
}

export interface TripStop {
  id: string;
  tripId: string;
  cityId: string;
  order: number;
  arrivalDate: string | null;
  departureDate: string | null;
  hotelName: string | null;
  hotelAddress: string | null;
  hotelCostPerNight: number | null;
  transportType: TransportType | null;
  transportNotes: string | null;
  notes: string | null;
  budgetEstimate: number | null;
  city: City;
  activities?: TripActivity[];
}

export interface TripWithStops extends Trip {
  stops: TripStop[];
}

export interface TripFilters {
  search: string;
  status: TripStatus | "ALL";
  sort: "recent" | "upcoming";
}
