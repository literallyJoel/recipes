import { Recipe } from "@jvrecipes/validation";
import { Card } from "../ui/card";
import { cn } from "@/lib/utils";

interface NutritionSectionProps {
  baseServings: number;
  ingredients: Recipe["ingredients"];
}

const NutritionSection = ({
  baseServings,
  ingredients,
}: NutritionSectionProps) => {
  const safeBaseServings = baseServings > 0 ? baseServings : 1;

  const totalNutrition = ingredients?.reduce(
    (acc, { ingredient, quantity, quantityUnit }) => {
      const n = ingredient.nutrition;
      if (!n) return acc;

      const normalizedUnit = quantityUnit.trim().toLowerCase();
      const quantityInGrams =
        normalizedUnit === "g" ||
        normalizedUnit === "gram" ||
        normalizedUnit === "grams"
          ? quantity
          : 0;

      const factor = quantityInGrams / 100;

      return {
        energy: acc.energy + (n.energy ?? 0) * factor,
        protein: acc.protein + (n.protein ?? 0) * factor,
        carbohydrates: acc.carbohydrates + (n.carbohydrates ?? 0) * factor,
        fat: acc.fat + (n.fat ?? 0) * factor,
        saturates: acc.saturates + (n.saturates ?? 0) * factor,
        sugars: acc.sugars + (n.sugars ?? 0) * factor,
        fibre: acc.fibre + (n.fibre ?? 0) * factor,
        salt: acc.salt + (n.salt ?? 0) * factor,
      };
    },
    {
      energy: 0,
      protein: 0,
      carbohydrates: 0,
      fat: 0,
      saturates: 0,
      sugars: 0,
      fibre: 0,
      salt: 0,
    },
  ) ?? {
    energy: 0,
    protein: 0,
    carbohydrates: 0,
    fat: 0,
    saturates: 0,
    sugars: 0,
    fibre: 0,
    salt: 0,
  };

  const nutrition = {
    energy: totalNutrition.energy / safeBaseServings,
    protein: totalNutrition.protein / safeBaseServings,
    carbohydrates: totalNutrition.carbohydrates / safeBaseServings,
    fat: totalNutrition.fat / safeBaseServings,
    saturates: totalNutrition.saturates / safeBaseServings,
    sugars: totalNutrition.sugars / safeBaseServings,
    fibre: totalNutrition.fibre / safeBaseServings,
    salt: totalNutrition.salt / safeBaseServings,
  };

  return (
    <div className="flex-1 overflow-y-auto -mx-3 px-3">
      <p className="mb-4 text-2xs font-semibold uppercase tracking-kicker text-muted-foreground">
        Per serving
      </p>

      <div className="mb-6 grid grid-cols-4 gap-2.5 pb-1">
        {(
          [
            ["kcal", Math.round(nutrition.energy)],
            ["protein", `${Math.round(nutrition.protein)}g`],
            ["carbs", `${Math.round(nutrition.carbohydrates)}g`],
            ["fat", `${Math.round(nutrition.fat)}g`],
          ] as const
        ).map(([label, value]) => (
          <Card
            key={label}
            variant="retro"
            className="flex flex-col items-center justify-center px-2 py-3 text-center"
          >
            <span className="font-display text-2xl leading-none tracking-display text-foreground">
              {value}
            </span>
            <span className="mt-1 text-2xs font-semibold uppercase tracking-meta text-muted-foreground">
              {label}
            </span>
          </Card>
        ))}
      </div>

      <div className="flex flex-col">
        {(
          [
            ["Saturates", nutrition.saturates],
            ["Sugars", nutrition.sugars],
            ["Fibre", nutrition.fibre],
            ["Salt", nutrition.salt],
          ] as const
        ).map(([label, value], i, arr) => (
          <div
            key={label}
            className={cn(
              "flex items-center justify-between py-2.5 text-sm",
              i < arr.length - 1 && "border-b border-border",
            )}
          >
            <span className="text-foreground">{label}</span>
            <span className="font-medium text-muted-foreground">
              {Math.round(value * 10) / 10}g
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NutritionSection;
