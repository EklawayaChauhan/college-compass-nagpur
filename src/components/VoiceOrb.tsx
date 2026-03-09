import { Mic, Loader2, Volume2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface VoiceOrbProps {
  state: "listening" | "processing" | "speaking" | null;
  onClose: () => void;
}

export function VoiceOrb({ state, onClose }: VoiceOrbProps) {
  if (!state) return null;

  const config = {
    listening: {
      icon: <Mic className="h-8 w-8" />,
      label: "Listening...",
      color: "bg-primary",
      ringColor: "bg-primary/30",
    },
    processing: {
      icon: <Loader2 className="h-8 w-8 animate-spin" />,
      label: "Processing...",
      color: "bg-secondary",
      ringColor: "bg-secondary/30",
    },
    speaking: {
      icon: <Volume2 className="h-8 w-8" />,
      label: "Speaking...",
      color: "bg-primary",
      ringColor: "bg-primary/30",
    },
  }[state];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.5 }}
          onClick={(e) => e.stopPropagation()}
          className="flex flex-col items-center gap-4"
        >
          <div className="relative">
            {state === "listening" && (
              <>
                <div className={cn("absolute inset-0 rounded-full animate-pulse-ring", config.ringColor)} />
                <div className={cn("absolute -inset-4 rounded-full animate-pulse-ring", config.ringColor)} style={{ animationDelay: "0.5s" }} />
              </>
            )}
            <div className={cn("relative flex h-24 w-24 items-center justify-center rounded-full text-primary-foreground shadow-lg", config.color)}>
              {config.icon}
            </div>
          </div>
          {state === "speaking" && (
            <div className="flex items-end gap-1 h-8">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="w-1 rounded-full bg-primary animate-voice-bar"
                  style={{ animationDelay: `${i * 0.08}s`, height: "4px" }}
                />
              ))}
            </div>
          )}
          <p className="text-sm font-medium text-foreground">{config.label}</p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
