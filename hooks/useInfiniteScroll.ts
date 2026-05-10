"use client";
import { useEffect, useRef, useCallback } from "react";

export function useInfiniteScroll(onLoadMore: () => void, hasMore: boolean) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const cb = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0]?.isIntersecting && hasMore) onLoadMore();
    },
    [onLoadMore, hasMore]
  );
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(cb, { rootMargin: "200px" });
    observer.observe(el);
    return () => observer.disconnect();
  }, [cb]);
  return sentinelRef;
}
