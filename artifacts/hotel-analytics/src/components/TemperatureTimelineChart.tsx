import type { TemperatureTimeline } from "../lib/timelineApi";
import { formatTimelineRangeRu } from "../lib/appDates";
import { ru } from "../i18n/ru";
import type { CSSProperties } from "react";

const CHART_FONT = "'JetBrains Mono', monospace";
const AXIS_FONT_SIZE = 10;
const LINE_COLOR = "#94a3b8";
const TODAY_COLOR = "#22d3ee";

function chartTextStyle(
  fontSize: number = AXIS_FONT_SIZE,
  fontWeight: CSSProperties["fontWeight"] = 600,
): CSSProperties {
  return {
    fontFamily: CHART_FONT,
    fontSize,
    fontWeight,
    letterSpacing: "-0.03em",
    fontVariantNumeric: "tabular-nums",
  };
}

const VIEW_WIDTH = 1000;
const PAD_LEFT = 48;
const PAD_RIGHT = 16;
const PAD_TOP = 20;
const PAD_BOTTOM = 56;
const PLOT_HEIGHT = 120;
const VIEW_HEIGHT = PAD_TOP + PLOT_HEIGHT + PAD_BOTTOM;
const PLOT_WIDTH = VIEW_WIDTH - PAD_LEFT - PAD_RIGHT;

const Y_MIN = -25;
const Y_MAX = 50;
const Y_TICKS = [-25, 0, 25, 50];

const DATE_ROW_Y = VIEW_HEIGHT - 8;
const SLOTS_PER_DAY = 4;

type DayPoint = {
  dayIndex: number;
  tempC: number;
  kind: TemperatureTimeline["points"][number]["kind"];
  date: string;
};

function dayCount(total: number): number {
  return total / SLOTS_PER_DAY;
}

function xForDay(dayIndex: number, days: number): number {
  return PAD_LEFT + (dayIndex / Math.max(days - 1, 1)) * PLOT_WIDTH;
}

function yPosition(temp: number): number {
  const ratio = (temp - Y_MIN) / (Y_MAX - Y_MIN);
  return PAD_TOP + PLOT_HEIGHT - ratio * PLOT_HEIGHT;
}

function dayNumberLabel(date: string): string {
  return String(new Date(`${date}T12:00:00`).getDate());
}

function isVerifiedPoint(
  point: TemperatureTimeline["points"][number] | undefined,
): boolean {
  return (
    point !== undefined &&
    point.tempC !== null &&
    point.tempC !== undefined &&
    point.verified !== false
  );
}

function pickDailyPoint(
  points: TemperatureTimeline["points"],
  dayIndex: number,
): DayPoint | null {
  const dayStart = dayIndex * SLOTS_PER_DAY;
  for (const offset of [2, 1, 3, 0]) {
    const point = points[dayStart + offset];
    if (isVerifiedPoint(point)) {
      return {
        dayIndex,
        tempC: point!.tempC!,
        kind: point!.kind,
        date: point!.date,
      };
    }
  }
  return null;
}

function buildDailySeries(points: TemperatureTimeline["points"]): DayPoint[] {
  const days = dayCount(points.length);
  const series: DayPoint[] = [];
  for (let dayIndex = 0; dayIndex < days; dayIndex += 1) {
    const dayPoint = pickDailyPoint(points, dayIndex);
    if (dayPoint) {
      series.push(dayPoint);
    }
  }
  return series;
}

function shouldShowValueLabel(
  point: DayPoint,
  series: DayPoint[],
  index: number,
): boolean {
  if (point.kind === "today") {
    return true;
  }
  if (index === 0 || index === series.length - 1) {
    return true;
  }
  return point.dayIndex % 5 === 0;
}

export default function TemperatureTimelineChart({
  timeline,
}: {
  timeline: TemperatureTimeline | null;
}) {
  if (!timeline || timeline.points.length === 0) {
    return null;
  }

  const dailySeries = buildDailySeries(timeline.points);
  if (dailySeries.length < 2) {
    return null;
  }

  const total = timeline.points.length;
  const days = dayCount(total);
  const baselineY = PAD_TOP + PLOT_HEIGHT;
  const todayPoint = dailySeries.find((p) => p.kind === "today");
  const todayDayIndex = todayPoint?.dayIndex ?? Math.floor(days / 2);
  const centerX = xForDay(todayDayIndex, days);

  const linePoints = dailySeries
    .map((point) => {
      const x = xForDay(point.dayIndex, days);
      const y = yPosition(point.tempC);
      return `${x},${y}`;
    })
    .join(" ");

  const dayLabels = timeline.points
    .map((point, index) => ({ point, index }))
    .filter(({ point }) => point.hour === 0);
  const periodLabel = formatTimelineRangeRu(
    dayLabels[0]?.point.date ?? timeline.centerDate,
    dayLabels[dayLabels.length - 1]?.point.date ?? timeline.centerDate,
  );

  return (
    <div className="space-y-2 border border-border rounded p-3 bg-background/50 w-full">
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] items-center gap-y-1 gap-x-2 text-xs uppercase tracking-wider text-muted-foreground font-mono">
        <span className="font-semibold sm:justify-self-start">{ru.timelineTitle}</span>
        <span className="font-sans normal-case text-[12px] font-semibold text-foreground/90 tracking-normal text-center sm:px-2">
          {periodLabel}
        </span>
        <span className="hidden sm:block" aria-hidden />
      </div>

      <svg
        viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
        className="w-full block"
        style={{ height: "auto", aspectRatio: `${VIEW_WIDTH} / ${VIEW_HEIGHT}` }}
        role="img"
        aria-label={ru.timelineTitle}
      >
        {Y_TICKS.map((tick) => {
          const y = yPosition(tick);
          return (
            <g key={tick}>
              <line
                x1={PAD_LEFT}
                y1={y}
                x2={VIEW_WIDTH - PAD_RIGHT}
                y2={y}
                stroke="rgba(148,163,184,0.1)"
                strokeWidth="1"
              />
              <text
                x={PAD_LEFT - 10}
                y={y + 4}
                textAnchor="end"
                fill="rgba(203,213,225,0.8)"
                style={chartTextStyle(AXIS_FONT_SIZE, 500)}
              >
                {tick}°
              </text>
            </g>
          );
        })}

        <line
          x1={centerX}
          y1={PAD_TOP}
          x2={centerX}
          y2={baselineY}
          stroke="rgba(34,211,238,0.35)"
          strokeWidth="1"
          strokeDasharray="4 4"
        />

        <line
          x1={PAD_LEFT}
          y1={baselineY}
          x2={VIEW_WIDTH - PAD_RIGHT}
          y2={baselineY}
          stroke="rgba(148,163,184,0.3)"
          strokeWidth="1"
        />

        {dayLabels.map(({ point }, dayIndex) => {
          const x = xForDay(dayIndex, days);
          return (
            <line
              key={`tick-${point.date}`}
              x1={x}
              y1={baselineY}
              x2={x}
              y2={baselineY + 3}
              stroke="rgba(148,163,184,0.25)"
              strokeWidth="1"
            />
          );
        })}

        <polyline
          fill="none"
          stroke={LINE_COLOR}
          strokeWidth="1.5"
          strokeLinejoin="round"
          strokeLinecap="round"
          points={linePoints}
        />

        {dailySeries.map((point, index) => {
          const x = xForDay(point.dayIndex, days);
          const y = yPosition(point.tempC);
          const isToday = point.kind === "today";
          const showLabel = shouldShowValueLabel(point, dailySeries, index);

          return (
            <g key={`day-${point.date}`}>
              <circle
                cx={x}
                cy={y}
                r={isToday ? 3.5 : 2.5}
                fill={isToday ? TODAY_COLOR : LINE_COLOR}
                stroke="#0f172a"
                strokeWidth="1"
              />
              {showLabel ? (
                <text
                  x={x}
                  y={y - 10}
                  textAnchor="middle"
                  fill={isToday ? "#67e8f9" : "rgba(203,213,225,0.75)"}
                  style={chartTextStyle(9, 500)}
                >
                  {point.tempC}°
                </text>
              ) : null}
            </g>
          );
        })}

        {dayLabels.map(({ point }, dayIndex) => {
          const x = xForDay(dayIndex, days);
          const isToday = point.kind === "today";

          return (
            <text
              key={`date-${point.date}`}
              x={x}
              y={DATE_ROW_Y}
              textAnchor="middle"
              fill={isToday ? "#67e8f9" : "rgba(203,213,225,0.8)"}
              style={chartTextStyle(AXIS_FONT_SIZE, 500)}
            >
              {dayNumberLabel(point.date)}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
