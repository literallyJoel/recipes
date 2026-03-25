import type { Recipe } from "@jvrecipes/validation";

export type SortKey = "newest" | "az" | "quickest";
export type TimeFilter = "30" | "60" | null;
export type ViewMode = "grid" | "list";

export function formatTime(mins: number): string {
  if (!mins) return "—";

  if (mins >= 60) {
    return `${Math.floor(mins / 60)}h${mins % 60 ? ` ${mins % 60}m` : ""}`;
  }

  return `${mins}m`;
}

export function totalMins(recipe: Recipe): number {
  return (recipe.prepMins ?? 0) + (recipe.cookMins ?? 0);
}
