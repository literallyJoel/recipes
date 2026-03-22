import { Outlet, createRootRoute } from "@tanstack/react-router";

import { ThemeToggle } from "@/components/shared/ThemeToggle";

const RootLayout = () => {
  return (
    <div className="min-h-screen">
      <header className="absolute inset-x-0 top-0 z-10">
        <div className="mx-auto flex max-w-7xl justify-end px-5 py-5 sm:px-8 lg:px-10">
          <ThemeToggle />
        </div>
      </header>

      <Outlet />
    </div>
  );
};

export const Route = createRootRoute({
  component: RootLayout
});
