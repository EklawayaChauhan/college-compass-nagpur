import { Volume2 } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

export interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatMessageProps {
  message: Message;
  onSpeak?: (text: string) => void;
}

function detectLang(text: string): string {
  return /[\u0900-\u097F]/.test(text) ? "hi-IN" : "en-IN";
}

export function ChatMessage({ message, onSpeak }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("flex gap-2 px-4", isUser ? "justify-end" : "justify-start")}
    >
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
          isUser
            ? "bg-chat-user text-chat-user-foreground rounded-br-md"
            : "bg-chat-ai text-chat-ai-foreground rounded-bl-md"
        )}
      >
        {isUser ? (
          <p>{message.content}</p>
        ) : (
          <div className="prose prose-sm dark:prose-invert max-w-none [&>p]:m-0 [&>ul]:my-1 [&>ul]:pl-4">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        )}
        {!isUser && onSpeak && message.content && (
          <button
            onClick={() => onSpeak(message.content)}
            className="mt-1.5 flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            <Volume2 className="h-3 w-3" />
            Listen
          </button>
        )}
      </div>
    </motion.div>
  );
}
