import { Send, Terminal } from "lucide-react";
import { mockConversations, mockChatMessages } from "../data/mockData";

export default function ChatPanel() {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Terminal size={16} className="text-muted-foreground" />
          <h2 className="text-xs font-semibold tracking-wider text-muted-foreground">RESEARCH ASSISTANT</h2>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] text-green-500/80 font-mono">DeepSeek Active</span>
        </div>
      </div>

      <div className="h-[35%] border-b border-border overflow-y-auto shrink-0 bg-background/50">
        <div className="p-2 space-y-1">
          {mockConversations.map((c, i) => (
            <button
              key={c.id}
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
        {mockChatMessages.map((m) => (
          <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] rounded p-3 text-sm leading-relaxed ${m.role === "user" ? "bg-accent text-accent-foreground ml-4" : "bg-secondary text-foreground mr-4"}`}
            >
              {m.text.split('\n').map((line, i) => (
                <div key={i} className={line.trim() === '' ? 'h-2' : ''}>
                  {line.includes('**') ? (
                    <span dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-primary">$1</strong>') }} />
                  ) : (
                    line
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-border shrink-0 bg-card">
        <div className="relative">
          <textarea
            placeholder="Ask about any hotel, market, or metric..."
            className="w-full bg-background border border-border rounded-sm py-2 px-3 text-sm focus:outline-none focus:border-primary resize-none min-h-[80px]"
          />
          <button className="absolute bottom-2 right-2 p-1.5 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors">
            <Send size={14} />
          </button>
          <div className="absolute top-2 right-2 text-[10px] text-muted-foreground font-mono">
            ⌘ ↵
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {["Compare Hotels", "Market Report", "Find Competitors", "Rate Analysis"].map((chip) => (
            <button key={chip} className="text-[10px] px-2 py-1 rounded bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors border border-border/50">
              {chip}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
