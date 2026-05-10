"use client";

import useSWR from "swr";
import { Trip } from "@prisma/client";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface UseTripsProps {
  status?: string | null;
  search?: string;
  sort?: "recent" | "upcoming";
}

export function useTrips(params?: UseTripsProps) {
  const query = new URLSearchParams();
  if (params?.status) query.append("status", params.status);
  if (params?.search) query.append("search", params.search);
  if (params?.sort) query.append("sort", params.sort);

  const { data, error, isLoading, mutate } = useSWR(
    `/api/trips?${query.toString()}`,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  return {
    trips: (data?.data as Trip[]) || [],
    isLoading,
    isError: error,
    mutate,
  };
}
