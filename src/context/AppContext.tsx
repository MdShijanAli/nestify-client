"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  startTransition,
} from "react";
import { properties as seedProperties, type Property } from "@/data/properties";

type AppContextValue = {
  properties: Property[];
  favorites: string[];
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => void;
  isInCompare: (id: string) => boolean;
  toggleCompare: (id: string) => void;
  compareList: string[];
};

const AppContext = createContext<AppContextValue | null>(null);

const FAVORITES_KEY = "nestify-favorites";
const COMPARE_KEY = "nestify-compare";

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [properties] = useState(seedProperties);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [compareList, setCompareList] = useState<string[]>([]);
  const [storageReady, setStorageReady] = useState(false);

  useEffect(() => {
    startTransition(() => {
      try {
        const favRaw = localStorage.getItem(FAVORITES_KEY);
        if (favRaw) setFavorites(new Set(JSON.parse(favRaw) as string[]));
        const cmpRaw = localStorage.getItem(COMPARE_KEY);
        if (cmpRaw) setCompareList(JSON.parse(cmpRaw) as string[]);
      } catch {
        /* ignore corrupt storage */
      }
      setStorageReady(true);
    });
  }, []);

  useEffect(() => {
    if (!storageReady) return;
    localStorage.setItem(FAVORITES_KEY, JSON.stringify([...favorites]));
  }, [favorites, storageReady]);

  useEffect(() => {
    if (!storageReady) return;
    localStorage.setItem(COMPARE_KEY, JSON.stringify(compareList));
  }, [compareList, storageReady]);

  const isFavorite = useCallback(
    (id: string) => favorites.has(id),
    [favorites]
  );

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const isInCompare = useCallback(
    (id: string) => compareList.includes(id),
    [compareList]
  );

  const toggleCompare = useCallback((id: string) => {
    setCompareList((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }, []);

  const favoriteIds = useMemo(() => [...favorites], [favorites]);

  const value = useMemo(
    () => ({
      properties,
      favorites: favoriteIds,
      isFavorite,
      toggleFavorite,
      isInCompare,
      toggleCompare,
      compareList,
    }),
    [
      properties,
      favoriteIds,
      isFavorite,
      toggleFavorite,
      isInCompare,
      toggleCompare,
      compareList,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error("useAppState must be used within AppProvider");
  }
  return ctx;
}
