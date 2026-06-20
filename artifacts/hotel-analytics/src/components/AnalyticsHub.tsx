import { useEffect, useRef, useState } from "react";
import { mockKPIs } from "../data/mockData";
import MetricCard from "./MetricCard";
import HotelCard from "./HotelCard";
import HotelPicker from "./HotelPicker";
import ComparisonMatrix from "./ComparisonMatrix";
import WeatherPanel from "./WeatherPanel";
import SavedReportsPanel from "./SavedReportsPanel";
import ActiveComparisonBar from "./ActiveComparisonBar";
import { DevBadge, DevBanner } from "./DevNotice";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { useSelectedHotel } from "../context/SelectedHotelContext";
import { useComparison, comparisonLimit } from "../context/ComparisonContext";
import { useWatchlist } from "../context/WatchlistContext";
import { useReports } from "../context/ReportsContext";
import {
  filterTrackedHotels,
  HOTEL_FILTERS,
  trackedHotels,
  trackedHotelsTotal,
  type HotelFilterId,
} from "../lib/hotelCatalog";
import { cityFromMarket } from "../lib/localize";
import { formatLastSync, formatStatusUtc } from "../lib/appDates";
import { ru } from "../i18n/ru";
const DEFAULT_SECTIONS = ["weather", "comparison"] as const;
const TRACKED_HOTELS_SECTION_ID = "tracked-hotels";
const RESEARCH_SECTION_ID = "research-workspace";

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function AnalyticsHub() {
  const { selectedHotelId, setSelectedHotelId, selectedHotel } = useSelectedHotel();
  const { comparisonIds, toggleComparison, isInComparison, canAddMore } = useComparison();
  const { watchlist } = useWatchlist();
  const { reports } = useReports();
  const [hotelFilter, setHotelFilter] = useState<HotelFilterId>("all");
  const [openSections, setOpenSections] = useState<string[]>([...DEFAULT_SECTIONS]);
  const prevWatchlistLength = useRef(watchlist.length);
  const watchlistIds = watchlist.map((entry) => entry.hotelId);
  const visibleHotels = filterTrackedHotels(trackedHotels, hotelFilter, watchlistIds);
  const mineFilterEmpty = hotelFilter === "mine" && watchlistIds.length === 0;

  const openMyList = () => {
    setHotelFilter("mine");
    setOpenSections((prev) =>
      prev.includes("hotels") ? prev : [...prev, "hotels"],
    );
    window.requestAnimationFrame(() => {
      scrollToSection(TRACKED_HOTELS_SECTION_ID);
    });
  };

  const openCatalog = () => {
    setHotelFilter("all");
    setOpenSections((prev) =>
      prev.includes("hotels") ? prev : [...prev, "hotels"],
    );
    window.requestAnimationFrame(() => {
      scrollToSection("hotel-picker");
    });
  };

  const openReports = () => {
    setOpenSections((prev) =>
      prev.includes("research") ? prev : [...prev, "research"],
    );
    window.requestAnimationFrame(() => {
      scrollToSection(RESEARCH_SECTION_ID);
    });
  };

  useEffect(() => {
    if (watchlist.length > prevWatchlistLength.current) {
      setHotelFilter("mine");
      setOpenSections((prev) =>
        prev.includes("hotels") ? prev : [...prev, "hotels"],
      );
    }
    prevWatchlistLength.current = watchlist.length;
  }, [watchlist.length]);
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Top Status Bar */}
      <div className="h-8 border-b border-border bg-card shrink-0 flex items-center px-4 justify-between text-[11px] font-mono tracking-tight text-muted-foreground">
        <div className="flex items-center gap-4">
          <span className="text-foreground font-sans font-medium uppercase tracking-wider">{ru.appTitle}</span>
          <span>{formatStatusUtc()}</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={openMyList}
            className="flex items-center gap-1.5 hover:text-foreground transition-colors"
            title={ru.myList}
          >
            <span className="w-1 h-1 rounded-full bg-cyan-500" />
            {ru.watchlistCount(watchlist.length)}
          </button>
          <button
            type="button"
            onClick={openCatalog}
            className="flex items-center gap-1.5 hover:text-foreground transition-colors"
            title={ru.catalogStatusHint(trackedHotels.length, trackedHotelsTotal)}
          >
            <span className="w-1 h-1 rounded-full bg-blue-500" />
            {trackedHotels.length} / {trackedHotelsTotal} {ru.hotelsTracked}
          </button>
          <button
            type="button"
            onClick={() => scrollToSection("comparison-matrix")}
            className="flex items-center gap-1.5 hover:text-foreground transition-colors"
            title={ru.workspaceHelpCompare(comparisonLimit)}
          >
            <span className="w-1 h-1 rounded-full bg-amber-500" />
            {comparisonIds.length} {ru.activeComparisons}
          </button>
          <button
            type="button"
            onClick={openReports}
            className="flex items-center gap-1.5 hover:text-foreground transition-colors"
            title={ru.workspaceHelpReports}
          >
            {reports.length} {ru.reports}
          </button>
          <span title={ru.demoDataHint}>{formatLastSync()}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        
        {/* KPI Row */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Сводка рынка
            </span>
            <DevBadge kind="demo" title={ru.kpiDemoHint} />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {mockKPIs.map((kpi, i) => (
              <MetricCard key={i} kpi={kpi} demo />
            ))}
          </div>
        </div>

        <div id="hotel-picker" className="bg-card border border-border rounded p-4 space-y-3">
          <HotelPicker
            hotels={trackedHotels}
            value={selectedHotelId}
            onChange={setSelectedHotelId}
          />
          <p className="text-[10px] text-muted-foreground leading-relaxed border-t border-border/60 pt-2">
            <span className="font-semibold text-foreground/80">{ru.workspaceHelpTitle}. </span>
            {ru.workspaceHelpHotels}
            <span className="block mt-1 text-amber-400/80">{ru.catalogOpenHint}</span>
          </p>
        </div>

        <Accordion
          type="multiple"
          value={openSections}
          onValueChange={setOpenSections}
          className="space-y-3"
        >
          <AccordionItem
            value="hotels"
            id={TRACKED_HOTELS_SECTION_ID}
            className="border border-border rounded bg-card px-4"
          >
            <AccordionTrigger className="hover:no-underline py-3">
              <div className="flex flex-1 items-center justify-between gap-3 pr-2 min-w-0">
                <div className="min-w-0 text-left">
                  <div className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">
                    {ru.trackedProperties}
                  </div>
                  <div className="text-xs text-foreground/80 font-normal normal-case mt-0.5 truncate">
                    {ru.hotelsAccordionHint} · {visibleHotels.length} /{" "}
                    {hotelFilter === "all"
                      ? trackedHotelsTotal
                      : trackedHotels.length}
                    {hotelFilter === "all" ? (
                      <DevBadge kind="wip" className="ml-1.5 align-middle" title={ru.catalogAllTabHint} />
                    ) : null}
                  </div>
                </div>
                <span className="text-[10px] font-mono text-cyan-400/90 shrink-0 hidden sm:inline">
                  {selectedHotel.name}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <ActiveComparisonBar />
              <div className="flex flex-wrap items-center justify-end gap-1 text-[11px] bg-secondary/50 rounded-sm p-0.5 mb-4">
                {HOTEL_FILTERS.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      setHotelFilter(tab.id);
                      if (tab.id === "mine") {
                        setOpenSections((prev) =>
                          prev.includes("hotels") ? prev : [...prev, "hotels"],
                        );
                      }
                    }}
                    className={`px-3 py-1 rounded-sm transition-colors ${hotelFilter === tab.id ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                    title={tab.id === "all" ? ru.catalogAllTabHint : undefined}
                  >
                    {tab.id === "mine" && watchlist.length > 0
                      ? `${tab.label} (${watchlist.length})`
                      : tab.id === "all"
                        ? ru.catalogAllTab(trackedHotelsTotal)
                        : tab.label}
                  </button>
                ))}
              </div>

              {hotelFilter === "all" ? (
                <DevBanner kind="wip" className="mb-4">
                  {ru.catalogAllBanner(trackedHotels.length, trackedHotelsTotal)}
                </DevBanner>
              ) : null}

              <div className="grid grid-cols-2 xl:grid-cols-3 gap-4 max-h-[min(52vh,520px)] overflow-y-auto pr-1">
                {visibleHotels.map((hotel) => (
                  <HotelCard
                    key={hotel.id}
                    hotel={hotel}
                    selected={selectedHotelId === hotel.id}
                    onSelect={() => setSelectedHotelId(hotel.id)}
                  />
                ))}
              </div>

              {mineFilterEmpty ? (
                <p className="text-sm text-muted-foreground text-center py-8 border border-dashed border-border rounded mt-4">
                  {ru.myListEmpty}
                </p>
              ) : null}
              {hotelFilter !== "mine" && visibleHotels.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8 border border-dashed border-border rounded mt-4">
                  {ru.noHotelsFound}
                </p>
              ) : null}
              {hotelFilter === "mine" && watchlistIds.length > 0 && visibleHotels.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8 border border-dashed border-border rounded mt-4">
                  {ru.noHotelsFound}
                </p>
              ) : null}            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="weather"
            className="border border-border rounded bg-card px-4"
          >
            <AccordionTrigger className="hover:no-underline py-3">
              <div className="text-left">
                <div className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">
                  {ru.destinationWeather}
                </div>
                <div className="text-xs text-foreground/80 font-normal normal-case mt-0.5">
                  {cityFromMarket(selectedHotel.market)} · {selectedHotel.name}
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-2">
              <WeatherPanel embedded />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="comparison"
            id="comparison-matrix"
            className="border border-border rounded bg-card px-4"
          >
            <AccordionTrigger className="hover:no-underline py-3">
              <div className="text-left">
                <div className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">
                  {ru.comparisonMatrix}
                </div>
                <div className="text-xs text-muted-foreground font-normal normal-case mt-0.5">
                  {ru.selectHotelsCompare}
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <ComparisonMatrix />
              <button
                type="button"
                onClick={() => {
                  if (!isInComparison(selectedHotel.id)) {
                    toggleComparison(selectedHotel.id);
                  }
                }}
                disabled={!canAddMore && !isInComparison(selectedHotel.id)}
                className="mt-4 text-xs px-4 py-2 border border-border rounded-sm hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground w-full border-dashed disabled:opacity-40"
              >
                {isInComparison(selectedHotel.id)
                  ? `${ru.inComparison}: ${selectedHotel.name}`
                  : `${ru.addToComparison} · ${selectedHotel.name}`}
              </button>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="research"
            id="research-workspace"
            className="border border-border rounded bg-card px-4"
          >
            <AccordionTrigger className="hover:no-underline py-3">
              <div className="text-left">
                <div className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">
                  {ru.researchWorkspace}
                </div>
                <div className="text-xs text-muted-foreground font-normal normal-case mt-0.5">
                  {ru.activeResearch} · {ru.savedReports}
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <p className="text-[10px] text-muted-foreground mb-4 leading-relaxed">
                {ru.workspaceHelpReports} {ru.createReportHint}: кнопка «Отчёт по рынку» в чате слева
                или свой текст в поле ввода. Снимок сравнения — в матрице сравнения.
                <span className="block mt-1 text-amber-400/80">{ru.reportsStorageHint}</span>
              </p>
              <SavedReportsPanel />
            </AccordionContent>          </AccordionItem>
        </Accordion>

      </div>
    </div>
  );
}
