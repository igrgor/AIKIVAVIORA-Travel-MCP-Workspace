import { MapPin, Star } from "lucide-react";

export default function HotelCard({ hotel }: { hotel: any }) {
  return (
    <div className="bg-card border border-border rounded overflow-hidden flex flex-col">
      <div className="p-4 border-b border-border bg-secondary/20">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h4 className="font-bold text-sm text-foreground">{hotel.name}</h4>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center text-amber-500">
                {Array.from({ length: hotel.stars }).map((_, i) => (
                  <Star key={i} size={10} fill="currentColor" />
                ))}
              </div>
              <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                <MapPin size={10} />
                {hotel.market}
              </span>
            </div>
          </div>
          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wider ${hotel.statusColor}`}>
            {hotel.status}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] px-1.5 py-0.5 border border-border rounded text-muted-foreground">{hotel.category}</span>
          <span className="text-[10px] px-1.5 py-0.5 border border-border rounded text-muted-foreground">{hotel.segment}</span>
        </div>
      </div>
      
      <div className="p-4 flex-1">
        <div className="grid grid-cols-3 gap-2 text-center mb-4">
          <div className="bg-secondary/30 rounded py-2">
            <div className="text-[10px] text-muted-foreground uppercase mb-0.5">ADR</div>
            <div className="font-mono text-xs font-bold">{hotel.adr}</div>
          </div>
          <div className="bg-secondary/30 rounded py-2 border border-primary/20">
            <div className="text-[10px] text-primary uppercase mb-0.5">RevPAR</div>
            <div className="font-mono text-xs font-bold text-primary">{hotel.revpar}</div>
          </div>
          <div className="bg-secondary/30 rounded py-2">
            <div className="text-[10px] text-muted-foreground uppercase mb-0.5">Occ%</div>
            <div className="font-mono text-xs font-bold">{hotel.occ}</div>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className={`text-xs font-mono font-bold ${hotel.trendColor}`}>
            {hotel.trend} <span className="text-[10px] text-muted-foreground font-sans font-normal ml-1">YoY RevPAR</span>
          </div>
          <div className="flex items-end gap-0.5">
            {hotel.bars.map((h: number, i: number) => (
              <div 
                key={i} 
                className={`w-1 rounded-t-sm ${hotel.trendColor.includes('red') ? 'bg-red-500' : 'bg-primary'}`}
                style={{ height: `${h * 3}px`, opacity: 0.4 + (i * 0.1) }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex border-t border-border grid-cols-2">
        <button className="flex-1 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors border-r border-border">
          Compare
        </button>
        <button className="flex-1 py-2 text-xs font-medium text-primary hover:bg-primary/10 transition-colors">
          Analyze
        </button>
      </div>
    </div>
  );
}
