import { mockHotels, type Hotel } from "../data/mockData";

export type HotelFilterId = "all" | "mine" | "5" | "4" | "resort" | "city";

export const HOTEL_FILTERS: { id: HotelFilterId; label: string }[] = [
  { id: "all", label: "Все" },
  { id: "mine", label: "Мои" },
  { id: "5", label: "5★" },
  { id: "4", label: "4★" },
  { id: "resort", label: "Курорты" },
  { id: "city", label: "Город" },
];

const marketCoords: Record<string, { latitude: number; longitude: number }> = {
  "Дубай, ОАЭ": { latitude: 25.2048, longitude: 55.2708 },
  "Лондон, Великобритания": { latitude: 51.5074, longitude: -0.1278 },
  "Нью-Йорк, США": { latitude: 40.7128, longitude: -74.006 },
  "Сингапур": { latitude: 1.3521, longitude: 103.8198 },
  "Париж, Франция": { latitude: 48.8566, longitude: 2.3522 },
  "Токио, Япония": { latitude: 35.6762, longitude: 139.6503 },
  "Гонконг, Китай": { latitude: 22.3193, longitude: 114.1694 },
  "Майами, США": { latitude: 25.7617, longitude: -80.1918 },
};

function coordsFor(market: string, index: number) {
  const base = marketCoords[market] ?? { latitude: 0, longitude: 0 };
  const offset = index * 0.012;
  return {
    latitude: Number((base.latitude + offset).toFixed(4)),
    longitude: Number((base.longitude - offset * 0.7).toFixed(4)),
  };
}

function makeHotel(
  id: string,
  entry: Omit<Hotel, "id" | "latitude" | "longitude" | "bars"> & {
    bars?: number[];
  },
  index: number,
): Hotel {
  const { latitude, longitude } = coordsFor(entry.market, index);
  return {
    ...entry,
    id,
    latitude,
    longitude,
    bars: entry.bars ?? [3, 4, 4, 5, 5, 6, 6],
  };
}

const extendedHotels: Hotel[] = [
  makeHotel(
    "7",
    {
      name: "Jumeirah Beach Hotel",
      stars: 5,
      category: "Курорт люкс",
      adr: "$720",
      revpar: "$590",
      occ: "82%",
      market: "Дубай, ОАЭ",
      segment: "Люкс",
      status: "Monitored",
      statusRu: "Мониторинг",
      statusColor: "bg-green-500/20 text-green-400",
      trend: "↑ +9%",
      trendColor: "text-green-500",
    },
    1,
  ),
  makeHotel(
    "8",
    {
      name: "Address Downtown",
      stars: 5,
      category: "Городской люкс",
      adr: "$610",
      revpar: "$498",
      occ: "81%",
      market: "Дубай, ОАЭ",
      segment: "Люкс",
      status: "Monitored",
      statusRu: "Мониторинг",
      statusColor: "bg-green-500/20 text-green-400",
      trend: "↑ +6%",
      trendColor: "text-green-500",
    },
    2,
  ),
  makeHotel(
    "9",
    {
      name: "The Savoy",
      stars: 5,
      category: "Городской люкс",
      adr: "$780",
      revpar: "$620",
      occ: "79%",
      market: "Лондон, Великобритания",
      segment: "Люкс",
      status: "Monitored",
      statusRu: "Мониторинг",
      statusColor: "bg-green-500/20 text-green-400",
      trend: "→ +0,8%",
      trendColor: "text-muted-foreground",
    },
    1,
  ),
  makeHotel(
    "10",
    {
      name: "Claridge's",
      stars: 5,
      category: "Городской люкс",
      adr: "$940",
      revpar: "$760",
      occ: "81%",
      market: "Лондон, Великобритания",
      segment: "Ультра-люкс",
      status: "In Analysis",
      statusRu: "В анализе",
      statusColor: "bg-amber-500/20 text-amber-400",
      trend: "↑ +4%",
      trendColor: "text-green-500",
    },
    2,
  ),
  makeHotel(
    "11",
    {
      name: "The Plaza",
      stars: 5,
      category: "Городской люкс",
      adr: "$820",
      revpar: "$655",
      occ: "80%",
      market: "Нью-Йорк, США",
      segment: "Люкс",
      status: "Monitored",
      statusRu: "Мониторинг",
      statusColor: "bg-green-500/20 text-green-400",
      trend: "↑ +2%",
      trendColor: "text-green-500",
    },
    1,
  ),
  makeHotel(
    "12",
    {
      name: "The St. Regis New York",
      stars: 5,
      category: "Городской люкс",
      adr: "$910",
      revpar: "$728",
      occ: "80%",
      market: "Нью-Йорк, США",
      segment: "Люкс",
      status: "Monitored",
      statusRu: "Мониторинг",
      statusColor: "bg-green-500/20 text-green-400",
      trend: "↑ +3%",
      trendColor: "text-green-500",
    },
    2,
  ),
  makeHotel(
    "13",
    {
      name: "Hilton Midtown",
      stars: 4,
      category: "Бизнес",
      adr: "$340",
      revpar: "$255",
      occ: "75%",
      market: "Нью-Йорк, США",
      segment: "Повышенный класс",
      status: "Monitored",
      statusRu: "Мониторинг",
      statusColor: "bg-green-500/20 text-green-400",
      trend: "→ +0,1%",
      trendColor: "text-muted-foreground",
    },
    3,
  ),
  makeHotel(
    "14",
    {
      name: "Raffles Singapore",
      stars: 5,
      category: "Городской люкс",
      adr: "$760",
      revpar: "$610",
      occ: "80%",
      market: "Сингапур",
      segment: "Люкс",
      status: "Monitored",
      statusRu: "Мониторинг",
      statusColor: "bg-green-500/20 text-green-400",
      trend: "↑ +11%",
      trendColor: "text-green-500",
    },
    1,
  ),
  makeHotel(
    "15",
    {
      name: "Mandarin Oriental Singapore",
      stars: 5,
      category: "Городской люкс",
      adr: "$690",
      revpar: "$552",
      occ: "80%",
      market: "Сингапур",
      segment: "Люкс",
      status: "Monitored",
      statusRu: "Мониторинг",
      statusColor: "bg-green-500/20 text-green-400",
      trend: "↑ +7%",
      trendColor: "text-green-500",
    },
    2,
  ),
  makeHotel(
    "16",
    {
      name: "Park Hyatt Paris",
      stars: 5,
      category: "Городской люкс",
      adr: "$880",
      revpar: "$704",
      occ: "80%",
      market: "Париж, Франция",
      segment: "Люкс",
      status: "Monitored",
      statusRu: "Мониторинг",
      statusColor: "bg-green-500/20 text-green-400",
      trend: "↑ +5%",
      trendColor: "text-green-500",
    },
    0,
  ),
  makeHotel(
    "17",
    {
      name: "Le Bristol Paris",
      stars: 5,
      category: "Городской люкс",
      adr: "$970",
      revpar: "$776",
      occ: "80%",
      market: "Париж, Франция",
      segment: "Ультра-люкс",
      status: "In Analysis",
      statusRu: "В анализе",
      statusColor: "bg-amber-500/20 text-amber-400",
      trend: "↑ +4%",
      trendColor: "text-green-500",
    },
    1,
  ),
  makeHotel(
    "18",
    {
      name: "Aman Tokyo",
      stars: 5,
      category: "Городской люкс",
      adr: "$1 020",
      revpar: "$816",
      occ: "80%",
      market: "Токио, Япония",
      segment: "Ультра-люкс",
      status: "Monitored",
      statusRu: "Мониторинг",
      statusColor: "bg-green-500/20 text-green-400",
      trend: "↑ +10%",
      trendColor: "text-green-500",
    },
    0,
  ),
  makeHotel(
    "19",
    {
      name: "The Peninsula Tokyo",
      stars: 5,
      category: "Городской люкс",
      adr: "$740",
      revpar: "$592",
      occ: "80%",
      market: "Токио, Япония",
      segment: "Люкс",
      status: "Monitored",
      statusRu: "Мониторинг",
      statusColor: "bg-green-500/20 text-green-400",
      trend: "↑ +6%",
      trendColor: "text-green-500",
    },
    1,
  ),
  makeHotel(
    "20",
    {
      name: "The Peninsula Hong Kong",
      stars: 5,
      category: "Городской люкс",
      adr: "$650",
      revpar: "$520",
      occ: "80%",
      market: "Гонконг, Китай",
      segment: "Люкс",
      status: "Monitored",
      statusRu: "Мониторинг",
      statusColor: "bg-green-500/20 text-green-400",
      trend: "↑ +8%",
      trendColor: "text-green-500",
    },
    0,
  ),
  makeHotel(
    "21",
    {
      name: "Mandarin Oriental Hong Kong",
      stars: 5,
      category: "Городской люкс",
      adr: "$710",
      revpar: "$568",
      occ: "80%",
      market: "Гонконг, Китай",
      segment: "Люкс",
      status: "Monitored",
      statusRu: "Мониторинг",
      statusColor: "bg-green-500/20 text-green-400",
      trend: "↑ +5%",
      trendColor: "text-green-500",
    },
    1,
  ),
  makeHotel(
    "22",
    {
      name: "Faena Hotel Miami Beach",
      stars: 5,
      category: "Курорт люкс",
      adr: "$890",
      revpar: "$712",
      occ: "80%",
      market: "Майами, США",
      segment: "Люкс",
      status: "Monitored",
      statusRu: "Мониторинг",
      statusColor: "bg-green-500/20 text-green-400",
      trend: "↑ +14%",
      trendColor: "text-green-500",
    },
    0,
  ),
  makeHotel(
    "23",
    {
      name: "1 Hotel South Beach",
      stars: 4,
      category: "Курорт",
      adr: "$420",
      revpar: "$315",
      occ: "75%",
      market: "Майами, США",
      segment: "Повышенный класс",
      status: "Monitored",
      statusRu: "Мониторинг",
      statusColor: "bg-green-500/20 text-green-400",
      trend: "↑ +9%",
      trendColor: "text-green-500",
    },
    1,
  ),
  makeHotel(
    "24",
    {
      name: "Sofitel Paris Le Faubourg",
      stars: 4,
      category: "Бизнес",
      adr: "$410",
      revpar: "$308",
      occ: "75%",
      market: "Париж, Франция",
      segment: "Повышенный класс",
      status: "Monitored",
      statusRu: "Мониторинг",
      statusColor: "bg-green-500/20 text-green-400",
      trend: "→ +0,5%",
      trendColor: "text-muted-foreground",
    },
    2,
  ),
];

export const trackedHotels: Hotel[] = [...mockHotels, ...extendedHotels];

export const trackedHotelsTotal = 847;

export function filterTrackedHotels(
  hotels: Hotel[],
  filter: HotelFilterId,
  watchlistIds?: string[],
): Hotel[] {
  switch (filter) {
    case "mine":
      if (!watchlistIds || watchlistIds.length === 0) {
        return [];
      }
      return hotels.filter((hotel) => watchlistIds.includes(hotel.id));
    case "5":
      return hotels.filter((hotel) => hotel.stars === 5);
    case "4":
      return hotels.filter((hotel) => hotel.stars === 4);
    case "resort":
      return hotels.filter((hotel) => /курорт/i.test(hotel.category));
    case "city":
      return hotels.filter(
        (hotel) =>
          /город|бизнес/i.test(hotel.category) &&
          !/курорт/i.test(hotel.category),
      );
    default:
      return hotels;
  }
}

export function groupHotelsByMarket(hotels: Hotel[]): Map<string, Hotel[]> {
  const groups = new Map<string, Hotel[]>();
  for (const hotel of hotels) {
    const list = groups.get(hotel.market) ?? [];
    list.push(hotel);
    groups.set(hotel.market, list);
  }
  return new Map(
    [...groups.entries()].sort(([a], [b]) => a.localeCompare(b, "ru")),
  );
}

export function searchHotels(hotels: Hotel[], query: string): Hotel[] {
  const q = query.trim().toLowerCase();
  if (!q) {
    return hotels;
  }
  return hotels.filter(
    (hotel) =>
      hotel.name.toLowerCase().includes(q) ||
      hotel.market.toLowerCase().includes(q) ||
      hotel.category.toLowerCase().includes(q) ||
      hotel.segment.toLowerCase().includes(q),
  );
}
