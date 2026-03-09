import { CollegeInfo } from "@/lib/colleges";
import { Building2, MapPin, Star, Target } from "lucide-react";
import { motion } from "framer-motion";

interface CollegeInfoCardProps {
  info: CollegeInfo;
}

export function CollegeInfoCard({ info }: CollegeInfoCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-4 rounded-xl border border-border bg-card p-4 shadow-sm"
    >
      <h2 className="text-base font-display font-semibold text-foreground flex items-center gap-2">
        🎓 {info.name}
      </h2>
      <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-primary" />
          Nagpur, Maharashtra
        </div>
        <div className="flex items-center gap-1.5">
          <Building2 className="h-3.5 w-3.5 text-primary" />
          {info.type}
        </div>
        <div className="flex items-center gap-1.5">
          <Star className="h-3.5 w-3.5 text-secondary" />
          {info.ranking}
        </div>
        <div className="flex items-center gap-1.5">
          <Target className="h-3.5 w-3.5 text-secondary" />
          {info.knownFor}
        </div>
      </div>
      {info.snippet && (
        <p className="mt-2 text-xs text-muted-foreground leading-relaxed line-clamp-2">
          {info.snippet}
        </p>
      )}
    </motion.div>
  );
}
