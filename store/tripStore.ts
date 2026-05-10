"use client";
import { create } from "zustand";
import { Trip, TripFilters } from "@/types/trip";

interface TripState {
  trips: Trip[];
  currentTrip: Trip | null;
  filters: TripFilters;
  pagination: { page: number; total: number; totalPages: number };
  setTrips: (trips: Trip[], total: number, totalPages: number) => void;
  addTrip: (trip: Trip) => void;
  updateTrip: (id: string, data: Partial<Trip>) => void;
  deleteTrip: (id: string) => void;
  setCurrentTrip: (trip: Trip | null) => void;
  setFilters: (filters: Partial<TripFilters>) => void;
  setPage: (page: number) => void;
}

export const useTripStore = create<TripState>((set) => ({
  trips: [],
  currentTrip: null,
  filters: { search: "", status: "ALL", sort: "upcoming" },
  pagination: { page: 1, total: 0, totalPages: 0 },
  setTrips: (trips, total, totalPages) =>
    set((s) => ({ trips, pagination: { ...s.pagination, total, totalPages } })),
  addTrip: (trip) => set((s) => ({ trips: [trip, ...s.trips] })),
  updateTrip: (id, data) =>
    set((s) => ({ trips: s.trips.map((t) => (t.id === id ? { ...t, ...data } : t)) })),
  deleteTrip: (id) => set((s) => ({ trips: s.trips.filter((t) => t.id !== id) })),
  setCurrentTrip: (currentTrip) => set({ currentTrip }),
  setFilters: (filters) => set((s) => ({ filters: { ...s.filters, ...filters }, pagination: { ...s.pagination, page: 1 } })),
  setPage: (page) => set((s) => ({ pagination: { ...s.pagination, page } })),
}));
