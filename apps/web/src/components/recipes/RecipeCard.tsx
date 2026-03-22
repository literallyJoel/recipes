import { Recipe } from "@jvrecipes/validation";
import { Card } from "../ui/card";
import UserImage from "../shared/UserImage";
import { Link } from "@tanstack/react-router";

interface RecipeCard {
  recipe: Recipe;
}

const RecipeCard = ({ recipe }: RecipeCard) => {
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
    //@ts-ignore I haven't done this page yet
    <Link to={`/recipes/${recipe.id}`}>
      <Card
        key={recipe.id}
        variant="retro"
        className="group flex min-h-56 flex-col justify-between rounded-retro border-retro bg-card p-5 font-display shadow-retro-sm transition-transform duration-150 hover:-translate-y-1"
      >
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-2">
              <h3 className="line-clamp-2 text-xl leading-tight tracking-display text-card-foreground">
                {recipe.title}
              </h3>
            </div>
          </div>

          {recipe.description ? (
            <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground not-italic font-sans">
              {recipe.description}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground font-sans italic"></p>
          )}

          <div className="h-divider w-full bg-border" />

          <RecipeMeta recipe={recipe} />
        </div>

        <div className="mt-5 flex items-center justify-between gap-4 pt-4 text-xs text-secondary-foreground">
          <div className="min-w-0 font-sans flex flex-row items-center justify-center gap-2 text-sm">
            <UserImage user={recipe.user} />
            {recipe.user.name}
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default RecipeCard;
