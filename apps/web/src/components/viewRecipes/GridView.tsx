import { Recipe } from "@jvrecipes/validation";
import UserImage from "../shared/UserImage";
import { Card } from "../ui/card";
import { Link } from "../ui/link";
import { totalMins } from "@/lib/recipes/util";

interface GridCardProps {
  recipe: Recipe;
}

const GridCard = ({ recipe }: GridCardProps) => {
  const total = totalMins(recipe);
  return (
    // @ts-ignore route not yet implemented
    <Link to={`/recipes/${recipe.id}`}>
      <Card
        variant="retro"
        className="flex flex-col gap-3 p-5 h-full cursor-pointer transition-transform duration-150 hover:-translate-y-1"
      >
        <h2 className="font-display text-xl leading-tight tracking-display text-card-foreground line-clamp-2">
          {recipe.title}
        </h2>
        {recipe.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed font-sans">
            {recipe.description}
          </p>
        )}
        <div className="h-divider w-full bg-border" />
        <div className="flex flex-wrap gap-2">
          {recipe.prepMins ? (
            <span className="text-2xs font-semibold tracking-meta uppercase rounded-full border-2 border-border bg-secondary text-secondary-foreground px-3 py-1">
              Prep {recipe.prepMins}m
            </span>
          ) : null}
          {recipe.cookMins ? (
            <span className="text-2xs font-semibold tracking-meta uppercase rounded-full border-2 border-border bg-secondary text-secondary-foreground px-3 py-1">
              Cook {recipe.cookMins}m
            </span>
          ) : null}
          {total > 0 && (
            <span className="text-2xs font-semibold tracking-meta uppercase rounded-full border-2 border-border bg-muted text-muted-foreground px-3 py-1">
              {total}m total
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-auto pt-1">
          <UserImage user={recipe.user} />
          <span className="text-sm font-semibold text-muted-foreground">
            {recipe.user.name}
          </span>
        </div>
      </Card>
    </Link>
  );
};

interface GridViewProps {
  filteredRecipes: Recipe[];
}

const GridView = ({ filteredRecipes }: GridViewProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {filteredRecipes.map((recipe) => (
        <GridCard key={recipe.id} recipe={recipe} />
      ))}
    </div>
  );
};

export default GridView;
