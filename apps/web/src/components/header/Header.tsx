import { authClient } from "@/lib/auth-client";
import { ThemeToggle } from "./components/ThemeToggle";
import UserPanel from "./components/UserPanel";

const Header = () => {
  const session = authClient.useSession();
  return (
    <header className="absolute inset-x-0 top-0 z-10">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
        <div className="font-display text-foreground text-4xl leading-none tracking-display">
          {session.data?.user ? "Recipes" : ""}
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {session.data?.user && <UserPanel />}
        </div>
      </div>
    </header>
  );
};

export default Header;
