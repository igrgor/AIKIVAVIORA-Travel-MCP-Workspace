import { translateWindDirection } from "./localize";

export function fahrenheitToCelsius(f: number): number {
  return Math.round(((f - 32) * 5) / 9);
}

export function celsiusToDisplay(c: number): string {
  return `${Math.round(c)}°C`;
}

export function parseTemperatureToC(value?: string): number | null {
  if (!value) {
    return null;
  }

  const fMatch = value.match(/(-?\d+(?:\.\d+)?)\s*°?\s*F/i);
  if (fMatch) {
    return fahrenheitToCelsius(parseFloat(fMatch[1]));
  }

  const cMatch = value.match(/(-?\d+(?:\.\d+)?)\s*°?\s*C/i);
  if (cMatch) {
    return Math.round(parseFloat(cMatch[1]));
  }

  return null;
}

export function formatTempC(value?: string): string {
  const parsed = parseTemperatureToC(value);
  return parsed === null ? "—" : celsiusToDisplay(parsed);
}

export function formatPressureMetric(value?: string): string {
  if (!value) {
    return "—";
  }
  const inHg = value.match(/(-?\d+(?:\.\d+)?)\s*inHg/i);
  if (inHg) {
    const mmHg = Math.round(parseFloat(inHg[1]) * 25.4);
    return `${mmHg} мм рт. ст.`;
  }
  const hPa = value.match(/(-?\d+(?:\.\d+)?)\s*(?:hPa|гПа)/i);
  if (hPa) {
    const mmHg = Math.round(parseFloat(hPa[1]) * 0.750062);
    return `${mmHg} мм рт. ст.`;
  }
  const mmHg = value.match(/(-?\d+(?:\.\d+)?)\s*(?:mmHg|мм\s*рт\.?\s*ст\.?)/i);
  if (mmHg) {
    return `${Math.round(parseFloat(mmHg[1]))} мм рт. ст.`;
  }
  return value;
}

export function formatVisibilityMetric(value?: string): string {
  if (!value) {
    return "—";
  }
  const miles = value.match(/(-?\d+(?:\.\d+)?)\s*miles?/i);
  if (miles) {
    const km = (parseFloat(miles[1]) * 1.60934).toFixed(1);
    return `${km} км`;
  }
  const km = value.match(/(-?\d+(?:\.\d+)?)\s*km/i);
  if (km) {
    return `${parseFloat(km[1]).toFixed(1)} км`;
  }
  return value;
}

export function formatWindMetric(value?: string): string {
  if (!value) {
    return "—";
  }
  const mph = value.match(/(-?\d+(?:\.\d+)?)\s*mph/i);
  if (mph) {
    const ms = (parseFloat(mph[1]) * 0.44704).toFixed(1);
    const dir = value.match(/\b([NSEW]{1,2})\b/i)?.[1]?.toUpperCase();
    const dirRu = dir ? translateWindDirection(dir) : "";
    return dirRu ? `${dirRu} ${ms} м/с` : `${ms} м/с`;
  }
  const ms = value.match(/(-?\d+(?:\.\d+)?)\s*m\/s/i);
  if (ms) {
    return translateWindDirection(`${parseFloat(ms[1]).toFixed(1)} м/с`);
  }
  return translateWindDirection(value);
}

const conditionRu: Record<string, string> = {
  "partly cloudy": "Переменная облачность",
  "mostly cloudy": "Преимущественно облачно",
  cloudy: "Облачно",
  clear: "Ясно",
  sunny: "Солнечно",
  rain: "Дождь",
  showers: "Ливни",
  snow: "Снег",
  fog: "Туман",
  thunderstorm: "Гроза",
  "scattered clouds": "Рассеянная облачность",
  "mostly clear": "Преимущественно ясно",
  "partly sunny": "Переменная облачность",
  fair: "Ясно",
  haze: "Дымка",
  mist: "Туман",
  drizzle: "Морось",
  "light rain": "Небольшой дождь",
  "heavy rain": "Сильный дождь",
  "light snow": "Небольшой снег",
  blizzard: "Метель",
  windy: "Ветрено",
  hot: "Жарко",
  cold: "Холодно",
  overcast: "Пасмурно",
};

export function translateCondition(value?: string): string {
  if (!value) {
    return "";
  }
  const lower = value.trim().toLowerCase();
  if (conditionRu[lower]) {
    return conditionRu[lower];
  }
  for (const [key, label] of Object.entries(conditionRu)) {
    if (lower.includes(key)) {
      return label;
    }
  }
  return value;
}

export function formatRussianShortDate(iso: string): string {
  const date = new Date(`${iso}T12:00:00`);
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "short",
  }).format(date);
}

export function addDays(base: Date, days: number): Date {
  const next = new Date(base);
  next.setDate(next.getDate() + days);
  return next;
}

export function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}
