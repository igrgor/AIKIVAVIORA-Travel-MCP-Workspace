export type WeatherField = {
  label: string;
  value: string;
};

export type WeatherPeriod = {
  title: string;
  fields: WeatherField[];
  summary?: string;
};

export type ParsedWeather =
  | {
      kind: "current";
      title: string;
      fields: WeatherField[];
      source?: string;
    }
  | {
      kind: "forecast";
      title: string;
      meta: WeatherField[];
      periods: WeatherPeriod[];
      source?: string;
    };

function parseFieldLine(line: string): WeatherField | null {
  const match = line.trim().match(/^\*\*(.+?):\*\*\s*(.+)$/);
  if (!match) {
    return null;
  }
  return { label: match[1].trim(), value: match[2].trim() };
}

function extractSource(text: string): string | undefined {
  const match = text.match(/\*Data source:\s*(.+?)\*/i);
  return match?.[1]?.trim();
}

function stripMarkdown(text: string): string {
  return text.replace(/\*\*(.+?)\*\*/g, "$1").trim();
}

export function parseWeatherMcp(text: string): ParsedWeather | null {
  if (!text.trim()) {
    return null;
  }

  const source = extractSource(text);
  const lines = text.split("\n");
  const titleLine = lines.find((line) => line.startsWith("# "));
  const title = titleLine ? stripMarkdown(titleLine.slice(2)) : "Weather";

  const isForecast = /forecast/i.test(title);

  if (!isForecast) {
    const fields = lines
      .map(parseFieldLine)
      .filter((field): field is WeatherField => field !== null);

    return {
      kind: "current",
      title,
      fields,
      source,
    };
  }

  const meta: WeatherField[] = [];
  const periods: WeatherPeriod[] = [];
  let current: WeatherPeriod | null = null;
  let summaryLines: string[] = [];

  const flushSummary = () => {
    if (!current) {
      return;
    }
    const summary = summaryLines
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#") && !line.startsWith("---"))
      .join(" ")
      .trim();
    if (summary) {
      current.summary = summary;
    }
    summaryLines = [];
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith("# ") || line === "---") {
      continue;
    }

    if (line.startsWith("## ")) {
      flushSummary();
      if (current) {
        periods.push(current);
      }
      current = {
        title: stripMarkdown(line.slice(3)),
        fields: [],
      };
      continue;
    }

    const field = parseFieldLine(line);
    if (field) {
      if (current) {
        current.fields.push(field);
      } else {
        meta.push(field);
      }
      continue;
    }

    if (current && !line.startsWith("*")) {
      summaryLines.push(stripMarkdown(line));
    }
  }

  flushSummary();
  if (current) {
    periods.push(current);
  }

  return {
    kind: "forecast",
    title,
    meta,
    periods,
    source,
  };
}

export function fieldValue(
  fields: WeatherField[],
  ...labels: string[]
): string | undefined {
  const normalized = labels.map((label) => label.toLowerCase());
  return fields.find((field) =>
    normalized.includes(field.label.toLowerCase()),
  )?.value;
}

export function weatherIconKey(conditions?: string): "sun" | "cloud" | "rain" | "snow" | "storm" {
  const text = (conditions ?? "").toLowerCase();
  if (/thunder|storm/.test(text)) {
    return "storm";
  }
  if (/snow|sleet|ice/.test(text)) {
    return "snow";
  }
  if (/rain|shower|drizzle/.test(text)) {
    return "rain";
  }
  if (/clear|sunny/.test(text)) {
    return "sun";
  }
  return "cloud";
}
