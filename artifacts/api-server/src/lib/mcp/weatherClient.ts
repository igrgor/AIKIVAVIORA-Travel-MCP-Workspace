import { createRequire } from "node:module";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

type WeatherToolArgs = Record<string, unknown>;

const require = createRequire(import.meta.url);
const weatherMcpEntry = require.resolve("@dangahagan/weather-mcp/dist/index.js");

let clientPromise: Promise<Client> | null = null;

function childEnv(): Record<string, string> {
  const keep = [
    "PATH",
    "PATHEXT",
    "SYSTEMROOT",
    "COMSPEC",
    "WINDIR",
    "HOME",
    "USERPROFILE",
    "APPDATA",
    "LOCALAPPDATA",
    "TEMP",
    "TMP",
    "NODE_PATH",
  ] as const;

  const env: Record<string, string> = {
    LOG_LEVEL: "1",
    ENABLED_TOOLS: process.env.WEATHER_ENABLED_TOOLS ?? "standard,+historical",
  };

  for (const key of keep) {
    const value = process.env[key];
    if (value) {
      env[key] = value;
    }
  }

  return env;
}

async function getWeatherClient(): Promise<Client> {
  if (!clientPromise) {
    clientPromise = (async () => {
      const transport = new StdioClientTransport({
        command: process.execPath,
        args: [weatherMcpEntry],
        env: childEnv(),
      });

      const client = new Client({
        name: "aikivaviora-travel-api",
        version: "1.0.0",
      });

      await client.connect(transport);
      return client;
    })();
  }

  return clientPromise;
}

export async function callWeatherTool(
  toolName: string,
  args: WeatherToolArgs,
) {
  const client = await getWeatherClient();
  return client.callTool(
    {
      name: toolName,
      arguments: args,
    },
    undefined,
    { timeout: 120_000 },
  );
}

export async function getCurrentConditions(
  latitude: number,
  longitude: number,
) {
  return callWeatherTool("get_current_conditions", { latitude, longitude });
}

export async function getDailyForecast(
  latitude: number,
  longitude: number,
  days = 7,
) {
  return callWeatherTool("get_forecast", {
    latitude,
    longitude,
    days,
    granularity: "daily",
  });
}

export async function getHourlyForecast(
  latitude: number,
  longitude: number,
  days = 2,
) {
  return callWeatherTool("get_forecast", {
    latitude,
    longitude,
    days,
    granularity: "hourly",
  });
}

export async function getHistoricalWeather(
  latitude: number,
  longitude: number,
  startDate: string,
  endDate: string,
) {
  return callWeatherTool("get_historical_weather", {
    latitude,
    longitude,
    start_date: startDate,
    end_date: endDate,
  });
}
