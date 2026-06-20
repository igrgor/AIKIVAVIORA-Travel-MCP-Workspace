import { trackedHotels } from "../lib/hotelCatalog";
import { mockMarketPulse, type Hotel } from "../data/mockData";
import { appQuarterShort } from "./appDates";

function parseMoney(value: string): number {
  return parseInt(value.replace(/[^\d]/g, ""), 10) || 0;
}

function hotelsInMarket(marketHint: string): Hotel[] {
  const hint = marketHint.trim().toLowerCase();
  if (!hint) {
    return trackedHotels;
  }
  return trackedHotels.filter((hotel) =>
    hotel.market.toLowerCase().includes(hint),
  );
}

function extractMarketHint(prompt: string): string {
  const patterns = [
    /в\s+([а-яё\-]+)/i,
    /рынок\s+([а-яё\-]+)/i,
    /([а-яё\-]+),/i,
  ];
  for (const pattern of patterns) {
    const match = prompt.match(pattern);
    if (match?.[1]) {
      return match[1];
    }
  }
  return "";
}

function topByAdr(hotels: Hotel[]): Hotel {
  return [...hotels].sort((a, b) => parseMoney(b.adr) - parseMoney(a.adr))[0];
}

function compareHotelsReply(hotels: Hotel[]): string {
  const ranked = [...hotels]
    .sort((a, b) => parseMoney(b.revpar) - parseMoney(a.revpar))
    .slice(0, 3);

  const lines = ranked.map(
    (hotel, index) =>
      `${index + 1}. **${hotel.name}** (${hotel.market}) — доход на номер **${hotel.revpar}**, ср. цена **${hotel.adr}**, загрузка **${hotel.occ}**`,
  );

  return `Сравнение по доходу на номер (${appQuarterShort}):\n\n${lines.join("\n")}`;
}

function marketReportReply(): string {
  const lines = mockMarketPulse.map(
    (item) => `• **${item.market}**: ${item.trend}`,
  );
  return `Пульс рынков:\n\n${lines.join("\n")}`;
}

function tariffReply(hotels: Hotel[]): string {
  const ranked = [...hotels].sort(
    (a, b) => parseMoney(b.adr) - parseMoney(a.adr),
  );
  const lines = ranked.map(
    (hotel) =>
      `• **${hotel.name}** — ${hotel.adr} (${hotel.segment}, ${hotel.market})`,
  );
  return `Ранжирование по средней цене номера:\n\n${lines.join("\n")}`;
}

function weatherReply(selectedHotel?: Hotel): string {
  if (!selectedHotel) {
    return "Выберите отель в центральной панели — блок «Погода в регионе» покажет MCP-данные для его координат.";
  }
  return `Погода MCP привязана к **${selectedHotel.name}** (${selectedHotel.market}). Откройте блок «Погода в регионе» ниже — там текущие условия и график на 30 дней.`;
}

export const quickPrompts = {
  compare: "Сравни отели по доходу на номер и загрузке",
  market: "Дай краткий отчёт по рынкам",
  weather: "Покажи погоду для активного отеля",
  tariffs: "Проанализируй тарифы и средние цены по отелям",
} as const;

export type AssistantAction = "scroll-weather" | null;

export function buildAssistantReply(
  prompt: string,
  selectedHotel?: Hotel,
): { text: string; action: AssistantAction } {
  const q = prompt.trim().toLowerCase();
  const marketHint = extractMarketHint(q);
  const scopedHotels = hotelsInMarket(marketHint);
  const hotels = scopedHotels.length > 0 ? scopedHotels : trackedHotels;

  if (/погод|weather|mcp.*погод/i.test(q)) {
    return { text: weatherReply(selectedHotel), action: "scroll-weather" };
  }

  if (/отчёт|отчет|рынк|пульс/i.test(q)) {
    return { text: marketReportReply(), action: null };
  }

  if (/тариф|цен|adr|стоимост/i.test(q)) {
    return { text: tariffReply(hotels), action: null };
  }

  if (/сравн|compare/i.test(q)) {
    return { text: compareHotelsReply(hotels), action: null };
  }

  if (/самый дорогой|дороже всех|максимальн.*цен|top.*adr/i.test(q)) {
    const top = topByAdr(hotels);
    const scope =
      marketHint && scopedHotels.length > 0
        ? ` в регионе «${scopedHotels[0].market.split(",")[0]}»`
        : "";
    return {
      text: `Самый дорогой отель${scope} — **${top.name}** (${top.market}): средняя цена **${top.adr}**, доход на номер **${top.revpar}**, загрузка **${top.occ}**.`,
      action: null,
    };
  }

  if (/доход на номер|revpar/i.test(q)) {
    const top = [...hotels].sort(
      (a, b) => parseMoney(b.revpar) - parseMoney(a.revpar),
    )[0];
    return {
      text: `Лидер по доходу на номер — **${top.name}**: **${top.revpar}** при загрузке **${top.occ}** и ADR **${top.adr}**.`,
      action: null,
    };
  }

  return {
    text: `По запросу «${prompt.trim()}» доступны **${trackedHotels.length}** демо-отеля (каталог STR **847** — в разработке). Спросите: «самый дорогой отель», «сравни отели», «отчёт по рынку» или «погода MCP».`,
    action: null,
  };
}
