import IngredientSection from "@/components/recipe/IngredientsSection";
import InstructionSection from "@/components/recipe/InstructionSection";
import NutritionSection from "@/components/recipe/NutritionSection";
import TabBar from "@/components/recipe/TabBar";
import SplitView from "@/components/shared/SplitView";
import { recipeWithIngredients } from "@/dev/dummy";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/recipes/$id/")({
  component: ViewRecipe,
});

export type Tab = "instructions" | "nutrition";

function ViewRecipe() {
  const recipe = recipeWithIngredients;
  const [servings, setServings] = useState(recipe.servings ?? 1);
  const [activeTab, setActiveTab] = useState<Tab>("instructions");

  const baseServings = recipe.servings ?? 1;
  const scale = servings / baseServings;

  const hasNutrition = recipe.ingredients.some((i) => i.ingredient.nutrition);

  const Viewport = () => {
    switch (activeTab) {
      case "instructions":
        return <InstructionSection instructions={recipe.instructions} />;
      case "nutrition":
        return (
          <NutritionSection
            baseServings={baseServings}
            ingredients={recipe.ingredients}
          />
        );
    }
  };

  return (
    <SplitView
      asideClassName="col-span-4"
      className="col-span-8"
      aside={
        <IngredientSection
          recipe={recipeWithIngredients}
          servings={servings}
          scale={scale}
          setServings={setServings}
        />
      }
    >
      <div className="flex h-full min-h-0 flex-col">
        <TabBar
          hasNutrition={hasNutrition}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <Viewport />
      </div>
    </SplitView>
  );
}
