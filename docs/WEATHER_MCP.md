# Weather MCP (ДЗ-2)

Интеграция `@dangahagan/weather-mcp` через stdio в `artifacts/api-server`.

## Запуск API

```bash
cd AIKIVAVIORA_Travel_MCP_Workspace
npx -y pnpm@10 install --ignore-scripts
npx -y pnpm@10 --filter @workspace/api-server run dev
```

Локально API слушает `http://localhost:3001/api`.

## Эндпоинты

| Метод | Путь | MCP tool |
|-------|------|----------|
| GET | `/api/weather/current?latitude=40.71&longitude=-74.01` | `get_current_conditions` |
| GET | `/api/weather/daily?latitude=40.71&longitude=-74.01&days=7` | `get_forecast` (`granularity=daily`) |
| GET | `/api/weather/hourly?latitude=40.71&longitude=-74.01&days=2` | `get_forecast` (`granularity=hourly`) |

## Пример

```bash
curl "http://localhost:3001/api/weather/current?latitude=40.7128&longitude=-74.0060"
```
