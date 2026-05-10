"use client";
import { useState, useEffect } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [stored, setStored] = useState<T>(initialValue);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) setStored(JSON.parse(item));
    } catch {
      // SSR or invalid JSON — use initial value
    }
  }, [key]);

  const setValue = (value: T) => {
    try {
      setStored(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // localStorage unavailable — silent fail
    }
  };

  return [stored, setValue] as const;
}
