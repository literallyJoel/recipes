import { useMemo } from "react";
import type { Recipe } from "@jvrecipes/validation";
import { totalMins, type SortKey, type TimeFilter } from "@/lib/recipes/util";

type UseFilteredRecipesOptions = {
  recipes: Recipe[];
  query: string;
  sort: SortKey;
  timeFilter: TimeFilter;
};

const useFilteredRecipes = ({
  recipes,
  query,
  sort,
  timeFilter,
}: UseFilteredRecipesOptions) => {
  return useMemo(() => {
    const q = query.toLowerCase().trim();

    let result = recipes.filter((recipe) => {
      if (q && !recipe.title.toLowerCase().includes(q)) return false;

      if (timeFilter !== null && totalMins(recipe) > Number(timeFilter)) {
        return false;
      }

      return true;
    });

    if (sort === "az") {
      result = [...result].sort((a, b) => a.title.localeCompare(b.title));
    } else if (sort === "quickest") {
      result = [...result].sort((a, b) => totalMins(a) - totalMins(b));
    } else {
      result = [...result].sort(
        (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime(),
      );
    }

    return result;
  }, [recipes, query, sort, timeFilter]);
};

export default useFilteredRecipes;
