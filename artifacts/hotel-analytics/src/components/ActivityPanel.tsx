import { Activity, Search, Upload } from "lucide-react";
import { mockSources, mockMarketPulse } from "../data/mockData";
import { useAppActivity } from "../context/AppActivityContext";
import { ru } from "../i18n/ru";
import { appYear } from "../lib/appDates";
import { translateLogType } from "../lib/localize";
import { DevBadge, DevBanner } from "./DevNotice";

const weatherSource = {
  name: ru.weatherMcp,
  status: ru.connected,
  statusColor: "text-cyan-400",
  detail: "@dangahagan/weather-mcp · stdio · api-server",
};

const stubSourceNames = new Set(["STR Global", "HotStats", "OTA Insight", "Веб-исследования", "Импорт CSV"]);

function sourceHint(name: string): string | undefined {
  if (name === "STR Global") return ru.strSourceHint;
  if (stubSourceNames.has(name)) return ru.dataSourcesDemoHint;
  return undefined;
}

export default function ActivityPanel() {
  const { logs } = useAppActivity();
  return (
    <div className="flex flex-col h-full bg-background border-l border-border shrink-0">
      
      {/* Activity Log */}
      <div className="h-[45%] flex flex-col border-b border-border">
        <div className="p-4 border-b border-border flex items-center justify-between shrink-0 bg-card">
          <div className="flex items-center gap-2">
            <Activity size={16} className="text-muted-foreground" />
            <h2 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">{ru.activityLog}</h2>
            <DevBadge kind="demo" title={ru.activityLogDemoHint} />
          </div>
          <div className="flex items-center gap-1.5" title={ru.activityLogDemoHint}>
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] text-green-500/80 font-mono uppercase">{ru.live}</span>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {logs.map((log, i) => (
            <div key={i} className="text-xs grid grid-cols-[auto_auto_1fr] gap-2 items-start">
              <span className="font-mono text-muted-foreground/60 text-[10px] mt-0.5">{log.time}</span>
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wider ${log.color}`}>
                {translateLogType(log.type)}
              </span>
              <span className="text-muted-foreground leading-snug">{log.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Data Sources */}
      <div className="h-[25%] flex flex-col border-b border-border">
        <div className="p-4 pb-2 shrink-0 flex items-center gap-2">
          <h2 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">{ru.dataSources}</h2>
          <DevBadge kind="stub" title={ru.dataSourcesDemoHint} />
        </div>
        <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2">
          {[weatherSource, ...mockSources].map((source, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-2 border border-border rounded-sm bg-card hover:bg-secondary/50 transition-colors"
              title={sourceHint(source.name)}
            >
              <div>
                <div className="flex items-center gap-1.5">
                  <div className="text-sm font-medium">{source.name}</div>
                  {stubSourceNames.has(source.name) ? (
                    <DevBadge kind={source.name === "STR Global" ? "wip" : "stub"} />
                  ) : null}
                </div>
                <div className="text-[10px] text-muted-foreground font-mono">{source.detail}</div>
              </div>
              {source.name === "Импорт CSV" ? (
                <button
                  type="button"
                  className="text-muted-foreground hover:text-foreground"
                  title={ru.quickResearchInDev}
                >
                  <Upload size={14} />
                </button>
              ) : (
                <span className={`text-[10px] uppercase font-bold tracking-wider ${source.statusColor}`}>
                  {source.status}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Quick Research */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 pb-2 shrink-0 flex items-center gap-2">
          <h2 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">{ru.quickResearch}</h2>
          <DevBadge kind="wip" title={ru.quickResearchInDev} />
        </div>
        <div className="px-4 space-y-4">
          <DevBanner kind="wip">{ru.quickResearchInDev}</DevBanner>
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-2.5 text-muted-foreground" />
            <input 
              type="text" 
              placeholder={ru.searchPlaceholder}
              disabled
              title={ru.quickResearchInDev}
              className="w-full bg-card border border-border rounded-sm py-2 pl-8 pr-3 text-xs opacity-60 cursor-not-allowed"
            />
          </div>
          
          <div className="flex flex-wrap gap-1.5">
            {[`Дубай люкс ${appYear}`, "Доход на номер, Нью-Йорк", "Доля рынка Лондон", "Отели Сингапура"].map(chip => (
              <button
                key={chip}
                type="button"
                disabled
                title={ru.quickResearchInDev}
                className="text-xs px-2.5 py-1.5 rounded bg-secondary text-muted-foreground opacity-60 cursor-not-allowed"
              >
                {chip}
              </button>
            ))}
          </div>

          <div className="pt-2 pb-4">
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">{ru.marketPulse}</h3>
              <DevBadge kind="demo" title={ru.marketPulseDemoHint} />
            </div>
            <div className="space-y-3">
              {mockMarketPulse.map((pulse, i) => (
                <div key={i} className="flex justify-between items-center gap-3" title={ru.marketPulseDemoHint}>
                  <span className="text-sm font-medium text-foreground">{pulse.market}</span>
                  <span className={`font-mono text-sm font-semibold shrink-0 ${pulse.color}`}>{pulse.trend}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
