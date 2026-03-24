import { Recipe } from "@jvrecipes/validation";
import { Link } from "../ui/link";
import React, { useState } from "react";
import UserImage from "../shared/UserImage";
import { cn } from "@/lib/utils";

interface IngredientSectionProps {
  recipe: Recipe;
  servings: number;
  scale: number;
  setServings: React.Dispatch<React.SetStateAction<number>>;
}

const IngredientSection = ({
  servings,
  recipe,
  scale,
  setServings,
}: IngredientSectionProps) => {
  const [checkedIngredients, setCheckedIngredients] = useState<Set<string>>(
    new Set(),
  );
  const formatQuantity = (quantity: number, unit: string): string => {
    const scaled = quantity * scale;
    const rounded =
      scaled < 1
        ? Math.round(scaled * 100) / 100
        : scaled < 10
          ? Math.round(scaled * 10) / 10
          : Math.round(scaled);
    return `${rounded}${unit}`;
  };

  const toggleIngredient = (id: string) => {
    setCheckedIngredients((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };
  return (
    <div className="flex flex-col w-full h-full min-h-0">
      <div className="shrink-0 pb-5 mb-5 border-b-retro border-primary-foreground/30">
        <div className="flex flex-row justify-between">
          <Link
            to="/home"
            className="inline-flex items-center gap-1.5 text-2xs font-semibold tracking-kicker uppercase text-primary-foreground/80 hover:text-primary-foreground transition-colors mb-4 shadow-none"
          >
            ← Back
          </Link>

          <Link to="./edit" variant="retro" className="text-xs">
            Edit Recipe
          </Link>
        </div>

        <h1 className="font-display text-4xl leading-none tracking-display text-primary-foreground mb-3">
          {recipe.title}
        </h1>
        {recipe.description && (
          <p className="text-sm leading-relaxed text-primary-foreground/85 mb-4">
            {recipe.description}
          </p>
        )}
        <div className="flex items-center gap-2.5">
          <UserImage user={recipe.user} />
          <span className="text-sm font-semibold text-primary-foreground">
            {recipe.user.name}
          </span>
        </div>
      </div>

      {(recipe.prepMins || recipe.cookMins || recipe.servings) && (
        <div className="shrink-0 flex flex-wrap gap-2 pb-5 mb-5 border-b-retro border-primary-foreground/30">
          {recipe.prepMins && (
            <span className="text-2xs font-semibold tracking-meta uppercase rounded-full border-retro border-foreground bg-primary/70 text-primary-foreground px-3 py-1.5 shadow-retro-xs">
              Prep {recipe.prepMins}m
            </span>
          )}
          {recipe.cookMins && (
            <span className="text-2xs font-semibold tracking-meta uppercase rounded-full border-retro border-foreground bg-primary/70 text-primary-foreground px-3 py-1.5 shadow-retro-xs">
              Cook {recipe.cookMins}m
            </span>
          )}
          {recipe.servings && (
            <span className="text-2xs font-semibold tracking-meta uppercase rounded-full border-retro border-foreground bg-primary/70 text-primary-foreground px-3 py-1.5 shadow-retro-xs">
              Serves {recipe.servings}
            </span>
          )}
        </div>
      )}

      <div className="shrink-0">
        <p className="text-2xs font-semibold tracking-kicker uppercase text-primary-foreground/80 mb-3">
          Ingredients
        </p>
        <div className="flex items-center gap-2.5 mb-3 w-fit rounded-full border-retro border-foreground bg-primary/60 shadow-retro-sm pl-3 pr-1.5 py-1">
          <span className="text-xs font-semibold text-primary-foreground">
            Servings
          </span>
          <button
            type="button"
            onClick={() => setServings((s) => Math.max(1, s - 1))}
            className="w-7 h-7 rounded-full border-retro border-foreground bg-accent text-accent-foreground flex items-center justify-center text-base font-semibold shadow-retro-xs cursor-pointer hover:translate-x-nudge hover:translate-y-nudge hover:shadow-none transition-all leading-none"
          >
            −
          </button>
          <span className="text-sm font-bold text-primary-foreground min-w-4 text-center">
            {servings}
          </span>
          <button
            type="button"
            onClick={() => setServings((s) => Math.min(24, s + 1))}
            className="w-7 h-7 rounded-full border-retro border-foreground bg-accent text-accent-foreground flex items-center justify-center text-base font-semibold shadow-retro-xs cursor-pointer hover:translate-x-nudge hover:translate-y-nudge hover:shadow-none transition-all leading-none"
          >
            +
          </button>
        </div>
      </div>

      <div className="flex-1 max-h-52 min-h-0 overflow-y-auto -mx-2 px-2">
        <div className="flex flex-col gap-1">
          {recipe.ingredients?.map(({ id, ingredient, quantity, quantityUnit, notes }) => {
            const checked = checkedIngredients.has(id);
            return (
              <button
                key={id}
                type="button"
                onClick={() => toggleIngredient(id)}
                className={cn(
                  "flex items-start gap-3 w-full text-left px-3 py-2.5 rounded-poster border-2 border-transparent cursor-pointer transition-all",
                  checked
                    ? "opacity-40 line-through"
                    : "hover:bg-primary/40 hover:border-foreground/30",
                )}
              >
                <span className="text-xs font-bold text-accent min-w-14 text-right shrink-0 pt-px">
                  {formatQuantity(quantity, quantityUnit)}
                </span>
                <span className="text-sm text-primary-foreground">
                  {ingredient.name}
                  {notes && (
                    <span className="text-primary-foreground/75 italic font-normal">
                      {" "}
                      — {notes}
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default IngredientSection;
