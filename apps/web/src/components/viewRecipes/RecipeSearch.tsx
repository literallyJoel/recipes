interface RecipeSearchProps {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
}

const RecipeSearch = ({ query, setQuery }: RecipeSearchProps) => {
  return (
    <div className="relative flex-1 min-w-48">
      <svg
        className="absolute left-3.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <circle cx="6.5" cy="6.5" r="4.5" />
        <path d="M10 10l3 3" strokeLinecap="round" />
      </svg>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search recipes..."
        className="w-full pl-9 pr-4 py-2 rounded-full border-retro border-foreground bg-background text-sm text-foreground placeholder:text-muted-foreground shadow-retro-sm outline-none focus:shadow-retro-md transition-all"
      />
    </div>
  );
};

export default RecipeSearch;
