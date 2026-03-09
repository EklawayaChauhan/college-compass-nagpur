import { useState, useRef, useEffect, useCallback } from "react";
import { Header } from "@/components/Header";
import { ChatMessage, Message } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { VoiceOrb } from "@/components/VoiceOrb";
import { useSpeechRecognition, useTTS } from "@/hooks/use-speech";
import { streamChat } from "@/lib/chat-api";
import { toast } from "sonner";
import { GraduationCap } from "lucide-react";
import { motion } from "framer-motion";

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [voiceState, setVoiceState] = useState<"listening" | "processing" | "speaking" | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { isSpeaking, speak, stop: stopTTS } = useTTS();

  const handleVoiceResult = useCallback((text: string) => {
    setVoiceState("processing");
    handleSend(text);
  }, [messages]);

  const { isListening, toggle: toggleMic } = useSpeechRecognition(handleVoiceResult);

  useEffect(() => {
    if (isListening) setVoiceState("listening");
    else if (voiceState === "listening") setVoiceState(null);
  }, [isListening]);

  useEffect(() => {
    if (isSpeaking) setVoiceState("speaking");
    else if (voiceState === "speaking") setVoiceState(null);
  }, [isSpeaking]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const handleSend = async (input: string) => {
    const userMsg: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    let assistantSoFar = "";
    const upsertAssistant = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
        }
        return [...prev, { role: "assistant", content: assistantSoFar }];
      });
    };

    try {
      await streamChat({
        messages: [...messages, userMsg],
        onDelta: upsertAssistant,
        onDone: () => {
          setIsLoading(false);
          if (voiceState === "processing") {
            setTimeout(() => speak(assistantSoFar), 200);
          }
        },
      });
    } catch (e: any) {
      console.error(e);
      setIsLoading(false);
      toast.error(e.message || "Failed to get response");
    }
  };

  const handleMicClick = () => {
    if (!(window as any).SpeechRecognition && !(window as any).webkitSpeechRecognition) {
      toast.error("Speech recognition not supported in this browser");
      return;
    }
    toggleMic();
  };

  const handleSpeak = (text: string) => {
    if (isSpeaking) stopTTS();
    else speak(text);
  };

  const handleCloseOrb = () => {
    if (isListening) toggleMic();
    if (isSpeaking) stopTTS();
    setVoiceState(null);
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <Header />

      <div ref={scrollRef} className="flex-1 overflow-y-auto py-4 space-y-3">
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center h-full text-center px-6 gap-4"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-lg">
              <GraduationCap className="h-8 w-8 text-primary-foreground" />
            </div>
            <h2 className="text-xl font-display font-semibold text-foreground">
              Welcome to CollegeAI Nagpur
            </h2>
            <p className="text-sm text-muted-foreground max-w-sm">
              Ask me anything about Nagpur colleges — placements, fees, hostel, campus life, rankings and more!
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-2">
              {["VNIT placements?", "RCOEM fees?", "Best engineering college?", "GMC Nagpur hostel?"].map((q) => (
                <button
                  key={q}
                  onClick={() => handleSend(q)}
                  className="rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {messages.map((msg, i) => (
          <ChatMessage key={i} message={msg} onSpeak={msg.role === "assistant" ? handleSpeak : undefined} />
        ))}

        {isLoading && messages[messages.length - 1]?.role === "user" && (
          <div className="flex px-4">
            <div className="bg-chat-ai rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex gap-1">
                <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" />
                <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0.1s" }} />
                <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0.2s" }} />
              </div>
            </div>
          </div>
        )}
      </div>

      <ChatInput
        onSend={handleSend}
        onMicClick={handleMicClick}
        isListening={isListening}
        disabled={isLoading}
        placeholder="Ask about any Nagpur college..."
      />

      <VoiceOrb state={voiceState} onClose={handleCloseOrb} />
    </div>
  );
};

export default Index;
