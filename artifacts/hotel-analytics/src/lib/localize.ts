const monthIndex: Record<string, number> = {
  jan: 0,
  january: 0,
  feb: 1,
  february: 1,
  mar: 2,
  march: 2,
  apr: 3,
  april: 3,
  may: 4,
  jun: 5,
  june: 5,
  jul: 6,
  july: 6,
  aug: 7,
  august: 7,
  sep: 8,
  sept: 8,
  september: 8,
  oct: 9,
  october: 9,
  nov: 10,
  november: 10,
  dec: 11,
  december: 11,
};

const windDirRu: Record<string, string> = {
  N: "С",
  S: "Ю",
  E: "В",
  W: "З",
  NE: "СВ",
  NW: "СЗ",
  SE: "ЮВ",
  SW: "ЮЗ",
};

const periodTitleRu: Record<string, string> = {
  today: "Сегодня",
  tonight: "Сегодня вечером",
  "this afternoon": "Сегодня днём",
  "this morning": "Сегодня утром",
  "this evening": "Сегодня вечером",
};

const fieldLabelRu: Record<string, string> = {
  location: "Локация",
  updated: "Обновлено",
  temperature: "Температура",
  humidity: "Влажность",
  wind: "Ветер",
  pressure: "Давление",
  visibility: "Видимость",
  dewpoint: "Точка росы",
  conditions: "Условия",
  forecast: "Прогноз",
  "precipitation chance": "Вероятность осадков",
  precipitation: "Осадки",
  "cloud cover": "Облачность",
};

const logTypeRu: Record<string, string> = {
  DATA: "ДАННЫЕ",
  ALERT: "ВНИМАНИЕ",
  REPORT: "ОТЧЁТ",
  SEARCH: "ПОИСК",
  AI: "ИИ",
  MCP: "MCP",
};

function ruDateTime(date: Date): string {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

export function formatWeatherTimeRu(value?: string): string {
  if (!value) {
    return "";
  }

  const trimmed = value.trim();

  const usStyle = trimmed.match(
    /^([A-Za-z]+)\s+(\d{1,2}),\s+(\d{4}),\s+(\d{1,2}):(\d{2})\s*(AM|PM)$/i,
  );
  if (usStyle) {
    const month = monthIndex[usStyle[1].toLowerCase()];
    if (month !== undefined) {
      let hour = parseInt(usStyle[4], 10);
      const minute = parseInt(usStyle[5], 10);
      const ampm = usStyle[6].toUpperCase();
      if (ampm === "PM" && hour !== 12) {
        hour += 12;
      }
      if (ampm === "AM" && hour === 12) {
        hour = 0;
      }
      const date = new Date(
        parseInt(usStyle[3], 10),
        month,
        parseInt(usStyle[2], 10),
        hour,
        minute,
      );
      return ruDateTime(date);
    }
  }

  const isoStyle = trimmed.match(
    /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})/,
  );
  if (isoStyle) {
    const date = new Date(
      parseInt(isoStyle[1], 10),
      parseInt(isoStyle[2], 10) - 1,
      parseInt(isoStyle[3], 10),
      parseInt(isoStyle[4], 10),
      parseInt(isoStyle[5], 10),
    );
    return ruDateTime(date);
  }

  const parsed = Date.parse(trimmed);
  if (!Number.isNaN(parsed)) {
    return ruDateTime(new Date(parsed));
  }

  return trimmed;
}

export function translateWindDirection(value: string): string {
  return value.replace(/\b(NW|NE|SW|SE|N|S|E|W)\b/gi, (dir) => {
    const key = dir.toUpperCase();
    return windDirRu[key] ?? dir;
  });
}

export function translateCloudCover(value?: string): string {
  if (!value) {
    return "";
  }

  let text = value
    .replace(/scattered clouds/gi, "Рассеянная облачность")
    .replace(/broken clouds/gi, "Разорванная облачность")
    .replace(/few clouds/gi, "Небольшая облачность")
    .replace(/overcast/gi, "Сплошная облачность")
    .replace(/clear/gi, "Ясно");

  text = text.replace(
    /at\s+([\d,]+)\s*ft/gi,
    (_, ft: string) => {
      const meters = Math.round(parseInt(ft.replace(/,/g, ""), 10) * 0.3048);
      return `на высоте ${meters.toLocaleString("ru-RU")} м`;
    },
  );

  return text.replace(/\s+/g, " ").trim();
}

export function translatePeriodTitle(value?: string): string {
  if (!value) {
    return "";
  }

  const lower = value.trim().toLowerCase();
  if (periodTitleRu[lower]) {
    return periodTitleRu[lower];
  }

  const nightMatch = lower.match(/^(\w+)\s+night$/);
  if (nightMatch) {
    const day = translateWeekday(nightMatch[1]);
    return day ? `Ночь, ${day}` : value;
  }

  const weekday = translateWeekday(lower);
  if (weekday) {
    return weekday;
  }

  const hourlyUs = value.trim().match(
    /^(\d{1,2})\/(\d{1,2})\/(\d{4}),\s*(\d{1,2}):(\d{2})\s*(AM|PM)$/i,
  );
  if (hourlyUs) {
    let hour = parseInt(hourlyUs[4], 10);
    const minute = hourlyUs[5];
    const ampm = hourlyUs[6].toUpperCase();
    if (ampm === "PM" && hour !== 12) {
      hour += 12;
    }
    if (ampm === "AM" && hour === 12) {
      hour = 0;
    }
    const date = new Date(
      parseInt(hourlyUs[3], 10),
      parseInt(hourlyUs[1], 10) - 1,
      parseInt(hourlyUs[2], 10),
      hour,
      parseInt(minute, 10),
    );
    return new Intl.DateTimeFormat("ru-RU", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(date);
  }

  return value;
}

const weekdayRu: Record<string, string> = {
  monday: "Понедельник",
  tuesday: "Вторник",
  wednesday: "Среда",
  thursday: "Четверг",
  friday: "Пятница",
  saturday: "Суббота",
  sunday: "Воскресенье",
};

function translateWeekday(value: string): string | null {
  return weekdayRu[value.trim().toLowerCase()] ?? null;
}

export function translateFieldLabel(label: string): string {
  return fieldLabelRu[label.trim().toLowerCase()] ?? label;
}

export function translateLogType(type: string): string {
  return logTypeRu[type] ?? type;
}

export function cityFromMarket(market: string): string {
  const [city] = market.split(",");
  return city?.trim() || market;
}

export function formatWeatherDestination(
  hotelName: string,
  market: string,
): string {
  return `${cityFromMarket(market)} · ${hotelName}`;
}

export function translateMcpSummary(value?: string): string {
  if (!value) {
    return "";
  }

  const replacements: [RegExp, string][] = [
    [/partly cloudy/gi, "переменная облачность"],
    [/mostly cloudy/gi, "преимущественно облачно"],
    [/chance of rain/gi, "вероятность дождя"],
    [/chance of showers/gi, "вероятность ливней"],
    [/showers/gi, "ливни"],
    [/thunderstorms?/gi, "гроза"],
    [/wind/gi, "ветер"],
    [/high near/gi, "макс. около"],
    [/low around/gi, "мин. около"],
  ];

  let text = value;
  for (const [pattern, replacement] of replacements) {
    text = text.replace(pattern, replacement);
  }
  return text;
}
