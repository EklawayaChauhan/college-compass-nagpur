import { Mic, SendHorizontal } from "lucide-react";
import { useRef, useState, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend: (text: string) => void;
  onMicClick: () => void;
  isListening: boolean;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({ onSend, onMicClick, isListening, disabled, placeholder }: ChatInputProps) {
  const [value, setValue] = useState("");
  const ref = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setValue("");
    if (ref.current) ref.current.style.height = "auto";
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = () => {
    if (ref.current) {
      ref.current.style.height = "auto";
      ref.current.style.height = Math.min(ref.current.scrollHeight, 120) + "px";
    }
  };

  return (
    <div className="border-t border-border bg-card/80 backdrop-blur-xl px-4 py-3">
      <div className="flex items-end gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMicClick}
          className={cn(
            "h-10 w-10 shrink-0 rounded-full transition-all",
            isListening && "bg-destructive text-destructive-foreground animate-pulse"
          )}
        >
          <Mic className="h-4 w-4" />
        </Button>
        <textarea
          ref={ref}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          placeholder={placeholder ?? "Ask about this college..."}
          disabled={disabled}
          rows={1}
          className="flex-1 resize-none rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <Button
          size="icon"
          onClick={handleSend}
          disabled={disabled || !value.trim()}
          className="h-10 w-10 shrink-0 rounded-full gradient-primary text-primary-foreground"
        >
          <SendHorizontal className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
