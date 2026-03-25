import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import type { Recipe } from "@jvrecipes/validation";
import RecipeListRow from "./RecipeListRow";

type RecipeListProps = {
  recipes: Recipe[];
};

const RecipeList = ({ recipes }: RecipeListProps) => {
  return (
    <Card variant="retro" className="overflow-hidden">
      <div className="border-b-retro border-foreground bg-secondary grid grid-cols-[1fr_64px_64px_80px_160px] gap-0 px-5 py-2.5">
        {(["Recipe", "Prep", "Cook", "Total", ""] as const).map((h) => (
          <span
            key={h}
            className={cn(
              "text-muted-foreground text-2xs font-semibold uppercase tracking-kicker",
              h === "" && "text-right",
            )}
          >
            {h}
          </span>
        ))}
      </div>

      {recipes.map((recipe, index) => (
        <RecipeListRow
          key={recipe.id}
          recipe={recipe}
          last={index === recipes.length - 1}
        />
      ))}
    </Card>
  );
};

export default RecipeList;
