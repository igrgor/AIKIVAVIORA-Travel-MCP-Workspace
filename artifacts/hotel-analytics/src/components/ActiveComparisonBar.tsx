import { X } from "lucide-react";
import { useComparison, comparisonLimit } from "../context/ComparisonContext";
import { ru } from "../i18n/ru";

export default function ActiveComparisonBar() {
  const {
    comparisonHotels,
    comparisonIds,
    removeComparison,
    clearComparison,
  } = useComparison();

  if (comparisonIds.length === 0) {
    return null;
  }

  return (
    <div className="mb-4 rounded border border-green-500/25 bg-green-500/5 px-3 py-2.5 space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-[11px] text-muted-foreground">
          {ru.compareSelectHint(comparisonIds.length, comparisonLimit)} · {ru.compareRemoveHint}
        </p>
        <button
          type="button"
          onClick={clearComparison}
          className="text-[10px] text-muted-foreground hover:text-foreground underline-offset-2 hover:underline"
        >
          {ru.clearAllComparison}
        </button>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {comparisonHotels.map((hotel) => (
          <span
            key={hotel.id}
            className="inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-sm bg-green-500/15 text-green-300 border border-green-500/30"
          >
            {hotel.name}
            <button
              type="button"
              onClick={() => removeComparison(hotel.id)}
              className="text-green-200/80 hover:text-foreground"
              aria-label={`${ru.removeFromComparison} ${hotel.name}`}
            >
              <X size={10} />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}
