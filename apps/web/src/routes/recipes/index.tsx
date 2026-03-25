import { recipesMock } from "@/dev/dummy";
import { useRequireAuth } from "@/lib/auth-guards";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import Toolbar from "@/components/viewRecipes/Toolbar";
import ListView from "@/components/viewRecipes/ListView";
import GridView from "@/components/viewRecipes/GridView";
import useRecipeSearch from "@/hooks/useRecipeSearch";

export const Route = createFileRoute("/recipes/")({
  component: RecipesPage,
});

export type SortKey = "newest" | "az" | "quickest";
export type TimeFilter = "30" | "60" | null;
export type ViewMode = "grid" | "list";

function RecipesPage() {
  const { redirect } = useRequireAuth("/login");

  const [sort, setSort] = useState<SortKey>("newest");
  const [timeFilter, setTimeFilter] = useState<TimeFilter>(null);
  const [view, setView] = useState<ViewMode>("list");

  const recipes = recipesMock;

  const { filtered, RecipeSearch } = useRecipeSearch({
    recipes,
    timeFilter,
    sort,
  });

  if (redirect) return redirect;

  const RecipeView = () => {
    if (filtered.length === 0) return null;

    return view === "grid" ? (
      <GridView filteredRecipes={filtered} />
    ) : (
      <ListView filteredRecipes={filtered} />
    );
  };
  return (
    <main className="bg-background text-foreground min-h-screen">
      <div className="mx-auto max-w-7xl px-5 pt-28 pb-10 sm:px-8 lg:px-10">
        <Toolbar
          sort={sort}
          setSort={setSort}
          timeFilter={timeFilter}
          setTimeFilter={setTimeFilter}
          view={view}
          setView={setView}
          RecipeSearch={RecipeSearch}
        />

        <p className="text-2xs font-semibold tracking-kicker uppercase text-muted-foreground mb-4">
          {filtered.length} recipe{filtered.length !== 1 ? "s" : ""}
        </p>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="font-display text-3xl tracking-display text-foreground mb-2">
              No recipes found
            </p>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search or filters.
            </p>
          </div>
        )}

        <RecipeView />
      </div>
    </main>
  );
}
