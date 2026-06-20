import { useEffect, useMemo, useState } from "react";
import { ChevronDown, CloudSun, Loader2, RefreshCw } from "lucide-react";
import { useAppActivity } from "../context/AppActivityContext";
import { useSelectedHotel } from "../context/SelectedHotelContext";
import {
  extractMcpText,
  fetchWeather,
  type WeatherMode,
} from "../lib/weatherApi";
import { fetchTemperatureTimeline, type TemperatureTimeline } from "../lib/timelineApi";
import { formatWeatherDestination } from "../lib/localize";
import { parseWeatherMcp } from "../lib/parseWeatherMcp";
import { ru } from "../i18n/ru";
import WeatherDisplay from "./WeatherDisplay";

const MODES: { id: WeatherMode; label: string; tool: string }[] = [
  { id: "current", label: ru.now, tool: "get_current_conditions" },
  { id: "daily", label: ru.sevenDay, tool: "get_forecast (daily)" },
  { id: "hourly", label: ru.hourly, tool: "get_forecast (hourly)" },
];

export default function WeatherPanel({ embedded = false }: { embedded?: boolean }) {
  const { addLog } = useAppActivity();
  const { selectedHotel } = useSelectedHotel();
  const [mode, setMode] = useState<WeatherMode>("current");
  const [rawText, setRawText] = useState("");
  const [timeline, setTimeline] = useState<TemperatureTimeline | null>(null);
  const [showRaw, setShowRaw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parsed = useMemo(() => parseWeatherMcp(rawText), [rawText]);

  const loadWeather = async (nextMode: WeatherMode = mode) => {
    const target = selectedHotel;
    const modeMeta = MODES.find((m) => m.id === nextMode) ?? MODES[0];

    setLoading(true);
    setError(null);
    setRawText("");

    addLog(
      "MCP",
      "bg-cyan-500/20 text-cyan-400",
      `Weather MCP → ${modeMeta.tool} · ${target.name} · ${target.market}`,
    );

    try {
      const days = nextMode === "hourly" ? 2 : 7;
      const result = await fetchWeather(
        nextMode,
        target.latitude,
        target.longitude,
        nextMode === "current" ? undefined : days,
      );

      let timelineData: TemperatureTimeline | null = null;
      if (nextMode === "current") {
        timelineData = await fetchTemperatureTimeline(
          target.latitude,
          target.longitude,
        );
      }

      const body = extractMcpText(result);
      setRawText(body);
      setTimeline(timelineData);

      addLog(
        result.isError ? "ALERT" : "DATA",
        result.isError
          ? "bg-amber-500/20 text-amber-400"
          : "bg-green-500/20 text-green-400",
        result.isError
          ? `Ошибка MCP · ${target.name}`
          : `Погода MCP · ${target.name} · ${modeMeta.label}`,
      );
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Ошибка запроса погоды";
      setError(message);
      setRawText("");
      setTimeline(null);
      addLog("ALERT", "bg-amber-500/20 text-amber-400", message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadWeather(mode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedHotel.id]);

  return (
    <div id="destination-weather" className="space-y-4">
      {!embedded ? (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CloudSun size={16} className="text-cyan-400" />
            <h3 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">
              {ru.destinationWeather}
            </h3>
            <span className="px-1.5 py-0.5 rounded-sm bg-cyan-500/10 text-[10px] font-mono text-cyan-400 border border-cyan-500/20">
              {ru.mcpBadge}
            </span>
          </div>
          <button
            type="button"
            onClick={() => void loadWeather()}
            disabled={loading}
            className="flex items-center gap-1.5 text-xs border border-border px-3 py-1.5 rounded-sm hover:bg-secondary disabled:opacity-50"
          >
            {loading ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              <RefreshCw size={12} />
            )}
            {ru.refresh}
          </button>
        </div>
      ) : null}

      <div
        className={
          embedded
            ? "space-y-4"
            : "bg-card border border-border rounded p-4 space-y-4"
        }
      >
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 text-[11px] bg-secondary/50 rounded-sm p-0.5">
            {MODES.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setMode(tab.id);
                  void loadWeather(tab.id);
                }}
                className={`px-3 py-1 rounded-sm transition-colors ${
                  mode === tab.id
                    ? "bg-background shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <span className="text-[11px] text-muted-foreground font-mono">
            {selectedHotel.latitude.toFixed(4)}, {selectedHotel.longitude.toFixed(4)}
          </span>

          <button
            type="button"
            onClick={() => void loadWeather()}
            disabled={loading}
            className={`flex items-center gap-1.5 text-xs border border-border px-3 py-1.5 rounded-sm hover:bg-secondary disabled:opacity-50 ${embedded ? "ml-auto" : ""}`}
          >
            {loading ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              <RefreshCw size={12} />
            )}
            {ru.refresh}
          </button>
        </div>

        {error ? (
          <div className="text-sm text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded p-3">
            {error}
            <div className="text-xs text-muted-foreground mt-2">{ru.apiError}</div>
          </div>
        ) : (
          <WeatherDisplay
            parsed={parsed}
            mode={mode}
            destinationLabel={formatWeatherDestination(
              selectedHotel.name,
              selectedHotel.market,
            )}
            loading={loading}
            timeline={timeline}
          />
        )}

        {rawText && !loading ? (
          <div className="border-t border-border pt-3">
            <button
              type="button"
              onClick={() => setShowRaw((open) => !open)}
              className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground hover:text-foreground"
            >
              <ChevronDown
                size={12}
                className={`transition-transform ${showRaw ? "rotate-180" : ""}`}
              />
              {ru.mcpRaw}
            </button>
            {showRaw ? (
              <pre className="mt-2 text-[10px] font-mono text-muted-foreground whitespace-pre-wrap leading-relaxed bg-background/60 border border-border rounded p-3 max-h-[160px] overflow-y-auto">
                {rawText}
              </pre>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
