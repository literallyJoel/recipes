import { cn } from "@/lib/utils";
import { ViewMode } from "@/routes/recipes";
import React from "react";
import ListIcon from "../icons/ListIcon";
import GridIcon from "../icons/GridIcon";

interface ViewToggleProps {
  view: ViewMode;
  setView: React.Dispatch<React.SetStateAction<ViewMode>>;
}

const ViewToggle = ({ view, setView }: ViewToggleProps) => {
  return (
    <div className="relative flex rounded-full border-retro border-foreground bg-background shadow-retro-sm p-1">
      <div
        className={cn(
          "absolute top-1 bottom-1 w-[calc(50%-2px)] rounded-full bg-accent border-2 border-foreground transition-transform duration-200 ease-out",
          view === "list" ? "translate-x-0" : "translate-x-[calc(100%-3px)]",
        )}
      />
      <button
        type="button"
        onClick={() => setView("list")}
        aria-label="List view"
        className={cn(
          "relative z-10 px-3 py-1.5 rounded-full cursor-pointer transition-colors duration-200",
          view === "list"
            ? "text-accent-foreground"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        <ListIcon />
      </button>
      <button
        type="button"
        onClick={() => setView("grid")}
        aria-label="Grid view"
        className={cn(
          "relative z-10 px-3 py-1.5 rounded-full cursor-pointer transition-colors duration-200",
          view === "grid"
            ? "text-accent-foreground"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        <GridIcon />
      </button>
    </div>
  );
};

export default ViewToggle;
