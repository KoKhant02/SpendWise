/**
 * Custom hook for localStorage persistence
 * Separates storage concerns from business logic
 */

import { useState, useEffect } from 'react';

/**
 * Hook for syncing state with localStorage
 * @param key - localStorage key
 * @param initialValue - Initial value if nothing in localStorage
 * @returns [state, setState] tuple
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  // Initialize state from localStorage or use initialValue
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error loading from localStorage (key: ${key}):`, error);
      return initialValue;
    }
  });

  // Sync to localStorage whenever value changes
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(`Error saving to localStorage (key: ${key}):`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue] as const;
}
