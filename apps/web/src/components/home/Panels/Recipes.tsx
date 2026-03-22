import RecipeCard from "@/components/recipes/RecipeCard";
import { Link } from "@/components/ui/link";
import { Recipe } from "@jvrecipes/validation";

interface RecipesProps {
  recipes: Recipe[];
  allLink: string;
  showCreate?: boolean;
}

const Recipes = ({ recipes, allLink, showCreate }: RecipesProps) => {
  return (
    <div className="flex flex-col gap-1">
      <div className="w-full flex flex-row items-end justify-end pb-4 gap-2">
        {showCreate && (
          //@ts-ignore I haven't implemented this page yet
          <Link variant="posterSecondary" to={"/recipes/create"}>
            New Recipe
          </Link>
        )}
        <Link
          variant="poster"
          /*@ts-ignore I haven't implemented this page yet*/
          to={allLink}
        >
          View All
        </Link>
      </div>
      <div className="grid h-full w-full content-start gap-4 md:grid-cols-2 xl:grid-cols-3">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
};

export default Recipes;
