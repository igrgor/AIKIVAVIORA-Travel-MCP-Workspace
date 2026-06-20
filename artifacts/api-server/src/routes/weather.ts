import { Router, type IRouter } from "express";
import { z } from "zod";
import {
  getCurrentConditions,
  getDailyForecast,
  getHourlyForecast,
} from "../lib/mcp/weatherClient";
import { buildTemperatureTimeline } from "../lib/weatherTimeline";
import { logger } from "../lib/logger";

const router: IRouter = Router();

const coordinatesSchema = z.object({
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
});

const dailySchema = coordinatesSchema.extend({
  days: z.coerce.number().int().min(1).max(16).optional(),
});

const hourlySchema = coordinatesSchema.extend({
  days: z.coerce.number().int().min(1).max(7).optional(),
});

function mcpResultToJson(result: Awaited<ReturnType<typeof getCurrentConditions>>) {
  return {
    isError: Boolean(result.isError),
    content: result.content,
  };
}

router.get("/weather/current", async (req, res) => {
  const parsed = coordinatesSchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  try {
    const result = await getCurrentConditions(
      parsed.data.latitude,
      parsed.data.longitude,
    );
    res.json(mcpResultToJson(result));
  } catch (err) {
    logger.error({ err }, "Weather MCP current conditions failed");
    res.status(502).json({ error: "Weather MCP request failed" });
  }
});

router.get("/weather/daily", async (req, res) => {
  const parsed = dailySchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  try {
    const result = await getDailyForecast(
      parsed.data.latitude,
      parsed.data.longitude,
      parsed.data.days,
    );
    res.json(mcpResultToJson(result));
  } catch (err) {
    logger.error({ err }, "Weather MCP daily forecast failed");
    res.status(502).json({ error: "Weather MCP request failed" });
  }
});

router.get("/weather/hourly", async (req, res) => {
  const parsed = hourlySchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  try {
    const result = await getHourlyForecast(
      parsed.data.latitude,
      parsed.data.longitude,
      parsed.data.days,
    );
    res.json(mcpResultToJson(result));
  } catch (err) {
    logger.error({ err }, "Weather MCP hourly forecast failed");
    res.status(502).json({ error: "Weather MCP request failed" });
  }
});

router.get("/weather/timeline", async (req, res) => {
  const parsed = coordinatesSchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  try {
    const timeline = await buildTemperatureTimeline(
      parsed.data.latitude,
      parsed.data.longitude,
    );
    res.json(timeline);
  } catch (err) {
    logger.error({ err }, "Weather MCP timeline failed");
    res.status(502).json({ error: "Weather MCP timeline failed" });
  }
});

export default router;
