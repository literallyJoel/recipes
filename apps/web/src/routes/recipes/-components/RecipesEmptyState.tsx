const RecipesEmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <p className="font-display text-foreground mb-2 text-3xl tracking-display">
        No recipes found
      </p>
      <p className="text-muted-foreground text-sm">
        Try adjusting your search or filters.
      </p>
    </div>
  );
};

export default RecipesEmptyState;
