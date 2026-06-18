import { mockKPIs, mockHotels } from "../data/mockData";
import MetricCard from "./MetricCard";
import HotelCard from "./HotelCard";
import ComparisonMatrix from "./ComparisonMatrix";
import { Download, FolderOpen, Play } from "lucide-react";

export default function AnalyticsHub() {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Top Status Bar */}
      <div className="h-8 border-b border-border bg-card shrink-0 flex items-center px-4 justify-between text-[11px] font-mono tracking-tight text-muted-foreground">
        <div className="flex items-center gap-4">
          <span className="text-foreground font-sans font-medium uppercase tracking-wider">Hotel Analytics Pro</span>
          <span>{new Date().toISOString().split('T')[0]} 14:34:22 UTC</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-blue-500"></span> 847 Hotels Tracked</span>
          <span className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-amber-500"></span> 23 Active Comparisons</span>
          <span>12 Reports</span>
          <span>Last Sync: 2m ago</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        
        {/* KPI Row */}
        <div className="grid grid-cols-4 gap-4">
          {mockKPIs.map((kpi, i) => (
            <MetricCard key={i} kpi={kpi} />
          ))}
        </div>

        {/* Hotel Cards Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h3 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">TRACKED PROPERTIES</h3>
              <span className="px-1.5 py-0.5 rounded-sm bg-secondary text-[10px] font-mono">6 HOTELS</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] bg-secondary/50 rounded-sm p-0.5">
              {['All', '5-Star', '4-Star', 'Resorts', 'City'].map((tab, i) => (
                <button key={tab} className={`px-3 py-1 rounded-sm transition-colors ${i === 0 ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
                  {tab}
                </button>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
            {mockHotels.map(hotel => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}
          </div>
        </div>

        {/* Comparison Panel */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">COMPARISON MATRIX</h3>
            <span className="text-xs text-muted-foreground/50">Select hotels to compare</span>
          </div>
          <ComparisonMatrix />
          <button className="text-xs px-4 py-2 border border-border rounded-sm hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground w-full border-dashed">
            + Add Hotel to Comparison
          </button>
        </div>

        {/* Research Workspace */}
        <div className="space-y-4">
          <div className="flex items-center border-b border-border">
            {['Active Research', 'Saved Reports', 'Data Sources', 'Export'].map((tab, i) => (
              <button key={tab} className={`px-4 py-2 text-xs border-b-2 transition-colors ${i === 0 ? 'border-primary text-primary font-medium' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
                {tab}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-card border border-border rounded p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium text-sm">Dubai Luxury Market Analysis — Q4 2024</h4>
                  <div className="text-[10px] text-muted-foreground font-mono mt-1">Created: Dec 15, 2024 | Status: In Progress</div>
                </div>
              </div>
              <div className="h-1 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[65%]" />
              </div>
              <div className="flex gap-1.5">
                <span className="px-1.5 py-0.5 bg-secondary text-[10px] rounded-sm text-muted-foreground">Dubai</span>
                <span className="px-1.5 py-0.5 bg-secondary text-[10px] rounded-sm text-muted-foreground">Luxury</span>
                <span className="px-1.5 py-0.5 bg-secondary text-[10px] rounded-sm text-muted-foreground">Q4-2024</span>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2">"Analyzing RevPAR trends across 5-star properties in Dubai Marina and Downtown districts..."</p>
              <div className="flex items-center gap-2 pt-2">
                <button className="flex items-center gap-1.5 text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-sm hover:bg-primary/90">
                  <Play size={12} /> Open
                </button>
                <button className="flex items-center gap-1.5 text-xs border border-border px-3 py-1.5 rounded-sm hover:bg-secondary">
                  <Download size={12} /> Export PDF
                </button>
              </div>
            </div>

            <div className="bg-card border border-border rounded p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">NYC Competitive Set Analysis</h4>
                  <div className="text-[10px] text-muted-foreground font-mono mt-1">Created: Dec 10, 2024 | Status: Complete</div>
                </div>
              </div>
              <div className="h-1 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-green-500 w-[100%]" />
              </div>
              <div className="flex gap-1.5">
                <span className="px-1.5 py-0.5 bg-secondary text-[10px] rounded-sm text-muted-foreground">New York</span>
                <span className="px-1.5 py-0.5 bg-secondary text-[10px] rounded-sm text-muted-foreground">Competitive-Set</span>
              </div>
              <div className="flex items-center gap-2 pt-2 mt-auto">
                <button className="flex items-center gap-1.5 text-xs border border-border px-3 py-1.5 rounded-sm hover:bg-secondary">
                  <FolderOpen size={12} /> View Results
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
