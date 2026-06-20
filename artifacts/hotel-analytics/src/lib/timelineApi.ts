export type TimelinePoint = {
  date: string;
  hour: number;
  label: string;
  tempC: number | null;
  kind: "past" | "today" | "forecast";
  verified?: boolean;
};

export type TemperatureTimeline = {
  centerDate: string;
  points: TimelinePoint[];
};

const API_BASE = import.meta.env.VITE_API_URL ?? "";

export async function fetchTemperatureTimeline(
  latitude: number,
  longitude: number,
): Promise<TemperatureTimeline> {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
  });

  const response = await fetch(`${API_BASE}/api/weather/timeline?${params}`);

  if (!response.ok) {
    throw new Error(`Timeline API error (${response.status})`);
  }

  return response.json() as Promise<TemperatureTimeline>;
}
