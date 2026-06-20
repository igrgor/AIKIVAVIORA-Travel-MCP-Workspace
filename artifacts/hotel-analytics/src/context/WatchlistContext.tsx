import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { trackedHotels } from "../lib/hotelCatalog";
import type { Hotel } from "../data/mockData";
import {
  loadWorkspace,
  normalizeWorkspace,
  saveWorkspace,
  sanitizeComparisonIds,
  type WatchlistEntry,
  type WorkspaceV1,
} from "../lib/workspaceStorage";

import { COMPARISON_LIMIT } from "../lib/comparisonLimit";

const MAX_COMPARE = COMPARISON_LIMIT;

const VALID_HOTEL_IDS = new Set(trackedHotels.map((hotel) => hotel.id));

function readWorkspace(): WorkspaceV1 {
  const normalized = loadWorkspace(VALID_HOTEL_IDS);
  saveWorkspace(normalized);
  return normalized;
}

type WatchlistContextValue = {
  watchlist: WatchlistEntry[];
  watchlistHotels: Hotel[];
  comparisonIds: string[];
  isInWatchlist: (hotelId: string) => boolean;
  addToWatchlist: (hotelId: string) => void;
  removeFromWatchlist: (hotelId: string) => void;
  toggleWatchlist: (hotelId: string) => void;
  toggleComparison: (hotelId: string) => void;
  addToComparison: (hotelId: string) => boolean;
  removeComparison: (hotelId: string) => void;
  clearComparison: () => void;
  persistActiveHotelId: (activeHotelId: string | null) => void;
};

const WatchlistContext = createContext<WatchlistContextValue | null>(null);

export function WatchlistProvider({ children }: { children: ReactNode }) {
  const [workspace, setWorkspace] = useState<WorkspaceV1>(() => readWorkspace());
  const workspaceRef = useRef(workspace);
  workspaceRef.current = workspace;

  const commitWorkspace = useCallback((next: WorkspaceV1) => {
    const normalized = normalizeWorkspace(next, VALID_HOTEL_IDS);
    saveWorkspace(normalized);
    return normalized;
  }, []);

  const applyWorkspace = useCallback(
    (next: WorkspaceV1) => {
      const normalized = commitWorkspace(next);
      setWorkspace(normalized);
      return normalized;
    },
    [commitWorkspace],
  );

  const watchlistHotels = useMemo(
    () =>
      workspace.watchlist
        .map((entry) => trackedHotels.find((hotel) => hotel.id === entry.hotelId))
        .filter((hotel): hotel is Hotel => hotel !== undefined),
    [workspace.watchlist],
  );

  const isInWatchlist = useCallback(
    (hotelId: string) =>
      workspace.watchlist.some((entry) => entry.hotelId === hotelId),
    [workspace.watchlist],
  );

  const addToWatchlist = useCallback(
    (hotelId: string) => {
      setWorkspace((current) => {
        if (current.watchlist.some((entry) => entry.hotelId === hotelId)) {
          return current;
        }
        return commitWorkspace({
          ...current,
          watchlist: [
            ...current.watchlist,
            { hotelId, addedAt: new Date().toISOString() },
          ],
        });
      });
    },
    [commitWorkspace],
  );

  const removeFromWatchlist = useCallback(
    (hotelId: string) => {
      setWorkspace((current) =>
        commitWorkspace({
          ...current,
          watchlist: current.watchlist.filter(
            (entry) => entry.hotelId !== hotelId,
          ),
        }),
      );
    },
    [commitWorkspace],
  );

  const toggleWatchlist = useCallback(
    (hotelId: string) => {
      if (isInWatchlist(hotelId)) {
        removeFromWatchlist(hotelId);
      } else {
        addToWatchlist(hotelId);
      }
    },
    [addToWatchlist, isInWatchlist, removeFromWatchlist],
  );

  const toggleComparison = useCallback((hotelId: string) => {
    if (!VALID_HOTEL_IDS.has(hotelId)) {
      return;
    }

    setWorkspace((current) => {
      const comparisonIds = sanitizeComparisonIds(
        current.comparisonIds,
        VALID_HOTEL_IDS,
        MAX_COMPARE,
      );

      if (comparisonIds.includes(hotelId)) {
        return commitWorkspace({
          ...current,
          comparisonIds: comparisonIds.filter((id) => id !== hotelId),
        });
      }

      if (comparisonIds.length >= MAX_COMPARE) {
        return commitWorkspace({ ...current, comparisonIds });
      }

      return commitWorkspace({
        ...current,
        comparisonIds: [...comparisonIds, hotelId],
      });
    });
  }, [commitWorkspace]);

  const addToComparison = useCallback((hotelId: string): boolean => {
    if (!VALID_HOTEL_IDS.has(hotelId)) {
      return false;
    }

    const current = workspaceRef.current;
    const comparisonIds = sanitizeComparisonIds(
      current.comparisonIds,
      VALID_HOTEL_IDS,
      MAX_COMPARE,
    );

    if (comparisonIds.includes(hotelId)) {
      return true;
    }

    if (comparisonIds.length >= MAX_COMPARE) {
      return false;
    }

    applyWorkspace({
      ...current,
      comparisonIds: [...comparisonIds, hotelId],
    });
    return true;
  }, [applyWorkspace]);

  const removeComparison = useCallback((hotelId: string) => {
    setWorkspace((current) => {
      const comparisonIds = sanitizeComparisonIds(
        current.comparisonIds,
        VALID_HOTEL_IDS,
        MAX_COMPARE,
      );

      if (!comparisonIds.includes(hotelId)) {
        return current;
      }

      return commitWorkspace({
        ...current,
        comparisonIds: comparisonIds.filter((id) => id !== hotelId),
      });
    });
  }, [commitWorkspace]);

  const clearComparison = useCallback(() => {
    setWorkspace((current) => {
      if (current.comparisonIds.length === 0) {
        return current;
      }
      return commitWorkspace({ ...current, comparisonIds: [] });
    });
  }, [commitWorkspace]);

  const persistActiveHotelId = useCallback(
    (activeHotelId: string | null) => {
      setWorkspace((current) =>
        commitWorkspace({
          ...current,
          activeHotelId:
            activeHotelId && VALID_HOTEL_IDS.has(activeHotelId)
              ? activeHotelId
              : null,
        }),
      );
    },
    [commitWorkspace],
  );

  const value = useMemo(
    () => ({
      watchlist: workspace.watchlist,
      watchlistHotels,
      comparisonIds: workspace.comparisonIds,
      isInWatchlist,
      addToWatchlist,
      removeFromWatchlist,
      toggleWatchlist,
      toggleComparison,
      addToComparison,
      removeComparison,
      clearComparison,
      persistActiveHotelId,
    }),
    [
      workspace.watchlist,
      workspace.comparisonIds,
      watchlistHotels,
      isInWatchlist,
      addToWatchlist,
      removeFromWatchlist,
      toggleWatchlist,
      toggleComparison,
      addToComparison,
      removeComparison,
      clearComparison,
      persistActiveHotelId,
    ],
  );

  return (
    <WatchlistContext.Provider value={value}>
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist() {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error("useWatchlist must be used within WatchlistProvider");
  }
  return context;
}

export function getPersistedComparisonIds(): string[] {
  return loadWorkspace(VALID_HOTEL_IDS).comparisonIds;
}

export function getPersistedActiveHotelId(): string | null {
  return loadWorkspace(VALID_HOTEL_IDS).activeHotelId;
}
