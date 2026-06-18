import { useEffect } from "react";
import ChatPanel from "./components/ChatPanel";
import AnalyticsHub from "./components/AnalyticsHub";
import ActivityPanel from "./components/ActivityPanel";

function App() {
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground font-sans">
      <div className="w-[280px] shrink-0 border-r border-border h-full flex flex-col overflow-hidden bg-card">
        <ChatPanel />
      </div>
      <div className="flex-1 h-full flex flex-col overflow-hidden">
        <AnalyticsHub />
      </div>
      <div className="w-[320px] shrink-0 border-l border-border h-full flex flex-col overflow-hidden bg-card">
        <ActivityPanel />
      </div>
    </div>
  );
}

export default App;
