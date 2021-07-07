import { useEffect, useState } from "react";

export function useStickyState(defaultValue: any, key: string) {
  const [value, setValue] = useState<any>(defaultValue);

  useEffect(() => {
    const storageValue = window.localStorage.getItem(key);
    const stickyValue = storageValue ? JSON.parse(storageValue) : null;
    if (stickyValue) {
      setValue(stickyValue);
    }
  }, [key]);

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}
