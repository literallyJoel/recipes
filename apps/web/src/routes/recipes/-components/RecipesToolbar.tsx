import { cn } from "@/lib/utils";
import GridIcon from "@/components/icons/GridIcon";
import ListIcon from "@/components/icons/ListIcon";
import type { SortKey, TimeFilter, ViewMode } from "@/lib/recipes/util";

type RecipesToolbarProps = {
  query: string;
  onQueryChange: (value: string) => void;
  sort: SortKey;
  onSortChange: (value: SortKey) => void;
  timeFilter: TimeFilter;
  onTimeFilterChange: (value: TimeFilter) => void;
  view: ViewMode;
  onViewChange: (value: ViewMode) => void;
};

const RecipesToolbar = ({
  query,
  onQueryChange,
  sort,
  onSortChange,
  timeFilter,
  onTimeFilterChange,
  view,
  onViewChange,
}: RecipesToolbarProps) => {
  return (
    <div className="mb-6 flex flex-wrap items-center gap-3">
      <div className="relative min-w-48 flex-1">
        <svg
          className="text-muted-foreground pointer-events-none absolute top-1/2 left-3.5 size-3.5 -translate-y-1/2"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <circle cx="6.5" cy="6.5" r="4.5" />
          <path d="M10 10l3 3" strokeLinecap="round" />
        </svg>

        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search recipes..."
          className="border-retro border-foreground bg-background text-foreground placeholder:text-muted-foreground focus:shadow-retro-md w-full rounded-full py-2 pr-4 pl-9 text-sm shadow-retro-sm outline-none transition-all"
        />
      </div>

      <div className="relative">
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value as SortKey)}
          className="border-retro border-foreground bg-background text-foreground appearance-none rounded-full py-2 pr-8 pl-4 text-xs font-semibold shadow-retro-sm outline-none"
        >
          <option value="newest">Newest</option>
          <option value="az">A – Z</option>
          <option value="quickest">Quickest</option>
        </select>

        <svg
          className="text-muted-foreground pointer-events-none absolute top-1/2 right-3 size-2.5 -translate-y-1/2"
          viewBox="0 0 10 6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M1 1l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <button
        type="button"
        onClick={() => onTimeFilterChange(timeFilter === "30" ? null : "30")}
        className={cn(
          "border-retro border-foreground border-3 cursor-pointer rounded-full px-4 py-2 text-2xs font-semibold uppercase tracking-wider shadow-retro-sm transition-all",
          timeFilter === "30"
            ? "bg-primary text-primary-foreground"
            : "bg-card text-foreground hover:text-primary-foreground hover:bg-primary",
        )}
      >
        Under 30m
      </button>

      <button
        type="button"
        onClick={() => onTimeFilterChange(timeFilter === "60" ? null : "60")}
        className={cn(
          "border-retro border-foreground border-3 cursor-pointer rounded-full px-4 py-2 text-2xs font-semibold uppercase tracking-wider shadow-retro-sm transition-all",
          timeFilter === "60"
            ? "bg-primary text-primary-foreground"
            : "bg-card text-foreground hover:text-primary-foreground hover:bg-primary",
        )}
      >
        Under 60m
      </button>

      <div className="flex-1" />

      <div className="border-retro border-foreground bg-background relative flex rounded-full p-1 shadow-retro-sm">
        <div
          className={cn(
            "bg-accent border-foreground absolute top-1 bottom-1 w-[calc(50%-3px)] rounded-full border-2 transition-transform duration-200 ease-out",
            view === "list" ? "translate-x-0" : "translate-x-[calc(100%-2px)]",
          )}
        />

        <button
          type="button"
          onClick={() => onViewChange("list")}
          aria-label="List view"
          className={cn(
            "relative z-10 cursor-pointer rounded-full px-3 py-1.5 transition-colors duration-200",
            view === "list"
              ? "text-accent-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <ListIcon />
        </button>

        <button
          type="button"
          onClick={() => onViewChange("grid")}
          aria-label="Grid view"
          className={cn(
            "relative z-10 cursor-pointer rounded-full px-3 py-1.5 transition-colors duration-200",
            view === "grid"
              ? "text-accent-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <GridIcon />
        </button>
      </div>
    </div>
  );
};

export default RecipesToolbar;
