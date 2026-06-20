import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { trackedHotels } from "../lib/hotelCatalog";
import {
  getPersistedActiveHotelId,
  useWatchlist,
} from "./WatchlistContext";
import type { Hotel } from "../data/mockData";

type SelectedHotelContextValue = {
  selectedHotel: Hotel;
  selectedHotelId: string;
  setSelectedHotelId: (id: string) => void;
};

const SelectedHotelContext = createContext<SelectedHotelContextValue | null>(
  null,
);

export function SelectedHotelProvider({ children }: { children: ReactNode }) {
  const { persistActiveHotelId } = useWatchlist();
  const persistedId = getPersistedActiveHotelId();
  const initialId =
    persistedId && trackedHotels.some((hotel) => hotel.id === persistedId)
      ? persistedId
      : trackedHotels[2].id;

  const [selectedHotelId, setSelectedHotelIdState] = useState(initialId);

  const setSelectedHotelId = useCallback((id: string) => {
    setSelectedHotelIdState(id);
    persistActiveHotelId(id);
  }, [persistActiveHotelId]);

  const selectedHotel = useMemo(
    () =>
      trackedHotels.find((hotel) => hotel.id === selectedHotelId) ??
      trackedHotels[0],
    [selectedHotelId],
  );

  const value = useMemo(
    () => ({ selectedHotel, selectedHotelId, setSelectedHotelId }),
    [selectedHotel, selectedHotelId, setSelectedHotelId],
  );

  return (
    <SelectedHotelContext.Provider value={value}>
      {children}
    </SelectedHotelContext.Provider>
  );
}

export function useSelectedHotel() {
  const context = useContext(SelectedHotelContext);
  if (!context) {
    throw new Error("useSelectedHotel must be used within SelectedHotelProvider");
  }
  return context;
}
