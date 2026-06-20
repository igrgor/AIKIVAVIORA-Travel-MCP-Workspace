import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  loadReports,
  newReportId,
  saveReports,
  type AnalysisReport,
  type ComparisonSnapshotReport,
  type ComparisonSnapshotRow,
  type SavedReport,
} from "../lib/workspaceStorage";

type ReportsContextValue = {
  reports: SavedReport[];
  saveAnalysisReport: (input: {
    title: string;
    messages: AnalysisReport["messages"];
    summaryMarkdown: string;
    hotelIds?: string[];
    tags?: string[];
  }) => AnalysisReport;
  saveComparisonSnapshot: (input: {
    title: string;
    hotelIds: string[];
    hotelNames: string[];
    rows: ComparisonSnapshotRow[];
    tags?: string[];
  }) => ComparisonSnapshotReport;
  removeReport: (id: string) => void;
  getReport: (id: string) => SavedReport | undefined;
  exportReportMarkdown: (id: string) => string | null;
};

const ReportsContext = createContext<ReportsContextValue | null>(null);

export function ReportsProvider({ children }: { children: ReactNode }) {
  const [reports, setReports] = useState<SavedReport[]>(() => loadReports());

  const persist = useCallback((next: SavedReport[]) => {
    saveReports(next);
    setReports(next);
  }, []);

  const saveAnalysisReport = useCallback(
    (input: {
      title: string;
      messages: AnalysisReport["messages"];
      summaryMarkdown: string;
      hotelIds?: string[];
      tags?: string[];
    }) => {
      const now = new Date().toISOString();
      const report: AnalysisReport = {
        kind: "analysis",
        id: newReportId(),
        title: input.title,
        createdAt: now,
        updatedAt: now,
        tags: input.tags ?? [],
        hotelIds: input.hotelIds ?? [],
        messages: input.messages,
        summaryMarkdown: input.summaryMarkdown,
      };
      persist([report, ...reports]);
      return report;
    },
    [persist, reports],
  );

  const saveComparisonSnapshot = useCallback(
    (input: {
      title: string;
      hotelIds: string[];
      hotelNames: string[];
      rows: ComparisonSnapshotRow[];
      tags?: string[];
    }) => {
      const now = new Date().toISOString();
      const report: ComparisonSnapshotReport = {
        kind: "comparison-snapshot",
        id: newReportId(),
        title: input.title,
        createdAt: now,
        updatedAt: now,
        tags: input.tags ?? [],
        hotelIds: input.hotelIds,
        hotelNames: input.hotelNames,
        rows: input.rows,
      };
      persist([report, ...reports]);
      return report;
    },
    [persist, reports],
  );

  const removeReport = useCallback(
    (id: string) => {
      persist(reports.filter((report) => report.id !== id));
    },
    [persist, reports],
  );

  const getReport = useCallback(
    (id: string) => reports.find((report) => report.id === id),
    [reports],
  );

  const exportReportMarkdown = useCallback(
    (id: string) => {
      const report = getReport(id);
      if (!report) {
        return null;
      }

      if (report.kind === "analysis") {
        const lines = [
          `# ${report.title}`,
          "",
          `Создан: ${new Date(report.createdAt).toLocaleString("ru-RU")}`,
          "",
          report.summaryMarkdown,
          "",
          "## Диалог",
          "",
          ...report.messages.map(
            (message) =>
              `**${message.role === "user" ? "Вы" : "Ассистент"}:** ${message.text}`,
          ),
        ];
        return lines.join("\n");
      }

      const header = report.hotelNames.join(" · ");
      const table = report.rows
        .map((row) => `| ${row.metric} | ${row.values.join(" | ")} |`)
        .join("\n");

      return [
        `# ${report.title}`,
        "",
        `Создан: ${new Date(report.createdAt).toLocaleString("ru-RU")}`,
        `Отели: ${header}`,
        "",
        "| Метрика | " + report.hotelNames.join(" | ") + " |",
        "| --- | " + report.hotelNames.map(() => "---").join(" | ") + " |",
        table,
      ].join("\n");
    },
    [getReport],
  );

  const value = useMemo(
    () => ({
      reports,
      saveAnalysisReport,
      saveComparisonSnapshot,
      removeReport,
      getReport,
      exportReportMarkdown,
    }),
    [
      reports,
      saveAnalysisReport,
      saveComparisonSnapshot,
      removeReport,
      getReport,
      exportReportMarkdown,
    ],
  );

  return (
    <ReportsContext.Provider value={value}>{children}</ReportsContext.Provider>
  );
}

export function useReports() {
  const context = useContext(ReportsContext);
  if (!context) {
    throw new Error("useReports must be used within ReportsProvider");
  }
  return context;
}
