type OpenMeteoDailyResponse = {
  daily?: {
    time?: string[];
    temperature_2m_mean?: Array<number | null>;
  };
};

export async function fetchOpenMeteoDailyTemps(
  latitude: number,
  longitude: number,
  pastDays: number,
  forecastDays: number,
): Promise<Map<string, number>> {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", String(latitude));
  url.searchParams.set("longitude", String(longitude));
  url.searchParams.set("daily", "temperature_2m_mean");
  url.searchParams.set("past_days", String(pastDays));
  url.searchParams.set("forecast_days", String(forecastDays));
  url.searchParams.set("timezone", "auto");

  const response = await fetch(url, { signal: AbortSignal.timeout(15_000) });
  if (!response.ok) {
    throw new Error(`Open-Meteo error (${response.status})`);
  }

  const json = (await response.json()) as OpenMeteoDailyResponse;
  const dates = json.daily?.time ?? [];
  const temps = json.daily?.temperature_2m_mean ?? [];
  const map = new Map<string, number>();

  for (let index = 0; index < dates.length; index += 1) {
    const temp = temps[index];
    if (temp !== null && temp !== undefined && Number.isFinite(temp)) {
      map.set(dates[index], Math.round(temp));
    }
  }

  return map;
}
