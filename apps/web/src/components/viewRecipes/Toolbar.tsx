import { SortKey, TimeFilter, ViewMode } from "@/routes/recipes";
import React, { JSX } from "react";
import Sort from "./Sort";
import Filters from "./Filters";
import ViewToggle from "./ViewToggle";
import Recipes from "../home/Panels/Recipes";

interface ToolbarProps {
  sort: SortKey;
  setSort: React.Dispatch<React.SetStateAction<SortKey>>;
  timeFilter: TimeFilter;
  setTimeFilter: React.Dispatch<React.SetStateAction<TimeFilter>>;
  view: ViewMode;
  setView: React.Dispatch<React.SetStateAction<ViewMode>>;
  RecipeSearch: JSX.Element;
}

const Toolbar = ({
  sort,
  setSort,
  timeFilter,
  setTimeFilter,
  view,
  setView,
  RecipeSearch
}: ToolbarProps) => {
  return (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      {RecipeSearch}
      <Sort sort={sort} setSort={setSort} />
      <Filters timeFilter={timeFilter} setTimeFilter={setTimeFilter} />P
      <div className="flex-1" />
      <ViewToggle view={view} setView={setView} />
    </div>
  );
};

export default Toolbar;
