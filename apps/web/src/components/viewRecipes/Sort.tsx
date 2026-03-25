import { SortKey } from "@/routes/recipes";
import React from "react";

interface SortProps {
  sort: SortKey;
  setSort: React.Dispatch<React.SetStateAction<SortKey>>;
}

const Sort = ({ sort, setSort }: SortProps) => {
  return (
    <div className="relative">
      <select
        value={sort}
        onChange={(e) => setSort(e.target.value as SortKey)}
        className="appearance-none pl-4 pr-8 py-2 rounded-full border-retro border-foreground bg-background text-xs font-semibold text-foreground shadow-retro-sm cursor-pointer outline-none"
      >
        <option value="newest">Newest</option>
        <option value="az">A – Z</option>
        <option value="quickest">Quickest</option>
      </select>
      <svg
        className="absolute right-3 top-1/2 -translate-y-1/2 size-2.5 text-muted-foreground pointer-events-none"
        viewBox="0 0 10 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M1 1l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
};

export default Sort;