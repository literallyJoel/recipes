import { Link } from "@tanstack/react-router";
import { Recipe } from "@jvrecipes/validation";

import UserImage from "../shared/UserImage";
import { Card } from "../ui/card";

interface RecipeCardProps {
  recipe: Recipe;
}

const RecipeCard = ({ recipe }: RecipeCardProps) => {
  const getTotalTime = (recipe: Recipe) => {
    const prep = recipe.prepMins ?? 0;
    const cook = recipe.cookMins ?? 0;
    const total = prep + cook;

    return total > 0 ? total : null;
  };

  const RecipeMeta = ({ recipe }: { recipe: Recipe }) => {
    const totalTime = getTotalTime(recipe);

    if (
      !recipe.prepMins &&
      !recipe.cookMins &&
      !recipe.servings &&
      !recipe.updatedAt &&
      totalTime === null
    ) {
      return null;
    }

    return (
      <div className="flex flex-wrap gap-2 text-2xs uppercase tracking-meta text-secondary-foreground">
        {recipe.prepMins ? (
          <div className="rounded-full border-2 border-border bg-secondary px-3 py-1">
            Prep {recipe.prepMins}m
          </div>
        ) : null}

        {recipe.cookMins ? (
          <div className="rounded-full border-2 border-border bg-secondary px-3 py-1">
            Cook {recipe.cookMins}m
          </div>
        ) : null}

        {recipe.servings ? (
          <div className="rounded-full border-2 border-border bg-muted px-3 py-1">
            Serves {recipe.servings}
          </div>
        ) : null}
      </div>
    );
  };

  return (
    <Link
      to={`/recipes/$id`}
      params={{ id: recipe.id }}
      className="block h-full"
    >
      <Card
        key={recipe.id}
        variant="retro"
        className="group flex h-full flex-col justify-between rounded-retro border-retro bg-card p-5 font-display shadow-retro-sm transition-transform duration-150 hover:-translate-y-1"
      >
        <div className="space-y-2">
          <div className="h-10">
            <h3 className="line-clamp-2 text-xl leading-tight tracking-display text-card-foreground">
              {recipe.title}
            </h3>
          </div>

          <div className="h-10">
            {recipe.description ? (
              <p className="line-clamp-3 font-sans text-sm leading-relaxed text-muted-foreground not-italic">
                {recipe.description}
              </p>
            ) : null}
          </div>

          <div className="h-divider w-full bg-border" />

          <RecipeMeta recipe={recipe} />
        </div>

        <div className="mt-4 flex items-center justify-between gap-4 pt-3 text-xs text-secondary-foreground">
          <div className="min-w-0 flex flex-row items-center justify-center gap-2 font-sans text-sm">
            <UserImage user={recipe.user} />
            {recipe.user.name}
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default RecipeCard;
