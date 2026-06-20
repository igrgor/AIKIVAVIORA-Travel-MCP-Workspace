import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { mockLogs } from "../data/mockData";

export type ActivityLog = {
  time: string;
  type: string;
  color: string;
  text: string;
};

type AppActivityContextValue = {
  logs: ActivityLog[];
  addLog: (type: string, color: string, text: string) => void;
};

const AppActivityContext = createContext<AppActivityContextValue | null>(null);

function formatLogTime(date = new Date()): string {
  return date.toLocaleTimeString("ru-RU", { hour12: false });
}

export function AppActivityProvider({ children }: { children: ReactNode }) {
  const [logs, setLogs] = useState<ActivityLog[]>(mockLogs);

  const addLog = useCallback((type: string, color: string, text: string) => {
    setLogs((prev) => [
      {
        time: formatLogTime(),
        type,
        color,
        text,
      },
      ...prev,
    ]);
  }, []);

  const value = useMemo(() => ({ logs, addLog }), [logs, addLog]);

  return (
    <AppActivityContext.Provider value={value}>
      {children}
    </AppActivityContext.Provider>
  );
}

export function useAppActivity() {
  const context = useContext(AppActivityContext);
  if (!context) {
    throw new Error("useAppActivity must be used within AppActivityProvider");
  }
  return context;
}
