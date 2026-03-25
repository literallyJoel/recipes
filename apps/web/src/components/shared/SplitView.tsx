import { ReactNode } from "react";
import { ClassNameValue } from "tailwind-merge";

import { cn } from "@/lib/utils";
import { Card } from "../ui/card";

interface SplitViewProps {
  aside?: ReactNode;
  children?: ReactNode;
  className?: ClassNameValue;
  asideClassName?: ClassNameValue;
  cardClassName?: ClassNameValue;
}

const SplitView = ({
  aside,
  children,
  className,
  asideClassName,
  cardClassName,
}: SplitViewProps) => (
  <main className="bg-background text-foreground min-h-screen">
    <div className="mx-auto flex min-h-screen max-w-7xl items-center px-5 pt-24 pb-8 sm:px-8 lg:px-10">
      <Card
        variant="frame"
        className={cn(
          "grid w-full overflow-hidden lg:min-h-144 grid-cols-12",
          cardClassName,
        )}
      >
        <section
          className={cn(
            "bg-primary text-primary-foreground col-span-6 flex min-h-64 items-start border-b-retro border-foreground p-8 sm:p-10 lg:min-h-full lg:border-r-retro lg:border-b-0 lg:p-14",
            asideClassName,
          )}
        >
          {aside}
        </section>

        <section
          className={cn("bg-card p-6 sm:p-8 lg:p-10 col-span-6", className)}
        >
          {children}
        </section>
      </Card>
    </div>
  </main>
);

export default SplitView;
