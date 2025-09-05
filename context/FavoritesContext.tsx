import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getFavorites, setFavorites } from "../lib/storage";

type Ctx = {
  favorites: Set<string>;
  toggle: (id: string) => void;
  isFavorite: (id: string) => boolean;
};

const FavoritesContext = createContext<Ctx | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavs] = useState<Set<string>>(new Set());

  useEffect(() => {
    (async () => {
      const ids = await getFavorites();
      setFavs(new Set(ids));
    })();
  }, []);

  const persist = useCallback((s: Set<string>) => setFavorites(Array.from(s)), []);

  const toggle = useCallback((id: string) => {
    setFavs((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      persist(next);
      return next;
    });
  }, [persist]);

  const isFavorite = useCallback((id: string) => favorites.has(id), [favorites]);

  const value = useMemo(() => ({ favorites, toggle, isFavorite }), [favorites, toggle, isFavorite]);

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
}

