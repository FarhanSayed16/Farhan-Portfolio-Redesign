'use client';

import { useState, useEffect, useCallback } from 'react';

/**
 * Generic localStorage hook. SSR-safe: reads only after mount.
 * Third return value `hydrated` is false until the first client read finishes.
 */
export function useLocalStorage<T>(
  key: string,
  defaultValue: T
): [T, (value: T | ((prev: T) => T)) => void, boolean] {
  const [storedValue, setStoredValue] = useState<T>(defaultValue);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;
    // Defer so hydration setState is not synchronous inside the effect body
    queueMicrotask(() => {
      if (cancelled) return;
      try {
        const item = window.localStorage.getItem(key);
        if (item !== null) {
          setStoredValue(JSON.parse(item) as T);
        }
      } catch {
        // localStorage unavailable or parse error — use default
      }
      setHydrated(true);
    });
    return () => {
      cancelled = true;
    };
  }, [key]);

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const newValue = value instanceof Function ? value(prev) : value;
        try {
          window.localStorage.setItem(key, JSON.stringify(newValue));
        } catch {
          // localStorage full or unavailable
        }
        return newValue;
      });
    },
    [key]
  );

  return [hydrated ? storedValue : defaultValue, setValue, hydrated];
}
