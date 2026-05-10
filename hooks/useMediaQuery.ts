"use client";
import { useEffect, useState } from "react";

const breakpoints = { sm: 640, md: 768, lg: 1024, xl: 1280 } as const;

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    setMatches(mq.matches);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [query]);
  return matches;
}

export function useIsMobile() {
  return useMediaQuery(`(max-width: ${breakpoints.md - 1}px)`);
}

export function useIsTablet() {
  return useMediaQuery(`(min-width: ${breakpoints.md}px) and (max-width: ${breakpoints.lg - 1}px)`);
}
