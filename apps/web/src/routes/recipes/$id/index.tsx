import SplitView from "@/components/shared/SplitView";
import { Card } from "@/components/ui/card";
import { recipeWithIngredients } from "@/dev/dummy";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/recipes/$id/")({
  component: ViewRecipe,
});

function ViewRecipe() {
  return (
    <SplitView
      aside={
        <div className="flex flex-col gap-5 w-full">
          <span className="text-2xl font-display text-foreground">
            Ingredients
          </span>
          {recipeWithIngredients.ingredients.map((ingredient) => (
            <Card
              variant="retro"
              className="flex flex-col gap-2 w-full px-4 py-1"
            >
              <div> {ingredient.ingredient.name}</div>
              <div>
                {" "}
                {ingredient.quantity} {ingredient.quantityUnit}
              </div>
            </Card>
          ))}
        </div>
      }
      asideClassName="col-span-3"
      className="cols-span-9"
    ></SplitView>
  );
}
