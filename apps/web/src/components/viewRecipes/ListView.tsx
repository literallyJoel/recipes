import { Recipe } from "@jvrecipes/validation";
import { Link } from "../ui/link";
import { cn } from "@/lib/utils";
import UserImage from "../shared/UserImage";
import { formatTime, totalMins } from "@/lib/recipes/util";
import { Card } from "../ui/card";

interface ListRowProps {
  last: boolean;
  recipe: Recipe;
}

const ListRow = ({ last, recipe }: ListRowProps) => {
  return (
    <Link
      // @ts-ignore route not yet implemented
      to={`/recipes/${recipe.id}`}
      className={cn(
        "grid grid-cols-[1fr_64px_64px_80px_160px] gap-0 px-5 py-3.5 items-center transition-colors hover:bg-secondary",
        !last && "border-b border-border",
      )}
    >
      <div className="min-w-0 flex flex-col gap-0.5">
        <span className="font-display text-base leading-tight tracking-display text-foreground truncate">
          {recipe.title}
        </span>
        {recipe.description && (
          <span className="text-xs text-muted-foreground truncate">
            {recipe.description}
          </span>
        )}
      </div>
      <span className="text-sm font-semibold text-foreground text-center tabular-nums">
        {recipe.prepMins ? formatTime(recipe.prepMins) : "—"}
      </span>
      <span className="text-sm font-semibold text-foreground text-center tabular-nums">
        {recipe.cookMins ? formatTime(recipe.cookMins) : "—"}
      </span>
      <span className="text-sm font-semibold text-foreground text-center tabular-nums">
        {totalMins(recipe) > 0 ? formatTime(totalMins(recipe)) : "—"}
      </span>
      <div className="flex items-center gap-2 justify-end min-w-0">
        <span className="text-xs font-semibold text-muted-foreground truncate">
          {recipe.user.name}
        </span>
        <UserImage user={recipe.user} />
      </div>
    </Link>
  );
};

interface ListViewProps {
  filteredRecipes: Recipe[];
}

const ListView = ({ filteredRecipes }: ListViewProps) => {
  return (
    <Card variant="retro" className="overflow-hidden">
      <div className="grid grid-cols-[1fr_64px_64px_80px_160px] gap-0 px-5 py-2.5 bg-secondary border-b-retro border-foreground">
        {(["Recipe", "Prep", "Cook", "Total", ""] as const).map((h) => (
          <span
            key={h}
            className={cn(
              "text-2xs font-semibold tracking-kicker uppercase text-muted-foreground",
              h === "" && "text-right",
            )}
          >
            {h}
          </span>
        ))}
      </div>

      {filteredRecipes.map((recipe, i) => (
        <ListRow
          key={recipe.id}
          recipe={recipe}
          last={i === filteredRecipes.length - 1}
        />
      ))}
    </Card>
  );
};

export default ListView;
