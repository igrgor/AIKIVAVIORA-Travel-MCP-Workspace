import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { Hotel } from "../data/mockData";
import { groupHotelsByMarket, searchHotels, trackedHotelsTotal } from "../lib/hotelCatalog";
import { ru } from "../i18n/ru";
import { DevBadge } from "./DevNotice";

import { useWatchlist } from "../context/WatchlistContext";

export default function HotelPicker({
  hotels,
  value,
  onChange,
  className = "",
}: {
  hotels: Hotel[];
  value: string;
  onChange: (hotelId: string) => void;
  className?: string;
}) {
  const [query, setQuery] = useState("");
  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const selectedInWatchlist = isInWatchlist(value);

  const filteredHotels = useMemo(
    () => searchHotels(hotels, query),
    [hotels, query],
  );
  const grouped = useMemo(
    () => groupHotelsByMarket(filteredHotels),
    [filteredHotels],
  );

  return (
    <div className={`space-y-2 min-w-[220px] flex-1 ${className}`}>
      <label className="text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
        {ru.selectFromList}
        <DevBadge kind="wip" title={ru.catalogAllTabHint} />
      </label>
      <div className="relative">
        <Search
          size={12}
          className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
        />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={ru.searchHotelPlaceholder}
          title={ru.catalogSearchHint}
          className="w-full bg-background border border-border rounded-sm py-1.5 pl-8 pr-3 text-xs focus:outline-none focus:border-primary"
        />
      </div>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full bg-background border border-border rounded-sm py-2 px-2.5 text-sm focus:outline-none focus:border-primary"
      >
        {filteredHotels.length === 0 ? (
          <option value="" disabled>
            {ru.noHotelsFound}
          </option>
        ) : (
          [...grouped.entries()].map(([market, marketHotels]) => (
            <optgroup key={market} label={market}>
              {marketHotels.map((hotel) => (
                <option key={hotel.id} value={hotel.id}>
                  {hotel.name} · {hotel.stars}★ · {hotel.adr}
                </option>
              ))}
            </optgroup>
          ))
        )}
      </select>
      <button
        type="button"
        onClick={() => toggleWatchlist(value)}
        disabled={!value}
        className={`text-[10px] px-2 py-1 rounded border transition-colors ${
          selectedInWatchlist
            ? "border-amber-500/40 text-amber-400 bg-amber-500/10"
            : "border-border text-muted-foreground hover:text-foreground hover:bg-secondary/40"
        }`}
      >
        {selectedInWatchlist ? `★ ${ru.inWatchlist}` : ru.addToWatchlist}
      </button>
      <p className="text-[10px] text-muted-foreground" title={ru.catalogAllTabHint}>
        {ru.catalogHint(filteredHotels.length, hotels.length, trackedHotelsTotal)}
      </p>
    </div>
  );
}
