import { useState } from "react";
import { Download, Trash2 } from "lucide-react";
import { useReports } from "../context/ReportsContext";
import type { SavedReport } from "../lib/workspaceStorage";
import { ru } from "../i18n/ru";
import { DevBadge } from "./DevNotice";

function formatReportDate(iso: string): string {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

function reportKindLabel(report: SavedReport): string {
  return report.kind === "analysis"
    ? ru.reportKindAnalysis
    : ru.reportKindComparison;
}

export default function SavedReportsPanel() {
  const { reports, removeReport, exportReportMarkdown } = useReports();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (reports.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-8 border border-dashed border-border rounded">
        {ru.noReportsYet}
      </p>
    );
  }

  const handleExport = (id: string) => {
    const markdown = exportReportMarkdown(id);
    if (!markdown) {
      return;
    }
    const report = reports.find((item) => item.id === id);
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${report?.title ?? "report"}.md`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-3">
      <p className="text-[10px] text-muted-foreground flex items-center gap-1.5" title={ru.reportsStorageHint}>
        <DevBadge kind="local" />
        {ru.reportsStorageHint}
      </p>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
      {reports.map((report) => {
        const expanded = expandedId === report.id;
        return (
          <div
            key={report.id}
            className="bg-background/50 border border-border rounded p-4 space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-medium text-sm truncate">{report.title}</h4>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-secondary text-muted-foreground">
                    {reportKindLabel(report)}
                  </span>
                </div>
                <div className="text-[10px] text-muted-foreground font-mono mt-1">
                  {ru.created}: {formatReportDate(report.createdAt)} · {report.tags.join(", ") || "—"}
                </div>
              </div>
            </div>

            {report.kind === "comparison-snapshot" ? (
              <p className="text-xs text-muted-foreground">
                {report.hotelNames.join(" · ")}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground line-clamp-2">
                {report.summaryMarkdown.split("\n")[0]}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() =>
                  setExpandedId(expanded ? null : report.id)
                }
                className="text-xs border border-border px-3 py-1.5 rounded-sm hover:bg-secondary"
              >
                {expanded ? "Свернуть" : ru.open}
              </button>
              <button
                type="button"
                onClick={() => handleExport(report.id)}
                className="flex items-center gap-1.5 text-xs border border-border px-3 py-1.5 rounded-sm hover:bg-secondary"
              >
                <Download size={12} /> {ru.exportMarkdown}
              </button>
              <button
                type="button"
                onClick={() => removeReport(report.id)}
                className="flex items-center gap-1.5 text-xs text-red-400/90 px-3 py-1.5 rounded-sm hover:bg-red-500/10"
              >
                <Trash2 size={12} /> {ru.deleteReport}
              </button>
            </div>

            {expanded ? (
              <pre className="text-[10px] font-mono text-muted-foreground whitespace-pre-wrap leading-relaxed bg-background/60 border border-border rounded p-3 max-h-[200px] overflow-y-auto">
                {exportReportMarkdown(report.id)}
              </pre>
            ) : null}
          </div>
        );
      })}
      </div>
    </div>
  );
}
