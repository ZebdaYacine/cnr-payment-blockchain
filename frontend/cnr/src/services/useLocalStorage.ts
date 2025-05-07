import { useCallback } from "react";

export function useLocalStorage() {
  const getItem = useCallback((key: string): string | null => {
    try {
      const item = window.localStorage.getItem(key);
      return item;
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return null;
    }
  }, []);

  const setItem = useCallback((key: string, value: string): void => {
    try {
      window.localStorage.setItem(key, value);
    } catch (error) {
      console.error("Error writing to localStorage:", error);
    }
  }, []);

  const removeItem = useCallback((key: string): void => {
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error("Error removing from localStorage:", error);
    }
  }, []);

  const clear = useCallback((): void => {
    try {
      window.localStorage.clear();
    } catch (error) {
      console.error("Error clearing localStorage:", error);
    }
  }, []);

  return {
    getItem,
    setItem,
    removeItem,
    clear,
  };
}
