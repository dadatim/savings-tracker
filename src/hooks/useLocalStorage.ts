import { useEffect, useState } from 'react';

/**
 * Like useState, but the value is saved to localStorage and restored on load.
 *
 * - `isValid` checks whatever was stored. If it's missing, corrupted, or from an
 *   older shape of the data, we fall back to `initialValue` instead of crashing.
 * - All storage access is wrapped in try/catch, because it can throw (private
 *   browsing, storage full, blocked by browser settings). If that happens the
 *   app keeps working in memory; it just won't persist.
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  isValid: (value: unknown) => value is T,
) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw === null) return initialValue;
      const parsed: unknown = JSON.parse(raw);
      return isValid(parsed) ? parsed : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage unavailable or full: ignore and keep going in memory.
    }
  }, [key, value]);

  return [value, setValue] as const;
}
