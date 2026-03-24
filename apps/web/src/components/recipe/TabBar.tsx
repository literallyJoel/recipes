import { cn } from "@/lib/utils";
import { Tab } from "@/routes/recipes/$id";
import React from "react";

interface TabBarProps {
  hasNutrition: boolean;
  activeTab: Tab;
  setActiveTab: React.Dispatch<React.SetStateAction<Tab>>;
}

const TabBar = ({ hasNutrition, activeTab, setActiveTab }: TabBarProps) => {
  return (
    <div className="flex gap-2 pb-5 mb-6 border-b-2 border-border">
      <button
        type="button"
        onClick={() => setActiveTab("instructions")}
        className={cn(
          "px-4 py-1.5 rounded-full border-retro text-xs font-semibold tracking-meta uppercase cursor-pointer transition-all",
          activeTab === "instructions"
            ? "bg-accent text-accent-foreground border-foreground shadow-retro-xs"
            : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground",
        )}
      >
        Instructions
      </button>
      {hasNutrition && (
        <button
          type="button"
          onClick={() => setActiveTab("nutrition")}
          className={cn(
            "px-4 py-1.5 rounded-full border-retro text-xs font-semibold tracking-meta uppercase cursor-pointer transition-all",
            activeTab === "nutrition"
              ? "bg-accent text-accent-foreground border-foreground shadow-retro-xs"
              : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground",
          )}
        >
          Nutrition
        </button>
      )}
    </div>
  );
};

export default TabBar;
