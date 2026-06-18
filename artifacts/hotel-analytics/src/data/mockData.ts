export const mockConversations = [
  { id: "1", title: "Marriott vs Hilton RevPAR", time: "10m ago", preview: "Comparing Q4 2024..." },
  { id: "2", title: "London Luxury Market", time: "2h ago", preview: "What is the ADR trend..." },
  { id: "3", title: "Singapore Occupancy", time: "Yesterday", preview: "Show me the top 5..." },
];

export const mockChatMessages = [
  { id: "1", role: "user", text: "How is Marriott performing vs Hilton in Dubai for Q4 2024?" },
  { id: "2", role: "assistant", text: "Based on the latest Q4 2024 data for the Dubai market:\n\n• **Marriott (Luxury Portfolio)**: RevPAR is tracking at **$412**, up **8.4%** YoY.\n• **Hilton (Luxury Portfolio)**: RevPAR is tracking at **$395**, up **6.2%** YoY.\n\nMarriott is currently leading in ADR growth, while Hilton has maintained higher occupancy." },
  { id: "3", role: "user", text: "What about their market share?" },
  { id: "4", role: "assistant", text: "Marriott holds a **14.2%** share of the luxury segment, slightly ahead of Hilton's **12.8%**. Would you like to generate a detailed comparison matrix?" },
];

export const mockKPIs = [
  { label: "RevPAR Index", value: "112.4", trend: "+3.2% vs LY", trendColor: "text-green-500", bars: [2, 4, 3, 5, 4, 6, 7] },
  { label: "ADR Average", value: "$287.50", trend: "+1.8% vs LY", trendColor: "text-green-500", bars: [4, 5, 4, 6, 5, 7, 6] },
  { label: "Occupancy Rate", value: "74.3%", trend: "-0.4% vs LY", trendColor: "text-red-500", bars: [7, 6, 7, 5, 6, 5, 4] },
  { label: "Market Score", value: "8.7/10", trend: "+0.3", trendColor: "text-green-500", bars: [5, 5, 6, 6, 7, 7, 8] },
];

export const mockHotels = [
  { id: "1", name: "Burj Al Arab", stars: 5, category: "Luxury Resort", adr: "$1,245", revpar: "$987", occ: "79%", market: "Dubai, UAE", segment: "Ultra-Luxury", status: "Monitored", statusColor: "bg-green-500/20 text-green-400", trend: "↑ +12%", trendColor: "text-green-500", bars: [2,3,5,4,6,5,8] },
  { id: "2", name: "The Ritz-Carlton", stars: 5, category: "City Luxury", adr: "$892", revpar: "$714", occ: "80%", market: "London, UK", segment: "Luxury", status: "Monitored", statusColor: "bg-green-500/20 text-green-400", trend: "↓ -2%", trendColor: "text-red-500", bars: [7,6,5,4,5,4,3] },
  { id: "3", name: "Four Seasons", stars: 5, category: "City Luxury", adr: "$1,050", revpar: "$840", occ: "80%", market: "New York, USA", segment: "Luxury", status: "In Analysis", statusColor: "bg-amber-500/20 text-amber-400", trend: "↑ +5%", trendColor: "text-green-500", bars: [3,4,4,5,5,6,7] },
  { id: "4", name: "Marina Bay Sands", stars: 5, category: "Resort/Casino", adr: "$678", revpar: "$542", occ: "80%", market: "Singapore", segment: "Luxury", status: "Monitored", statusColor: "bg-green-500/20 text-green-400", trend: "↑ +18%", trendColor: "text-green-500", bars: [1,2,4,5,7,6,8] },
  { id: "5", name: "Marriott Marquis", stars: 4, category: "Business", adr: "$389", revpar: "$295", occ: "76%", market: "New York, USA", segment: "Upscale", status: "Monitored", statusColor: "bg-green-500/20 text-green-400", trend: "→ +0.3%", trendColor: "text-muted-foreground", bars: [4,4,5,4,5,4,5] },
  { id: "6", name: "Atlantis The Palm", stars: 5, category: "Resort", adr: "$545", revpar: "$423", occ: "78%", market: "Dubai, UAE", segment: "Upper-Upscale", status: "In Analysis", statusColor: "bg-amber-500/20 text-amber-400", trend: "↑ +8%", trendColor: "text-green-500", bars: [3,4,3,5,6,5,7] },
];

export const mockLogs = [
  { time: "14:32:11", type: "DATA", color: "bg-blue-500/20 text-blue-400", text: "RevPAR data updated: Burj Al Arab (+12.4%)" },
  { time: "14:31:58", type: "ALERT", color: "bg-amber-500/20 text-amber-400", text: "Occupancy drop detected: Ritz-Carlton London (-3.2%)" },
  { time: "14:30:22", type: "REPORT", color: "bg-green-500/20 text-green-400", text: "Dubai Market Report generated successfully" },
  { time: "14:28:45", type: "DATA", color: "bg-blue-500/20 text-blue-400", text: "ADR benchmark updated for NYC market" },
  { time: "14:27:19", type: "SEARCH", color: "bg-purple-500/20 text-purple-400", text: "Web search: 'Dubai hotel market Q4 2024'" },
  { time: "14:25:33", type: "AI", color: "bg-teal-500/20 text-teal-400", text: "Analysis complete: Marriott vs Hilton comparison" },
  { time: "14:23:17", type: "DATA", color: "bg-blue-500/20 text-blue-400", text: "Rate data synced: Marina Bay Sands" },
  { time: "14:21:44", type: "ALERT", color: "bg-amber-500/20 text-amber-400", text: "New competitor identified: W Hotels Dubai" },
  { time: "14:19:28", type: "SEARCH", color: "bg-purple-500/20 text-purple-400", text: "Web search: 'Singapore luxury hotel RevPAR 2024'" },
  { time: "14:17:55", type: "AI", color: "bg-teal-500/20 text-teal-400", text: "Report generated: NYC Competitive Set" },
  { time: "14:15:33", type: "DATA", color: "bg-blue-500/20 text-blue-400", text: "STR data import: London market" },
  { time: "14:13:22", type: "REPORT", color: "bg-green-500/20 text-green-400", text: "Four Seasons NY analysis saved" },
];

export const mockSources = [
  { name: "STR Global", status: "Connected", statusColor: "text-green-400", detail: "Last sync: 2 min ago | Hotels: 847" },
  { name: "HotStats", status: "Connected", statusColor: "text-green-400", detail: "Last sync: 15 min ago | Hotels: 234" },
  { name: "OTA Insight", status: "Connected", statusColor: "text-green-400", detail: "Last sync: 5 min ago | Rate data" },
  { name: "Web Research", status: "Active", statusColor: "text-teal-400", detail: "3 searches today" },
  { name: "Manual Import", status: "Ready", statusColor: "text-muted-foreground", detail: "Upload CSV" },
];

export const mockMarketPulse = [
  { market: "Dubai", trend: "RevPAR +14.2% YoY", color: "text-green-500" },
  { market: "New York", trend: "RevPAR +3.1% YoY", color: "text-green-500" },
  { market: "London", trend: "RevPAR -1.8% YoY", color: "text-red-500" },
  { market: "Singapore", trend: "RevPAR +22.4% YoY", color: "text-green-500" },
];
