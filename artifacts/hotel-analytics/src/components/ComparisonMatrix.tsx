import { useMemo, useState } from "react";
import { BookmarkPlus, X } from "lucide-react";
import { useComparison, comparisonLimit } from "../context/ComparisonContext";
import { useWatchlist } from "../context/WatchlistContext";
import { useReports } from "../context/ReportsContext";
import { useAppActivity } from "../context/AppActivityContext";
import { searchHotels, trackedHotels } from "../lib/hotelCatalog";
import { buildComparisonRows } from "../lib/comparisonMetrics";
import { appQuarterShort } from "../lib/appDates";
import { ru } from "../i18n/ru";
export default function ComparisonMatrix() {
  const {
    comparisonHotels,
    comparisonIds,
    toggleComparison,
    removeComparison,
    clearComparison,
    isInComparison,
    canAddMore,
  } = useComparison();
  const { isInWatchlist, addToWatchlist } = useWatchlist();
  const { saveComparisonSnapshot } = useReports();
  const { addLog } = useAppActivity();
  const [query, setQuery] = useState("");
  const [snapshotSaved, setSnapshotSaved] = useState(false);

  const filteredHotels = useMemo(    () => searchHotels(trackedHotels, query),
    [query],
  );
  const rows = useMemo(
    () => buildComparisonRows(comparisonHotels),
    [comparisonHotels],
  );

  const missingFromWatchlist = useMemo(
    () => comparisonHotels.filter((hotel) => !isInWatchlist(hotel.id)),
    [comparisonHotels, isInWatchlist],
  );

  const handleSaveSnapshot = () => {
    if (comparisonHotels.length === 0) {
      return;
    }
    const title = `Сравнение · ${comparisonHotels.map((hotel) => hotel.name).join(" vs ")} · ${appQuarterShort}`;
    saveComparisonSnapshot({
      title,
      hotelIds: comparisonHotels.map((hotel) => hotel.id),
      hotelNames: comparisonHotels.map((hotel) => hotel.name),
      rows: rows.map((row) => ({ metric: row.metric, values: row.values })),
      tags: comparisonHotels.map((hotel) => hotel.market),
    });
    setSnapshotSaved(true);
    addLog("REPORT", "bg-amber-500/20 text-amber-400", ru.snapshotSaved);
    window.setTimeout(() => setSnapshotSaved(false), 2500);
  };

  const handleAddMissingToWatchlist = () => {
    missingFromWatchlist.forEach((hotel) => addToWatchlist(hotel.id));
    addLog("LIST", "bg-cyan-500/20 text-cyan-400", `Добавлено в список: ${missingFromWatchlist.length}`);
  };

  return (    <div className="space-y-4">
      <div className="border border-border rounded bg-card p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">
            {ru.compareSelectHint(comparisonIds.length, comparisonLimit)}
          </p>
          {comparisonIds.length > 0 ? (
            <button
              type="button"
              onClick={clearComparison}
              className="text-[10px] text-muted-foreground hover:text-foreground"
            >
              {ru.clearComparison}
            </button>
          ) : null}
        </div>

        <p className="text-[10px] text-muted-foreground leading-relaxed">
          {ru.workspaceHelpCompare(comparisonLimit)}
        </p>

        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={ru.searchHotelPlaceholder}
          title={ru.catalogSearchHint}
          className="w-full bg-background border border-border rounded-sm py-1.5 px-3 text-xs focus:outline-none focus:border-primary"
        />

        <div className="max-h-48 overflow-y-auto border border-border/60 rounded-sm divide-y divide-border/40">
          {filteredHotels.length === 0 ? (
            <p className="p-3 text-xs text-muted-foreground">{ru.noHotelsFound}</p>
          ) : (
            filteredHotels.map((hotel) => {
              const checked = isInComparison(hotel.id);
              const disabled = !checked && !canAddMore;

              return (
                <label
                  key={hotel.id}
                  className={`flex items-center gap-3 px-3 py-2 text-sm cursor-pointer hover:bg-secondary/30 ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    disabled={disabled}
                    onChange={() => toggleComparison(hotel.id)}
                    className="accent-primary"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="font-medium text-foreground">{hotel.name}</span>
                    <span className="block text-[10px] text-muted-foreground">
                      {hotel.market} · {hotel.adr} · {hotel.revpar}
                    </span>
                  </span>
                  <span className="text-[10px] text-muted-foreground shrink-0">
                    {hotel.stars}★
                  </span>
                </label>
              );
            })
          )}
        </div>

        {comparisonHotels.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {comparisonHotels.map((hotel) => (
              <span
                key={hotel.id}
                className="inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-sm bg-secondary text-foreground border border-border/60"
              >
                {hotel.name}
                <button
                  type="button"
                  onClick={() => removeComparison(hotel.id)}
                  className="text-muted-foreground hover:text-foreground"
                  aria-label={`Убрать ${hotel.name}`}
                >
                  <X size={10} />
                </button>
              </span>
            ))}
          </div>
        ) : null}
      </div>

      {comparisonHotels.length === 0 ? (
        <div className="border border-dashed border-border rounded p-6 text-center text-sm text-muted-foreground">
          {ru.compareEmpty}
        </div>
      ) : (
        <>
        {missingFromWatchlist.length > 0 ? (
          <div className="flex flex-wrap items-center justify-between gap-2 border border-dashed border-amber-500/30 rounded bg-amber-500/5 px-3 py-2 text-xs text-muted-foreground">
            <span>{ru.compareWatchlistHint}</span>
            <button
              type="button"
              onClick={handleAddMissingToWatchlist}
              className="flex items-center gap-1 text-amber-400 hover:text-amber-300"
            >
              <BookmarkPlus size={12} />
              {ru.addToWatchlist} ({missingFromWatchlist.length})
            </button>
          </div>
        ) : null}
        <div className="border border-border rounded overflow-hidden bg-card text-sm">          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="p-3 font-medium text-muted-foreground uppercase text-xs w-[25%]">
                  {ru.metric}
                </th>
                {comparisonHotels.map((hotel) => (
                  <th key={hotel.id} className="p-3 font-medium text-foreground">
                    <div>{hotel.name}</div>
                    <div className="text-[10px] font-normal text-muted-foreground mt-0.5">
                      {hotel.market}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="font-mono text-xs">
              {rows.map((row) => (
                <tr
                  key={row.metric}
                  className="border-b border-border/50 hover:bg-secondary/20 transition-colors last:border-0"
                >
                  <td className="p-3 font-sans text-muted-foreground border-r border-border/50">
                    {row.metric}
                  </td>
                  {row.values.map((value, index) => (
                    <td
                      key={`${row.metric}-${index}`}
                      className={`p-3 ${
                        row.highlightIndex === index
                          ? "bg-green-500/10 text-green-400"
                          : row.lowlightIndex === index
                            ? "bg-red-500/10 text-red-400"
                            : "text-foreground"
                      }`}
                    >
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button
          type="button"
          onClick={handleSaveSnapshot}
          className="w-full text-xs px-4 py-2 border border-border rounded-sm hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground border-dashed"
        >
          {snapshotSaved ? `✓ ${ru.snapshotSaved}` : ru.saveComparisonSnapshot}
        </button>
        </>
      )}    </div>
  );
}
