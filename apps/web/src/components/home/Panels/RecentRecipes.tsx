import RecipeCard from "@/components/recipes/RecipeCard";
import UserImage from "@/components/shared/UserImage";
import { Card } from "@/components/ui/card";
import { recentRecipesMock as recentRecipes } from "@/dev/dummy";
import { authClient } from "@/lib/auth-client";
import { Recipe } from "@jvrecipes/validation";

const RecentRecipes = () => {
  return (
    <div className="grid h-full w-full content-start gap-4 md:grid-cols-2 xl:grid-cols-3">
      {recentRecipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </div>
  );
};

export default RecentRecipes;
