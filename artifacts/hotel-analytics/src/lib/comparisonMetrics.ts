import type { Hotel } from "../data/mockData";
import { ru } from "../i18n/ru";

function parseMoney(value: string): number {
  return parseInt(value.replace(/[^\d]/g, ""), 10) || 0;
}

function parsePercent(value: string): number {
  return parseFloat(value.replace("%", "").replace(",", ".")) || 0;
}

function parseTrend(value: string): number {
  const match = value.match(/(-?\d+(?:,\d+)?)/);
  return match ? parseFloat(match[1].replace(",", ".")) : 0;
}

function formatMoney(amount: number): string {
  return `$${amount.toLocaleString("en-US")}`;
}

export type ComparisonMetricRow = {
  metric: string;
  values: string[];
  highlightIndex: number | null;
  lowlightIndex: number | null;
  higherIsBetter: boolean;
};

function rankIndices(
  numbers: number[],
  higherIsBetter: boolean,
): { highlight: number | null; lowlight: number | null } {
  if (numbers.length === 0) {
    return { highlight: null, lowlight: null };
  }

  let bestIndex = 0;
  let worstIndex = 0;

  for (let index = 1; index < numbers.length; index += 1) {
    if (higherIsBetter) {
      if (numbers[index] > numbers[bestIndex]) {
        bestIndex = index;
      }
      if (numbers[index] < numbers[worstIndex]) {
        worstIndex = index;
      }
    } else if (numbers[index] < numbers[bestIndex]) {
      bestIndex = index;
    } else if (numbers[index] > numbers[worstIndex]) {
      worstIndex = index;
    }
  }

  return {
    highlight: numbers.length > 1 ? bestIndex : null,
    lowlight: numbers.length > 1 ? worstIndex : null,
  };
}

function buildRow(
  metric: string,
  values: string[],
  numbers: number[],
  higherIsBetter: boolean,
): ComparisonMetricRow {
  const { highlight, lowlight } = rankIndices(numbers, higherIsBetter);
  return {
    metric,
    values,
    highlightIndex: highlight,
    lowlightIndex: lowlight,
    higherIsBetter,
  };
}

export function buildComparisonRows(hotels: Hotel[]): ComparisonMetricRow[] {
  if (hotels.length === 0) {
    return [];
  }

  const adrValues = hotels.map((hotel) => hotel.adr);
  const adrNums = hotels.map((hotel) => parseMoney(hotel.adr));

  const revparValues = hotels.map((hotel) => hotel.revpar);
  const revparNums = hotels.map((hotel) => parseMoney(hotel.revpar));

  const occValues = hotels.map((hotel) =>
    hotel.occ.replace(".", ",").replace(/(\d+)%/, "$1,0%"),
  );
  const occNums = hotels.map((hotel) => parsePercent(hotel.occ));

  const trevparValues = hotels.map((hotel) =>
    formatMoney(Math.round(parseMoney(hotel.revpar) * 1.55)),
  );
  const trevparNums = hotels.map((hotel) =>
    Math.round(parseMoney(hotel.revpar) * 1.55),
  );

  const gopparValues = hotels.map((hotel) =>
    formatMoney(Math.round(parseMoney(hotel.revpar) * 0.68)),
  );
  const gopparNums = hotels.map((hotel) =>
    Math.round(parseMoney(hotel.revpar) * 0.68),
  );

  const shareValues = hotels.map((hotel) => {
    const base = 8 + hotel.stars * 2 + (parseMoney(hotel.revpar) % 7);
    return `${(base + parseMoney(hotel.id) * 0.3).toFixed(1).replace(".", ",")}%`;
  });
  const shareNums = shareValues.map((value) => parsePercent(value));

  const reviewValues = hotels.map((hotel) =>
    (8.8 + hotel.stars * 0.08 + (parseMoney(hotel.revpar) % 10) * 0.01)
      .toFixed(1)
      .replace(".", ","),
  );
  const reviewNums = reviewValues.map((value) => parseFloat(value.replace(",", ".")));

  const growthValues = hotels.map((hotel) => {
    const trend = parseTrend(hotel.trend);
    const sign = trend > 0 ? "+" : "";
    return `${sign}${trend.toFixed(1).replace(".", ",")}%`;
  });
  const growthNums = hotels.map((hotel) => parseTrend(hotel.trend));

  return [
    buildRow(ru.adr, adrValues, adrNums, true),
    buildRow(ru.revpar, revparValues, revparNums, true),
    buildRow(ru.occupancy, occValues, occNums, true),
    buildRow(ru.trevpar, trevparValues, trevparNums, true),
    buildRow(ru.goppar, gopparValues, gopparNums, true),
    buildRow(ru.marketShare, shareValues, shareNums, true),
    buildRow(ru.reviewScore, reviewValues, reviewNums, true),
    buildRow(ru.yoyGrowth, growthValues, growthNums, true),
  ];
}
