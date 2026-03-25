import { recipesMock } from "@/dev/dummy";
import { useRequireAuth } from "@/lib/auth-guards";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import RecipeGridCard from "./-components/RecipeGridCard";
import RecipeList from "./-components/RecipeList";
import RecipesEmptyState from "./-components/RecipesEmptyState";
import RecipesHeader from "./-components/RecipesHeader";
import RecipesResultsCount from "./-components/RecipesResultsCount";
import RecipesToolbar from "./-components/RecipesToolbar";
import useFilteredRecipes from "./-hooks/useFilteredRecipes";
import type { SortKey, TimeFilter, ViewMode } from "@/lib/recipes/util";
import RecipeCard from "@/components/recipes/RecipeCard";

export const Route = createFileRoute("/recipes/")({
  component: RecipesPage,
});

function RecipesPage() {
  const { redirect } = useRequireAuth("/login");

  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("newest");
  const [timeFilter, setTimeFilter] = useState<TimeFilter>(null);
  const [view, setView] = useState<ViewMode>("list");

  const recipes = recipesMock;

  const filtered = useFilteredRecipes({
    recipes,
    query,
    sort,
    timeFilter,
  });

  if (redirect) return redirect;

  return (
    <main className="bg-background text-foreground min-h-screen">
      <div className="mx-auto max-w-7xl px-5 pt-28 pb-10 sm:px-8 lg:px-10">
        <RecipesHeader />

        <RecipesToolbar
          query={query}
          onQueryChange={setQuery}
          sort={sort}
          onSortChange={setSort}
          timeFilter={timeFilter}
          onTimeFilterChange={setTimeFilter}
          view={view}
          onViewChange={setView}
        />

        <RecipesResultsCount count={filtered.length} />

        {filtered.length === 0 && <RecipesEmptyState />}

        {view === "grid" && filtered.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        )}

        {view === "list" && filtered.length > 0 && (
          <RecipeList recipes={filtered} />
        )}
      </div>
    </main>
  );
}
