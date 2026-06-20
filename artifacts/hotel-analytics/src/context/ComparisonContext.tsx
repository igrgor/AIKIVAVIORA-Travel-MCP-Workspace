import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import { trackedHotels } from "../lib/hotelCatalog";
import type { Hotel } from "../data/mockData";
import { useWatchlist } from "./WatchlistContext";

import { COMPARISON_LIMIT } from "../lib/comparisonLimit";

const MAX_COMPARE = COMPARISON_LIMIT;

type ComparisonContextValue = {
  comparisonIds: string[];
  comparisonHotels: Hotel[];
  toggleComparison: (hotelId: string) => void;
  addToComparison: (hotelId: string) => boolean;
  removeComparison: (hotelId: string) => void;
  clearComparison: () => void;
  isInComparison: (hotelId: string) => boolean;
  canAddMore: boolean;
};

const ComparisonContext = createContext<ComparisonContextValue | null>(null);

export function ComparisonProvider({ children }: { children: ReactNode }) {
  const {
    comparisonIds,
    toggleComparison,
    addToComparison,
    removeComparison,
    clearComparison,
  } = useWatchlist();

  const comparisonHotels = useMemo(
    () =>
      comparisonIds
        .map((id) => trackedHotels.find((hotel) => hotel.id === id))
        .filter((hotel): hotel is Hotel => hotel !== undefined),
    [comparisonIds],
  );

  const value = useMemo(
    () => ({
      comparisonIds,
      comparisonHotels,
      toggleComparison,
      addToComparison,
      removeComparison,
      clearComparison,
      isInComparison: (hotelId: string) => comparisonIds.includes(hotelId),
      canAddMore: comparisonIds.length < MAX_COMPARE,
    }),
    [
      comparisonIds,
      comparisonHotels,
      toggleComparison,
      addToComparison,
      removeComparison,
      clearComparison,
    ],
  );

  return (
    <ComparisonContext.Provider value={value}>
      {children}
    </ComparisonContext.Provider>
  );
}

export function useComparison() {
  const context = useContext(ComparisonContext);
  if (!context) {
    throw new Error("useComparison must be used within ComparisonProvider");
  }
  return context;
}

export const comparisonLimit = COMPARISON_LIMIT;
