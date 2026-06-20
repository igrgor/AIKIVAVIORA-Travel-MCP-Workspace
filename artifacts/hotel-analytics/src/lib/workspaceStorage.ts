import { COMPARISON_LIMIT } from "./comparisonLimit";

export const WORKSPACE_STORAGE_KEY = "aikivaviora.workspace.v2";
const LEGACY_WORKSPACE_STORAGE_KEY = "aikivaviora.workspace.v1";
export const REPORTS_STORAGE_KEY = "aikivaviora.reports.v1";

export type WatchlistEntry = {
  hotelId: string;
  note?: string;
  addedAt: string;
};

export type WorkspaceV1 = {
  watchlist: WatchlistEntry[];
  activeHotelId: string | null;
  comparisonIds: string[];
};

export const emptyWorkspace = (): WorkspaceV1 => ({
  watchlist: [],
  activeHotelId: null,
  comparisonIds: [],
});

export function sanitizeComparisonIds(
  ids: unknown,
  validHotelIds: ReadonlySet<string>,
  max = COMPARISON_LIMIT,
): string[] {
  if (!Array.isArray(ids)) {
    return [];
  }

  const seen = new Set<string>();
  const result: string[] = [];

  for (const id of ids) {
    const normalizedId =
      typeof id === "string"
        ? id
        : typeof id === "number"
          ? String(id)
          : null;
    if (!normalizedId || !validHotelIds.has(normalizedId) || seen.has(normalizedId)) {
      continue;
    }
    seen.add(normalizedId);
    result.push(normalizedId);
    if (result.length >= max) {
      break;
    }
  }

  return result;
}

export function normalizeWorkspace(
  workspace: WorkspaceV1,
  validHotelIds: ReadonlySet<string>,
): WorkspaceV1 {
  const comparisonIds = sanitizeComparisonIds(
    workspace.comparisonIds,
    validHotelIds,
  );

  const watchlist = Array.isArray(workspace.watchlist)
    ? workspace.watchlist
        .map((entry) => ({
          ...entry,
          hotelId:
            typeof entry.hotelId === "string"
              ? entry.hotelId
              : String(entry.hotelId),
        }))
        .filter((entry) => validHotelIds.has(entry.hotelId))
    : [];

  const activeHotelId =
    typeof workspace.activeHotelId === "string" &&
    validHotelIds.has(workspace.activeHotelId)
      ? workspace.activeHotelId
      : null;

  return {
    watchlist,
    activeHotelId,
    comparisonIds,
  };
}

export function loadWorkspace(
  validHotelIds?: ReadonlySet<string>,
): WorkspaceV1 {
  try {
    let raw = localStorage.getItem(WORKSPACE_STORAGE_KEY);
    if (!raw) {
      raw = localStorage.getItem(LEGACY_WORKSPACE_STORAGE_KEY);
      if (raw && validHotelIds) {
        const parsed = JSON.parse(raw) as Partial<WorkspaceV1>;
        const legacyWorkspace: WorkspaceV1 = {
          watchlist: Array.isArray(parsed.watchlist) ? parsed.watchlist : [],
          activeHotelId:
            typeof parsed.activeHotelId === "string"
              ? parsed.activeHotelId
              : typeof parsed.activeHotelId === "number"
                ? String(parsed.activeHotelId)
                : null,
          comparisonIds: Array.isArray(parsed.comparisonIds)
            ? parsed.comparisonIds.map((id) =>
                typeof id === "string" ? id : String(id),
              )
            : [],
        };
        const migrated = normalizeWorkspace(legacyWorkspace, validHotelIds);
        saveWorkspace(migrated);
        localStorage.removeItem(LEGACY_WORKSPACE_STORAGE_KEY);
        return migrated;
      }
    }

    if (!raw) {
      return emptyWorkspace();
    }

    const parsed = JSON.parse(raw) as Partial<WorkspaceV1>;
    const workspace: WorkspaceV1 = {
      watchlist: Array.isArray(parsed.watchlist) ? parsed.watchlist : [],
      activeHotelId:
        typeof parsed.activeHotelId === "string"
          ? parsed.activeHotelId
          : typeof parsed.activeHotelId === "number"
            ? String(parsed.activeHotelId)
            : null,
      comparisonIds: Array.isArray(parsed.comparisonIds)
        ? parsed.comparisonIds.map((id) =>
            typeof id === "string" ? id : String(id),
          )
        : [],
    };

    if (!validHotelIds) {
      return workspace;
    }

    return normalizeWorkspace(workspace, validHotelIds);
  } catch {
    return emptyWorkspace();
  }
}

export function saveWorkspace(workspace: WorkspaceV1): void {
  localStorage.setItem(WORKSPACE_STORAGE_KEY, JSON.stringify(workspace));
}

export type ChatMessageSnapshot = {
  role: "user" | "assistant";
  text: string;
};

export type ComparisonSnapshotRow = {
  metric: string;
  values: string[];
};

export type AnalysisReport = {
  kind: "analysis";
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  hotelIds: string[];
  messages: ChatMessageSnapshot[];
  summaryMarkdown: string;
};

export type ComparisonSnapshotReport = {
  kind: "comparison-snapshot";
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  hotelIds: string[];
  hotelNames: string[];
  rows: ComparisonSnapshotRow[];
};

export type SavedReport = AnalysisReport | ComparisonSnapshotReport;

export function loadReports(): SavedReport[] {
  try {
    const raw = localStorage.getItem(REPORTS_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw) as SavedReport[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveReports(reports: SavedReport[]): void {
  localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(reports));
}

export function newReportId(): string {
  return `report-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
