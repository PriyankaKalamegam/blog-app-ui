import { useEffect, useState } from "react";

export function useDebouncedValue(value, delay = 350) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Wait for typing to pause before exposing the next value to API-driven components.
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
