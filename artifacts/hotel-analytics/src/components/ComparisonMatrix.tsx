export default function ComparisonMatrix() {
  const data = [
    { metric: "ADR", h1: "$1,245", h2: "$892", h3: "$1,050", highlight: 1, lowlight: 2 },
    { metric: "RevPAR", h1: "$987", h2: "$714", h3: "$840", highlight: 1, lowlight: 2 },
    { metric: "Occupancy", h1: "79.0%", h2: "80.0%", h3: "80.0%", highlight: 2, lowlight: 1 },
    { metric: "TRevPAR", h1: "$1,540", h2: "$980", h3: "$1,120", highlight: 1, lowlight: 2 },
    { metric: "GOPPAR", h1: "$680", h2: "$410", h3: "$450", highlight: 1, lowlight: 2 },
    { metric: "Market Share", h1: "18.4%", h2: "12.1%", h3: "15.2%", highlight: 1, lowlight: 2 },
    { metric: "Review Score", h1: "9.6", h2: "9.2", h3: "9.4", highlight: 1, lowlight: 2 },
    { metric: "YoY Growth", h1: "+12.4%", h2: "-2.0%", h3: "+5.0%", highlight: 1, lowlight: 2 },
  ];

  return (
    <div className="border border-border rounded overflow-hidden bg-card text-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-border bg-secondary/50">
            <th className="p-3 font-medium text-muted-foreground uppercase text-xs w-[25%]">Metric</th>
            <th className="p-3 font-medium text-foreground">Burj Al Arab</th>
            <th className="p-3 font-medium text-foreground">Ritz-Carlton London</th>
            <th className="p-3 font-medium text-foreground">Four Seasons NY</th>
          </tr>
        </thead>
        <tbody className="font-mono text-xs">
          {data.map((row, i) => (
            <tr key={i} className="border-b border-border/50 hover:bg-secondary/20 transition-colors last:border-0">
              <td className="p-3 font-sans text-muted-foreground border-r border-border/50">{row.metric}</td>
              <td className={`p-3 ${row.highlight === 1 ? 'bg-green-500/10 text-green-400' : row.lowlight === 1 ? 'bg-red-500/10 text-red-400' : 'text-foreground'}`}>
                {row.h1}
              </td>
              <td className={`p-3 ${row.highlight === 2 ? 'bg-green-500/10 text-green-400' : row.lowlight === 2 ? 'bg-red-500/10 text-red-400' : 'text-foreground'}`}>
                {row.h2}
              </td>
              <td className={`p-3 ${row.highlight === 3 ? 'bg-green-500/10 text-green-400' : row.lowlight === 3 ? 'bg-red-500/10 text-red-400' : 'text-foreground'}`}>
                {row.h3}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
