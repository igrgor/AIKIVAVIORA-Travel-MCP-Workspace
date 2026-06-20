const now = new Date();

export const appYear = now.getFullYear();
export const appQuarter = Math.floor(now.getMonth() / 3) + 1;
export const appQuarterLabel = `${appQuarter} кв. ${appYear}`;
export const appQuarterShort = `Q${appQuarter} ${appYear}`;

export function formatAppDateRu(daysAgo = 0): string {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function formatStatusUtc(): string {
  const formatted = new Intl.DateTimeFormat("ru-RU", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "UTC",
  }).format(new Date());
  return `${formatted} UTC`;
}

export function formatLastSync(): string {
  return "Синхр.: 2 мин назад";
}

export function formatTimelineRangeRu(startDate: string, endDate: string): string {
  const start = new Date(`${startDate}T12:00:00`);
  const end = new Date(`${endDate}T12:00:00`);
  const startLabel = new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
  }).format(start);
  const endLabel = new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
  }).format(end);
  const year = end.getFullYear();
  return `${startLabel} - ${endLabel} ${year} год`;
}
