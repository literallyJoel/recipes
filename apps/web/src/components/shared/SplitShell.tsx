import type { ReactNode } from "react";

import { Card } from "@/components/ui/card";

type SplitShellProps = {
  aside: ReactNode;
  children: ReactNode;
};

export const SplitShell = ({ aside, children }: SplitShellProps) => {
  return (
    <main className="bg-background text-foreground min-h-screen">
      <div className="mx-auto flex min-h-screen max-w-7xl items-center px-5 pt-24 pb-8 sm:px-8 lg:px-10">
        <Card
          variant="frame"
          className="grid w-full overflow-hidden lg:min-h-144 lg:grid-cols-[1.05fr_0.95fr]"
        >
          <section className="bg-primary text-primary-foreground flex min-h-64 items-start border-b-[3px] border-foreground p-8 sm:p-10 lg:min-h-full lg:border-r-[3px] lg:border-b-0 lg:p-14">
            {aside}
          </section>

          <section className="bg-card p-6 sm:p-8 lg:p-10">
            <div className="flex h-full w-full max-w-md flex-col justify-end gap-8 lg:ml-auto">
              {children}
            </div>
          </section>
        </Card>
      </div>
    </main>
  );
};
