import { appQuarterLabel, appQuarterShort, appYear } from "../lib/appDates";

export const mockConversations = [
  { id: "1", title: "Marriott vs Hilton — доход на номер", time: "10 мин назад", preview: `Сравнение ${appQuarterLabel}…` },
  { id: "2", title: "Люкс-рынок Лондона", time: "2 ч назад", preview: "Какой тренд средней цены…" },
  { id: "3", title: "Загрузка в Сингапуре", time: "Вчера", preview: "Топ-5 объектов…" },
];

export const mockChatMessages = [
  { id: "1", role: "user", text: `Как Marriott выступает против Hilton в Дубае за ${appQuarterShort}?` },
  { id: "2", role: "assistant", text: `По данным ${appQuarterShort} для рынка Дубая:\n\n• **Marriott (люкс-портфель)**: доход на номер **$412**, рост **8,4%** г/г.\n• **Hilton (люкс-портфель)**: доход на номер **$395**, рост **6,2%** г/г.\n\nMarriott лидирует по росту средней цены, Hilton сохраняет более высокую загрузку.` },
  { id: "3", role: "user", text: "А как с долей рынка?" },
  { id: "4", role: "assistant", text: "Marriott занимает **14,2%** люкс-сегмента, немного опережая Hilton (**12,8%**). Сформировать детальную матрицу сравнения?" },
];

export type Hotel = {
  id: string;
  name: string;
  stars: number;
  category: string;
  adr: string;
  revpar: string;
  occ: string;
  market: string;
  segment: string;
  status: string;
  statusRu: string;
  statusColor: string;
  trend: string;
  trendColor: string;
  bars: number[];
  latitude: number;
  longitude: number;
};

export const mockKPIs = [
  { label: "Индекс дохода на номер", value: "112,4", trend: "+3,2% к пр. г.", trendColor: "text-green-500", bars: [2, 4, 3, 5, 4, 6, 7] },
  { label: "Средняя цена номера", value: "$287,50", trend: "+1,8% к пр. г.", trendColor: "text-green-500", bars: [4, 5, 4, 6, 5, 7, 6] },
  { label: "Загрузка", value: "74,3%", trend: "-0,4% к пр. г.", trendColor: "text-red-500", bars: [7, 6, 7, 5, 6, 5, 4] },
  { label: "Оценка рынка", value: "8,7/10", trend: "+0,3", trendColor: "text-green-500", bars: [5, 5, 6, 6, 7, 7, 8] },
];

export const mockHotels: Hotel[] = [
  { id: "1", name: "Burj Al Arab", stars: 5, category: "Курорт люкс", adr: "$1 245", revpar: "$987", occ: "79%", market: "Дубай, ОАЭ", segment: "Ультра-люкс", status: "Monitored", statusRu: "Мониторинг", statusColor: "bg-green-500/20 text-green-400", trend: "↑ +12%", trendColor: "text-green-500", bars: [2,3,5,4,6,5,8], latitude: 25.2048, longitude: 55.2708 },
  { id: "2", name: "The Ritz-Carlton", stars: 5, category: "Городской люкс", adr: "$892", revpar: "$714", occ: "80%", market: "Лондон, Великобритания", segment: "Люкс", status: "Monitored", statusRu: "Мониторинг", statusColor: "bg-green-500/20 text-green-400", trend: "↓ -2%", trendColor: "text-red-500", bars: [7,6,5,4,5,4,3], latitude: 51.5074, longitude: -0.1278 },
  { id: "3", name: "Four Seasons", stars: 5, category: "Городской люкс", adr: "$1 050", revpar: "$840", occ: "80%", market: "Нью-Йорк, США", segment: "Люкс", status: "In Analysis", statusRu: "В анализе", statusColor: "bg-amber-500/20 text-amber-400", trend: "↑ +5%", trendColor: "text-green-500", bars: [3,4,4,5,5,6,7], latitude: 40.7128, longitude: -74.006 },
  { id: "4", name: "Marina Bay Sands", stars: 5, category: "Курорт/казино", adr: "$678", revpar: "$542", occ: "80%", market: "Сингапур", segment: "Люкс", status: "Monitored", statusRu: "Мониторинг", statusColor: "bg-green-500/20 text-green-400", trend: "↑ +18%", trendColor: "text-green-500", bars: [1,2,4,5,7,6,8], latitude: 1.3521, longitude: 103.8198 },
  { id: "5", name: "Marriott Marquis", stars: 4, category: "Бизнес", adr: "$389", revpar: "$295", occ: "76%", market: "Нью-Йорк, США", segment: "Повышенный класс", status: "Monitored", statusRu: "Мониторинг", statusColor: "bg-green-500/20 text-green-400", trend: "→ +0,3%", trendColor: "text-muted-foreground", bars: [4,4,5,4,5,4,5], latitude: 40.758, longitude: -73.9855 },
  { id: "6", name: "Atlantis The Palm", stars: 5, category: "Курорт", adr: "$545", revpar: "$423", occ: "78%", market: "Дубай, ОАЭ", segment: "Повышенный класс", status: "In Analysis", statusRu: "В анализе", statusColor: "bg-amber-500/20 text-amber-400", trend: "↑ +8%", trendColor: "text-green-500", bars: [3,4,3,5,6,5,7], latitude: 25.1304, longitude: 55.1173 },
];

export const mockLogs = [
  { time: "14:32:11", type: "DATA", color: "bg-blue-500/20 text-blue-400", text: "Обновлены данные дохода на номер: Burj Al Arab (+12,4%)" },
  { time: "14:31:58", type: "ALERT", color: "bg-amber-500/20 text-amber-400", text: "Снижение загрузки: The Ritz-Carlton, Лондон (-3,2%)" },
  { time: "14:30:22", type: "REPORT", color: "bg-green-500/20 text-green-400", text: "Отчёт по рынку Дубая сформирован" },
  { time: "14:28:45", type: "DATA", color: "bg-blue-500/20 text-blue-400", text: "Бенчмарк средней цены обновлён для Нью-Йорка" },
  { time: "14:27:19", type: "SEARCH", color: "bg-purple-500/20 text-purple-400", text: `Веб-поиск: «рынок отелей Дубая ${appQuarterShort}»` },
  { time: "14:25:33", type: "AI", color: "bg-teal-500/20 text-teal-400", text: "Анализ завершён: сравнение Marriott vs Hilton" },
  { time: "14:23:17", type: "DATA", color: "bg-blue-500/20 text-blue-400", text: "Синхр. тарифов: Marina Bay Sands" },
  { time: "14:21:44", type: "ALERT", color: "bg-amber-500/20 text-amber-400", text: "Новый конкурент: W Hotels, Дубай" },
  { time: "14:19:28", type: "SEARCH", color: "bg-purple-500/20 text-purple-400", text: `Веб-поиск: «доход на номер люкс-отелей Сингапура ${appYear}»` },
  { time: "14:17:55", type: "AI", color: "bg-teal-500/20 text-teal-400", text: "Отчёт сформирован: конкурентный анализ Нью-Йорка" },
  { time: "14:15:33", type: "DATA", color: "bg-blue-500/20 text-blue-400", text: "Импорт STR: рынок Лондона" },
  { time: "14:13:22", type: "REPORT", color: "bg-green-500/20 text-green-400", text: "Анализ Four Seasons, Нью-Йорк сохранён" },
];

export const mockSources = [
  { name: "STR Global", status: "Подключён", statusColor: "text-green-400", detail: "Демо · синхр. · целевой каталог: 847 (в разработке)" },
  { name: "HotStats", status: "Подключён", statusColor: "text-green-400", detail: "Синхр.: 15 мин назад | Отелей: 234" },
  { name: "OTA Insight", status: "Подключён", statusColor: "text-green-400", detail: "Синхр.: 5 мин назад | Тарифы" },
  { name: "Веб-исследования", status: "Активен", statusColor: "text-teal-400", detail: "3 запроса сегодня" },
  { name: "Импорт CSV", status: "Готов", statusColor: "text-muted-foreground", detail: "Загрузить файл" },
];

export const mockMarketPulse = [
  { market: "Дубай", trend: "Дох. на номер +14,2% г/г", color: "text-green-500" },
  { market: "Нью-Йорк", trend: "Дох. на номер +3,1% г/г", color: "text-green-500" },
  { market: "Лондон", trend: "Дох. на номер -1,8% г/г", color: "text-red-500" },
  { market: "Сингапур", trend: "Дох. на номер +22,4% г/г", color: "text-green-500" },
];

export const weatherDestinations = [
  {
    id: "nyc",
    label: "Нью-Йорк, США",
    latitude: 40.7128,
    longitude: -74.006,
    note: "США — доступны все инструменты MCP",
  },
  {
    id: "london",
    label: "Лондон, Великобритания",
    latitude: 51.5074,
    longitude: -0.1278,
    note: "Прогноз через Open-Meteo; текущие условия MCP — только США",
  },
  {
    id: "dubai",
    label: "Дубай, ОАЭ",
    latitude: 25.2048,
    longitude: 55.2708,
    note: "Прогноз через Open-Meteo; текущие условия MCP — только США",
  },
  {
    id: "singapore",
    label: "Сингапур",
    latitude: 1.3521,
    longitude: 103.8198,
    note: "Прогноз через Open-Meteo; текущие условия MCP — только США",
  },
];
