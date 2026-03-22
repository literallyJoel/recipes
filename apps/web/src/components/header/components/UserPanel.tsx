import UserImage from "@/components/shared/UserImage";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";
import { ChevronDown } from "lucide-react";

export const UserPanel = () => {
  const signOut = authClient.signOut;
  const { data: session, isPending } = authClient.useSession();
  const name = session?.user.name?.trim() || "Your Account";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={
            session ? `Open account menu for ${name}` : "Open account menu"
          }
          aria-busy={isPending}
          className="relative inline-flex items-center gap-3 cursor-pointer rounded-full border-retro border-foreground bg-background px-2 py-1.5 pr-10 shadow-retro-sm"
        >
          <UserImage user={session?.user} />
          <div className="flex items-center justify-center pr-2">
            <p className="text-foreground max-w-40 truncate text-sm font-semibold leading-none">
              {isPending ? "Loading..." : name}
            </p>
          </div>
          <div className="absolute right-3" aria-hidden="true">
            <ChevronDown className="size-4" />
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Recipes</DropdownMenuLabel>
          <DropdownMenuItem>My Recipes</DropdownMenuItem>
          <DropdownMenuItem>Shared With Me</DropdownMenuItem>
          <DropdownMenuItem>Create Recipe</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuGroup>
          <DropdownMenuLabel>General</DropdownMenuLabel>
          <DropdownMenuItem>My Account</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => signOut()}
            className="focus:bg-destructive"
          >
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserPanel;
