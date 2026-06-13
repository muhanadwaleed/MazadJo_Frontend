"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { auctionsService } from "@mazad/api";
import { useAuth } from "@mazad/auth";

type WatchlistIdsContextValue = {
  isOnWatchlist: (auctionId: number) => boolean;
  setOnWatchlist: (auctionId: number, onWatchlist: boolean) => void;
};

const WatchlistIdsContext = createContext<WatchlistIdsContextValue | null>(null);

export function WatchlistIdsProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [watchlistIds, setWatchlistIds] = useState<Set<number>>(() => new Set());

  useEffect(() => {
    if (!isAuthenticated) {
      setWatchlistIds(new Set());
      return;
    }

    let cancelled = false;
    auctionsService
      .listWatchlistClient({ page_size: 100 })
      .then((data) => {
        if (!cancelled) {
          setWatchlistIds(new Set(data.results.map((entry) => entry.auction.id)));
        }
      })
      .catch(() => {
        if (!cancelled) {
          setWatchlistIds(new Set());
        }
      });

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  const setOnWatchlist = useCallback((auctionId: number, onWatchlist: boolean) => {
    setWatchlistIds((current) => {
      const next = new Set(current);
      if (onWatchlist) {
        next.add(auctionId);
      } else {
        next.delete(auctionId);
      }
      return next;
    });
  }, []);

  const isOnWatchlist = useCallback(
    (auctionId: number) => watchlistIds.has(auctionId),
    [watchlistIds]
  );

  const value = useMemo(
    () => ({ isOnWatchlist, setOnWatchlist }),
    [isOnWatchlist, setOnWatchlist]
  );

  return (
    <WatchlistIdsContext.Provider value={value}>{children}</WatchlistIdsContext.Provider>
  );
}

export function useWatchlistIds() {
  const context = useContext(WatchlistIdsContext);
  if (!context) {
    throw new Error("useWatchlistIds must be used within WatchlistIdsProvider");
  }
  return context;
}

/** Safe when provider is optional (returns false / no-op). */
export function useOptionalWatchlistIds() {
  return useContext(WatchlistIdsContext);
}
