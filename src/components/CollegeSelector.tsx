import { NAGPUR_COLLEGES } from "@/lib/colleges";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GraduationCap } from "lucide-react";

interface CollegeSelectorProps {
  selected: string | null;
  onSelect: (college: string) => void;
}

export function CollegeSelector({ selected, onSelect }: CollegeSelectorProps) {
  return (
    <div className="px-4 py-3">
      <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <GraduationCap className="h-3.5 w-3.5" />
        Select College
      </label>
      <Select value={selected ?? undefined} onValueChange={onSelect}>
        <SelectTrigger className="w-full bg-card border-border">
          <SelectValue placeholder="Choose a Nagpur college..." />
        </SelectTrigger>
        <SelectContent className="max-h-64">
          {NAGPUR_COLLEGES.map((c) => (
            <SelectItem key={c} value={c}>
              {c}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
