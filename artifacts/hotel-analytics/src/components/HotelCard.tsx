import type { MouseEvent } from "react";
import { MapPin, Star } from "lucide-react";
import type { Hotel } from "../data/mockData";
import { useComparison, comparisonLimit } from "../context/ComparisonContext";
import { useAppActivity } from "../context/AppActivityContext";
import { useWatchlist } from "../context/WatchlistContext";
import { ru } from "../i18n/ru";

export default function HotelCard({
  hotel,
  selected,
  onSelect,
}: {
  hotel: Hotel;
  selected: boolean;
  onSelect: () => void;
}) {
  const { isInComparison, addToComparison, removeComparison, comparisonIds } =
    useComparison();
  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const { addLog } = useAppActivity();
  const inComparison = isInComparison(hotel.id);
  const inWatchlist = isInWatchlist(hotel.id);
  const canAddMore = comparisonIds.length < comparisonLimit;

  const handleCompare = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    event.preventDefault();
    if (inComparison) {
      removeComparison(hotel.id);
      return;
    }
    if (!addToComparison(hotel.id)) {
      addLog(
        "CMP",
        "bg-amber-500/20 text-amber-400",
        ru.compareLimitReached(comparisonLimit),
      );
    }
  };

  return (
    <div
      className={`bg-card border rounded overflow-hidden flex flex-col text-left transition-colors w-full ${
        selected
          ? "border-cyan-400/60 ring-1 ring-cyan-400/30"
          : "border-border hover:border-border/80"
      }`}
    >
      <button
        type="button"
        onClick={onSelect}
        className="flex flex-col flex-1 text-left"
      >
        <div className="p-4 border-b border-border bg-secondary/20">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="font-bold text-sm text-foreground">{hotel.name}</h4>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center text-amber-500">
                  {Array.from({ length: hotel.stars }).map((_, i) => (
                    <Star key={i} size={10} fill="currentColor" />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <MapPin size={12} />
                  {hotel.market}
                </span>
              </div>
            </div>
            <span
              className={`text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-wider ${hotel.statusColor}`}
            >
              {hotel.statusRu}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2 py-1 border border-border rounded text-muted-foreground">
              {hotel.category}
            </span>
            <span className="text-xs px-2 py-1 border border-border rounded text-muted-foreground">
              {hotel.segment}
            </span>
          </div>
        </div>

        <div className="p-4 flex-1">
          <div className="grid grid-cols-3 gap-2 text-center mb-4">
            <div className="bg-secondary/30 rounded py-2.5 px-1">
              <div className="text-xs text-muted-foreground uppercase mb-1 tracking-wide">
                {ru.adr}
              </div>
              <div className="font-mono text-base font-bold">{hotel.adr}</div>
            </div>
            <div className="bg-secondary/30 rounded py-2.5 px-1 border border-primary/20">
              <div className="text-xs text-primary uppercase mb-1 tracking-wide">
                {ru.revpar}
              </div>
              <div className="font-mono text-base font-bold text-primary">
                {hotel.revpar}
              </div>
            </div>
            <div className="bg-secondary/30 rounded py-2.5 px-1">
              <div className="text-xs text-muted-foreground uppercase mb-1 tracking-wide">
                {ru.occ}
              </div>
              <div className="font-mono text-base font-bold">{hotel.occ}</div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className={`text-sm font-mono font-bold ${hotel.trendColor}`}>
              {hotel.trend}{" "}
              <span className="text-xs text-muted-foreground font-sans font-medium ml-1">
                {ru.yoyRevpar}
              </span>
            </div>
            <div className="flex items-end gap-0.5">
              {hotel.bars.map((h, i) => (
                <div
                  key={i}
                  className={`w-1 rounded-t-sm ${hotel.trendColor.includes("red") ? "bg-red-500" : "bg-primary"}`}
                  style={{ height: `${h * 3}px`, opacity: 0.4 + i * 0.1 }}
                />
              ))}
            </div>
          </div>
        </div>
      </button>

      <div className="flex border-t border-border">
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            toggleWatchlist(hotel.id);
          }}
          className={`flex-1 py-2 text-xs font-medium border-r border-border transition-colors ${
            inWatchlist
              ? "text-amber-400 bg-amber-500/10"
              : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
          }`}
        >
          {inWatchlist ? `★ ${ru.inWatchlist}` : ru.addToWatchlist}
        </button>
        <button
          type="button"
          onClick={handleCompare}
          className={`flex-1 py-2 text-xs font-medium border-r border-border transition-colors ${
            !inComparison && !canAddMore ? "opacity-40 cursor-not-allowed" : ""
          } ${
            inComparison
              ? "text-green-400 bg-green-500/10"
              : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
          }`}
        >
          {inComparison ? `✓ ${ru.inComparison}` : ru.compare}
        </button>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onSelect();
          }}
          className={`flex-1 py-2 text-xs font-medium transition-colors ${
            selected ? "text-cyan-400 bg-cyan-500/10" : "text-primary hover:bg-secondary/40"
          }`}
        >
          {selected ? `● ${ru.activeHotelSelected}` : ru.analyze}
        </button>
      </div>
    </div>
  );
}
