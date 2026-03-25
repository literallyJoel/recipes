import UserImage from "@/components/shared/UserImage";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import type { Recipe } from "@jvrecipes/validation";
import { formatTime, totalMins } from "@/lib/recipes/util";
type RecipeListRowProps = {
  recipe: Recipe;
  last: boolean;
};

const RecipeListRow = ({ recipe, last }: RecipeListRowProps) => {
  return (
    <Link
      to={`/recipes/$id`}
      params={{ id: recipe.id }}
      className={cn(
        "grid grid-cols-[1fr_64px_64px_80px_160px] items-center gap-0 px-5 py-3.5 transition-colors hover:bg-secondary-foreground/10",
        !last && "border-border border-b",
      )}
    >
      <div className="min-w-0 flex flex-col gap-0.5">
        <span className="font-display text-foreground truncate text-base leading-tight tracking-display">
          {recipe.title}
        </span>

        {recipe.description && (
          <span className="text-muted-foreground truncate text-xs">
            {recipe.description}
          </span>
        )}
      </div>

      <span className="text-foreground text-center text-sm font-semibold tabular-nums">
        {recipe.prepMins ? formatTime(recipe.prepMins) : "—"}
      </span>

      <span className="text-foreground text-center text-sm font-semibold tabular-nums">
        {recipe.cookMins ? formatTime(recipe.cookMins) : "—"}
      </span>

      <span className="text-foreground text-center text-sm font-semibold tabular-nums">
        {totalMins(recipe) > 0 ? formatTime(totalMins(recipe)) : "—"}
      </span>

      <div className="min-w-0 flex items-center justify-end gap-2">
        <span className="text-muted-foreground truncate text-xs font-semibold">
          {recipe.user.name}
        </span>
        <UserImage user={recipe.user} />
      </div>
    </Link>
  );
};

export default RecipeListRow;
