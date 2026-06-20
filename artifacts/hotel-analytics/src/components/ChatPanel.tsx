import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Bookmark, Loader2, Send, Terminal } from "lucide-react";
import { mockConversations, mockChatMessages } from "../data/mockData";
import { useAppActivity } from "../context/AppActivityContext";
import { useSelectedHotel } from "../context/SelectedHotelContext";
import { useReports } from "../context/ReportsContext";
import {
  buildAssistantReply,
  quickPrompts,
} from "../lib/chatAssistant";
import { appQuarterShort } from "../lib/appDates";
import { ru } from "../i18n/ru";
import { DevBadge } from "./DevNotice";
type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

const QUICK_CHIPS: { label: string; prompt: string }[] = [
  { label: "Сравнить отели", prompt: quickPrompts.compare },
  { label: "Отчёт по рынку", prompt: quickPrompts.market },
  { label: ru.weatherMcp, prompt: quickPrompts.weather },
  { label: "Анализ тарифов", prompt: quickPrompts.tariffs },
];

function renderMessageLine(line: string) {
  if (line.includes("**")) {
    return (
      <span
        dangerouslySetInnerHTML={{
          __html: line.replace(
            /\*\*(.*?)\*\*/g,
            '<strong class="font-bold text-primary">$1</strong>',
          ),
        }}
      />
    );
  }
  return line;
}

export default function ChatPanel() {
  const { addLog } = useAppActivity();
  const { selectedHotel } = useSelectedHotel();
  const { saveAnalysisReport } = useReports();
  const [messages, setMessages] = useState<ChatMessage[]>(
    mockChatMessages as ChatMessage[],
  );
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [savedMessageIds, setSavedMessageIds] = useState<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSending, scrollToBottom]);

  const sendMessage = useCallback(
    async (rawText: string) => {
      const text = rawText.trim();
      if (!text || isSending) {
        return;
      }

      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        text,
      };

      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      setIsSending(true);

      addLog("AI", "bg-teal-500/20 text-teal-400", `Запрос: ${text}`);

      await new Promise((resolve) => setTimeout(resolve, 450));

      const { text: reply, action } = buildAssistantReply(text, selectedHotel);
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        text: reply,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsSending(false);

      addLog("AI", "bg-teal-500/20 text-teal-400", "Ответ сформирован");

      if (action === "scroll-weather") {
        document
          .getElementById("destination-weather")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    },
    [addLog, isSending, selectedHotel],
  );

  const handleSubmit = () => {
    void sendMessage(input);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      handleSubmit();
    }
  };

  const handleSaveReport = (assistantIndex: number) => {
    const assistantMessage = messages[assistantIndex];
    if (!assistantMessage || assistantMessage.role !== "assistant") {
      return;
    }

    const userMessage = [...messages.slice(0, assistantIndex)]
      .reverse()
      .find((message) => message.role === "user");

    const title = userMessage
      ? userMessage.text.slice(0, 72)
      : `Анализ · ${selectedHotel.name} · ${appQuarterShort}`;

    saveAnalysisReport({
      title,
      summaryMarkdown: assistantMessage.text,
      messages: [
        ...(userMessage
          ? [{ role: "user" as const, text: userMessage.text }]
          : []),
        { role: "assistant", text: assistantMessage.text },
      ],
      hotelIds: [selectedHotel.id],
      tags: [selectedHotel.market, selectedHotel.segment],
    });

    setSavedMessageIds((prev) => new Set(prev).add(assistantMessage.id));
    addLog("REPORT", "bg-amber-500/20 text-amber-400", ru.reportSaved);
  };

  return (    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Terminal size={16} className="text-muted-foreground" />
          <h2 className="text-xs font-semibold tracking-wider text-muted-foreground">
            {ru.researchAssistant}
          </h2>
        </div>
        <div className="flex items-center gap-1.5" title={ru.chatDeepSeekHint}>
          <DevBadge kind="wip" />
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] text-green-500/80 font-mono">
            {ru.deepSeekActive}
          </span>
        </div>
      </div>

      <div className="h-[35%] border-b border-border overflow-y-auto shrink-0 bg-background/50">
        <div className="px-3 pt-2 pb-1 flex items-center gap-1.5">
          <span className="text-[9px] text-muted-foreground uppercase tracking-wider">История</span>
          <DevBadge kind="demo" title={ru.chatHistoryDemoHint} />
        </div>
        <div className="p-2 space-y-1">
          {mockConversations.map((c, i) => (
            <button
              key={c.id}
              type="button"
              title={ru.chatHistoryDemoHint}
              className={`w-full text-left p-2 rounded-sm text-sm transition-colors ${i === 0 ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary/50"}`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium truncate">{c.title}</span>
                <span className="text-[10px] shrink-0">{c.time}</span>
              </div>
              <div className="text-xs opacity-70 truncate">{c.preview}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, index) => (
          <div
            key={m.id}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded p-3 text-sm leading-relaxed ${m.role === "user" ? "bg-accent text-accent-foreground ml-4" : "bg-secondary text-foreground mr-4"}`}
            >
              {m.text.split("\n").map((line, i) => (
                <div key={i} className={line.trim() === "" ? "h-2" : ""}>
                  {renderMessageLine(line)}
                </div>
              ))}
              {m.role === "assistant" ? (
                <button
                  type="button"
                  onClick={() => handleSaveReport(index)}
                  disabled={savedMessageIds.has(m.id)}
                  className="mt-2 flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground disabled:opacity-50"
                >
                  <Bookmark size={10} />
                  {savedMessageIds.has(m.id) ? ru.reportSaved : ru.saveReport}
                </button>
              ) : null}
            </div>
          </div>
        ))}
        {isSending ? (
          <div className="flex justify-start">
            <div className="bg-secondary text-muted-foreground rounded p-3 text-sm mr-4 flex items-center gap-2">
              <Loader2 size={14} className="animate-spin" />
              Формирую ответ…
            </div>
          </div>
        ) : null}

        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-border shrink-0 bg-card">
        <div className="relative">
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={ru.chatPlaceholder}
            disabled={isSending}
            className="w-full bg-background border border-border rounded-sm py-2 px-3 pr-10 text-sm focus:outline-none focus:border-primary resize-none min-h-[80px] disabled:opacity-60"
          />
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!input.trim() || isSending}
            className="absolute bottom-2 right-2 p-1.5 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:pointer-events-none"
            aria-label="Отправить"
          >
            {isSending ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Send size={14} />
            )}
          </button>
          <div className="absolute top-2 right-2 text-[10px] text-muted-foreground font-mono pointer-events-none">
            ⌘ ↵
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {QUICK_CHIPS.map((chip) => (
            <button
              key={chip.label}
              type="button"
              disabled={isSending}
              onClick={() => void sendMessage(chip.prompt)}
              className="text-[10px] px-2 py-1 rounded bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors border border-border/50 disabled:opacity-40"
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
