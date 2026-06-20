import type { ReactNode } from "react";
import {
  Cloud,
  CloudRain,
  CloudSnow,
  CloudSun,
  Droplets,
  Eye,
  Gauge,
  Loader2,
  Sun,
  Wind,
  Zap,
} from "lucide-react";
import type { ParsedWeather, WeatherField, WeatherPeriod } from "../lib/parseWeatherMcp";
import type { TemperatureTimeline } from "../lib/timelineApi";
import { formatTempC, formatPressureMetric, formatVisibilityMetric, formatWindMetric, translateCondition } from "../lib/units";
import {
  formatWeatherTimeRu,
  translateCloudCover,
  translateFieldLabel,
  translateMcpSummary,
  translatePeriodTitle,
} from "../lib/localize";
import type { WeatherMode } from "../lib/weatherApi";
import { fieldValue, weatherIconKey } from "../lib/parseWeatherMcp";
import { ru } from "../i18n/ru";
import TemperatureTimelineChart from "./TemperatureTimelineChart";

function WeatherIcon({
  conditions,
  size = 40,
}: {
  conditions?: string;
  size?: number;
}) {
  const key = weatherIconKey(conditions);
  const className = "text-cyan-400 shrink-0";

  switch (key) {
    case "sun":
      return <Sun size={size} className={className} />;
    case "rain":
      return <CloudRain size={size} className={className} />;
    case "snow":
      return <CloudSnow size={size} className={className} />;
    case "storm":
      return <Zap size={size} className={className} />;
    default:
      return conditions?.toLowerCase().includes("partly") ? (
        <CloudSun size={size} className={className} />
      ) : (
        <Cloud size={size} className={className} />
      );
  }
}

function MetricTile({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: ReactNode;
}) {
  return (
    <div className="bg-background/70 border border-border rounded p-3 min-w-0">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">
        {icon}
        <span>{label}</span>
      </div>
      <div className="text-sm font-mono font-semibold text-foreground truncate">
        {value}
      </div>
    </div>
  );
}

function CurrentWeatherView({
  parsed,
  destinationLabel,
  timeline,
}: {
  parsed: Extract<ParsedWeather, { kind: "current" }>;
  destinationLabel: string;
  timeline: TemperatureTimeline | null;
}) {
  const conditions = translateCondition(fieldValue(parsed.fields, "Conditions", "Forecast"));
  const temperature = formatTempC(fieldValue(parsed.fields, "Temperature"));
  const time = formatWeatherTimeRu(fieldValue(parsed.fields, "Time"));
  const humidity = fieldValue(parsed.fields, "Humidity");
  const wind = formatWindMetric(fieldValue(parsed.fields, "Wind"));
  const pressure = formatPressureMetric(fieldValue(parsed.fields, "Pressure"));
  const visibility = formatVisibilityMetric(fieldValue(parsed.fields, "Visibility"));
  const dewpoint = formatTempC(fieldValue(parsed.fields, "Dewpoint"));
  const cloudCover = translateCloudCover(fieldValue(parsed.fields, "Cloud Cover"));

  const metrics = [
    humidity && { label: ru.humidity, value: humidity, icon: <Droplets size={12} /> },
    wind && { label: ru.wind, value: wind, icon: <Wind size={12} /> },
    pressure && { label: ru.pressure, value: pressure, icon: <Gauge size={12} /> },
    visibility && { label: ru.visibility, value: visibility, icon: <Eye size={12} /> },
    dewpoint !== "—" && { label: ru.dewpoint, value: dewpoint, icon: <Droplets size={12} /> },
  ].filter(Boolean) as { label: string; value: string; icon: ReactNode }[];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-5 p-4 rounded bg-gradient-to-r from-cyan-500/10 via-background to-background border border-cyan-500/15">
        <WeatherIcon conditions={conditions} size={48} />
        <div className="min-w-0 flex-1">
          <div className="text-4xl font-mono font-bold tracking-tight text-foreground">
            {temperature}
          </div>
          <div className="text-base text-foreground/90 mt-1">
            {conditions ?? ru.conditionsUnavailable}
          </div>
          <div className="text-sm text-muted-foreground mt-2 leading-snug break-words">
            <span className="font-mono">{destinationLabel}</span>
            {time ? (
              <span className="font-mono text-muted-foreground/80">
                {" "}
                · {time}
              </span>
            ) : null}
          </div>
        </div>
      </div>

      <TemperatureTimelineChart timeline={timeline} />

      {metrics.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {metrics.map((metric) => (
            <MetricTile key={metric.label} {...metric} />
          ))}
        </div>
      ) : null}

      {cloudCover ? (
        <div className="text-xs text-muted-foreground border border-border rounded p-3 bg-background/50">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground/70">
            {ru.cloudCover} ·{" "}
          </span>
          {cloudCover}
        </div>
      ) : null}
    </div>
  );
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
      {children}
    </h4>
  );
}

function ForecastMeta({ fields }: { fields: WeatherField[] }) {
  if (fields.length === 0) {
    return null;
  }
  return (
    <div className="flex flex-wrap gap-2">
      {fields.map((field) => (
        <span
          key={field.label}
          className="text-[10px] font-mono px-2 py-1 rounded-sm bg-secondary text-muted-foreground border border-border/60"
        >
          {translateFieldLabel(field.label)}:{" "}
          {formatTempC(field.value) !== "—" ? formatTempC(field.value) : field.value}
        </span>
      ))}
    </div>
  );
}

function DailyForecastView({
  parsed,
}: {
  parsed: Extract<ParsedWeather, { kind: "forecast" }>;
}) {
  const periods = parsed.periods.slice(0, 7);

  return (
    <div className="space-y-4">
      <SectionTitle>{ru.dailyForecastTitle}</SectionTitle>
      <ForecastMeta fields={parsed.meta} />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {periods.map((period) => (
          <ForecastPeriodCard key={period.title} period={period} />
        ))}
      </div>
    </div>
  );
}

function HourlyForecastView({
  parsed,
}: {
  parsed: Extract<ParsedWeather, { kind: "forecast" }>;
}) {
  return (
    <div className="space-y-4">
      <SectionTitle>{ru.hourlyForecastTitle}</SectionTitle>
      <ForecastMeta fields={parsed.meta} />
      <div className="border border-border rounded overflow-hidden bg-background/50 max-h-[min(52vh,420px)] overflow-y-auto">
        <table className="w-full text-left text-xs">
          <thead className="sticky top-0 bg-secondary/90 backdrop-blur-sm">
            <tr className="border-b border-border">
              <th className="p-2.5 font-medium text-muted-foreground">Время</th>
              <th className="p-2.5 font-medium text-muted-foreground">°C</th>
              <th className="p-2.5 font-medium text-muted-foreground">Условия</th>
              <th className="p-2.5 font-medium text-muted-foreground hidden sm:table-cell">
                {ru.wind}
              </th>
              <th className="p-2.5 font-medium text-muted-foreground hidden md:table-cell">
                {ru.rain}
              </th>
            </tr>
          </thead>
          <tbody className="font-mono">
            {parsed.periods.map((period) => {
              const forecast = translateCondition(
                fieldValue(period.fields, "Forecast", "Conditions"),
              );
              const precip = fieldValue(
                period.fields,
                "Precipitation Chance",
                "Precipitation",
              );
              const wind = formatWindMetric(fieldValue(period.fields, "Wind"));

              return (
                <tr
                  key={period.title}
                  className="border-b border-border/40 hover:bg-secondary/20"
                >
                  <td className="p-2.5 font-sans text-foreground whitespace-nowrap">
                    {translatePeriodTitle(period.title)}
                  </td>
                  <td className="p-2.5 text-primary font-semibold">
                    {formatTempC(fieldValue(period.fields, "Temperature"))}
                  </td>
                  <td className="p-2.5 font-sans text-muted-foreground">
                    {forecast}
                  </td>
                  <td className="p-2.5 hidden sm:table-cell text-muted-foreground">
                    {wind || "—"}
                  </td>
                  <td className="p-2.5 hidden md:table-cell text-cyan-400/90">
                    {precip || "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ForecastPeriodCard({ period }: { period: WeatherPeriod }) {
  const temperature = formatTempC(fieldValue(period.fields, "Temperature"));
  const precip = fieldValue(
    period.fields,
    "Precipitation Chance",
    "Precipitation",
  );
  const wind = formatWindMetric(fieldValue(period.fields, "Wind"));
  const forecast = translateCondition(
    fieldValue(period.fields, "Forecast", "Conditions"),
  );

  return (
    <div className="bg-background/70 border border-border rounded p-4 hover:border-cyan-500/30 transition-colors">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {translatePeriodTitle(period.title)}
          </div>
          <div className="text-2xl font-mono font-bold mt-1">{temperature}</div>
        </div>
        <WeatherIcon conditions={forecast} size={28} />
      </div>
      <div className="space-y-1.5 text-xs text-muted-foreground">
        {forecast ? <div>{forecast}</div> : null}
        {precip ? (
          <div className="font-mono text-cyan-400/90">
            {ru.rain} {precip}
          </div>
        ) : null}
        {wind ? <div className="font-mono">{wind}</div> : null}
      </div>
      {period.summary ? (
        <p className="text-[11px] text-muted-foreground/80 mt-3 line-clamp-2 leading-relaxed">
          {translateMcpSummary(period.summary)}
        </p>
      ) : null}
    </div>
  );
}

export default function WeatherDisplay({
  parsed,
  mode,
  destinationLabel,
  loading,
  timeline,
}: {
  parsed: ParsedWeather | null;
  mode: WeatherMode;
  destinationLabel: string;
  loading: boolean;
  timeline: TemperatureTimeline | null;
}) {
  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
        <Loader2 size={16} className="animate-spin text-cyan-400" />
        {ru.loadingWeather}
      </div>
    );
  }

  if (!parsed) {
    return (
      <div className="py-12 text-center text-sm text-muted-foreground">
        {ru.noWeatherData}
      </div>
    );
  }

  if (mode === "current") {
    if (parsed.kind !== "current") {
      return (
        <div className="py-12 text-center text-sm text-muted-foreground">
          {ru.noWeatherData}
        </div>
      );
    }
    return (
      <CurrentWeatherView
        parsed={parsed}
        destinationLabel={destinationLabel}
        timeline={timeline}
      />
    );
  }

  if (parsed.kind !== "forecast") {
    return (
      <div className="py-12 text-center text-sm text-muted-foreground">
        {ru.noWeatherData}
      </div>
    );
  }

  if (mode === "hourly") {
    return <HourlyForecastView parsed={parsed} />;
  }

  return <DailyForecastView parsed={parsed} />;
}
