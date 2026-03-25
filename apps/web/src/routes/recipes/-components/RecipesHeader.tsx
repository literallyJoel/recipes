import { Link } from "@/components/ui/link";

const RecipesHeader = () => {
  return (
    <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
      <div>
        <Link
          to="/home"
          variant="poster"
          className="mb-4"
        >
          ← Home
        </Link>

        <h1 className="font-display text-5xl leading-none tracking-display">
          Your Recipes
        </h1>
      </div>

      {/* @ts-ignore route not yet implemented */}
      <Link variant="poster" to="/recipes/create" size="lg">
        + New Recipe
      </Link>
    </div>
  );
};

export default RecipesHeader;
