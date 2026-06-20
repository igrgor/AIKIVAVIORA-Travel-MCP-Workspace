export type McpContentBlock = {
  type: string;
  text?: string;
};

export type McpToolResult = {
  isError: boolean;
  content: McpContentBlock[];
};

export type WeatherMode = "current" | "daily" | "hourly";

const API_BASE = import.meta.env.VITE_API_URL ?? "";

function mcpText(result: McpToolResult): string {
  return result.content
    .filter((block) => block.type === "text" && block.text)
    .map((block) => block.text)
    .join("\n\n");
}

export function extractMcpText(result: McpToolResult): string {
  if (result.isError) {
    return mcpText(result) || "Weather MCP returned an error.";
  }
  return mcpText(result) || "No weather data returned.";
}

export async function fetchWeather(
  mode: WeatherMode,
  latitude: number,
  longitude: number,
  days?: number,
): Promise<McpToolResult> {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
  });

  if (days !== undefined) {
    params.set("days", String(days));
  }

  const path =
    mode === "current"
      ? "/api/weather/current"
      : mode === "daily"
        ? "/api/weather/daily"
        : "/api/weather/hourly";

  const response = await fetch(`${API_BASE}${path}?${params.toString()}`);

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(
      typeof body.error === "string"
        ? body.error
        : `Weather API error (${response.status})`,
    );
  }

  return response.json() as Promise<McpToolResult>;
}
