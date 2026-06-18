import { Activity, Search, Upload } from "lucide-react";
import { mockLogs, mockSources, mockMarketPulse } from "../data/mockData";

export default function ActivityPanel() {
  return (
    <div className="flex flex-col h-full bg-background border-l border-border shrink-0">
      
      {/* Activity Log */}
      <div className="h-[45%] flex flex-col border-b border-border">
        <div className="p-4 border-b border-border flex items-center justify-between shrink-0 bg-card">
          <div className="flex items-center gap-2">
            <Activity size={16} className="text-muted-foreground" />
            <h2 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">ACTIVITY LOG</h2>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] text-green-500/80 font-mono uppercase">Live</span>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {mockLogs.map((log, i) => (
            <div key={i} className="text-xs grid grid-cols-[auto_auto_1fr] gap-2 items-start">
              <span className="font-mono text-muted-foreground/60 text-[10px] mt-0.5">{log.time}</span>
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wider ${log.color}`}>
                {log.type}
              </span>
              <span className="text-muted-foreground leading-snug">{log.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Data Sources */}
      <div className="h-[25%] flex flex-col border-b border-border">
        <div className="p-4 pb-2 shrink-0">
          <h2 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">DATA SOURCES</h2>
        </div>
        <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2">
          {mockSources.map((source, i) => (
            <div key={i} className="flex items-center justify-between p-2 border border-border rounded-sm bg-card hover:bg-secondary/50 transition-colors">
              <div>
                <div className="text-sm font-medium">{source.name}</div>
                <div className="text-[10px] text-muted-foreground font-mono">{source.detail}</div>
              </div>
              {source.name === "Manual Import" ? (
                <button className="text-muted-foreground hover:text-foreground">
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
        <div className="p-4 pb-2 shrink-0">
          <h2 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">QUICK RESEARCH</h2>
        </div>
        <div className="px-4 space-y-4">
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-2.5 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search hotel, market, or comp set..." 
              className="w-full bg-card border border-border rounded-sm py-2 pl-8 pr-3 text-xs focus:outline-none focus:border-primary"
            />
          </div>
          
          <div className="flex flex-wrap gap-1.5">
            {["Dubai luxury 2024", "NYC RevPAR", "London market share", "Singapore hotels"].map(chip => (
              <button key={chip} className="text-[10px] px-2 py-1 rounded bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors">
                {chip}
              </button>
            ))}
          </div>

          <div className="pt-2">
            <h3 className="text-[10px] font-semibold tracking-wider text-muted-foreground/70 uppercase mb-2">MARKET PULSE</h3>
            <div className="space-y-2">
              {mockMarketPulse.map((pulse, i) => (
                <div key={i} className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">{pulse.market}</span>
                  <span className={`font-mono text-[11px] ${pulse.color}`}>{pulse.trend}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
