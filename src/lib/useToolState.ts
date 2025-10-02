import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

/**
 * Custom hook for tools: syncs state with localStorage and optional URL query param
 * @param key localStorage key
 * @param initialValue default value
 * @param urlParam optional URL query parameter name
 */
export function useToolState(
  key: string,
  initialValue: string,
  urlParam?: string
) {
  const [searchParams] = useSearchParams();
  const [isMounted, setIsMounted] = useState(false);

  // Load from localStorage or URL on mount
  const [value, setValue] = useState<string>(() => {
    try {
      const fromStorage = localStorage.getItem(key);
      if (fromStorage) return fromStorage;

      if (urlParam) {
        const fromUrl = searchParams.get(urlParam);
        if (fromUrl) return decodeURIComponent(fromUrl);
      }

      return initialValue;
    } catch {
      return initialValue;
    }
  });

  // Persist to localStorage after mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      try {
        localStorage.setItem(key, value);
      } catch {}
    }
  }, [value, key, isMounted]);

  // Generate shareable URL
  const getShareableUrl = () => {
    if (!urlParam) return "";
    const encoded = encodeURIComponent(value);
    return `${window.location.origin}${window.location.pathname}?${urlParam}=${encoded}`;
  };

  return [value, setValue, getShareableUrl] as const;
}
