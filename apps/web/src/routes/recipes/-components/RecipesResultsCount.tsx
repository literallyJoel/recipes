type RecipesResultsCountProps = {
  count: number;
};

const RecipesResultsCount = ({ count }: RecipesResultsCountProps) => {
  return (
    <p className="text-muted-foreground mb-4 text-2xs font-semibold uppercase tracking-kicker">
      {count} recipe{count !== 1 ? "s" : ""}
    </p>
  );
};

export default RecipesResultsCount;
