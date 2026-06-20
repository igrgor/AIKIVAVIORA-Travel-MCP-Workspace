import { fetchOpenMeteoDailyTemps } from "./openMeteoClient";
import { extractMcpText, type McpToolResult } from "./mcpText";
import {
  getCurrentConditions,
  getDailyForecast,
  getHistoricalWeather,
  getHourlyForecast,
} from "./mcp/weatherClient";

const PAST_DAYS = 14;
const FUTURE_DAYS = 15;
const SLOT_HOURS = [0, 6, 12, 18] as const;

export type TimelinePoint = {
  date: string;
  hour: number;
  label: string;
  tempC: number | null;
  kind: "past" | "today" | "forecast";
  verified: boolean;
};

export type TemperatureTimeline = {
  centerDate: string;
  points: TimelinePoint[];
};

function fToC(f: number): number {
  return Math.round(((f - 32) * 5) / 9);
}

function parseTempC(text: string): number | null {
  const f = text.match(/(-?\d+(?:\.\d+)?)\s*°?\s*F/i);
  if (f) {
    return fToC(parseFloat(f[1]));
  }
  const c = text.match(/(-?\d+(?:\.\d+)?)\s*°?\s*C/i);
  if (c) {
    return Math.round(parseFloat(c[1]));
  }
  return null;
}

function ruLabel(iso: string): string {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "short",
  }).format(new Date(`${iso}T12:00:00`));
}

function addDays(base: Date, days: number): Date {
  const next = new Date(base);
  next.setDate(next.getDate() + days);
  return next;
}

function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function slotKey(date: string, hour: number): string {
  return `${date}T${hour.toString().padStart(2, "0")}`;
}

function parseBlockTemp(block: string): number | null {
  return (
    parseTempC(block.match(/\*\*Temperature:\*\*\s*([^\n]+)/i)?.[1] ?? "") ??
    parseTempC(block)
  );
}

function extractDailyTemps(text: string): Map<string, number> {
  const map = new Map<string, number>();

  const isoBlocks = text.split(/(?=\d{4}-\d{2}-\d{2})/g);
  for (const block of isoBlocks) {
    const dateMatch = block.match(/^(\d{4}-\d{2}-\d{2})/);
    if (!dateMatch) {
      continue;
    }
    const temp = parseBlockTemp(block);
    if (temp !== null) {
      map.set(dateMatch[1], temp);
    }
  }

  const periodBlocks = text.split(/(?=## )/g);
  let offset = 1;
  const today = new Date();
  for (const block of periodBlocks) {
    if (!block.startsWith("## ")) {
      continue;
    }
    const usDate = block.match(/##\s+(\d{1,2})\/(\d{1,2})\/(\d{4})/);
    if (usDate) {
      const iso = `${usDate[3]}-${usDate[1].padStart(2, "0")}-${usDate[2].padStart(2, "0")}`;
      const temp = parseBlockTemp(block);
      if (temp !== null) {
        map.set(iso, temp);
      }
      continue;
    }
    const temp = parseBlockTemp(block);
    if (temp !== null && !block.includes(":")) {
      map.set(isoDate(addDays(today, offset)), temp);
      offset += 1;
    }
  }

  const tempLines = text.match(/\*\*Temperature:\*\*\s*([^\n]+)/gi) ?? [];
  if (map.size === 0 && tempLines.length === 1) {
    const temp = parseTempC(tempLines[0]);
    if (temp !== null) {
      map.set(isoDate(today), temp);
    }
  }

  return map;
}

function parseHourFromBlock(block: string): { iso: string; hour: number } | null {
  const usTime = block.match(
    /##\s+(\d{1,2})\/(\d{1,2})\/(\d{4}),\s+(\d{1,2}):(\d{2})(?::\d{2})?\s*(AM|PM)?/i,
  );
  if (usTime) {
    let hour = parseInt(usTime[4], 10);
    const ampm = usTime[6]?.toUpperCase();
    if (ampm === "PM" && hour !== 12) {
      hour += 12;
    }
    if (ampm === "AM" && hour === 12) {
      hour = 0;
    }
    const iso = `${usTime[3]}-${usTime[1].padStart(2, "0")}-${usTime[2].padStart(2, "0")}`;
    return { iso, hour };
  }

  const isoTime = block.match(/##\s+(\d{4}-\d{2}-\d{2})[T ](\d{2}):(\d{2})/);
  if (isoTime) {
    return { iso: isoTime[1], hour: parseInt(isoTime[2], 10) };
  }

  return null;
}

function extractHourlyTemps(text: string): Map<string, number> {
  const map = new Map<string, number>();
  const blocks = text.split(/(?=## )/g);

  for (const block of blocks) {
    const parsed = parseHourFromBlock(block);
    if (!parsed) {
      continue;
    }
    const temp = parseBlockTemp(block);
    if (temp !== null) {
      map.set(`${parsed.iso}T${parsed.hour.toString().padStart(2, "0")}`, temp);
    }
  }

  return map;
}

function tempForSlot(
  date: string,
  slotHour: number,
  hourly: Map<string, number>,
  daily: Map<string, number>,
): number | null {
  const exact = hourly.get(slotKey(date, slotHour));
  if (exact !== undefined) {
    return exact;
  }

  let best: { diff: number; temp: number } | null = null;
  for (const [key, temp] of hourly) {
    if (!key.startsWith(`${date}T`)) {
      continue;
    }
    const hour = parseInt(key.slice(11), 10);
    const diff = Math.abs(hour - slotHour);
    if (diff <= 3 && (!best || diff < best.diff)) {
      best = { diff, temp };
    }
  }
  if (best) {
    return best.temp;
  }

  return daily.get(date) ?? null;
}

function emptyTimeline(today: Date): TemperatureTimeline {
  const points: TimelinePoint[] = [];

  for (let offset = -PAST_DAYS; offset <= FUTURE_DAYS; offset += 1) {
    const date = isoDate(addDays(today, offset));
    const kind =
      offset < 0 ? "past" : offset === 0 ? "today" : "forecast";

    for (const hour of SLOT_HOURS) {
      points.push({
        date,
        hour,
        label: hour === 0 ? ruLabel(date) : "",
        tempC: null,
        kind,
        verified: false,
      });
    }
  }

  return { centerDate: isoDate(today), points };
}

export async function buildTemperatureTimeline(
  latitude: number,
  longitude: number,
): Promise<TemperatureTimeline> {
  const today = new Date();
  const timeline = emptyTimeline(today);
  const startDate = isoDate(addDays(today, -PAST_DAYS));
  const midDate = isoDate(addDays(today, -8));
  const recentStart = isoDate(addDays(today, -7));
  const endDate = isoDate(addDays(today, -1));

  const [historicalEarly, historicalRecent, current, hourly, forecast, openMeteoDaily] =
    await Promise.all([
      getHistoricalWeather(latitude, longitude, startDate, midDate).catch(
        () => null,
      ),
      getHistoricalWeather(latitude, longitude, recentStart, endDate).catch(
        () => null,
      ),
      getCurrentConditions(latitude, longitude).catch(() => null),
      getHourlyForecast(latitude, longitude, 14).catch(() => null),
      getDailyForecast(latitude, longitude, FUTURE_DAYS).catch(() => null),
      fetchOpenMeteoDailyTemps(
        latitude,
        longitude,
        PAST_DAYS,
        FUTURE_DAYS + 1,
      ).catch(() => new Map<string, number>()),
    ]);

  const archiveHourly = new Map<string, number>();
  const archiveDaily = new Map<string, number>();
  const liveHourly = new Map<string, number>();
  const liveDaily = new Map<string, number>();

  for (const historical of [historicalEarly, historicalRecent]) {
    if (!historical) {
      continue;
    }
    const text = extractMcpText(historical);
    for (const [key, temp] of extractHourlyTemps(text)) {
      archiveHourly.set(key, temp);
    }
    for (const [date, temp] of extractDailyTemps(text)) {
      archiveDaily.set(date, temp);
    }
  }

  for (const result of [current, forecast]) {
    if (!result) {
      continue;
    }
    const text = extractMcpText(result);
    for (const [date, temp] of extractDailyTemps(text)) {
      liveDaily.set(date, temp);
    }
  }

  if (hourly) {
    const text = extractMcpText(hourly);
    for (const [key, temp] of extractHourlyTemps(text)) {
      liveHourly.set(key, temp);
    }
  }

  timeline.points = timeline.points.map((point) => {
    if (point.kind === "past") {
      const fromArchive = tempForSlot(
        point.date,
        point.hour,
        archiveHourly,
        archiveDaily,
      );
      if (fromArchive !== null) {
        return { ...point, tempC: fromArchive, verified: true };
      }

      const pointDate = new Date(`${point.date}T12:00:00`);
      const daysAgo = Math.floor(
        (today.getTime() - pointDate.getTime()) / 86_400_000,
      );
      if (daysAgo <= 7) {
        const fromLive = tempForSlot(
          point.date,
          point.hour,
          liveHourly,
          liveDaily,
        );
        if (fromLive !== null) {
          return { ...point, tempC: fromLive, verified: true };
        }
      }

      return point;
    }

    const tempC = tempForSlot(point.date, point.hour, liveHourly, liveDaily);
    if (tempC !== null) {
      return { ...point, tempC, verified: true };
    }
    return point;
  });

  timeline.points = timeline.points.map((point) => {
    if (point.tempC !== null) {
      return point;
    }
    const daily =
      point.kind === "past"
        ? (archiveDaily.get(point.date) ?? liveDaily.get(point.date))
        : liveDaily.get(point.date);
    if (daily !== undefined) {
      return { ...point, tempC: daily, verified: true };
    }
    const openMeteo = openMeteoDaily.get(point.date);
    if (openMeteo !== undefined) {
      return { ...point, tempC: openMeteo, verified: true };
    }
    return point;
  });

  return timeline;
}
