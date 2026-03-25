import RecipeSearch from "@/components/viewRecipes/RecipeSearch";
import { totalMins } from "@/lib/recipes/util";
import { SortKey, TimeFilter } from "@/routes/recipes";
import { Recipe } from "@jvrecipes/validation";
import { useMemo, useState } from "react";

interface useRecipeSearchProps {
  recipes: Recipe[];
  timeFilter: TimeFilter;
  sort: SortKey;
}

function useRecipeSearch({ recipes, timeFilter, sort }: useRecipeSearchProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const _query = query.toLowerCase().trim();

    let filtered = recipes.filter((recipe) => {
      if (_query && !recipe.title.toLowerCase().includes(_query)) return false;
      if (timeFilter !== null && totalMins(recipe) > Number(timeFilter)) {
        return false;
      }

      return true;
    });

    if (sort === "az") {
      filtered = [...filtered].sort((a, b) => a.title.localeCompare(b.title));
    } else if (sort == "quickest") {
      filtered = [...filtered].sort((a, b) => totalMins(a) - totalMins(b));
    } else {
      filtered = [...filtered].sort(
        (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime(),
      );
    }

    return filtered;
  }, [recipes, query, sort, timeFilter]);

  return {
    filtered,
    RecipeSearch: <RecipeSearch query={query} setQuery={setQuery} />,
  };
}

export default useRecipeSearch;
