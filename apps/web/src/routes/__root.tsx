import { Outlet, createRootRoute } from "@tanstack/react-router";

import Header from "@/components/header/Header";

const RootLayout = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Outlet />
    </div>
  );
};

export const Route = createRootRoute({
  component: RootLayout,
});
