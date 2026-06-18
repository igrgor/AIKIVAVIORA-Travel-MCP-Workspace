export default function MetricCard({ kpi }: { kpi: any }) {
  return (
    <div className="bg-card border border-border rounded p-4 relative overflow-hidden group hover:border-border/80 transition-colors">
      <div className="text-xs font-medium text-muted-foreground mb-1">{kpi.label}</div>
      <div className="text-2xl font-mono text-foreground font-bold tracking-tight">{kpi.value}</div>
      <div className={`text-xs font-mono mt-1 ${kpi.trendColor}`}>
        {kpi.trend}
      </div>
      
      <div className="absolute right-4 bottom-4 flex items-end gap-0.5 opacity-50 group-hover:opacity-100 transition-opacity">
        {kpi.bars.map((h: number, i: number) => (
          <div 
            key={i} 
            className="w-1 bg-primary rounded-t-sm"
            style={{ height: `${h * 4}px`, opacity: 0.5 + (i * 0.08) }}
          />
        ))}
      </div>
    </div>
  );
}
