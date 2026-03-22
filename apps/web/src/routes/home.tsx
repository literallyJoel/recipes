import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import SplitView from "@/components/shared/SplitView";
import { CycleSelect } from "@/components/ui/cycle-select";
import { useRequireAuth } from "@/lib/auth-guards";
import RecentRecipes from "@/components/home/Panels/RecentRecipes";

const HOME_SECTIONS = [
  { value: "recent", label: "Recent Recipes" },
  { value: "diary", label: "Diary" },
  { value: "meal-plans", label: "Meal Plans" },
  { value: "your", label: "Your Recipes" },
  { value: "shared", label: "Shared Recipes" },
] as const;

type HomeSection = (typeof HOME_SECTIONS)[number]["value"];

export const Route = createFileRoute("/home")({
  component: HomePage,
});

function HomePage() {
  const { redirect } = useRequireAuth("/login");
  const [section, setSection] = useState<HomeSection>("recent");

  if (redirect) {
    return redirect;
  }

  function getActiveSection() {
    switch (section) {
      case "recent":
        return <RecentRecipes />;
      default:
        return null;
    }
  }

  return (
    <SplitView
      asideClassName="col-span-3"
      className="col-span-9"
      aside={
        <div className="w-full max-w-full h-full">
          <CycleSelect
            aria-label="Home section"
            options={[...HOME_SECTIONS]}
            value={section}
            onChange={setSection}
            className="w-full max-w-full px-1 min-h-full"
          />
        </div>
      }
    >
      {getActiveSection()}
    </SplitView>
  );
}
