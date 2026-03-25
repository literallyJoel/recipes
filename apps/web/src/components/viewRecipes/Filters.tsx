import { cn } from "@/lib/utils";
import { TimeFilter } from "@/routes/recipes";
import React from "react";

interface FiltersProps {
  timeFilter: TimeFilter;
  setTimeFilter: React.Dispatch<React.SetStateAction<TimeFilter>>;
}

const Filters = ({ timeFilter, setTimeFilter }: FiltersProps) => {
  return (
    <>
      <button
        type="button"
        onClick={() => setTimeFilter(timeFilter === "30" ? null : "30")}
        className={cn(
          "px-4 py-2 rounded-full border-retro text-2xs font-semibold tracking-meta uppercase cursor-pointer transition-all shadow-retro-sm",
          timeFilter === "30"
            ? "bg-primary text-primary-foreground border-foreground"
            : "bg-background border-foreground text-muted-foreground hover:text-foreground hover:bg-secondary",
        )}
      >
        Under 30m
      </button>
      <button
        type="button"
        onClick={() => setTimeFilter(timeFilter === "60" ? null : "60")}
        className={cn(
          "px-4 py-2 rounded-full border-retro text-2xs font-semibold tracking-meta uppercase cursor-pointer transition-all shadow-retro-sm",
          timeFilter === "60"
            ? "bg-primary text-primary-foreground border-foreground"
            : "bg-background border-foreground text-muted-foreground hover:text-foreground hover:bg-secondary",
        )}
      >
        Under 60m
      </button>
    </>
  );
};

export default Filters;
