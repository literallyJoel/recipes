import { Link } from "../ui/link";

const PageHeader = () => (
  <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
    <div>
      <Link
        to="/home"
        className="inline-flex items-center gap-1.5 text-2xs font-semibold tracking-kicker uppercase text-muted-foreground hover:text-foreground transition-colors mb-3"
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

export default PageHeader;
